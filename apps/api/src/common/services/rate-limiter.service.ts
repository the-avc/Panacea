import Redis from 'ioredis';
import { logSecurityEvent } from '../middleware/audit';

export interface RateLimitStatus {
  allowed: boolean;
  remainingAttempts: number;
  lockedUntil: number | null;
  retryAfterSeconds: number | null;
}

/**
 * PANACEA SECURITY — Centralized Distributed Rate Limiting Service
 *
 * Implements:
 * 1. Redis-backed centralized state store across multiple API instances
 * 2. Fail-closed defense in production: Refuses fallback to local Map() if Redis is offline
 * 3. In-memory fallback strictly for local unit tests / offline development (NODE_ENV !== 'production')
 * 4. Dual-key tracking: IP address and normalized account identity
 * 5. Endpoint-specific quotas: Login, MFA, Password Reset, Document Upload & Download, Admin
 * 6. Constant-time dummy verification path for nonexistent accounts (side-channel mitigation)
 * 7. Audit & security event emission on lockout triggers
 */
export class RateLimiterService {
  private static instance: RateLimiterService;

  private redis: Redis | null = null;
  private redisConnected = false;

  // In-memory fallback buckets (for dev/test resilience ONLY — strictly forbidden in production)
  private accountAttempts: Map<string, { count: number; lockedUntil: number }> = new Map();
  private ipAttempts: Map<string, { count: number; resetAt: number }> = new Map();
  private endpointBuckets: Map<string, { count: number; resetAt: number }> = new Map();

  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private readonly IP_WINDOW_MS = 60 * 1000; // 1 minute
  private readonly MAX_IP_RPM = 30; // 30 req/min per IP on auth endpoints

  private constructor() {
    this.initRedis();
  }

  public static getInstance(): RateLimiterService {
    if (!RateLimiterService.instance) {
      RateLimiterService.instance = new RateLimiterService();
    }
    return RateLimiterService.instance;
  }

  private initRedis() {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST;

    if (!redisUrl && !redisHost) {
      return;
    }

    try {
      if (redisUrl) {
        this.redis = new Redis(redisUrl, {
          connectTimeout: 2000,
          maxRetriesPerRequest: 1,
          lazyConnect: true,
          enableOfflineQueue: false,
        });
      } else {
        this.redis = new Redis({
          host: redisHost || '127.0.0.1',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          password: process.env.REDIS_PASSWORD || undefined,
          connectTimeout: 2000,
          maxRetriesPerRequest: 1,
          lazyConnect: true,
          enableOfflineQueue: false,
        });
      }

      this.redis.on('error', () => {
        this.redisConnected = false;
      });

      this.redis.on('ready', () => {
        this.redisConnected = true;
      });
    } catch (err: any) {
      this.redisConnected = false;
    }
  }

  /**
   * Explicit sequential initialization for server startup.
   */
  public async initialize(): Promise<void> {
    const isProd = process.env.NODE_ENV === 'production';
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST;

    if (isProd && !redisUrl && !redisHost) {
      throw new Error(
        '[RATE-LIMITER] FATAL: Production environment requires centralized Redis (REDIS_URL or REDIS_HOST). In-memory fallback is strictly forbidden in production.',
      );
    }

    if (redisUrl || redisHost) {
      try {
        if (!this.redis) {
          this.initRedis();
        }
        if (this.redis) {
          await this.redis.connect().catch((err: any) => {
            if (!err.message?.includes('already')) throw err;
          });
          const ping = await this.redis.ping();
          if (ping !== 'PONG') {
            throw new Error('Redis ping response was not PONG');
          }
          this.redisConnected = true;
          console.log('[RATE-LIMITER] Connected and verified centralized Redis cluster.');
        }
      } catch (err: any) {
        this.redisConnected = false;
        if (isProd) {
          throw new Error(
            `[RATE-LIMITER] FATAL: Redis connection failed in production (${err.message}). Fail-closed policy prevents startup.`,
          );
        }
      }
    }
  }

  /**
   * Health check for readiness probes
   */
  public async isHealthy(): Promise<boolean> {
    const isProd = process.env.NODE_ENV === 'production';

    if (isProd) {
      if (!this.redis || !this.redisConnected) {
        return false;
      }
      try {
        const ping = await this.redis.ping();
        return ping === 'PONG';
      } catch {
        return false;
      }
    }

    // In dev/test:
    if (this.redis && this.redisConnected) {
      try {
        const ping = await this.redis.ping();
        return ping === 'PONG';
      } catch {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks whether the current IP is rate-limited on auth endpoints.
   * In production: FAILS CLOSED if Redis is unavailable.
   */
  public async checkIpRateLimit(ip: string): Promise<boolean> {
    const isProd = process.env.NODE_ENV === 'production';

    if (this.redis && this.redisConnected) {
      try {
        const key = `ratelimit:ip:${ip}`;
        const current = await this.redis.incr(key);
        if (current === 1) {
          await this.redis.pexpire(key, this.IP_WINDOW_MS);
        }
        return current <= this.MAX_IP_RPM;
      } catch {
        if (isProd) {
          // FAIL CLOSED: Never bypass rate limiting on Redis network error in production
          return false;
        }
      }
    }

    if (isProd) {
      // In-memory fallback strictly forbidden in production
      return false;
    }

    const now = Date.now();
    const entry = this.ipAttempts.get(ip);

    if (!entry || entry.resetAt < now) {
      this.ipAttempts.set(ip, { count: 1, resetAt: now + this.IP_WINDOW_MS });
      return true;
    }

    entry.count++;
    return entry.count <= this.MAX_IP_RPM;
  }

  /**
   * Checks if an account is locked due to brute-force attempts.
   * In production: FAILS CLOSED if Redis is unavailable.
   */
  public async checkAccountLock(accountKey: string): Promise<RateLimitStatus> {
    const isProd = process.env.NODE_ENV === 'production';
    const normalized = accountKey.toLowerCase().trim();
    const now = Date.now();

    if (this.redis && this.redisConnected) {
      try {
        const lockKey = `ratelimit:lock:${normalized}`;
        const lockedUntilStr = await this.redis.get(lockKey);
        if (lockedUntilStr) {
          const lockedUntil = parseInt(lockedUntilStr, 10);
          if (lockedUntil > now) {
            return {
              allowed: false,
              remainingAttempts: 0,
              lockedUntil,
              retryAfterSeconds: Math.ceil((lockedUntil - now) / 1000),
            };
          }
        }

        const countKey = `ratelimit:failed:${normalized}`;
        const countStr = await this.redis.get(countKey);
        const count = countStr ? parseInt(countStr, 10) : 0;
        return {
          allowed: true,
          remainingAttempts: Math.max(0, this.MAX_FAILED_ATTEMPTS - count),
          lockedUntil: null,
          retryAfterSeconds: null,
        };
      } catch {
        if (isProd) {
          // FAIL CLOSED
          return {
            allowed: false,
            remainingAttempts: 0,
            lockedUntil: now + 60000,
            retryAfterSeconds: 60,
          };
        }
      }
    }

    if (isProd) {
      // In-memory fallback strictly forbidden in production
      return {
        allowed: false,
        remainingAttempts: 0,
        lockedUntil: now + 60000,
        retryAfterSeconds: 60,
      };
    }

    const entry = this.accountAttempts.get(normalized);

    if (entry && entry.lockedUntil > now) {
      const retryAfterSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
      return {
        allowed: false,
        remainingAttempts: 0,
        lockedUntil: entry.lockedUntil,
        retryAfterSeconds,
      };
    }

    if (entry && entry.lockedUntil > 0 && entry.lockedUntil <= now) {
      this.accountAttempts.delete(normalized);
    }

    const currentCount = this.accountAttempts.get(normalized)?.count || 0;
    return {
      allowed: true,
      remainingAttempts: Math.max(0, this.MAX_FAILED_ATTEMPTS - currentCount),
      lockedUntil: null,
      retryAfterSeconds: null,
    };
  }

  /**
   * Records a failed login attempt for an account.
   * In production: FAILS CLOSED if Redis is unavailable.
   */
  public async recordFailedAttempt(
    accountKey: string,
    ip: string,
    requestId: string,
  ): Promise<RateLimitStatus> {
    const isProd = process.env.NODE_ENV === 'production';
    const normalized = accountKey.toLowerCase().trim();
    const now = Date.now();

    if (this.redis && this.redisConnected) {
      try {
        const countKey = `ratelimit:failed:${normalized}`;
        const newCount = await this.redis.incr(countKey);
        await this.redis.pexpire(countKey, this.LOCKOUT_WINDOW_MS);

        if (newCount >= this.MAX_FAILED_ATTEMPTS) {
          const lockedUntil = now + this.LOCKOUT_WINDOW_MS;
          const lockKey = `ratelimit:lock:${normalized}`;
          await this.redis.set(lockKey, lockedUntil.toString(), 'PX', this.LOCKOUT_WINDOW_MS);

          logSecurityEvent({
            eventType: 'BRUTE_FORCE_LOCKOUT',
            severity: 'high',
            sourceIp: ip,
            requestId,
            details: {
              account: normalized,
              failedAttempts: newCount,
              lockoutDurationMinutes: this.LOCKOUT_WINDOW_MS / 60000,
            },
          });

          return {
            allowed: false,
            remainingAttempts: 0,
            lockedUntil,
            retryAfterSeconds: Math.ceil(this.LOCKOUT_WINDOW_MS / 1000),
          };
        }

        return {
          allowed: true,
          remainingAttempts: Math.max(0, this.MAX_FAILED_ATTEMPTS - newCount),
          lockedUntil: null,
          retryAfterSeconds: null,
        };
      } catch {
        if (isProd) {
          return {
            allowed: false,
            remainingAttempts: 0,
            lockedUntil: now + 60000,
            retryAfterSeconds: 60,
          };
        }
      }
    }

    if (isProd) {
      return {
        allowed: false,
        remainingAttempts: 0,
        lockedUntil: now + 60000,
        retryAfterSeconds: 60,
      };
    }

    const entry = this.accountAttempts.get(normalized) || { count: 0, lockedUntil: 0 };
    entry.count += 1;

    if (entry.count >= this.MAX_FAILED_ATTEMPTS) {
      entry.lockedUntil = now + this.LOCKOUT_WINDOW_MS;
      this.accountAttempts.set(normalized, entry);

      logSecurityEvent({
        eventType: 'BRUTE_FORCE_LOCKOUT',
        severity: 'high',
        sourceIp: ip,
        requestId,
        details: {
          account: normalized,
          failedAttempts: entry.count,
          lockoutDurationMinutes: this.LOCKOUT_WINDOW_MS / 60000,
        },
      });

      return {
        allowed: false,
        remainingAttempts: 0,
        lockedUntil: entry.lockedUntil,
        retryAfterSeconds: Math.ceil(this.LOCKOUT_WINDOW_MS / 1000),
      };
    }

    this.accountAttempts.set(normalized, entry);
    return {
      allowed: true,
      remainingAttempts: this.MAX_FAILED_ATTEMPTS - entry.count,
      lockedUntil: null,
      retryAfterSeconds: null,
    };
  }

  /**
   * Clears failed attempt counter upon successful authentication
   */
  public async resetAccount(accountKey: string): Promise<void> {
    const normalized = accountKey.toLowerCase().trim();
    if (this.redis && this.redisConnected) {
      try {
        await this.redis.del(`ratelimit:failed:${normalized}`, `ratelimit:lock:${normalized}`);
      } catch {
        // Ignored
      }
    }
    this.accountAttempts.delete(normalized);
  }

  /**
   * Generalized endpoint-specific rate limiter.
   * Limits sensitive actions like upload, download, password reset, MFA challenges.
   * In production: FAILS CLOSED if Redis is unavailable.
   */
  public async checkEndpointLimit(
    tag: string,
    key: string,
    maxRequests: number,
    windowSeconds: number,
  ): Promise<{ allowed: boolean; remaining: number; retryAfterSeconds?: number }> {
    const isProd = process.env.NODE_ENV === 'production';
    const compositeKey = `endpoint:${tag}:${key.toLowerCase().trim()}`;
    const windowMs = windowSeconds * 1000;
    const now = Date.now();

    if (this.redis && this.redisConnected) {
      try {
        const redisKey = `ratelimit:${compositeKey}`;
        const current = await this.redis.incr(redisKey);
        if (current === 1) {
          await this.redis.pexpire(redisKey, windowMs);
        }
        if (current > maxRequests) {
          const ttlMs = await this.redis.pttl(redisKey);
          return {
            allowed: false,
            remaining: 0,
            retryAfterSeconds: Math.ceil(Math.max(1, ttlMs) / 1000),
          };
        }
        return {
          allowed: true,
          remaining: maxRequests - current,
        };
      } catch {
        if (isProd) {
          return { allowed: false, remaining: 0, retryAfterSeconds: 60 };
        }
      }
    }

    if (isProd) {
      return { allowed: false, remaining: 0, retryAfterSeconds: 60 };
    }

    const entry = this.endpointBuckets.get(compositeKey);
    if (!entry || entry.resetAt < now) {
      this.endpointBuckets.set(compositeKey, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    entry.count++;
    if (entry.count > maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
      };
    }

    return { allowed: true, remaining: maxRequests - entry.count };
  }

  private localGrants: Map<string, { grantHash: string; documentId: string; userId: string; expiresAt: number; used: boolean }> = new Map();

  /**
   * Constant-time dummy verification hash to equalize response times
   * and prevent account existence enumeration via timing side-channels
   */
  public async performDummyTimingProof(): Promise<void> {
    try {
      const argon2 = require('argon2');
      await argon2.verify(
        '$argon2id$v=19$m=65536,t=3,p=4$dummySalt1234567890$dummyHashSignatureValue1234567890',
        'dummyCandidatePasswordString#2026',
      );
    } catch {
      // Intentional no-op to balance timing
    }
  }

  /**
   * Centralized Redis-backed short-lived single-use download grant creation.
   * Stored under SHA-256(grantToken) with automatic Redis TTL expiration.
   */
  public async createDownloadGrant(
    grantHash: string,
    data: { documentId: string; userId: string; expiresAt: number },
    ttlSeconds = 300,
  ): Promise<void> {
    const isProd = process.env.NODE_ENV === 'production';
    const payload = {
      grantHash,
      documentId: data.documentId,
      userId: data.userId,
      expiresAt: data.expiresAt,
      used: false,
    };

    if (this.redis && this.redisConnected) {
      try {
        await this.redis.set(`grant:${grantHash}`, JSON.stringify(payload), 'EX', ttlSeconds);
        return;
      } catch (err: any) {
        if (isProd) {
          throw new Error(`[GRANT] 503 Service Unavailable: Redis failed to persist download grant: ${err.message}`);
        }
      }
    }

    if (isProd) {
      throw new Error('[GRANT] 503 Service Unavailable: Centralized Redis is required for download grants in production.');
    }

    this.localGrants.set(grantHash, payload);
  }

  /**
   * Centralized Redis-backed single-use grant validation and atomic consumption.
   * Uses Lua script to atomically fetch and mark used (or reject if already used/expired).
   */
  public async consumeDownloadGrant(grantHash: string): Promise<{ documentId: string; userId: string; expiresAt: number; used: boolean } | null> {
    const isProd = process.env.NODE_ENV === 'production';

    if (this.redis && this.redisConnected) {
      try {
        // Atomic Lua script: read, check used, mark used, keep TTL
        const luaScript = `
          local val = redis.call('GET', KEYS[1])
          if not val then return nil end
          local data = cjson.decode(val)
          if data.used then return nil end
          data.used = true
          redis.call('SET', KEYS[1], cjson.encode(data), 'KEEPTTL')
          return val
        `;
        const raw = (await this.redis.eval(luaScript, 1, `grant:${grantHash}`)) as string | null;
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (err: any) {
        if (isProd) {
          throw new Error(`[GRANT] 503 Service Unavailable: Redis failed to consume download grant: ${err.message}`);
        }
      }
    }

    if (isProd) {
      throw new Error('[GRANT] 503 Service Unavailable: Centralized Redis is required for download grants in production.');
    }

    const grant = this.localGrants.get(grantHash);
    if (!grant) return null;
    if (grant.used || grant.expiresAt < Date.now()) {
      return null;
    }
    grant.used = true;
    return grant;
  }
}

export const rateLimiter = RateLimiterService.getInstance();


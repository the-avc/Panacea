import { db } from '../../database/db';
import { getStorageService, MemoryStorageService } from '../storage/storage.service';
import { getMalwareScanner, MockMalwareScanner } from '../services/malware-scanner.service';
import { rateLimiter } from '../services/rate-limiter.service';
import { SEED_USERS } from '../../database/seed-data';

export interface ValidationReport {
  valid: boolean;
  errors: string[];
  environment: string;
}

/**
 * Validates STATIC production environment configuration (environment variables & format).
 * This check runs BEFORE any network connection is opened or dependency is initialized.
 * Never leaks secret values in error messages.
 */
export function validateStaticProductionConfig(envOverride?: string): ValidationReport {
  const currentEnv = envOverride || process.env.NODE_ENV || 'development';
  const errors: string[] = [];

  if (currentEnv !== 'production') {
    return {
      valid: true,
      errors: [],
      environment: currentEnv,
    };
  }

  // 1. Mandatory Secrets Validation (No values leaked in errors)
  const mandatorySecrets = [
    { key: 'DATABASE_URL', val: process.env.DATABASE_URL },
    { key: 'SESSION_SECRET', val: process.env.SESSION_SECRET },
    { key: 'S3_BUCKET', val: process.env.S3_BUCKET },
    { key: 'S3_ACCESS_KEY', val: process.env.S3_ACCESS_KEY },
    { key: 'S3_SECRET_KEY', val: process.env.S3_SECRET_KEY },
    { key: 'CLAMAV_HOST', val: process.env.CLAMAV_HOST },
    { key: 'CLAMAV_PORT', val: process.env.CLAMAV_PORT },
  ];

  for (const item of mandatorySecrets) {
    if (!item.val || item.val.trim() === '') {
      errors.push(`Missing mandatory environment secret or parameter: ${item.key}`);
    } else if (item.val.includes('CHANGE_ME') || item.val.includes('change_me')) {
      errors.push(`Insecure placeholder detected in configuration: ${item.key}`);
    }
  }

  // Redis configuration check
  const redisConfigured = Boolean(process.env.REDIS_URL || process.env.REDIS_HOST);
  if (!redisConfigured) {
    errors.push('Missing mandatory Redis configuration (REDIS_URL or REDIS_HOST). Centralized rate limiting is required in production.');
  }

  // S3 Endpoint / Region configuration
  if (!process.env.S3_ENDPOINT && !process.env.S3_REGION) {
    errors.push('Missing object storage provider configuration (S3_ENDPOINT or S3_REGION is required).');
  }

  if (process.env.S3_ENDPOINT && (process.env.S3_ENDPOINT.includes('localhost') || process.env.S3_ENDPOINT.includes('127.0.0.1') || process.env.S3_ENDPOINT.includes('9000'))) {
    errors.push('Localhost storage endpoint is forbidden in production (S3_ENDPOINT). Dedicated object storage is required.');
  }

  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
    errors.push('SESSION_SECRET length must be at least 32 characters for production security.');
  }

  // Reject Demo Seed Data & Development Fixtures in Production
  if (process.env.ENABLE_DEV_SEEDS === 'true' || process.env.SEED_DEMO_DATA === 'true') {
    errors.push('Development seed fixtures are strictly forbidden when NODE_ENV=production (ENABLE_DEV_SEEDS / SEED_DEMO_DATA).');
  }

  if (Object.keys(SEED_USERS).length > 0 && !process.env.JEST_WORKER_ID) {
    errors.push('Demo users or test credentials detected in active seed table. Production must be initialized with zero demo accounts.');
  }

  return {
    valid: errors.length === 0,
    errors,
    environment: currentEnv,
  };
}

/**
 * Validates RUNTIME dependency health after dependencies have been initialized.
 * All dependencies are MANDATORY in production — no opt-out environment flags.
 */
export async function validateRuntimeDependencies(envOverride?: string): Promise<ValidationReport> {
  const currentEnv = envOverride || process.env.NODE_ENV || 'development';
  const errors: string[] = [];

  if (currentEnv !== 'production') {
    return {
      valid: true,
      errors: [],
      environment: currentEnv,
    };
  }

  // 1. PostgreSQL Database Health
  if (!process.env.DATABASE_URL || !db.isHealthy()) {
    errors.push('Persistent PostgreSQL database is not connected or unhealthy. In-memory fallback is strictly forbidden in production.');
  }

  // 2. Object Storage Health (No in-memory fallback, no opt-out)
  const storage = getStorageService();
  if (storage instanceof MemoryStorageService) {
    errors.push('In-memory object storage vault detected. Production requires real S3/MinIO private bucket.');
  } else {
    const storageHealthy = await storage.isHealthy().catch(() => false);
    if (!storageHealthy) {
      errors.push('Configured S3/MinIO object storage bucket is unreachable.');
    }
  }

  // 3. ClamAV Malware Scanner Health (No mock scanner, no opt-out)
  const scanner = getMalwareScanner();
  if (scanner instanceof MockMalwareScanner) {
    errors.push('Mock malware scanner detected. Production requires real ClamAV antivirus integration.');
  } else {
    const scannerHealthy = await scanner.isHealthy().catch(() => false);
    if (!scannerHealthy) {
      errors.push('Configured ClamAV malware scanner is unreachable.');
    }
  }

  // 4. Centralized Redis Rate Limiter Health (No opt-out)
  const redisHealthy = await rateLimiter.isHealthy().catch(() => false);
  if (!redisHealthy) {
    errors.push('Centralized Redis rate limiting cluster is unreachable.');
  }

  return {
    valid: errors.length === 0,
    errors,
    environment: currentEnv,
  };
}

/**
 * Comprehensive production startup validation combining static config and runtime dependencies.
 * Used by test suites and pre-flight probes.
 */
export async function validateProductionStartup(envOverride?: string): Promise<ValidationReport> {
  const staticReport = validateStaticProductionConfig(envOverride);
  const runtimeReport = await validateRuntimeDependencies(envOverride);
  return {
    valid: staticReport.valid && runtimeReport.valid,
    errors: [...staticReport.errors, ...runtimeReport.errors],
    environment: staticReport.environment,
  };
}

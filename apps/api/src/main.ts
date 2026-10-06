import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { requestIdMiddleware } from './common/middleware/request-id';
import { errorHandlerMiddleware } from './common/filters/error.filter';
import { csrfProtectionMiddleware } from './common/middleware/csrf';
import { db } from './database/db';
import authRouter from './modules/auth/auth.controller';
import casesRouter from './modules/cases/cases.controller';
import documentsRouter from './modules/documents/documents.controller';
import organizationsRouter from './modules/organizations/organizations.controller';
import usersRouter from './modules/users/users.controller';
import notificationsRouter from './modules/notifications/notifications.controller';
import adminRouter from './modules/admin/admin.controller';
import { getStorageService } from './common/storage/storage.service';
import { getMalwareScanner } from './common/services/malware-scanner.service';
import { rateLimiter } from './common/services/rate-limiter.service';
import {
  validateStaticProductionConfig,
  validateRuntimeDependencies,
} from './common/config/startup-validator';

const app = express();
const PORT = process.env.PORT || 4000;

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// CORS restricted to approved web and portal origins
const allowedOrigins = [
  'http://localhost:3000', // Public web
  'http://localhost:3001', // Client portal
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  process.env.APP_WEB_ORIGIN,
  process.env.APP_PORTAL_ORIGIN,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or automated test runners)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'test') {
        callback(null, true);
      } else {
        callback(new Error('Origin not permitted by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-CSRF-Token', 'X-XSRF-Token'],
    exposedHeaders: ['X-Request-Id'],
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Correlation ID
app.use(requestIdMiddleware);

// CSRF Defense on State-Changing Operations
app.use(csrfProtectionMiddleware);

// Liveness Probe (Is the process alive?)
app.get('/health/live', (req: any, res) => {
  return res.status(200).json({
    status: 'ALIVE',
    service: 'Panacea Security API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});

// Readiness Probe (Can this instance safely serve production traffic?)
app.get('/health/ready', async (req: any, res) => {
  const dbHealthy = db.isHealthy();
  const storage = getStorageService();
  const storageHealthy = await storage.isHealthy().catch(() => false);
  const scanner = getMalwareScanner();
  const scannerHealthy = await scanner.isHealthy().catch(() => false);
  const rateLimiterHealthy = await rateLimiter.isHealthy().catch(() => false);

  const isReady =
    dbHealthy &&
    (process.env.NODE_ENV !== 'production' ||
      (storageHealthy && scannerHealthy && rateLimiterHealthy));

  if (!isReady && process.env.NODE_ENV === 'production') {
    return res.status(503).json({
      status: 'UNHEALTHY',
      ready: false,
      service: 'Panacea Security API',
      message: 'Critical production dependency offline. Refusing traffic in fail-closed state.',
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    });
  }

  return res.status(200).json({
    status: 'HEALTHY',
    ready: true,
    service: 'Panacea Security API',
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});

// Backwards-compatible /health alias mapping to readiness
app.get('/health', async (req: any, res) => {
  const dbHealthy = db.isHealthy();
  if (!dbHealthy && process.env.NODE_ENV === 'production') {
    return res.status(503).json({
      status: 'UNHEALTHY',
      ready: false,
      service: 'Panacea Security API',
      message: 'Persistent database service unavailable. Refusing requests in fail-closed state.',
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
    });
  }

  return res.status(200).json({
    status: 'HEALTHY',
    ready: true,
    service: 'Panacea Security API',
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});

// API v1 Routing
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/cases', casesRouter);
app.use('/api/v1/documents', documentsRouter);
app.use('/api/v1/organizations', organizationsRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/admin/users', usersRouter);

// 404 Handler for undefined routes
app.use((req: any, res) => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.path} does not exist.`,
      requestId: req.requestId,
    },
  });
});

// Global Error Handler (Never leaks stacks or raw DB errors)
app.use(errorHandlerMiddleware);

/**
 * Sequential production initialization lifecycle:
 * create application -> initialize configuration -> connect PostgreSQL ->
 * verify PostgreSQL -> initialize storage -> verify object storage ->
 * initialize malware scanner -> verify scanner -> initialize rate limiter ->
 * verify Redis -> start HTTP server.
 */
export async function startServer(): Promise<void> {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  try {
    // 1. Initialize configuration & static production validation
    console.log('[PANACEA API] 1. Initializing configuration & validating static production constraints...');
    const staticReport = validateStaticProductionConfig();
    if (!staticReport.valid && process.env.NODE_ENV === 'production') {
      console.error('[PANACEA API] FATAL: Production static configuration validation failed:');
      staticReport.errors.forEach((e) => console.error(`  - ${e}`));
      process.exit(1);
    }

    // 2. Connect PostgreSQL & 3. Verify PostgreSQL
    console.log('[PANACEA API] 2. Connecting and verifying PostgreSQL database...');
    await db.initialize();
    if (process.env.NODE_ENV === 'production' && !db.isHealthy()) {
      console.error('[PANACEA API] FATAL: PostgreSQL health check failed in production.');
      process.exit(1);
    }

    // 4. Initialize storage & 5. Verify object storage
    console.log('[PANACEA API] 3. Initializing and verifying private object storage...');
    const storage = getStorageService();
    const storageHealthy = await storage.isHealthy().catch(() => false);
    if (process.env.NODE_ENV === 'production' && !storageHealthy) {
      console.error('[PANACEA API] FATAL: Object storage health check failed in production.');
      process.exit(1);
    }

    // 6. Initialize malware scanner & 7. Verify scanner
    console.log('[PANACEA API] 4. Initializing and verifying ClamAV malware scanner...');
    const scanner = getMalwareScanner();
    const scannerHealthy = await scanner.isHealthy().catch(() => false);
    if (process.env.NODE_ENV === 'production' && !scannerHealthy) {
      console.error('[PANACEA API] FATAL: ClamAV malware scanner check failed in production.');
      process.exit(1);
    }

    // 8. Initialize rate limiter & 9. Verify Redis
    console.log('[PANACEA API] 5. Initializing and verifying centralized Redis rate limiter...');
    await rateLimiter.initialize();
    const rateLimiterHealthy = await rateLimiter.isHealthy().catch(() => false);
    if (process.env.NODE_ENV === 'production' && !rateLimiterHealthy) {
      console.error('[PANACEA API] FATAL: Centralized Redis rate limiter check failed in production.');
      process.exit(1);
    }

    // 10. Final unified runtime dependency validation
    console.log('[PANACEA API] 6. Executing final runtime dependency health validation...');
    const runtimeReport = await validateRuntimeDependencies();
    if (!runtimeReport.valid && process.env.NODE_ENV === 'production') {
      console.error('[PANACEA API] FATAL: Production runtime dependency validation failed:');
      runtimeReport.errors.forEach((e) => console.error(`  - ${e}`));
      process.exit(1);
    }

    // 11. Start HTTP server
    app.listen(PORT, () => {
      console.log(`[PANACEA API] Security API listening on port ${PORT} (/api/v1) [Traffic Ready]`);
    });
  } catch (err: any) {
    console.error(`[PANACEA API] FATAL STARTUP FAILURE: ${err.message}`);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;

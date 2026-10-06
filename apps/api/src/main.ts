import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { requestIdMiddleware } from './common/middleware/request-id';
import { errorHandlerMiddleware } from './common/filters/error.filter';
import authRouter from './modules/auth/auth.controller';
import casesRouter from './modules/cases/cases.controller';
import documentsRouter from './modules/documents/documents.controller';
import organizationsRouter from './modules/organizations/organizations.controller';
import usersRouter from './modules/users/users.controller';
import notificationsRouter from './modules/notifications/notifications.controller';
import adminRouter from './modules/admin/admin.controller';

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
  process.env.APP_WEB_ORIGIN,
  process.env.APP_PORTAL_ORIGIN,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) during development
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not permitted by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id'],
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Correlation ID
app.use(requestIdMiddleware);

// Liveness & Readiness probe
app.get('/health', (req: any, res) => {
  res.status(200).json({
    status: 'HEALTHY',
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

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[PANACEA API] Security API listening on port ${PORT} (/api/v1)`);
  });
}

export default app;

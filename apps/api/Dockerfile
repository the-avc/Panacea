# ===================================================================
# PANACEA CONSULTANCY — Production API Dockerfile
# Multi-stage security hardened container
# ===================================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Copy root manifests and lockfile
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json tsconfig.json ./

# Copy packages
COPY packages/ ./packages/

# Copy API app
COPY apps/api/ ./apps/api/

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @panacea/types build
RUN pnpm --filter @panacea/security build
RUN pnpm --filter @panacea/config build
RUN pnpm --filter @panacea/api build

# ===================================================================
# Production Runner Stage
# ===================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install dumb-init for proper signal handling (PID 1)
RUN apk add --no-cache dumb-init

# Create non-root system user
RUN addgroup -g 1001 -S panacea && \
    adduser -u 1001 -S panacea -G panacea

# Copy build output and production dependencies
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

USER panacea

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health/live || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "apps/api/dist/main.js"]

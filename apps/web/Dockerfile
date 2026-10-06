# ===================================================================
# PANACEA CONSULTANCY — Production Web Dockerfile
# Multi-stage security hardened container for Public Website
# ===================================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Copy root manifests and lockfile
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json tsconfig.json ./

# Copy packages
COPY packages/ ./packages/

# Copy Web app
COPY apps/web/ ./apps/web/

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @panacea/types build
RUN pnpm --filter @panacea/security build
RUN pnpm --filter @panacea/config build
RUN pnpm --filter @panacea/ui build
RUN pnpm --filter @panacea/web build

# ===================================================================
# Production Runner Stage
# ===================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root system user
RUN addgroup -g 1001 -S panacea && \
    adduser -u 1001 -S panacea -G panacea

# Copy build output and standalone next server
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules

USER panacea

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node_modules/.bin/next", "start", "apps/web", "-p", "3000"]

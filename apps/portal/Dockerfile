# ===================================================================
# PANACEA CONSULTANCY — Production Portal Dockerfile
# Multi-stage security hardened container for Client & Directorate Portal
# ===================================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Copy root manifests and lockfile
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json tsconfig.json ./

# Copy packages
COPY packages/ ./packages/

# Copy Portal app
COPY apps/portal/ ./apps/portal/

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @panacea/types build
RUN pnpm --filter @panacea/security build
RUN pnpm --filter @panacea/config build
RUN pnpm --filter @panacea/ui build
RUN pnpm --filter @panacea/portal build

# ===================================================================
# Production Runner Stage
# ===================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root system user
RUN addgroup -g 1001 -S panacea && \
    adduser -u 1001 -S panacea -G panacea

# Copy build output and dependencies
COPY --from=builder /app/apps/portal/public ./apps/portal/public
COPY --from=builder /app/apps/portal/.next ./apps/portal/.next
COPY --from=builder /app/apps/portal/package.json ./apps/portal/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/portal/node_modules ./apps/portal/node_modules

USER panacea

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001 || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node_modules/.bin/next", "start", "apps/portal", "-p", "3001"]

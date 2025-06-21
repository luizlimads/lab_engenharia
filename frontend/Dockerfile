# syntax=docker.io/docker/dockerfile:1

FROM oven/bun:1-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json bun.lockb ./

# Install production dependencies
FROM base AS prod-deps
RUN bun install --omit=dev --frozen-lockfile

# Install all deps and build site
FROM base AS all-deps
RUN bun install --frozen-lockfile

FROM all-deps AS build
COPY . .
RUN bun run build

FROM node:22-alpine AS serve
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]

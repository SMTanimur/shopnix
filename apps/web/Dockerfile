FROM node:22-alpine AS base
RUN npm install -g bun@1.2.17

FROM base AS builder
WORKDIR /app
RUN bun install -g turbo
COPY . .
RUN turbo prune web --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/bun.lock* ./
RUN bun install

COPY --from=builder /app/out/full/ .
RUN bun run build --filter=web

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=installer /app/apps/web/.next/standalone ./
COPY --from=installer /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer /app/apps/web/public ./apps/web/public

EXPOSE 3000
ENV PORT=3000
CMD ["node", "apps/web/server.js"]

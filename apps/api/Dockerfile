FROM node:22-alpine AS base
RUN npm install -g bun@1.2.17

FROM base AS builder
WORKDIR /app
RUN bun install -g turbo
COPY . .
RUN turbo prune api --docker

FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/bun.lock* ./
RUN bun install

COPY --from=builder /app/out/full/ .
RUN bun run build --filter=api

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache curl

COPY --from=installer /app/apps/api/dist ./apps/api/dist
COPY --from=installer /app/apps/api/package.json ./apps/api/package.json
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/packages ./packages

EXPOSE 4000
CMD ["node", "apps/api/dist/main"]

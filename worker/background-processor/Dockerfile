#############################
# Builder
#############################

FROM node:22-alpine AS builder

WORKDIR /app

ENV CI=true

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

COPY packages ./packages
COPY worker/background-processor ./worker/background-processor

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @dam/shared build
RUN pnpm --filter @dam/database build
RUN pnpm --filter @dam/worker build


#############################
# Runtime
#############################

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

RUN apk add --no-cache ffmpeg

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/worker/background-processor ./worker/background-processor

CMD ["node", "worker/background-processor/dist/worker.js"]
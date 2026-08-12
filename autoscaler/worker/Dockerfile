FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./

COPY packages ./packages

COPY autoscaler/worker ./autoscaler/worker

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @dam/shared build

RUN pnpm --filter @dam/worker-autoscaler build

WORKDIR /app/autoscaler/worker

CMD ["node", "dist/autoscaler.js"]
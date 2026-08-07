# ---------- Builder ----------
    FROM node:22-alpine AS builder

    WORKDIR /app

    ENV CI=true
    
    RUN corepack enable
    
    COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
    COPY tsconfig.base.json ./
    
    COPY packages ./packages
    COPY services/api ./services/api
    
    RUN pnpm install --frozen-lockfile
    
    RUN pnpm --filter @dam/shared build
    RUN pnpm --filter @dam/database build
    RUN pnpm --filter @dam/api build
    
    # ---------- Runtime ----------
    FROM node:22-alpine
    
    WORKDIR /app
    
    RUN corepack enable
    
    COPY --from=builder /app/package.json ./
    COPY --from=builder /app/pnpm-lock.yaml ./
    COPY --from=builder /app/pnpm-workspace.yaml ./
    
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/packages ./packages
    COPY --from=builder /app/services/api ./services/api
    
    WORKDIR /app/services/api
    
    EXPOSE 3000
    
    CMD ["pnpm", "start"]
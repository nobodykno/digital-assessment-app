#############################
# Build React
#############################

FROM node:22-alpine AS builder

WORKDIR /app

ENV CI=true

RUN corepack enable

COPY . .

RUN pnpm install

RUN pnpm --filter @dam/web build


#############################
# Nginx
#############################

FROM nginx:alpine

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
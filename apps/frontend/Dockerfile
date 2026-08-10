FROM node:24-alpine AS base

WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/frontend/package*.json ./apps/frontend/


FROM base AS development

RUN npm ci

COPY apps/frontend ./apps/frontend

WORKDIR /app/apps/frontend

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


FROM base AS build

RUN npm ci

COPY apps/frontend ./apps/frontend

WORKDIR /app/apps/frontend

RUN npm run build


FROM nginx:alpine AS production

COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
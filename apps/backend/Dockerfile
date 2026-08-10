FROM node:24-alpine AS base

WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

FROM base AS development

RUN npm ci

COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

CMD ["npm", "run", "start:dev"]


FROM base AS build

RUN npm ci

COPY apps/backend ./apps/backend

WORKDIR /app/apps/backend

RUN npm run build


FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/

RUN npm ci --omit=dev

COPY --from=build /app/apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend

CMD ["node", "dist/main.js"]
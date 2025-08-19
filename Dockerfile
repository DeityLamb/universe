FROM node:18-alpine AS builder

WORKDIR /app

COPY ./ ./

RUN npm install

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

RUN npm ci --omit=dev

COPY ./drizzle ./drizzle
COPY --from=builder /app/dist ./dist

CMD ["npm", "run", "start"]
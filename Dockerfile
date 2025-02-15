
FROM node:22-alpine AS build

ARG APP

WORKDIR /build

COPY package*.json ./

RUN npm install

COPY apps/${APP} ./apps/${APP}
COPY drizzle.config.ts tsconfig.json nest-cli.json ./

RUN npm run build ${APP}

FROM node:22-alpine

ARG APP

WORKDIR /app

COPY --from=build /build/package*.json ./
COPY --from=build /build/node_modules ./node_modules
COPY ./drizzle ./drizzle

RUN npm prune --omit=dev

COPY --from=build /build/dist/apps/${APP} ./

CMD ["node", "main.js"] 

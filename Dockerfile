ARG NODE_VERSION=22.12.0
FROM node:${NODE_VERSION} AS base

WORKDIR /usr/src
COPY package*.json ./

FROM base AS dev

RUN --mount=type=cache,target=/root/.npm \
    npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]

FROM base AS builder

ENV NODE_ENV=production

RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

COPY . .

RUN npm run build

RUN npm prune --omit=dev

FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /usr/src

COPY --from=builder /usr/src /usr/src

ENV NODE_ENV=production

EXPOSE 5173

USER node

CMD ["npm", "start"]

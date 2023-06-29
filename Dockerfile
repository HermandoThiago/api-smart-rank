FROM node:lts-alpine

RUN apk add --no-cache bash

WORKDIR /home/node/app

COPY . /home/node/app

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

USER node

CMD ["pnpm", "run", "start:dev"]
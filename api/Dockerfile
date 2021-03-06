FROM node:16-alpine as base

WORKDIR /app

FROM base as builder

COPY ./*.json ./
COPY ./yarn.lock ./
COPY ./prisma ./

RUN yarn --prod --pure-lockfile
RUN cp -RL ./node_modules /tmp/prod-node_modules

RUN yarn --pure-lockfile

COPY ./src ./src
RUN yarn build
RUN yarn prisma generate

FROM base as runner

COPY --from=builder /app/dist ./
COPY --from=builder /tmp/prod-node_modules ./node_modules
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client

CMD ["node", "index.js"]
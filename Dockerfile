FROM node:gallium-alpine as builder

ENV NODE_ENV build

WORKDIR /app
RUN chown node:node /app && chgrp 0 /app && chmod g+w /app
COPY --chown=node:node . .
USER node

RUN npm ci \
    && npm run build

# ---

FROM node:gallium-alpine

ENV NODE_ENV production

EXPOSE 3100
USER root
RUN apk add bash libcap && setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/node

WORKDIR /app
RUN chown -R node:0 /app

COPY --chown=node:node --from=builder /app/package*.json /app/
COPY --chown=node:node --from=builder /app/dist/ /app/dist/
COPY --chown=node:node --from=builder /app/src/ /app/src/
USER node

## disable prepare no need for husky in docker
RUN npm set-script prepare "" &&\
   npm ci 
#--omit=dev

CMD ["node", "dist/main.js"]

FROM node:24-alpine as builder

ENV NODE_ENV build

WORKDIR /app
RUN chown node:node /app && chgrp 0 /app && chmod g+w /app
USER node

# Install dependencies before copying the source, so this layer is reused when only the code changes
COPY --chown=node:node package*.json .npmrc ./
RUN npm ci --no-audit --no-fund

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --omit=dev --no-audit --no-fund

# ---

FROM node:24-alpine

ENV NODE_ENV production

EXPOSE 3100
USER root
RUN apk add --no-cache bash libcap curl && setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/node

WORKDIR /app
RUN chown -R node:0 /app

COPY --chown=node:node --from=builder /app/package*.json /app/
# Production dependencies were already installed and pruned in the builder stage, no need for a second npm ci
COPY --chown=node:node --from=builder /app/node_modules/ /app/node_modules/
COPY --chown=node:node --from=builder /app/dist/ /app/dist/
COPY --chown=node:node --from=builder /app/src/ /app/src/
COPY --chown=node:node --from=builder /app/scripts/ /app/scripts/
USER node

CMD ["node", "dist/src/main.js"]

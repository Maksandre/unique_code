FROM node:20 as base

WORKDIR /app

RUN npm install -g @acala-network/chopsticks@latest

CMD ["chopsticks", "--config=/app/config.yml"]

FROM base as assethub

COPY .docker/chopsticks/kusama-asset-hub.yml /app/config.yml
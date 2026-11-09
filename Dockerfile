FROM node:22-alpine

WORKDIR /app

COPY package.json ./
COPY bin ./bin

CMD ["node", "bin/cli.js"]

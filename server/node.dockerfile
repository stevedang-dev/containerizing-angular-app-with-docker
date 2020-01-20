FROM node:alpine

LABEL author="Steve Dang"

WORKDIR /var/www/angular-node-service

COPY package.json package.json
RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]

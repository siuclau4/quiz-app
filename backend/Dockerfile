FROM node:16.13.2

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENV DB_HOST=mongo

CMD [ "node", "index.js" ]
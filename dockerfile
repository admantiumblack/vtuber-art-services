FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install express

EXPOSE 3000

COPY . .

CMD ["node", "app.js"]
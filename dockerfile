FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install express

RUN npm install nodemon

EXPOSE 3000

COPY . .

ENTRYPOINT ["nodemon", "./src/app.js"]  

CMD ["npm", "run", "dev"]
# CMD ["node", "app.js"]
FROM node:18

WORKDIR /usr/local/apps/app

COPY package*.json ./
RUN npm install
ENV PATH=/usr/local/apps/app/node_modules/.bin:$PATH

WORKDIR /usr/local/apps/app/dev
COPY src ./src
RUN npm install express

RUN npm install nodemon

RUN npm install dotenv

RUN npm install mysql

EXPOSE 3000

COPY . .
ENTRYPOINT ["nodemon", "/usr/local/apps/app/dev/src/app.js"]  

CMD ["npm", "run", "dev"]
# CMD ["node", "app.js"]
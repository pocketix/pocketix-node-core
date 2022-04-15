FROM node:17.9

WORKDIR /usr/src/app/backend

COPY . .

WORKDIR /usr/src/app/backend/InfluxDataBase

RUN npm install

WORKDIR /usr/src/app/backend/express

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]

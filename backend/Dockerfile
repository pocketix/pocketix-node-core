FROM node:20 as express-build

WORKDIR /usr/src/app/backend

COPY . .

WORKDIR /usr/src/app/backend/InfluxDataBase

RUN npm ci

WORKDIR /usr/src/app/backend/express

RUN npm ci
RUN npm run build
COPY ./express/.env.docker ./express/.env

FROM node:20 as express-release
EXPOSE 3000

WORKDIR /usr/src/app
COPY --from=express-build /usr/src/app/backend/express/dist/ /usr/src/app/dist
COPY ./express/package.json /usr/src/app/package.json
COPY ./express/package-lock.json /usr/src/app/package-lock.json
COPY ./express/.env.docker /usr/src/app/.env

RUN npm ci --omit=optional --omit=dev

CMD ["npm", "run", "run"]

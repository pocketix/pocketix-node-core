FROM node:17.9

WORKDIR /usr/src/app/frontend

COPY . .

RUN npm install && npm install -g @angular/cli@8.1.2

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]

FROM node:18 as env

RUN npm install -g @angular/cli npm-snapshot && \
  npm cache clean --force

FROM env as dev
ARG configuration="production"
ARG port=80

RUN echo $configuration
RUN echo $port
WORKDIR /usr/src/app
COPY . .

RUN npm install --omit=optional
RUN ng build --configuration $configuration

# release stage
FROM nginx:alpine AS release

EXPOSE $port

COPY --from=dev /usr/src/app/dist/dip /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

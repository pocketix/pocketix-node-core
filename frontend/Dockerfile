FROM node:17.9 as env

RUN npm config set unsafe-perm true && \
  npm install -g @angular/cli npm-snapshot && \
  npm cache clean --force

FROM env as dev
ARG configuration="production"
ARG port=80

RUN echo $configuration
RUN echo $port
WORKDIR /usr/src/app
ENV NODE_OPTIONS="--max_old_space_size=4096"
COPY . .

RUN npm install --omit=optional
RUN ng build --configuration $configuration

# release stage
FROM nginx:latest AS release

EXPOSE $port

COPY --from=dev /usr/src/app/dist/dip /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

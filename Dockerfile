FROM node:16.16.0-alpine as build
WORKDIR /app

ARG LOOP

COPY ./package.json ./

RUN npm install

COPY . .

RUN npm run build:${LOOP}

FROM nginx:1.21.6-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


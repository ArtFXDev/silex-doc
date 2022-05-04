FROM node:lts-alpine AS build
WORKDIR /home/
RUN mkdir -p /home/build
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /home/build /usr/share/nginx/html

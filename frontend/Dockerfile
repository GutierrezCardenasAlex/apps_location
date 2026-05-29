FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_MAP_STYLE_URL=/maps/styles/basic-preview/style.json
ARG VITE_API_URL=/api
ENV VITE_MAP_STYLE_URL=$VITE_MAP_STYLE_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

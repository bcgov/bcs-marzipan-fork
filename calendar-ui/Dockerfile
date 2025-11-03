FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# Add nginx config if needed to proxy /api to backend
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
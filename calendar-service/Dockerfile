FROM node:22-alpine3.21 AS build
WORKDIR /app/calendar-service
# Copy only this service's package files
COPY calendar-service/package*.json ./
RUN npm install

# Copy service source code
COPY calendar-service/ ./
RUN npm run build

FROM node:22-alpine3.21
WORKDIR /app
#ENV NODE_ENV=production
# Copy only the built service
COPY --from=build /app/calendar-service/dist ./dist
COPY --from=build /app/calendar-service/package*.json ./
RUN npm install --production
EXPOSE 3001
CMD ["node", "dist/main.js"]
FROM node:22-alpine3.21 AS build
WORKDIR /app

# Copy root package files for workspace configuration
COPY package*.json ./

# Copy TypeScript base config (packages extend this)
COPY tsconfig.base.json ./

# Copy packages directory (workspace dependencies)
COPY packages/ ./packages/

# Copy UI package files
COPY calendar-ui/package*.json ./calendar-ui/

# Install all dependencies (workspace-aware)
RUN npm install

# Copy UI source code
COPY calendar-ui/ ./calendar-ui/

# Build packages first, then the UI
RUN npm run build --workspace=packages/shared && \
    npm run build --workspace=calendar-ui

FROM docker.io/library/nginx:alpine
COPY --from=build /app/calendar-ui/dist /usr/share/nginx/html
# Add nginx config if needed to proxy /api to backend
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
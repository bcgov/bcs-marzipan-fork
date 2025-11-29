FROM node:22-alpine3.21 AS build
WORKDIR /app

# Copy root package files for workspace configuration
COPY package*.json ./

# Copy TypeScript base config (packages extend this)
COPY tsconfig.base.json ./

# Copy packages directory (workspace dependencies)
COPY packages/ ./packages/

# Copy service package files
COPY calendar-service/package*.json ./calendar-service/

# Install all dependencies (workspace-aware)
RUN npm install

# Copy service source code
COPY calendar-service/ ./calendar-service/

# Build packages first, then the service
RUN npm run build --workspace=packages/database && \
    npm run build --workspace=packages/shared && \
    npm run build --workspace=calendar-service

FROM node:22-alpine3.21
WORKDIR /app
#ENV NODE_ENV=production

# Copy root package files (needed for workspace resolution)
COPY package*.json ./

# Copy built packages with their package.json files
COPY --from=build /app/packages/database/package*.json ./packages/database/
COPY --from=build /app/packages/database/dist ./packages/database/dist/
COPY --from=build /app/packages/shared/package*.json ./packages/shared/
COPY --from=build /app/packages/shared/dist ./packages/shared/dist/

# Copy built service
COPY --from=build /app/calendar-service/dist ./calendar-service/dist
COPY --from=build /app/calendar-service/package*.json ./calendar-service/

# Install production dependencies (workspace-aware from root)
# Skip scripts to avoid husky prepare hook in production
RUN npm install --production --workspaces=false --ignore-scripts && \
    npm install --production --workspace=packages/database --ignore-scripts && \
    npm install --production --workspace=packages/shared --ignore-scripts && \
    npm install --production --workspace=calendar-service --ignore-scripts

EXPOSE 3001
WORKDIR /app/calendar-service
CMD ["node", "dist/main.js"]
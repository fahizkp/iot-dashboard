# Stage 1: Build React frontend
FROM node:20-alpine AS client-build
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app/client
COPY client/package.json client/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile
COPY client/ ./
RUN pnpm build

# Stage 2: Production nginx image serving frontend
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy frontend build
COPY --from=client-build /app/client/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

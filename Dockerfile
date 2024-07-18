# Use an official Node.js runtime as the base image
FROM oven/bun:1.1-slim as build-stage
LABEL authors="xcodeassociated"

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy app source code to the working directory
COPY . .

# Generate types
RUN bun run generate:graphql

# Build the prod app
RUN NODE_ENV=production bun run build

# Use NGINX as the production server
FROM nginx:stable-alpine-slim

# Copy the NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the build stage to NGINX
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
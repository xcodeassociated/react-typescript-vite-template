# Use an official Node.js runtime as the base image
FROM node:18 as build-stage
LABEL authors="xcodeassociated"

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code to the working directory
COPY . .

## Generate types
#RUN npm run generate:graphql

RUN node node_modules/esbuild/install.js

# Build the app
RUN npm run build

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
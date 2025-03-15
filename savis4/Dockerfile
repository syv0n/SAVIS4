# Use a base image that supports multiple architectures
FROM --platform=$BUILDPLATFORM node:14.21.3-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY Savis3/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY Savis3 .

# Build the Angular app
RUN npm run build

# Use a lightweight web server as the final image
FROM --platform=$TARGETPLATFORM nginx:alpine

# Copy the built app to nginx's serve directory
COPY --from=builder /app/dist/Savis3 /usr/share/nginx/html

# Install Node.js and npm in the final stage for testing
RUN apk add --update nodejs npm

# Copy package.json and install dependencies for running tests
COPY Savis3/package*.json ./
RUN npm install

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

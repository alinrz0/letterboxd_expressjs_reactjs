# Use a specific lightweight Node.js version
FROM node:18-alpine

# Set environment variables for production
ENV NODE_ENV=development

# Install required dependencies for Alpine (if needed)
RUN apk add --no-cache bash

# Create a non-root user for security
RUN addgroup app && adduser -S -G app app

# Set the working directory inside the express folder
WORKDIR /app/express

# Copy package.json and package-lock.json first to optimize Docker caching
COPY express/package.json express/package-lock.json ./ 

# Install dependencies (including dev dependencies for development)
RUN npm install

# Copy the entire express folder (including src/)
COPY express /app/express

# Change ownership to the non-root user
RUN chown -R app:app /app

# Switch to the non-root user
USER app

# Expose the application port
EXPOSE 3000


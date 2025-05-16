# Use Node.js LTS version
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Set environment variables
ENV REACT_APP_API_URL=https://antipilug-backend-antipilug.apps.gpu-nested.med.one/api
ENV NODE_ENV=production

# First copy only package files for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/build ./build

# Install serve to run the application
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]

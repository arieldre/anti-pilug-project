# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install TypeScript globally
RUN npm install -g typescript

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install --save-dev @types/node @types/express @types/jsonwebtoken @types/mongoose
RUN npm install axios @types/axios

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "dev"] 
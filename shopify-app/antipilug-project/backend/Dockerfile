# --------- Build stage ---------
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Install TypeScript globally
    RUN npm install -g typescript
    
    # Copy package files
    COPY package*.json ./
    
    # Install all dependencies including dev
    RUN npm install
    
    # Copy the rest of the source code
    COPY . .
    
    # Build the TypeScript app
    RUN npm run build
    
    # --------- Production stage ---------
    FROM node:18-alpine
    
    WORKDIR /app
    
    # Set environment variables
    ENV PORT=5000
    ENV MONGODB_URI=mongodb://mongodb:27017/antipilug
    ENV FRONTEND_URL=https://antipilug-frontend-antipilug.apps.gpu-nested.med.one
    ENV NODE_ENV=production
    
    # Copy only needed files from builder
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/node_modules ./node_modules
    
    EXPOSE 5000
    
    CMD ["node", "dist/server.js"]
    
FROM node:alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies (without dev packages for production)
RUN npm ci --legacy-peer-deps

# Copy the rest of the app
COPY . .

RUN npm run build

# Install PM2 globally
RUN npm install --global pm2

# Ensure cache and .next have correct permissions
RUN mkdir -p .next/cache && \
    chown -R node:node .next && \
    chmod -R 755 .next

# Expose port
EXPOSE 3000

# Switch to non-root user
USER node

# Start the app with PM2 (using npm start)
CMD ["pm2-runtime", "start", "npm", "--", "start"]

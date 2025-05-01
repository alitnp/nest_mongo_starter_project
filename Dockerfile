# Use a Node.js runtime
FROM node:20

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy built app
COPY dist ./dist

# Start the app
CMD ["node", "dist/main.js"]

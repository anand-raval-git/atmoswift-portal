# Use Node.js official image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file first
COPY package*.json ./

# Uninstall tauri-cli (in case it's in dependencies)
RUN npm uninstall @tauri-apps/cli || true

# Install project dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose port 8080 for Vite dev server
EXPOSE 8080

# Start the frontend on port 8080
CMD ["npm", "run", "dev", "--", "--port", "8080", "--host"]


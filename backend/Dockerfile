FROM node:20-alpine

WORKDIR /app

# Install OpenSSL and other required dependencies
RUN apk add --no-cache openssl openssl-dev sqlite

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Make init script executable
RUN chmod +x init.sh

# Expose port 8000
EXPOSE 8000

# Start the application with initialization
CMD ["/bin/sh", "./init.sh"] 
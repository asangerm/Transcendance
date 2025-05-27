FROM node:20-alpine

WORKDIR /app

# Install required OS packages
RUN apk add --no-cache openssl openssl-dev sqlite

# Copy app files first
COPY . .

# Install dependencies
RUN npm install

# Make init script executable
RUN chmod +x init.sh

# Expose backend port
EXPOSE 8000

# Start application via init script
CMD ["/bin/sh", "./init.sh"]

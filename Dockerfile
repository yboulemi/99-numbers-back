# Use a specific version of node based on Alpine Linux
FROM node:20.11.0-alpine

# Install bash
RUN apk add --no-cache bash

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --verbose

# Copy the rest of your application code
COPY . .

# Download and prepare wait-for-it script
COPY wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh

# Copy SSL certificates
COPY ./ssl/certs/99-numbers.com.pem /etc/ssl/certs/
COPY ./ssl/private/99-numbers.com.key.pem /etc/ssl/private/

# Ensure the SSL directory and files have the correct permissions
RUN chmod 600 /etc/ssl/private/99-numbers.com.key.pem
RUN chmod 644 /etc/ssl/certs/99-numbers.com.pem

# Make your service's port available
EXPOSE 8443

# Command to run your app using the wait-for-it script
CMD ["/usr/wait-for-it.sh", "db:3306", "--", "npm", "start"]

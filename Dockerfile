FROM node:20.11.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Make your service's port available
EXPOSE 3252


# Command to run your app
CMD ["npm", "start"]

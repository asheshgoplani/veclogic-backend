# Use the official Node.js runtime as a base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application to the container
COPY . .

# Specify the port that the application will run on
EXPOSE 5000

# Command to run the application
CMD [ "npm", "start" ]

# Base image to use and official Node runtime as a parent image
FROM node:18
# Set the working directory in the container to /app
WORKDIR /app
# Install ffmpeg cli for the video processsing 
RUN apt-get update && apt-get install -y ffmpeg
# Copy the packages required for npm
COPY package*.json ./
# Install those npm packages
RUN npm install
#app source code inside the docker image
COPY . .
# Make port 3000 available outside this container
EXPOSE 3000
# Define the command to run your app using CMD (only one CMD allowed)
CMD [ "npm","start" ]
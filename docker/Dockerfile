# Use the base image with Node.js 10.19
FROM node:10.19

# Copy the current directory into the Docker image
COPY . /legacy-challenge-sync-processor

# Set working directory for future use
WORKDIR /legacy-challenge-sync-processor

# Install the dependencies from package.json
RUN npm install
CMD npm start

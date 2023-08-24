# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

COPY tsconfig*.json ./

# Install app dependencies
RUN npm install && npm install typescript

# Copy the rest of the application code to the container
COPY . .

# Build app
RUN npm run build

# Set environment variables
ENV PORT=3000
ENV PG_HOST="plarium.cpmyrepxren3.il-central-1.rds.amazonaws.com"
ENV PG_DB="postgres"
ENV PG_USER="plarium"
ENV PG_PASS="Aa123456"
ENV PG_PORT=5432

# Expose the port that the app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]


# backend/Dockerfile
FROM node:22

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies inside the Docker container
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Bundle app source
COPY . .

# Build the TypeScript app
RUN npm run build

EXPOSE ${PORT}
CMD [ "nodemon", "--watch", ".", "--exec", "npm", "start" ]

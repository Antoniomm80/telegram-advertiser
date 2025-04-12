FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies with yarn
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Run the application
CMD ["yarn", "start"]

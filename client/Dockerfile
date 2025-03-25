FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variable for the API URL
ARG API_URL
ENV NEXT_PUBLIC_API_URL=${API_URL}

# Build the application
RUN npm run build

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
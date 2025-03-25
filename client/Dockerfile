FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variable for the API URL
ENV NEXT_PUBLIC_API_URL=http://api:9000

# Build the application
RUN npm run build

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
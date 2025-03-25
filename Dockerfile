# Stage 1: Build API
FROM python:3.11-slim as api
WORKDIR /app
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY api/ .
EXPOSE 9000
CMD ["uvicorn", "run:app", "--host", "0.0.0.0", "--port", "9000"]

# Stage 2: Build Client
FROM node:20-alpine as client
WORKDIR /app
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ .
ENV NEXT_PUBLIC_API_URL=http://api:9000
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
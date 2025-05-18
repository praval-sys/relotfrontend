FROM node:20-alpine

WORKDIR /app

# Copy env first so Docker doesn't cache old values
COPY .env.production .env.production

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build with correct env vars
RUN npm run build

EXPOSE 3003

CMD ["npm", "start"]

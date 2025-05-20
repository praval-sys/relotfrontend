FROM node:20-alpine

WORKDIR /app



# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Accept ENV file as a build arg and write it into .env.production
ARG FRONTEND_ENV
RUN echo "$FRONTEND_ENV" > .env.production


# Build with correct env vars
RUN npm run build

EXPOSE 3003

CMD ["npm", "start"]

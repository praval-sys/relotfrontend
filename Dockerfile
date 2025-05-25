FROM node:20-alpine AS builder

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

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3003

CMD ["npm", "start"]

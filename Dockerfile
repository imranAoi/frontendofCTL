# 1️⃣ Base image to build the app
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of your project
COPY . .

# Generate production build
RUN npm run build

# 2️⃣ Final image to run the app using standalone output
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only necessary output files from builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Optional: if you use next.config.js or .env
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.env ./.env

EXPOSE 3000

CMD ["node", "server.js"]

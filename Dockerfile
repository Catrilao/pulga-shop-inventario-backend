# Dockerfile for Pulga Shop Inventario backend
# Multi-stage build using pnpm (via corepack) and Node 20

FROM node:20 AS builder

WORKDIR /app

# copy lockfile and package manifest first for better caching
COPY package.json pnpm-lock.yaml* ./

# enable corepack and install dependencies with pnpm (including dev deps for build)
RUN npm install --legacy-peer-deps

# Copy prisma schema so `prisma generate` can find the schema file
COPY prisma ./prisma

# Ensure Prisma client is generated inside the container before building
RUN npx prisma generate --schema=prisma/schema.prisma
RUN ls -la generated || true

# copy source and build using tsc to avoid nest-cli runtime issues
COPY . .
# Build using npm (runs `nest build` as defined in package.json)
RUN npm run build

# Production image
FROM node:20

WORKDIR /app

# copy built artifacts + node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/docs ./docs
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main"]

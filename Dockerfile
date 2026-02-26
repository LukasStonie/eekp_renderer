# Stage 1: Build
FROM node:lts-alpine AS builder
WORKDIR /app
COPY frontend/eekp_renderer/package*.json ./
RUN npm install
COPY frontend/eekp_renderer/ ./
RUN npm run build

# Stage 2: Runtime (This is the stage that actually runs on your server)
FROM node:lts-alpine
WORKDIR /app

# 1. Copy the compiled app from the builder
COPY --from=builder /app/.output ./.output

# 2. Copy the certs folder from your HOST into the final image
# This is what was missing!
COPY frontend/eekp_renderer/certs ./certs

ENV HOST=0.0.0.0
ENV PORT=8000
ENV NODE_ENV=production

EXPOSE 8000
CMD ["node", ".output/server/index.mjs"]
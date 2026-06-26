# ── Stage 1: build the React frontend ──────────────────
FROM node:20-bookworm-slim AS build
WORKDIR /app
# Build metadata shown in the app (set by CI to the workflow run number).
ARG BUILD_ID=dev
ENV BUILD_ID=$BUILD_ID
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: runtime — Express serves dist/ + the API ──
FROM node:20-bookworm-slim AS run
ENV NODE_ENV=production
WORKDIR /app
# Only production deps (express + better-sqlite3; prebuilt glibc binary, no compiling).
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY server.js ./
COPY --from=build /app/dist ./dist
# SQLite lives on a mounted volume so data survives redeploys.
ENV DB_PATH=/data/dashboard.db
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]

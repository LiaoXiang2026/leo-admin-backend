# ---- Build Stage ----
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json ./
# Resolve catalog: reference for standalone install
RUN sed -i 's/"dotenv": "catalog:"/"dotenv": "^17.4.2"/' package.json && npm install

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
RUN npx nest build

# ---- Production Stage ----
FROM node:22-slim

WORKDIR /app

COPY package.json ./
RUN sed -i 's/"dotenv": "catalog:"/"dotenv": "^17.4.2"/' package.json && npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

EXPOSE 3200

CMD ["node", "dist/main.js"]

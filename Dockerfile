# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --production --legacy-peer-deps

EXPOSE 3000
CMD ["npm", "start"]

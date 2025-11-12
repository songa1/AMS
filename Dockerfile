# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build -- --no-turbo

# ---- Production Stage ----
FROM node:20-alpine
WORKDIR /usr/src/app
COPY .next ./.next
COPY public ./public
COPY package*.json ./
RUN npm install --production --legacy-peer-deps
EXPOSE 3000
CMD ["npm", "start"]

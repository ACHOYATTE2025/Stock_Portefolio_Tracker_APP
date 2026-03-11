# ─────────────────────────────────────────
# Stage 1 — DEV
# ─────────────────────────────────────────
FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]


# ─────────────────────────────────────────
# Stage 2 — BUILD (pour la prod)
# ─────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .
RUN npm run build


# ─────────────────────────────────────────
# Stage 3 — PROD (Nginx ultra-léger)
# ─────────────────────────────────────────
FROM nginx:alpine AS prod

# Copie le build React
COPY --from=build /app/dist /usr/share/nginx/html

# Config Nginx pour React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

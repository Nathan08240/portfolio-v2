# ---------- BUILD ----------
FROM node:20-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .

# Variable injectée AU BUILD (important pour Vite)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm run build


# ---------- SERVE ----------
FROM nginx:alpine

# Supprimer la conf par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Config Nginx SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fichiers buildés
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

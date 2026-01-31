# --- ÉTAPE 1 : BUILD DU FRONTEND ---
FROM node:20-alpine as frontend-build

# Activation de pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app/frontend

# Copie des dépendances frontend
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copie du code source frontend
COPY frontend/ .

# Build du frontend (génère le dossier dist)
# On définit l'URL de l'API comme relative pour le monolithe
ENV VITE_API_URL=/api
RUN pnpm run build


# --- ÉTAPE 2 : PRÉPARATION DU BACKEND ---
FROM node:20 as backend

# Installation de pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copie des dépendances backend
COPY backend/package.json backend/pnpm-lock.yaml* ./

# Configuration pour better-sqlite3
RUN printf "onlyBuiltDependencies:\n  - better-sqlite3\n  - sqlite3\n  - sequelize\n" > pnpm-workspace.yaml

# Installation des dépendances backend
RUN pnpm install --frozen-lockfile

# Copie du code source backend
COPY backend/ .

# --- ÉTAPE 3 : ASSEMBLAGE FINAL ---
# On copie le build du frontend (dist) vers le dossier public du backend
COPY --from=frontend-build /app/frontend/dist ./public

# Exposition du port
EXPOSE 3000

# Démarrage du serveur
CMD ["pnpm", "start"]

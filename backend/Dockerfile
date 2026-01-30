# Utiliser une image Node.js LTS légère
FROM node:20-alpine

# Créer le répertoire de travail
WORKDIR /app

# Installer les dépendances système nécessaires pour compiler les modules natifs (comme better-sqlite3)
# python3, make, g++ sont souvent requis par node-gyp
RUN apk add --no-cache python3 make g++

# Copier les fichiers de dépendances
COPY package.json pnpm-lock.yaml* ./

# Installer pnpm
RUN npm install -g pnpm

# Installer les dépendances du projet
RUN pnpm install --frozen-lockfile

# Copier le reste du code source
COPY . .

# Exposer le port sur lequel l'application tourne
EXPOSE 3000

# Commande de démarrage
CMD ["pnpm", "start"]

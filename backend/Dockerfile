# On utilise une image Node.js complète (pas Alpine) pour faciliter la compilation native
FROM node:20

# Installation de pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copie des fichiers de définition des dépendances
COPY package.json pnpm-lock.yaml* ./

# Configuration spécifique pour pnpm et les modules natifs
# On crée le fichier pnpm-workspace.yaml pour forcer le build des dépendances natives
RUN printf "onlyBuiltDependencies:\n  - better-sqlite3\n  - sqlite3\n  - sequelize\n" > pnpm-workspace.yaml

# Installation des dépendances
# --frozen-lockfile assure qu'on installe exactement les versions du lockfile
RUN pnpm install --frozen-lockfile

# Copie du reste du code source
COPY . .

# Exposition du port
EXPOSE 3000

# Démarrage
CMD ["pnpm", "start"]

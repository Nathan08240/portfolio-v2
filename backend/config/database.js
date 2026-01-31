const { Sequelize } = require('sequelize');
const path = require('path');

// Si une variable d'environnement DB_PATH existe, on l'utilise.
// Sinon, on utilise le chemin par défaut (local).
const storagePath = process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite');

console.log(`Database storage path: ${storagePath}`);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false, 
  dialectModule: require('better-sqlite3'),
});

module.exports = sequelize;

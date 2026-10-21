const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Docker : /app/data/database.sqlite (volume) ; local : backend/data/database.sqlite
const storage = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'database.sqlite');
fs.mkdirSync(path.dirname(storage), { recursive: true });

// Configuration standard et propre pour Sequelize avec better-sqlite3
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false, // Mettre à `console.log` pour voir les requêtes SQL effectuées

});

module.exports = sequelize;

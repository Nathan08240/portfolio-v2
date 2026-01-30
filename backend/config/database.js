const { Sequelize } = require('sequelize');
const path = require('path');

// Configuration standard et propre pour Sequelize avec better-sqlite3
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false, // Mettre à `console.log` pour voir les requêtes SQL effectuées
});

module.exports = sequelize;

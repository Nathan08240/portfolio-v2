const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Experience = sequelize.define('Experience', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING, // Ex: "Développeur Full Stack" ou "Master Informatique"
    allowNull: false,
  },
  organization: {
    type: DataTypes.STRING, // Ex: "Google" ou "Université de Paris"
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('work', 'education'), // Pour distinguer Expérience Pro et Formation
    allowNull: false,
    defaultValue: 'work'
  },
  startDate: {
    type: DataTypes.STRING, // On peut utiliser STRING pour simplifier (ex: "Sept 2023") ou DATEONLY
    allowNull: false,
  },
  endDate: {
    type: DataTypes.STRING, // Ex: "Présent" ou "Juin 2024"
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  tableName: 'experiences',
  timestamps: true,
});

module.exports = Experience;

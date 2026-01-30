const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Définition du modèle Profile
const Profile = sequelize.define('Profile', {
  // Le modèle aura les champs suivants dans la table
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  introduction: {
    type: DataTypes.TEXT, // TEXT est plus adapté pour des descriptions longues
    allowNull: true,
  },
}, {
  // Options du modèle
  tableName: 'profiles', // Nom de la table dans la base de données
  timestamps: true, // Ajoute les champs createdAt et updatedAt automatiquement
});

module.exports = Profile;

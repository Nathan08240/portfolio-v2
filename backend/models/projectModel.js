const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  technologies: {
    type: DataTypes.STRING, // On stockera une liste séparée par des virgules, ex: "Vue.js,Node.js,Tailwind"
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING, // URL vers une image de présentation du projet
    allowNull: true,
  },
  projectUrl: {
    type: DataTypes.STRING, // URL vers le projet en ligne
    allowNull: true,
  },
  repoUrl: {
    type: DataTypes.STRING, // URL vers le dépôt GitHub/GitLab
    allowNull: true,
  },
}, {
  tableName: 'projects',
  timestamps: true,
});

module.exports = Project;

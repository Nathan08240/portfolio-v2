const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path'); // Import path
const sequelize = require('./config/database');

// Modèles
const Profile = require('./models/profileModel');
const Project = require('./models/projectModel');
const User = require('./models/userModel');
const Experience = require('./models/experienceModel');

const app = express();
const port = process.env.PORT || 3000; // Utiliser le port de l'env ou 3000

app.use(cors());
app.use(express.json());

// --- ROUTES API ---
const profileRoutes = require('./routes/profileRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const experienceRoutes = require('./routes/experienceRoutes');

app.use('/api', profileRoutes);
app.use('/api', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', experienceRoutes);

// --- SERVIR LE FRONTEND (FICHIERS STATIQUES) ---
// Le dossier 'dist' sera copié à la racine de l'app dans le Dockerfile
const distPath = path.join(__dirname, 'public'); 
app.use(express.static(distPath));

// --- CATCH-ALL ROUTE (POUR VUE ROUTER) ---
// CORRECTION ICI : Utilisation d'une Regex pour capturer toutes les routes non gérées
// Express 5 n'aime pas '*' tout seul.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const initializeDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection OK.');
    
    await sequelize.query("PRAGMA journal_mode=WAL;");
    
    console.log('Syncing models...');
    await sequelize.sync(); 
    console.log('Models synced.');

    // Initialisation des données par défaut (Profil, Admin, Expériences, Projets)
    const profileCount = await Profile.count();
    if (profileCount === 0) {
      await Profile.create({
        name: "Nathan",
        title: "Développeur Web Full-Stack",
        introduction: "Passionné par la création d'applications web modernes."
      });
    }

    const userCount = await User.count();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({ username: 'admin', password: hashedPassword });
    }
    
    const expCount = await Experience.count();
    if (expCount === 0) {
      await Experience.bulkCreate([
        {
          title: "Développeur Full Stack",
          organization: "Tech Solutions Inc.",
          type: "work",
          startDate: "2022",
          endDate: "Présent",
          description: "Développement d'applications web React/Node.js, gestion de base de données, optimisation des performances."
        },
        {
          title: "Master Informatique",
          organization: "Université de Technologie",
          type: "education",
          startDate: "2020",
          endDate: "2022",
          description: "Spécialisation en génie logiciel et systèmes distribués."
        }
      ]);
    }
    
    const projCount = await Project.count();
    if (projCount === 0) {
        await Project.bulkCreate([
            {
              title: "Mon Portfolio",
              description: "Le site que vous consultez actuellement. Développé avec Vue.js, Tailwind CSS et un backend Node.js/Express.",
              technologies: "Vue.js,Node.js,Sequelize,Tailwind CSS",
              repoUrl: "https://github.com/votre-pseudo/portfolio-v2",
            },
            {
              title: "Application de Tâches",
              description: "Une application simple de type 'To-Do List' pour gérer les tâches quotidiennes, avec une interface réactive.",
              technologies: "Vue.js,Vite,CSS",
              projectUrl: "https://lien-vers-votre-app.com",
              repoUrl: "https://github.com/votre-pseudo/todo-app",
            }
        ]);
    }

  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
};

const startServer = async () => {
  await initializeDatabase();
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

startServer();

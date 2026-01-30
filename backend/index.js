const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');

// Modèles
const Profile = require('./models/profileModel');
const Project = require('./models/projectModel');
const User = require('./models/userModel');
const Experience = require('./models/experienceModel');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes
const profileRoutes = require('./routes/profileRoutes');
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');
const experienceRoutes = require('./routes/experienceRoutes');

app.use('/api', profileRoutes);
app.use('/api', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', experienceRoutes);

app.get('/', (req, res) => {
  res.send('Backend server is running!');
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

    // 1. Profil par défaut
    const profileCount = await Profile.count();
    console.log(`Profiles found: ${profileCount}`);
    if (profileCount === 0) {
      await Profile.create({
        name: "Nathan",
        title: "Développeur Web Full-Stack",
        introduction: "Passionné par la création d'applications web modernes."
      });
      console.log('-> Default profile created.');
    }

    // 2. Admin par défaut
    const userCount = await User.count();
    console.log(`Users found: ${userCount}`);
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword
      });
      console.log('-> Default admin user created (admin/admin123).');
    }

    // 3. Expériences par défaut
    const expCount = await Experience.count();
    console.log(`Experiences found: ${expCount}`);
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
      console.log('-> Default experiences created.');
    }
    
    // 4. Projets par défaut (si aucun)
    const projCount = await Project.count();
    console.log(`Projects found: ${projCount}`);
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
        console.log('-> Default projects created.');
    }

  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  await initializeDatabase();
  app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
  });
};

startServer();

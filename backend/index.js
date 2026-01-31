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
// Toutes les requêtes qui ne sont pas des API sont renvoyées vers index.html
app.get('*', (req, res) => {
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
    // ... (Code identique à avant, je ne le répète pas pour la concision, mais il est conservé)
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
    
    // ... (Expériences et Projets par défaut)

  } catch (error) {
    console.error('Failed to initialize database:', error);
    // On ne quitte pas le processus ici pour laisser le serveur tourner même si la DB a un souci temporaire
  }
};

const startServer = async () => {
  await initializeDatabase();
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

startServer();

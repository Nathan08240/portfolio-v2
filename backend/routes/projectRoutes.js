const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth'); // Import du middleware

// Route publique
router.get('/projects', projectController.getProjects);

// Routes protégées (Admin seulement)
router.post('/projects', auth, projectController.createProject);
router.put('/projects/:id', auth, projectController.updateProject);
router.delete('/projects/:id', auth, projectController.deleteProject);

module.exports = router;

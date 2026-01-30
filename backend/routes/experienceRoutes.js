const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const auth = require('../middleware/auth');

// Route publique
router.get('/experiences', experienceController.getExperiences);

// Routes protégées (Admin seulement)
router.post('/experiences', auth, experienceController.createExperience);
router.put('/experiences/:id', auth, experienceController.updateExperience);
router.delete('/experiences/:id', auth, experienceController.deleteExperience);

module.exports = router;

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

router.get('/profile', profileController.getProfile);
router.put('/profile', auth, profileController.updateProfile);

module.exports = router;

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'votre_super_secret_key_a_changer_en_prod'; // À mettre dans un .env idéalement

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. Trouver l'utilisateur
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // 2. Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // 3. Générer le token
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

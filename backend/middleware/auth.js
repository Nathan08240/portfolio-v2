const jwt = require('jsonwebtoken');
const SECRET_KEY = 'votre_super_secret_key_a_changer_en_prod';

module.exports = (req, res, next) => {
  try {
    // Récupérer le token du header Authorization: "Bearer <token>"
    const token = req.headers.authorization.split(' ')[1];
    
    if (!token) {
      throw new Error('Authentification requise');
    }

    // Vérifier le token
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.auth = { userId: decodedToken.id };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Requête non authentifiée !' });
  }
};

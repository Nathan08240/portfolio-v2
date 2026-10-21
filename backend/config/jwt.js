const crypto = require('crypto');

let secret = process.env.JWT_SECRET;
if (!secret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET manquant : démarrage refusé en production.');
  }
  // Hors production : secret aléatoire, les tokens expirent à chaque redémarrage
  console.warn('JWT_SECRET absent : secret temporaire généré (dev uniquement).');
  secret = crypto.randomBytes(32).toString('hex');
}

module.exports = secret;

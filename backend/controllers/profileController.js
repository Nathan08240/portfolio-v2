const Profile = require('../models/profileModel');

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) return res.status(404).json({ message: "Aucun profil trouvé." });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération profil", error: error.message });
  }
};

// Mettre à jour le profil (Admin)
exports.updateProfile = async (req, res) => {
  try {
    // On suppose qu'il n'y a qu'un seul profil, on prend le premier
    const profile = await Profile.findOne();
    if (!profile) {
      // Si pas de profil, on le crée
      const newProfile = await Profile.create(req.body);
      return res.status(201).json(newProfile);
    }
    
    await profile.update(req.body);
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Erreur mise à jour profil", error: error.message });
  }
};

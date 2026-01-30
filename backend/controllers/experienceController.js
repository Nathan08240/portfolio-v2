const Experience = require('../models/experienceModel');

// Obtenir toutes les expériences (Public)
exports.getExperiences = async (req, res) => {
  try {
    // Tri par date de création décroissante pour l'instant (ou on pourrait trier par startDate)
    const experiences = await Experience.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération expériences", error: error.message });
  }
};

// Créer une expérience (Admin)
exports.createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ message: "Erreur création expérience", error: error.message });
  }
};

// Modifier une expérience (Admin)
exports.updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Experience.update(req.body, { where: { id } });
    if (updated) {
      const updatedExperience = await Experience.findByPk(id);
      res.status(200).json(updatedExperience);
    } else {
      res.status(404).json({ message: "Expérience non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur modification expérience", error: error.message });
  }
};

// Supprimer une expérience (Admin)
exports.deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Experience.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Expérience non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression expérience", error: error.message });
  }
};

const Experience = require('../models/experienceModel');

const MONTHS = ['jan', 'fev', 'mar', 'avr', 'mai', 'juin', 'juil', 'aou', 'sep', 'oct', 'nov', 'dec'];
const ONGOING = Number.MAX_SAFE_INTEGER;

// Dates libres ('2022', 'Sept 2023', '03/2022') -> AAAAMM ; sans année ('Présent', vide) -> null
const dateValue = (str) => {
  const s = String(str ?? '').toLowerCase().normalize('NFD').replaceAll(/[̀-ͯ]/g, '');
  const year = s.match(/\d{4}/)?.[0];
  if (!year) return null;
  const word = s.match(/[a-z]+/)?.[0] ?? '';
  let month = MONTHS.findIndex((m) => word.startsWith(m)) + 1;
  if (!month) month = Number(s.replace(year, '').match(/\d{1,2}/)?.[0] ?? 0);
  return Number(year) * 100 + (month <= 12 ? month : 0);
};

// Plus récente d'abord : en cours en tête, puis fin décroissante, puis début décroissant
exports.sortExperiences = (experiences) => experiences
  .map((e) => ({ e, end: dateValue(e.endDate) ?? ONGOING, start: dateValue(e.startDate) ?? 0 }))
  .sort((a, b) => (b.end - a.end) || (b.start - a.start))
  .map(({ e }) => e);

// Obtenir toutes les expériences (Public)
exports.getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(exports.sortExperiences(experiences));
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

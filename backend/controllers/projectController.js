const Project = require('../models/projectModel');

// Obtenir tous les projets (Public)
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération projets", error: error.message });
  }
};

// Créer un projet (Admin)
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Erreur création projet", error: error.message });
  }
};

// Modifier un projet (Admin)
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Project.update(req.body, { where: { id } });
    if (updated) {
      const updatedProject = await Project.findByPk(id);
      res.status(200).json(updatedProject);
    } else {
      res.status(404).json({ message: "Projet non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur modification projet", error: error.message });
  }
};

// Supprimer un projet (Admin)
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Projet non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression projet", error: error.message });
  }
};

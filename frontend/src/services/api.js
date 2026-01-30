// Utilisation de la variable d'environnement VITE_API_URL
// Si elle n'est pas définie (ex: en dev local sans .env), on fallback sur localhost:3000/api
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiService = {
  // --- PROFIL ---
  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/profile`);
    if (!response.ok) throw new Error('Erreur profil');
    return await response.json();
  },
  
  async updateProfile(data, token) {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur update profil');
    return await response.json();
  },

  // --- PROJETS ---
  async getProjects() {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) throw new Error('Erreur projets');
    return await response.json();
  },

  async createProject(data, token) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur création projet');
    return await response.json();
  },

  async updateProject(id, data, token) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur modification projet');
    return await response.json();
  },

  async deleteProject(id, token) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erreur suppression projet');
  },

  // --- EXPÉRIENCES (PARCOURS) ---
  async getExperiences() {
    const response = await fetch(`${API_BASE_URL}/experiences`);
    if (!response.ok) throw new Error('Erreur expériences');
    return await response.json();
  },

  async createExperience(data, token) {
    const response = await fetch(`${API_BASE_URL}/experiences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur création expérience');
    return await response.json();
  },

  async updateExperience(id, data, token) {
    const response = await fetch(`${API_BASE_URL}/experiences/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur modification expérience');
    return await response.json();
  },

  async deleteExperience(id, token) {
    const response = await fetch(`${API_BASE_URL}/experiences/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erreur suppression expérience');
  },

  // --- AUTH ---
  // J'ajoute aussi la méthode de login ici pour centraliser l'URL
  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Erreur login');
    return data;
  }
};

// En production (monolithe), l'API est sur le même domaine, donc on utilise un chemin relatif '/api'.
// En développement, on peut surcharger avec VITE_API_URL si besoin.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const parseTechs = (csv) => (csv ?? '').split(',').map((t) => t.trim()).filter(Boolean);

// Erreur = message du serveur (ou défaut) + statut HTTP, pour détecter le 401 côté admin
async function request(path, { method = 'GET', body, token, fallback = 'Erreur serveur' } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}${path}`, { method, headers, body: body && JSON.stringify(body) });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const err = new Error(data?.message || fallback);
    err.status = response.status;
    throw err;
  }
  return data;
}

export const apiService = {
  // --- PROFIL ---
  getProfile: () => request('/profile', { fallback: 'Erreur profil' }),
  updateProfile: (data, token) => request('/profile', { method: 'PUT', body: data, token, fallback: 'Erreur update profil' }),

  // --- PROJETS ---
  getProjects: () => request('/projects', { fallback: 'Erreur projets' }),
  createProject: (data, token) => request('/projects', { method: 'POST', body: data, token, fallback: 'Erreur création projet' }),
  updateProject: (id, data, token) => request(`/projects/${id}`, { method: 'PUT', body: data, token, fallback: 'Erreur modification projet' }),
  deleteProject: (id, token) => request(`/projects/${id}`, { method: 'DELETE', token, fallback: 'Erreur suppression projet' }),

  // --- EXPÉRIENCES (PARCOURS) ---
  getExperiences: () => request('/experiences', { fallback: 'Erreur expériences' }),
  createExperience: (data, token) => request('/experiences', { method: 'POST', body: data, token, fallback: 'Erreur création expérience' }),
  updateExperience: (id, data, token) => request(`/experiences/${id}`, { method: 'PUT', body: data, token, fallback: 'Erreur modification expérience' }),
  deleteExperience: (id, token) => request(`/experiences/${id}`, { method: 'DELETE', token, fallback: 'Erreur suppression expérience' }),

  // --- AUTH ---
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials, fallback: 'Erreur login' }),
};

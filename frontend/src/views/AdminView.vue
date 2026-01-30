<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiService } from '@/services/api';

const router = useRouter();
const activeTab = ref('projects'); // 'projects', 'experiences', 'profile'
const token = localStorage.getItem('token');

// Données
const projects = ref([]);
const experiences = ref([]);
const profile = ref({});

// États d'édition
const isEditingProject = ref(false);
const currentProject = ref({});
const isEditingExperience = ref(false);
const currentExperience = ref({});

onMounted(async () => {
  if (!token) {
    await router.push('/login');
    return;
  }
  await loadAllData();
});

const loadAllData = async () => {
  projects.value = await apiService.getProjects();
  experiences.value = await apiService.getExperiences();
  profile.value = await apiService.getProfile();
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};

// --- GESTION PROJETS ---
const openProjectModal = (project = null) => {
  if (project) {
    currentProject.value = { ...project };
  } else {
    currentProject.value = { title: '', description: '', technologies: '', repoUrl: '', projectUrl: '' };
  }
  isEditingProject.value = true;
};

const saveProject = async () => {
  try {
    if (currentProject.value.id) {
      await apiService.updateProject(currentProject.value.id, currentProject.value, token);
    } else {
      await apiService.createProject(currentProject.value, token);
    }
    isEditingProject.value = false;
    await loadAllData();
  } catch (e) {
    alert('Erreur sauvegarde projet');
  }
};

const deleteProject = async (id) => {
  if (!confirm('Supprimer ce projet ?')) return;
  await apiService.deleteProject(id, token);
  await loadAllData();
};

// --- GESTION EXPÉRIENCES ---
const openExperienceModal = (exp = null) => {
  if (exp) {
    currentExperience.value = { ...exp };
  } else {
    currentExperience.value = { title: '', organization: '', type: 'work', startDate: '', endDate: '', description: '' };
  }
  isEditingExperience.value = true;
};

const saveExperience = async () => {
  try {
    if (currentExperience.value.id) {
      await apiService.updateExperience(currentExperience.value.id, currentExperience.value, token);
    } else {
      await apiService.createExperience(currentExperience.value, token);
    }
    isEditingExperience.value = false;
    await loadAllData();
  } catch (e) {
    alert('Erreur sauvegarde expérience');
  }
};

const deleteExperience = async (id) => {
  if (!confirm('Supprimer cette expérience ?')) return;
  await apiService.deleteExperience(id, token);
  await loadAllData();
};

// --- GESTION PROFIL ---
const saveProfile = async () => {
  try {
    await apiService.updateProfile(profile.value, token);
    alert('Profil mis à jour !');
  } catch (e) {
    alert('Erreur mise à jour profil');
  }
};
</script>

<template>
  <div class="min-h-screen bg-background text-text flex">

    <!-- Sidebar -->
    <aside class="w-64 bg-background-soft border-r border-background-mute flex flex-col fixed h-full">
      <div class="p-6 border-b border-background-mute">
        <h1 class="text-2xl font-bold text-heading font-mono">Admin Panel</h1>
      </div>

      <nav class="flex-grow p-4 space-y-2">
        <button
          @click="activeTab = 'projects'"
          class="w-full text-left px-4 py-3 rounded transition-colors font-mono"
          :class="activeTab === 'projects' ? 'bg-accent text-background font-bold' : 'hover:bg-background-mute text-text'"
        >
          Projets
        </button>
        <button
          @click="activeTab = 'experiences'"
          class="w-full text-left px-4 py-3 rounded transition-colors font-mono"
          :class="activeTab === 'experiences' ? 'bg-accent text-background font-bold' : 'hover:bg-background-mute text-text'"
        >
          Parcours
        </button>
        <button
          @click="activeTab = 'profile'"
          class="w-full text-left px-4 py-3 rounded transition-colors font-mono"
          :class="activeTab === 'profile' ? 'bg-accent text-background font-bold' : 'hover:bg-background-mute text-text'"
        >
          Profil
        </button>
      </nav>

      <div class="p-4 border-t border-background-mute">
        <button @click="logout" class="w-full px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500/10 transition-colors">
          Déconnexion
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-grow ml-64 p-8 md:p-12 overflow-y-auto">

      <!-- ONGLET PROJETS -->
      <div v-if="activeTab === 'projects'">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-heading">Gestion des Projets</h2>
          <button @click="openProjectModal()" class="bg-accent text-background px-4 py-2 rounded font-bold hover:bg-accent/90">
            + Nouveau Projet
          </button>
        </div>

        <div class="grid gap-4">
          <div v-for="project in projects" :key="project.id" class="bg-background-soft p-6 rounded border border-background-mute flex justify-between items-center">
            <div>
              <h3 class="text-xl font-bold text-heading">{{ project.title }}</h3>
              <p class="text-sm text-text/60 mb-2">{{ project.technologies }}</p>
              <p class="text-sm text-text truncate max-w-md">{{ project.description }}</p>
            </div>
            <div class="flex space-x-3">
              <button @click="openProjectModal(project)" class="text-accent hover:text-white">Éditer</button>
              <button @click="deleteProject(project.id)" class="text-red-400 hover:text-red-300">Supprimer</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ONGLET EXPÉRIENCES -->
      <div v-if="activeTab === 'experiences'">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-heading">Gestion du Parcours</h2>
          <button @click="openExperienceModal()" class="bg-accent text-background px-4 py-2 rounded font-bold hover:bg-accent/90">
            + Nouvelle Expérience
          </button>
        </div>

        <div class="space-y-6">
          <div v-for="exp in experiences" :key="exp.id" class="bg-background-soft p-6 rounded border border-background-mute flex justify-between items-start">
            <div>
              <div class="flex items-center gap-3 mb-1">
                <span
                  class="text-xs font-bold px-2 py-1 rounded uppercase"
                  :class="exp.type === 'work' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'"
                >
                  {{ exp.type === 'work' ? 'Travail' : 'Formation' }}
                </span>
                <h3 class="text-xl font-bold text-heading">{{ exp.title }}</h3>
              </div>
              <p class="text-accent font-mono text-sm mb-2">{{ exp.organization }} | {{ exp.startDate }} - {{ exp.endDate || 'Présent' }}</p>
              <p class="text-text text-sm">{{ exp.description }}</p>
            </div>
            <div class="flex space-x-3">
              <button @click="openExperienceModal(exp)" class="text-accent hover:text-white">Éditer</button>
              <button @click="deleteExperience(exp.id)" class="text-red-400 hover:text-red-300">Supprimer</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ONGLET PROFIL -->
      <div v-if="activeTab === 'profile'">
        <h2 class="text-3xl font-bold text-heading mb-8">Modifier le Profil</h2>
        <div class="bg-background-soft p-8 rounded border border-background-mute max-w-2xl">
          <form @submit.prevent="saveProfile" class="space-y-6">
            <div>
              <label class="block text-sm font-mono text-accent mb-2">Nom complet</label>
              <input v-model="profile.name" class="w-full bg-background border border-background-mute rounded p-3 text-heading focus:border-accent focus:outline-none">
            </div>
            <div>
              <label class="block text-sm font-mono text-accent mb-2">Titre / Poste</label>
              <input v-model="profile.title" class="w-full bg-background border border-background-mute rounded p-3 text-heading focus:border-accent focus:outline-none">
            </div>
            <div>
              <label class="block text-sm font-mono text-accent mb-2">Introduction</label>
              <textarea v-model="profile.introduction" rows="6" class="w-full bg-background border border-background-mute rounded p-3 text-heading focus:border-accent focus:outline-none"></textarea>
            </div>
            <button type="submit" class="bg-accent text-background font-bold px-6 py-3 rounded hover:bg-accent/90">
              Enregistrer les modifications
            </button>
          </form>
        </div>
      </div>

    </main>

    <!-- MODALE PROJET -->
    <div v-if="isEditingProject" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div class="bg-background-soft p-8 rounded-lg w-full max-w-2xl border border-background-mute">
        <h3 class="text-2xl font-bold text-heading mb-6">{{ currentProject.id ? 'Modifier' : 'Ajouter' }} un Projet</h3>
        <form @submit.prevent="saveProject" class="space-y-4">
          <input v-model="currentProject.title" placeholder="Titre" class="w-full bg-background p-3 rounded border border-background-mute text-heading" required>
          <input v-model="currentProject.technologies" placeholder="Technos (ex: Vue, Node)" class="w-full bg-background p-3 rounded border border-background-mute text-heading" required>
          <textarea v-model="currentProject.description" placeholder="Description" rows="4" class="w-full bg-background p-3 rounded border border-background-mute text-heading" required></textarea>
          <div class="grid grid-cols-2 gap-4">
            <input v-model="currentProject.repoUrl" placeholder="URL GitHub" class="bg-background p-3 rounded border border-background-mute text-heading">
            <input v-model="currentProject.projectUrl" placeholder="URL Demo" class="bg-background p-3 rounded border border-background-mute text-heading">
          </div>
          <div class="flex justify-end gap-4 mt-6">
            <button type="button" @click="isEditingProject = false" class="text-text hover:text-white">Annuler</button>
            <button type="submit" class="bg-accent text-background font-bold px-6 py-2 rounded">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODALE EXPÉRIENCE -->
    <div v-if="isEditingExperience" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div class="bg-background-soft p-8 rounded-lg w-full max-w-2xl border border-background-mute">
        <h3 class="text-2xl font-bold text-heading mb-6">{{ currentExperience.id ? 'Modifier' : 'Ajouter' }} une Expérience</h3>
        <form @submit.prevent="saveExperience" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <input v-model="currentExperience.title" placeholder="Titre (ex: Développeur)" class="bg-background p-3 rounded border border-background-mute text-heading" required>
            <input v-model="currentExperience.organization" placeholder="Entreprise / École" class="bg-background p-3 rounded border border-background-mute text-heading" required>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <select v-model="currentExperience.type" class="bg-background p-3 rounded border border-background-mute text-heading">
              <option value="work">Travail</option>
              <option value="education">Formation</option>
            </select>
            <input v-model="currentExperience.startDate" placeholder="Début (ex: 2022)" class="bg-background p-3 rounded border border-background-mute text-heading" required>
            <input v-model="currentExperience.endDate" placeholder="Fin (ex: Présent)" class="bg-background p-3 rounded border border-background-mute text-heading">
          </div>

          <textarea v-model="currentExperience.description" placeholder="Description des tâches..." rows="4" class="w-full bg-background p-3 rounded border border-background-mute text-heading"></textarea>

          <div class="flex justify-end gap-4 mt-6">
            <button type="button" @click="isEditingExperience = false" class="text-text hover:text-white">Annuler</button>
            <button type="submit" class="bg-accent text-background font-bold px-6 py-2 rounded">Sauvegarder</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

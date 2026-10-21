<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { apiService } from '@/services/api';
import NavBar from '../components/NavBar.vue';
import HeroSection from '../components/HeroSection.vue';
import ProjectsList from '../components/ProjectsList.vue';
import TimelineSection from '../components/TimelineSection.vue';
import AboutSection from '../components/AboutSection.vue';
import ContactSection from '../components/ContactSection.vue';

const profile = ref(null);
const projects = ref([]);
const experiences = ref([]);
const status = reactive({ profile: 'loading', projects: 'loading', experiences: 'loading' }); // 'loading' | 'ok' | 'error'

async function load(key, target, fetcher) {
  status[key] = 'loading';
  try {
    target.value = await fetcher();
    status[key] = 'ok';
  } catch {
    status[key] = 'error';
  }
}
const loadProjects = () => load('projects', projects, apiService.getProjects);
const loadExperiences = () => load('experiences', experiences, apiService.getExperiences);
onMounted(() => Promise.all([load('profile', profile, apiService.getProfile), loadProjects(), loadExperiences()]));

const FALLBACK = { name: 'Nathan', title: 'Développeur web full-stack', introduction: '' };
const shownProfile = computed(() => profile.value ?? FALLBACK);
// Une section reste affichée pendant le chargement ou en erreur, et disparaît si la liste est vide
const showProjects = computed(() => status.projects !== 'ok' || projects.value.length > 0);
const showExperiences = computed(() => status.experiences !== 'ok' || experiences.value.length > 0);

const links = computed(() => [
  showProjects.value && { id: 'projects', label: 'Projets' },
  showExperiences.value && { id: 'experience', label: 'Parcours' },
  { id: 'about', label: 'À propos', desktopOnly: true },
  { id: 'contact', label: 'Contact' },
].filter(Boolean));

const year = new Date().getFullYear();
</script>

<template>
  <NavBar :name="shownProfile.name" :links="links" />
  <main id="contenu" tabindex="-1" class="focus:outline-none">
    <HeroSection :profile="shownProfile" :loading="status.profile === 'loading'" :has-projects="showProjects" />
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <ProjectsList v-if="showProjects" :projects="projects" :status="status.projects" @retry="loadProjects" />
      <TimelineSection v-if="showExperiences" :experiences="experiences" :status="status.experiences" @retry="loadExperiences" />
      <AboutSection />
      <ContactSection />
    </div>
  </main>
  <footer class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-rule px-4 py-8 font-condensed text-meta text-muted sm:px-6 lg:px-8">
    <p>© {{ year }} {{ shownProfile.name }}</p>
    <a href="#home" class="link">Haut de page</a>
  </footer>
</template>

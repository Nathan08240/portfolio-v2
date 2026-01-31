<script setup>
import { ref, onMounted } from 'vue';
import { apiService } from '@/services/api';

const projects = ref([]);
const error = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    projects.value = await apiService.getProjects();
  } catch (e) {
    error.value = 'Impossible de charger les projets.';
  } finally {
    isLoading.value = false;
  }
});

const getTechs = (techString) => techString.split(',');
</script>

<template>
  <section id="projects" class="py-20 md:py-32  max-w-7xl mx-auto">
    <div class="flex items-center mb-12 w-full">
      <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-heading flex items-center whitespace-nowrap">
        <span class="text-accent font-mono text-xl md:text-2xl mr-2">03.</span> Quelques projets
      </h2>
      <div class="h-px bg-background-mute flex-grow ml-6 max-w-xs hidden sm:block"></div>
    </div>

    <div v-if="isLoading" class="text-center text-accent font-mono">Chargement...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      <div
        v-for="project in projects"
        :key="project.id"
        class="group bg-background-soft/80 backdrop-blur-sm border border-transparent hover:border-accent/30 rounded hover:-translate-y-2 transition-all duration-300 p-6 md:p-8 flex flex-col h-full shadow-lg hover:shadow-2xl"
      >
        <div class="flex justify-between items-center mb-6">
          <div class="text-accent">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
            </svg>
          </div>
          <div class="flex space-x-4 text-text">
            <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" class="hover:text-accent transition-colors" aria-label="GitHub Repo">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </a>
            <a v-if="project.projectUrl" :href="project.projectUrl" target="_blank" class="hover:text-accent transition-colors" aria-label="Live Demo">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          </div>
        </div>

        <h3 class="text-xl font-bold text-heading mb-2 group-hover:text-accent transition-colors">
          {{ project.title }}
        </h3>

        <p class="text-text mb-6 flex-grow text-sm leading-relaxed">
          {{ project.description }}
        </p>

        <div class="flex flex-wrap gap-3 mt-auto font-mono text-xs text-text/80">
          <span v-for="tech in getTechs(project.technologies)" :key="tech" class="bg-accent/5 px-2 py-1 rounded text-accent">
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

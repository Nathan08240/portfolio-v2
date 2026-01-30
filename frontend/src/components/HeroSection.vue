<script setup>
import { ref, onMounted } from 'vue';
import { apiService } from '@/services/api';

const profile = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    profile.value = await apiService.getProfile();
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});

const scrollToProjects = () => {
  const element = document.getElementById('projects');
  if (element) {
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
};
</script>

<template>
  <section id="home" class="min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 pt-20">
    <div class="w-full max-w-7xl mx-auto">
      <div v-if="isLoading" class="animate-pulse space-y-4">
        <div class="h-4 bg-background-mute w-32 rounded"></div>
        <div class="h-16 bg-background-mute w-full md:w-3/4 rounded"></div>
        <div class="h-8 bg-background-mute w-2/3 rounded"></div>
      </div>

      <div v-else-if="profile" class="space-y-5 md:space-y-8 animate-fade-in-up">
        <p class="text-accent font-mono text-base md:text-lg mb-4">Bonjour, je m'appelle</p>

        <h1 class="text-4xl sm:text-5xl md:text-7xl font-bold text-heading tracking-tight leading-tight">
          {{ profile.name }}.
        </h1>

        <h2 class="text-3xl sm:text-4xl md:text-6xl font-bold text-text leading-tight">
          {{ profile.title }}
        </h2>

        <p class="mt-6 max-w-xl text-text text-base md:text-lg leading-relaxed">
          {{ profile.introduction }}
        </p>

        <div class="pt-10 flex flex-col sm:flex-row gap-4">
          <button
            @click="scrollToProjects"
            class="px-8 py-4 border border-accent text-accent font-mono rounded hover:bg-accent/10 transition-colors duration-300 text-center"
          >
            Voir mes projets
          </button>
          <a
            href="#contact"
            class="px-8 py-4 bg-accent text-background font-mono font-bold rounded hover:bg-accent/90 transition-colors duration-300 text-center"
          >
            Me contacter
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

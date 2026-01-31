<script setup>
import { ref, onMounted } from 'vue';
import { apiService } from '@/services/api';

const experiences = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    experiences.value = await apiService.getExperiences();
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <section id="experience" class="py-20 md:py-32 mx-auto max-w-7xl">
    <div class="flex items-center mb-12 w-full">
      <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-heading flex items-center whitespace-nowrap">
        <span class="text-accent font-mono text-xl md:text-2xl mr-2">02.</span> Mon parcours
      </h2>
      <div class="h-px bg-background-mute flex-grow ml-6 max-w-xs hidden sm:block"></div>
    </div>

    <div v-if="isLoading" class="text-center text-accent font-mono">Chargement...</div>

    <div v-else class="relative border-l border-background-mute ml-3 md:ml-6 space-y-12">
      <div
        v-for="(exp, index) in experiences"
        :key="exp.id"
        class="relative pl-8 md:pl-12 group"
      >
        <!-- Point sur la timeline -->
        <div class="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-background-mute border border-accent group-hover:bg-accent transition-colors duration-300"></div>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <h3 class="text-xl font-bold text-heading group-hover:text-accent transition-colors">
            {{ exp.title }}
            <span class="text-accent">@ {{ exp.organization }}</span>
          </h3>
          <span class="font-mono text-xs text-text/60 mt-1 sm:mt-0">
            {{ exp.startDate }} — {{ exp.endDate || 'Présent' }}
          </span>
        </div>

        <p class="text-text text-base leading-relaxed max-w-2xl">
          {{ exp.description }}
        </p>
      </div>
    </div>
  </section>
</template>

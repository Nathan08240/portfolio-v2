<script setup>
import { computed } from 'vue';
import { parseTechs } from '@/services/api';
import PageSection from './PageSection.vue';
import ErrorBanner from './ErrorBanner.vue';

const props = defineProps({
  projects: { type: Array, required: true },
  status: { type: String, required: true },
});
defineEmits(['retry']);

const meta = computed(() => {
  if (props.status !== 'ok') return '';
  const n = props.projects.length;
  return `${n} projet${n > 1 ? 's' : ''}`;
});

const linksOf = (p) => [
  { url: p.projectUrl, label: 'Site en ligne' },
  { url: p.repoUrl, label: 'Code source' },
].filter((l) => l.url);
</script>

<template>
  <PageSection id="projects" title="Projets" :meta="meta">
    <ul v-if="status === 'loading'" aria-busy="true" class="divide-y divide-rule">
      <li v-for="n in 2" :key="n" class="py-8 first:pt-0 last:pb-0">
        <div class="skeleton h-7 w-1/2"></div>
        <div class="skeleton mt-3 h-5 max-w-prose"></div>
        <div class="skeleton mt-2 h-5 w-2/3 max-w-prose"></div>
        <div class="mt-4 flex gap-2">
          <div v-for="c in 3" :key="c" class="skeleton h-6 w-16"></div>
        </div>
      </li>
    </ul>

    <ErrorBanner v-else-if="status === 'error'">
      Les projets n'ont pas pu être chargés.
      <template #action>
        <button type="button" class="btn-secondary" @click="$emit('retry')">Réessayer</button>
      </template>
    </ErrorBanner>

    <ul v-else class="divide-y divide-rule">
      <li v-for="p in projects" :key="p.id" class="py-8 first:pt-0 last:pb-0">
        <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 class="text-h3 font-bold text-ink text-balance [overflow-wrap:anywhere]">{{ p.title }}</h3>
          <ul v-if="linksOf(p).length" class="flex flex-wrap gap-x-5 gap-y-1 text-meta font-medium">
            <li v-for="l in linksOf(p)" :key="l.label">
              <a :href="l.url" target="_blank" rel="noopener" class="link inline-flex min-h-11 items-center gap-1">
                {{ l.label }}
                <svg aria-hidden="true" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
                <span class="sr-only"> (nouvel onglet)</span>
              </a>
            </li>
          </ul>
        </div>
        <p class="mt-3 max-w-prose whitespace-pre-line text-ink-soft [overflow-wrap:anywhere]">{{ p.description }}</p>
        <ul v-if="parseTechs(p.technologies).length" aria-label="Technologies" class="mt-4 flex flex-wrap gap-2">
          <li v-for="(t, i) in parseTechs(p.technologies)" :key="i" class="chip">{{ t }}</li>
        </ul>
      </li>
    </ul>
  </PageSection>
</template>

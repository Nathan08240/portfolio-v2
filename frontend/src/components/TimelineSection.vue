<script setup>
import { computed } from 'vue';
import PageSection from './PageSection.vue';
import ErrorBanner from './ErrorBanner.vue';

const props = defineProps({
  experiences: { type: Array, required: true },
  status: { type: String, required: true },
});
defineEmits(['retry']);

const count = (n, word) => (n ? `${n} ${word}${n > 1 ? 's' : ''}` : '');

// Ex. « 2 postes et 1 formation », partie à 0 omise
const meta = computed(() => {
  if (props.status !== 'ok') return '';
  const work = props.experiences.filter((e) => e.type === 'work').length;
  return [count(work, 'poste'), count(props.experiences.length - work, 'formation')].filter(Boolean).join(' et ');
});
</script>

<template>
  <PageSection id="experience" title="Parcours" :meta="meta">
    <ol v-if="status === 'loading'" aria-busy="true" class="divide-y divide-rule">
      <li v-for="n in 2" :key="n" class="grid gap-2 py-6 first:pt-0 last:pb-0 sm:grid-cols-[10rem_1fr] sm:gap-6">
        <div class="skeleton h-5 w-32"></div>
        <div>
          <div class="skeleton h-7 w-1/2"></div>
          <div class="skeleton mt-2 h-5 w-1/3"></div>
          <div class="skeleton mt-3 h-5 max-w-prose"></div>
        </div>
      </li>
    </ol>

    <ErrorBanner v-else-if="status === 'error'">
      Le parcours n'a pas pu être chargé.
      <template #action>
        <button type="button" class="btn-secondary" @click="$emit('retry')">Réessayer</button>
      </template>
    </ErrorBanner>

    <ol v-else class="divide-y divide-rule">
      <li v-for="e in experiences" :key="e.id" class="grid gap-2 py-6 first:pt-0 last:pb-0 sm:grid-cols-[10rem_1fr] sm:gap-6">
        <div class="font-condensed text-meta font-medium text-muted tabular-nums">
          <p>{{ e.startDate }} – {{ e.endDate || 'aujourd’hui' }}</p>
          <p class="mt-0.5 flex items-center gap-1.5">
            <span aria-hidden="true" class="size-2 border-[1.5px] border-current" :class="{ 'bg-current': e.type === 'work' }"></span>
            {{ e.type === 'work' ? 'Poste' : 'Formation' }}
          </p>
        </div>
        <div class="min-w-0">
          <h3 class="text-h3 font-bold text-ink text-balance [overflow-wrap:anywhere]">{{ e.title }}</h3>
          <p class="text-ink-soft">{{ e.organization }}</p>
          <p v-if="e.description" class="mt-3 max-w-prose whitespace-pre-line text-ink-soft [overflow-wrap:anywhere]">{{ e.description }}</p>
        </div>
      </li>
    </ol>
  </PageSection>
</template>

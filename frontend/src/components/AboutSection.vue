<script setup>
import PageSection from './PageSection.vue';

const skills = [
  'JavaScript / TypeScript', 'React / Next.js', 'Vue.js / Nuxt', 'Node.js', 'Express', 'Python', 'FastAPI',
  'Sequelize', 'SQLite', 'Tailwind CSS', 'Git',
];
</script>

<template>
  <PageSection id="about" title="À propos">
    <div class="max-w-prose space-y-4 text-ink-soft">
      <p>
        Bonjour ! Je suis passionné par le développement web et la création d'expériences numériques interactives.
        Mon parcours a commencé par la curiosité de comprendre comment fonctionnent les sites web, ce qui m'a
        rapidement
        amené à écrire mes premières lignes de code.
      </p>
      <p>
        Aujourd'hui, je me concentre sur la construction d'applications web accessibles et performantes.
        J'aime résoudre des problèmes complexes et apprendre continuellement de nouvelles technologies.
      </p>
    </div>

    <h3 class="mt-10 text-h3 font-bold text-ink">Technologies</h3>
    <ul class="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 font-condensed font-medium text-ink sm:grid-cols-3">
      <li v-for="skill in skills" :key="skill">{{ skill }}</li>
    </ul>
  </PageSection>
</template>

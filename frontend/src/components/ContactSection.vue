<script setup>
import PageSection from './PageSection.vue';

// Adresse actuelle conservée telle quelle : à remplacer par la vraie
const CONTACT_EMAIL = 'votre.email@example.com';
</script>

<template>
  <PageSection id="contact" title="Contact">
    <p class="max-w-prose text-lead text-ink-soft">Un projet, un poste à pourvoir ou une question technique : écrivez-moi.</p>
    <a
      :href="`mailto:${CONTACT_EMAIL}`"
      class="mt-6 inline-block font-wide text-email font-bold text-accent underline decoration-2 underline-offset-[0.15em] transition-colors duration-fast hover:text-accent-hover [overflow-wrap:anywhere]"
    >{{ CONTACT_EMAIL }}</a>
  </PageSection>
</template>

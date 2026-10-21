<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <a href="#contenu" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-paper">Aller au contenu</a>
  <RouterView />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Plan isométrique de la stack : trois plaques, des requêtes qui les traversent
const LAYERS = [
  { label: 'Front', y: 1.7 },
  { label: 'API', y: 0 },
  { label: 'Base', y: -1.7 },
];

const host = ref(null);
const labelEls = [];
const ready = ref(false);
let cleanup = null;
let unmounted = false;

// Three.js chargé à part, après le premier rendu de la page
onMounted(async () => {
  try {
    const { mountStackScene } = await import('./stack3d.js');
    if (unmounted) return;
    cleanup = mountStackScene(host.value, LAYERS, labelEls);
    ready.value = Boolean(cleanup);
  } catch {
    // chargement impossible : la scène reste absente
  }
});
onBeforeUnmount(() => {
  unmounted = true;
  cleanup?.();
});
</script>

<template>
  <div
    ref="host"
    aria-hidden="true"
    class="relative overflow-hidden transition-opacity duration-700 ease-enter"
    :class="ready ? 'opacity-100' : 'opacity-0'"
  >
    <span
      v-for="(layer, i) in LAYERS"
      :key="layer.label"
      :ref="(node) => { labelEls[i] = node; }"
      class="absolute left-0 top-0 font-condensed text-meta font-semibold text-ink-soft"
    >{{ layer.label }}</span>
  </div>
</template>

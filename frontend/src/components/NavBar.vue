<script setup>
defineProps({
  name: { type: String, required: true },
  links: { type: Array, required: true },
});
defineEmits(['palette']);

const shortcut = /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘ K' : 'Ctrl K';
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-rule bg-paper">
    <div class="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-x-4 px-4 sm:px-6 lg:px-8">
      <a href="#home" class="font-wide text-lg font-bold text-ink">{{ name }}</a>
      <div class="flex items-center gap-2">
        <nav aria-label="Navigation principale">
          <ul class="flex gap-1 sm:gap-2">
            <li v-for="link in links" :key="link.id" :class="{ 'hidden md:block': link.desktopOnly }">
              <a :href="`#${link.id}`" class="nav-link">{{ link.label }}</a>
            </li>
          </ul>
        </nav>
        <button
          type="button"
          class="hidden h-9 items-center gap-2 rounded-md border border-rule px-2.5 text-meta text-muted transition-colors duration-fast hover:border-rule-strong hover:text-ink sm:inline-flex"
          aria-keyshortcuts="Control+K Meta+K"
          @click="$emit('palette')"
        >
          Commandes
          <kbd class="font-condensed font-semibold">{{ shortcut }}</kbd>
        </button>
      </div>
    </div>
  </header>
</template>

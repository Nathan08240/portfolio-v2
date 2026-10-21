<script setup>
defineProps({
  name: { type: String, required: true },
  links: { type: Array, required: true },
});
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-rule bg-paper">
    <div class="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-x-4 px-4 sm:px-6 lg:px-8">
      <a href="#home" class="font-wide text-lg font-bold text-ink">{{ name }}</a>
      <nav aria-label="Navigation principale">
        <ul class="flex gap-1 sm:gap-2">
          <li v-for="link in links" :key="link.id" :class="{ 'hidden md:block': link.desktopOnly }">
            <a :href="`#${link.id}`" class="nav-link">{{ link.label }}</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

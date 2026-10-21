<script setup>
defineProps({
  profile: { type: Object, required: true },
  loading: { type: Boolean, default: false },
  hasProjects: { type: Boolean, default: true },
});
</script>

<template>
  <section id="home" :aria-busy="loading" class="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-28">
    <template v-if="loading">
      <div class="text-display"><span class="skeleton block h-[0.95em] w-[6ch]"></span></div>
      <div class="skeleton mt-3 h-7 w-64 max-w-full"></div>
      <div class="mt-10 lg:mt-14 lg:grid lg:grid-cols-12">
        <div class="space-y-3 lg:col-span-9 lg:col-start-4 lg:pl-10">
          <div class="skeleton h-5 w-full max-w-[34rem]"></div>
          <div class="skeleton h-5 w-11/12 max-w-[34rem]"></div>
          <div class="skeleton h-5 w-2/3 max-w-[34rem]"></div>
        </div>
      </div>
    </template>

    <template v-else>
      <h1 class="hero-name font-wide text-display font-extrabold text-ink text-balance hyphens-auto [overflow-wrap:anywhere]">{{ profile.name }}</h1>
      <p class="mt-3 font-condensed text-hero-title font-semibold text-ink-soft text-balance">{{ profile.title }}</p>

      <div class="mt-10 lg:mt-14 lg:grid lg:grid-cols-12">
        <div class="lg:col-span-9 lg:col-start-4 lg:pl-10">
          <p v-if="profile.introduction" class="max-w-[34rem] whitespace-pre-line text-lead text-ink-soft">{{ profile.introduction }}</p>
          <div class="flex flex-wrap gap-3" :class="{ 'mt-8': profile.introduction }">
            <a v-if="hasProjects" href="#projects" class="btn-primary">Voir les projets</a>
            <a href="#contact" :class="hasProjects ? 'btn-secondary' : 'btn-primary'">Me contacter</a>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  meta: { type: String, default: '' },
});
</script>

<template>
  <section :id="id" :aria-labelledby="`${id}-title`" class="border-t border-rule lg:grid lg:grid-cols-12">
    <div class="pt-12 lg:col-span-3 lg:py-24 lg:pr-8">
      <div class="lg:sticky lg:top-24">
        <h2 :id="`${id}-title`" class="font-wide text-section font-bold text-ink text-balance">{{ title }}</h2>
        <p v-if="meta" class="mt-1 font-condensed text-meta text-muted">{{ meta }}</p>
      </div>
    </div>
    <div class="pb-16 pt-6 lg:col-span-9 lg:border-l lg:border-rule lg:py-24 lg:pl-10">
      <slot />
    </div>
  </section>
</template>

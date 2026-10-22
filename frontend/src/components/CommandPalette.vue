<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, useId } from 'vue';
import { CONTACT_EMAIL, GITHUB_URL } from '@/config';

const props = defineProps({
  links: { type: Array, required: true },
});

const dialog = ref(null);
const input = ref(null);
const query = ref('');
const active = ref(0);
const status = ref('');
const id = useId();

const commands = computed(() => [
  { label: 'Accueil', hint: 'Section', run: () => goTo('home') },
  ...props.links.map((l) => ({ label: l.label, hint: 'Section', run: () => goTo(l.id) })),
  { label: "Copier l'adresse e-mail", hint: CONTACT_EMAIL, run: copyEmail },
  { label: 'Écrire un e-mail', hint: 'mailto', run: () => leave(() => { window.location.href = `mailto:${CONTACT_EMAIL}`; }) },
  { label: 'GitHub', hint: GITHUB_URL.replace('https://', ''), run: () => leave(() => window.open(GITHUB_URL, '_blank', 'noopener')) },
]);

const normalize = (s) => s.normalize('NFD').replaceAll(/\p{Diacritic}/gu, '').toLowerCase();
const results = computed(() => {
  const q = normalize(query.value.trim());
  return commands.value.filter((c) => normalize(c.label).includes(q));
});
watch(query, () => { active.value = 0; });

function open() {
  query.value = '';
  status.value = '';
  active.value = 0;
  dialog.value.showModal();
  nextTick(() => input.value.focus());
}
const close = () => dialog.value.close();

function leave(action) {
  close();
  action();
}

function goTo(sectionId) {
  close();
  document.getElementById(sectionId)?.scrollIntoView();
  history.replaceState(null, '', `#${sectionId}`);
}

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(CONTACT_EMAIL);
    status.value = 'Adresse copiée.';
    setTimeout(close, 900);
  } catch {
    status.value = `Copie impossible : ${CONTACT_EMAIL}`;
  }
}

function move(step) {
  const n = results.value.length;
  if (!n) return;
  active.value = (active.value + step + n) % n;
  nextTick(() => document.getElementById(`${id}-opt-${active.value}`)?.scrollIntoView({ block: 'nearest' }));
}

function onKeydown(e) {
  if (e.key === 'ArrowDown') move(1);
  else if (e.key === 'ArrowUp') move(-1);
  else if (e.key === 'Enter') results.value[active.value]?.run();
  else return;
  e.preventDefault();
}

// Clic sur le fond (hors du contenu) : fermeture
const onDialogClick = (e) => e.target === dialog.value && close();

function onShortcut(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (dialog.value.open) close();
    else open();
  }
}
onMounted(() => window.addEventListener('keydown', onShortcut));
onBeforeUnmount(() => window.removeEventListener('keydown', onShortcut));

defineExpose({ open });
</script>

<template>
  <dialog
    ref="dialog"
    :aria-labelledby="`${id}-title`"
    class="mt-[12vh] w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-lg bg-surface p-0 text-base text-ink shadow-overlay"
    @click="onDialogClick"
  >
    <h2 :id="`${id}-title`" class="sr-only">Palette de commandes</h2>
    <div class="flex items-center gap-3 border-b border-rule px-4">
      <input
        ref="input"
        v-model="query"
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-autocomplete="list"
        :aria-controls="`${id}-list`"
        :aria-activedescendant="results.length ? `${id}-opt-${active}` : undefined"
        aria-label="Rechercher une commande"
        placeholder="Aller à une section, copier l'e-mail…"
        autocomplete="off"
        spellcheck="false"
        class="h-14 w-full bg-transparent text-base text-ink placeholder:text-muted focus:outline-none"
        @keydown="onKeydown"
      >
      <kbd class="shrink-0 rounded-sm border border-rule px-1.5 font-condensed text-meta text-muted">Échap</kbd>
    </div>
    <ul :id="`${id}-list`" role="listbox" aria-label="Commandes" class="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
      <li
        v-for="(cmd, i) in results"
        :id="`${id}-opt-${i}`"
        :key="cmd.label"
        role="option"
        :aria-selected="i === active"
        class="flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2.5"
        :class="i === active ? 'bg-accent-tint text-ink' : 'text-ink-soft'"
        @mousemove="active = i"
        @click="cmd.run()"
      >
        <span class="font-medium">{{ cmd.label }}</span>
        <span class="truncate font-condensed text-meta text-muted">{{ cmd.hint }}</span>
      </li>
      <li v-if="!results.length" class="px-3 py-6 text-center text-muted">Aucune commande</li>
    </ul>
    <p role="status" class="border-t border-rule px-4 py-2 font-condensed text-meta text-muted" :class="{ 'sr-only': !status }">{{ status }}</p>
  </dialog>
</template>

<script setup>
import { ref, useId } from 'vue';
import ErrorBanner from './ErrorBanner.vue';
import SpinnerIcon from './SpinnerIcon.vue';

const props = defineProps({
  title: { type: String, required: true },
  message: { type: String, default: '' },
  confirmLabel: { type: String, required: true },
  busyLabel: { type: String, default: '' },
  cancelLabel: { type: String, default: 'Annuler' },
  danger: { type: Boolean, default: false },
  busy: { type: Boolean, default: false },
  error: { type: String, default: '' },
});
const emit = defineEmits(['confirm', 'cancel']);

const dialog = ref(null);
const id = useId();

const open = () => dialog.value.showModal();
const close = () => dialog.value.close();

function cancel() {
  close();
  emit('cancel');
}

// Échap : fermeture native, sauf pendant l'action en cours
function onNativeCancel(event) {
  if (props.busy) event.preventDefault();
  else emit('cancel');
}

defineExpose({ open, close });
</script>

<template>
  <dialog
    ref="dialog"
    role="alertdialog"
    :aria-labelledby="`${id}-title`"
    :aria-describedby="message ? `${id}-message` : undefined"
    class="w-[calc(100%-2rem)] max-w-md rounded-lg bg-surface p-0 text-base text-ink shadow-overlay"
    @cancel="onNativeCancel"
  >
    <div class="p-5">
      <h2 :id="`${id}-title`" class="text-lg font-bold text-balance">{{ title }}</h2>
      <p v-if="message" :id="`${id}-message`" class="mt-2 whitespace-pre-line text-ink-soft [overflow-wrap:anywhere]">{{ message }}</p>
      <ErrorBanner v-if="error" class="mt-4">{{ error }}</ErrorBanner>
      <div class="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" class="btn-secondary" autofocus @click="cancel">{{ cancelLabel }}</button>
        <button
          type="button"
          :class="danger ? 'btn-danger' : 'btn-primary'"
          :disabled="busy"
          :aria-busy="busy"
          @click="emit('confirm')"
        >
          <SpinnerIcon v-if="busy" />
          {{ busy ? busyLabel : confirmLabel }}
        </button>
      </div>
    </div>
  </dialog>
</template>

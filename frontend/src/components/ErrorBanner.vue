<template>
  <div role="alert" class="flex gap-3 rounded-md border border-danger bg-danger-tint p-4 text-ink">
    <svg aria-hidden="true" class="mt-0.5 size-5 shrink-0 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" />
    </svg>
    <div class="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
      <p class="min-w-0 [overflow-wrap:anywhere]"><slot /></p>
      <slot name="action" />
    </div>
  </div>
</template>

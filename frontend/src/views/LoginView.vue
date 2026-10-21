<script setup>
import { ref, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiService } from '@/services/api';
import ErrorBanner from '../components/ErrorBanner.vue';
import SpinnerIcon from '../components/SpinnerIcon.vue';

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');
const passwordInput = ref(null);
const route = useRoute();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const data = await apiService.login({ username: username.value, password: password.value });
    localStorage.setItem('token', data.token);
    await router.push('/admin');
  } catch (e) {
    // fetch lève un TypeError quand le serveur est injoignable
    error.value = e instanceof TypeError
      ? 'Serveur injoignable. Vérifiez votre connexion et réessayez.'
      : e.message;
    if (e.status === 401) {
      await nextTick();
      passwordInput.value.focus();
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main id="contenu" tabindex="-1" class="grid min-h-dvh place-items-center px-4 py-12 focus:outline-none">
    <div class="w-full max-w-sm">
      <RouterLink to="/" class="link inline-flex min-h-11 items-center gap-1 text-meta font-medium">
        <svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        Retour au site
      </RouterLink>

      <h1 class="mt-6 font-wide text-section font-bold text-ink">Connexion</h1>
      <p class="mt-1 text-muted">Espace d'administration du portfolio.</p>

      <p v-if="route.query.expire" class="mt-6 rounded-md border border-rule-strong bg-surface p-4 text-base text-ink">
        Votre session a expiré. Reconnectez-vous pour continuer.
      </p>

      <form class="mt-8 space-y-5 text-base" @submit.prevent="handleLogin">
        <div>
          <label for="login-username" class="label">Identifiant</label>
          <input
            id="login-username"
            v-model="username"
            type="text"
            class="field"
            autocomplete="username"
            autocapitalize="none"
            spellcheck="false"
            autofocus
            required
          >
        </div>

        <div>
          <label for="login-password" class="label">Mot de passe</label>
          <div class="relative">
            <input
              id="login-password"
              ref="passwordInput"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="field pr-12"
              autocomplete="current-password"
              required
            >
            <button
              type="button"
              class="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-md text-muted transition-colors duration-fast hover:text-ink"
              :aria-pressed="showPassword"
              :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              @click="showPassword = !showPassword"
            >
              <svg aria-hidden="true" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />
                <path v-if="showPassword" d="m3 3 18 18" />
              </svg>
            </button>
          </div>
        </div>

        <ErrorBanner v-if="error">{{ error }}</ErrorBanner>

        <button type="submit" class="btn-primary w-full" :disabled="loading" :aria-busy="loading">
          <SpinnerIcon v-if="loading" />
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>
    </div>
  </main>
</template>

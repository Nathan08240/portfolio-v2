<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiService } from '@/services/api';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const data = await apiService.login({ username: username.value, password: password.value });

    // Stocker le token
    localStorage.setItem('token', data.token);
    router.push('/admin');

  } catch (e) {
    error.value = e.message || 'Erreur serveur';
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <div class="w-full max-w-md bg-background-soft p-8 rounded-lg shadow-xl border border-background-mute">
      <h1 class="text-3xl font-bold text-heading mb-6 text-center">Admin Login</h1>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-text mb-2 font-mono text-sm">Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full bg-background border border-background-mute rounded p-3 text-heading focus:border-accent focus:outline-none transition-colors"
            required
          >
        </div>

        <div>
          <label class="block text-text mb-2 font-mono text-sm">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full bg-background border border-background-mute rounded p-3 text-heading focus:border-accent focus:outline-none transition-colors"
            required
          >
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">{{ error }}</div>

        <button
          type="submit"
          class="w-full bg-accent text-background font-bold py-3 rounded hover:bg-accent/90 transition-colors"
        >
          Se connecter
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const isMenuOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const scrollToSection = (id) => {
  isMenuOpen.value = false;
  const element = document.getElementById(id);
  if (element) {
    // Offset pour compenser la hauteur de la navbar fixe
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const navLinks = [
  { name: 'Accueil', id: 'home' },
  { name: 'À propos', id: 'about' },
  { name: 'Projets', id: 'projects' },
  { name: 'Contact', id: 'contact' },
];
</script>

<template>
  <nav
    class="fixed w-full   z-50 transition-all duration-300"
    :class="[isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg py-4' : 'bg-background py-6']"
  >
    <div class="container mx-auto max-w-7xl  flex justify-between items-center">
      <!-- Logo -->
      <div class="text-accent font-mono text-xl font-bold cursor-pointer z-50" @click="scrollToSection('home')">
        &lt;Nathan /&gt;
      </div>

      <!-- Desktop Menu (Visible uniquement sur md et plus) -->
      <div class="hidden md:flex space-x-8 items-center">
        <button
          v-for="link in navLinks"
          :key="link.name"
          @click="scrollToSection(link.id)"
          class="text-heading hover:text-accent font-mono text-sm transition-colors duration-300"
        >
          <span class="text-accent mr-1">#</span>{{ link.name }}
        </button>

        <!-- Bouton CV (Optionnel, bon pour le look desktop) -->
        <a href="#" class="px-4 py-2 border border-accent text-accent font-mono text-sm rounded hover:bg-accent/10 transition-colors">
          CV
        </a>
      </div>

      <!-- Mobile Menu Button (Visible uniquement en dessous de md) -->
      <div class="md:hidden z-50">
        <button @click="toggleMenu" class="text-accent focus:outline-none p-2">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay (Plein écran sur mobile) -->
    <div
      v-show="isMenuOpen"
      class="fixed inset-0 bg-background/95 backdrop-blur-xl flex flex-col justify-center items-center z-40 md:hidden transition-opacity duration-300"
    >
      <div class="flex flex-col items-center space-y-8">
        <button
          v-for="link in navLinks"
          :key="link.name"
          @click="scrollToSection(link.id)"
          class="text-heading hover:text-accent font-mono text-2xl transition-colors duration-300"
        >
          <span class="text-accent mr-1">#</span>{{ link.name }}
        </button>
        <a href="#" class="px-8 py-4 border border-accent text-accent font-mono text-lg rounded hover:bg-accent/10 transition-colors mt-8">
          Mon CV
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
import HeroSection from '../components/HeroSection.vue';
import AboutSection from '../components/AboutSection.vue';
import TimelineSection from '../components/TimelineSection.vue'; // Nouveau composant
import ProjectsList from '../components/ProjectsList.vue';
import ContactSection from '../components/ContactSection.vue';
import BackgroundAnimation from '../components/BackgroundAnimation.vue';
</script>

<template>
  <div class="bg-background min-h-screen flex flex-col font-sans selection:bg-accent selection:text-background relative">
    <BackgroundAnimation />
    <div class="relative z-10 flex flex-col min-h-screen">
      <NavBar />
      <main class="flex-grow">
        <HeroSection />
        <AboutSection />
        <TimelineSection /> <!-- Ajouté ici -->
        <ProjectsList />
        <ContactSection />
      </main>
      <footer class="py-6 text-center text-text font-mono text-xs hover:text-accent transition-colors duration-300">
        <p>Conçu & Développé par Nathan</p>
      </footer>
    </div>
  </div>
</template>

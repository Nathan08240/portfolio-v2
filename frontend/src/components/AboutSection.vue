<script setup>
const skills = [
  'JavaScript (ES6+) / Typescript', 'React / NextJS', 'Vue.js / Nuxt', 'Node.js', 'Express', 'Python', 'FastAPI',
  'Sequelize', 'SQLite', 'Tailwind CSS', 'Git'
];
</script>

<template>
  <section id="about" class="py-20  md:py-32 max-w-7xl mx-auto">
    <div class="flex items-center mb-12 w-full">
      <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-heading flex items-center whitespace-nowrap">
        <span class="text-accent font-mono text-xl md:text-2xl mr-2">01.</span> À propos de moi
      </h2>
      <div class="h-px bg-background-mute flex-grow ml-6 max-w-xs hidden sm:block"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-5 gap-12">
      <!-- Texte : prend 3 colonnes sur 5 en desktop -->
      <div class="md:col-span-3 text-text text-base md:text-lg space-y-4">
        <p>
          Bonjour ! Je suis passionné par le développement web et la création d'expériences numériques interactives.
          Mon parcours a commencé par la curiosité de comprendre comment fonctionnent les sites web, ce qui m'a
          rapidement
          amené à écrire mes premières lignes de code.
        </p>
        <p>
          Aujourd'hui, je me concentre sur la construction d'applications web accessibles et performantes.
          J'aime résoudre des problèmes complexes et apprendre continuellement de nouvelles technologies.
        </p>
        <p>
          Voici quelques technologies avec lesquelles j'ai travaillé récemment :
        </p>

        <ul class="grid grid-cols-2 gap-2 mt-4 font-mono text-sm">
          <li v-for="skill in skills" :key="skill" class="flex items-center">
            <span class="text-accent mr-2">▹</span> {{ skill }}
          </li>
        </ul>
      </div>

      <!-- Image : prend 2 colonnes sur 5 en desktop, centrée sur mobile -->
      <div class="md:col-span-2 flex justify-center md:justify-start">
        <div class="relative group w-64 h-64 md:w-full md:h-auto max-w-xs">
          <!-- Cadre décoratif -->
          <div
              class="absolute top-4 left-4 w-full h-full border-2 border-accent rounded transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2 hidden md:block"></div>

          <!-- Image container -->
          <div
              class="relative w-full h-full bg-background-soft rounded overflow-hidden grayscale hover:grayscale-0 transition-all duration-300 aspect-square">
            <div class="flex items-center justify-center h-full text-accent font-mono text-6xl bg-background-mute">
              N
            </div>
            <!-- <img src="/path/to/image.jpg" alt="Profile" class="object-cover w-full h-full" /> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

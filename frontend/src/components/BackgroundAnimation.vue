<template>
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <!-- 1. La Grille Technique (Dots) -->
    <div class="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

    <!-- 2. Orbe Lumineux 1 (Teal - Haut Gauche) -->
    <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] animate-blob mix-blend-screen"></div>

    <!-- 3. Orbe Lumineux 2 (Bleu/Violet - Bas Droite) -->
    <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen"></div>

    <!-- 4. Orbe Lumineux 3 (Centre mouvant) -->
    <div class="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen"></div>
  </div>
</template>

<style scoped>
/* Motif de grille (points) */
.bg-grid-pattern {
  background-image: radial-gradient(var(--color-heading) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Animation des orbes */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 10s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>

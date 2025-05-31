<template>
  <div class="page-container">
    <main class="content-container">
      <BannerSection />
      <ComposerSection />
      <!-- Ajoutez ici d'autres sections factorisées si besoin -->
    </main>
  </div>
</template>

<script setup lang="ts">
import BannerSection from '@/components/BannerSection.vue'
import ComposerSection from '@/components/ComposerSection.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Satisfy&display=swap');

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  background-color: #f9f9f9;
}

.content-container {
  width: 100%;
}
</style>

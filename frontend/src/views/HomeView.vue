<template>
  <div class="page-container">
    <main class="content-container">
      <BannerSection />
      <ComposerSection />
      <ActualiteBanner />
      <section class="cta-section">
        <div class="cta-content">
          <h2>Testez la page Catalogue</h2>
          <router-link to="/catalogue" class="cta-btn">Voir le catalogue</router-link>
        </div>
      </section>
      <!-- Ajoutez ici d'autres sections factorisées si besoin -->
    </main>
  </div>
</template>

<script setup lang="ts">
import BannerSection from '@/components/BannerSection.vue'
import ComposerSection from '@/components/ComposerSection.vue'
import ActualiteBanner from '@/components/ActualiteBanner.vue'
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

.cta-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 2.5rem 0 0 0;
}

.cta-content {
  background: #fff6f2;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(180, 138, 120, 0.07);
  padding: 2rem 2.5rem;
  text-align: center;
}

.cta-content h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #b48a78;
  font-family: 'Roboto', sans-serif;
}

.cta-btn {
  display: inline-block;
  background: #b48a78;
  color: #fff;
  padding: 0.8rem 2rem;
  border-radius: 2rem;
  font-weight: bold;
  font-size: 1.1rem;
  text-decoration: none;
  transition:
    background 0.2s,
    transform 0.2s;
}

.cta-btn:hover {
  background: #a06c54;
  transform: scale(1.05);
}
</style>

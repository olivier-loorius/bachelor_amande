<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <Panier :isOpen="panierStore.isPanierOpen" @close="panierStore.fermerPanier" />
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Panier from './views/panier/Panier.vue'
import ScrollToTop from './components/ScrollToTop.vue'

import { usePanierStore } from './stores/panier'

const panierStore = usePanierStore()
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

.main-content {
  padding-top: 80px; /* Hauteur de la navbar */
  min-height: calc(100vh - 80px);
}

/* Mobile : ajuster le padding */
@media (max-width: 768px) {
  .main-content {
    padding-top: 65px; /* Hauteur de la navbar mobile */
    min-height: calc(100vh - 65px);
  }
}
</style>
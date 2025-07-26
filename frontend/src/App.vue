<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <Panier :isOpen="isPanierOpen" @close="fermerPanier" />
    <ScrollToTop />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Panier from './views/Panier.vue'
import ScrollToTop from './components/ScrollToTop.vue'
import { usePanier } from './composables/usePanier'

const { isPanierOpen, fermerPanier } = usePanier()
</script>

<style>
.main-content {
  padding-top: 80px; /* Hauteur de la navbar */
}

/* Mobile : ajuster le padding */
@media (max-width: 768px) {
  .main-content {
    padding-top: 65px; /* Hauteur de la navbar mobile */
  }
}
</style>
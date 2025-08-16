<template>
  <button 
    @click="scrollToTop" 
    class="scroll-to-top-btn"
    :class="{ 'admin-mode': isAdminRoute }"
    aria-label="Retour en haut de la page"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})

const scrollToTop = () => {
  window.scrollTo(0, 0)
}
</script>

<style scoped>
.scroll-to-top-btn {
  position: fixed;
  width: 45px;
  height: 45px;
  background: #ff6f61;
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 999;
  outline: none;
}

.scroll-to-top-btn.admin-mode {
  background: #01192b; /* Couleur bleue du dashboard */
}

.scroll-to-top-btn:focus {
  outline: none;
  border: none;
}

.scroll-to-top-btn:active {
  outline: none;
  border: none;
}

/* Desktop : en bas à droite */
@media (min-width: 769px) {
  .scroll-to-top-btn {
    bottom: 30px;
    right: 30px;
    width: 35px;
    height: 35px;
    top: auto;
  }
}

/* Mobile : en bas à droite */
@media (max-width: 768px) {
  .scroll-to-top-btn {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
    top: auto;
  }
}
</style> 
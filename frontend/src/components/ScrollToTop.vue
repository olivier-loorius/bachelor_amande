<template>
  <button 
    v-show="showButton" 
    @click="scrollToTop" 
    class="scroll-to-top-btn"
    aria-label="Retour en haut de la page"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const showButton = ref(false)

const handleScroll = () => {
  showButton.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.scroll-to-top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: var(--accent-color);
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 1000;
  opacity: 0;
  transform: translateY(20px);
}

.scroll-to-top-btn:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.scroll-to-top-btn:active {
  transform: translateY(0);
}

/* Animation d'apparition */
.scroll-to-top-btn {
  transition: all 0.3s ease;
}

.scroll-to-top-btn[v-show="true"] {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .scroll-to-top-btn {
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
  }
}
</style> 
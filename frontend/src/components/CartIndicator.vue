<template>
  <div class="cart-indicator" @click="ouvrirPanier">
    <i class="fas fa-shopping-cart"></i>
    <span v-if="nombreArticles > 0" class="cart-badge">{{ nombreArticles }}</span>
  </div>
</template>

<script setup lang="ts">
import { usePanier } from '@/composables/usePanier'

const { nombreArticles, ouvrirPanier } = usePanier()
</script>

<style scoped>
.cart-indicator {
  position: relative;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-indicator:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.cart-indicator i {
  font-size: 1.2rem;
  color: var(--text-color);
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--accent-color);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style> 
<template>
  <button @click="openCart" class="cart-indicator" :class="{ disabled: !isLoggedIn }">
    <i class="fas fa-shopping-cart"></i>
    <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePanierStore } from '@/stores/panier'
import { useAuthStore } from '@/stores/auth'

const panierStore = usePanierStore()
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)
const cartItemCount = computed(() => {
  return panierStore.panier.reduce((sum, item) => sum + item.quantite, 0)
})

const openCart = () => {
  if (isLoggedIn.value) {
    panierStore.ouvrirPanier()
  }
}
</script>

<style scoped>
.cart-indicator {
  position: relative;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-indicator:hover:not(.disabled) {
  color: var(--accent-color);
  background: rgba(255, 111, 97, 0.1);
}

.cart-indicator.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-count {
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
  font-size: 0.75rem;
  font-weight: bold;
  border: 2px solid white;
}

/* Responsive */
@media (max-width: 768px) {
  .cart-indicator {
    font-size: 1.1rem;
    padding: 0.4rem;
  }

  .cart-count {
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
  }
}
</style> 
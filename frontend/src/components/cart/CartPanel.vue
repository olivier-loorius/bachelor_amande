<template>
  <div class="cart-panel" :class="{ 'cart-open': isOpen }">
    <div class="cart-overlay" @click="closeCart"></div>
    <div class="cart-content">
      <div class="cart-header">
        <h3>Mon Panier</h3>
        <button @click="closeCart" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="cart-body">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Votre panier est vide</p>
        </div>

        <div v-else class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.image_url" :alt="item.nom" />
            </div>
            <div class="item-details">
              <h4>{{ item.nom }}</h4>
              <p class="item-price">{{ formatPrice(item.prix) }}</p>
            </div>
            <div class="item-actions">
              <button @click="decreaseQuantity(item.id)" class="quantity-btn">
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity">{{ item.quantite }}</span>
              <button @click="increaseQuantity(item.id)" class="quantity-btn">
                <i class="fas fa-plus"></i>
              </button>
              <button @click="removeItem(item.id)" class="remove-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="cart-total">
          <span>Total:</span>
          <span class="total-price">{{ formatPrice(totalPrice) }}</span>
        </div>
        <button @click="checkout" class="checkout-btn">
          Commander
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePanierStore } from '@/stores/panier'

const panierStore = usePanierStore()

const isOpen = computed(() => panierStore.isOpen)
const cartItems = computed(() => panierStore.panier)
const totalPrice = computed(() => {
  return panierStore.panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0)
})

const closeCart = () => {
  panierStore.fermerPanier()
}

const increaseQuantity = (itemId: number) => {
  panierStore.ajouterAuPanier({ id: itemId, quantite: 1 })
}

const decreaseQuantity = (itemId: number) => {
  panierStore.retirerDuPanier(itemId, 1)
}

const removeItem = (itemId: number) => {
  panierStore.supprimerDuPanier(itemId)
}

const checkout = () => {
  // Logique de commande à implémenter
  console.log('Commande en cours...')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}
</script>

<style scoped>
.cart-panel {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1001;
  display: flex;
  flex-direction: column;
}

.cart-panel.cart-open {
  right: 0;
}

.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.cart-panel.cart-open .cart-overlay {
  opacity: 1;
  visibility: visible;
}

.cart-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  z-index: 1001;
  position: relative;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  background: var(--primary-color);
  color: var(--text-color);
}

.cart-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-color-light);
}

.empty-cart i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--background-light);
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-details h4 {
  margin: 0 0 5px 0;
  font-size: 1rem;
  color: var(--text-color);
}

.item-price {
  margin: 0;
  font-weight: 600;
  color: var(--accent-color);
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.quantity-btn:hover {
  background: var(--accent-hover);
  transform: scale(1.1);
}

.quantity {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.remove-btn {
  background: var(--error-color);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: var(--error-hover);
  transform: scale(1.1);
}

.cart-footer {
  padding: 20px;
  border-top: 1px solid var(--border-color);
  background: var(--background-light);
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 1.1rem;
}

.total-price {
  color: var(--accent-color);
  font-size: 1.2rem;
}

.checkout-btn {
  width: 100%;
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .cart-panel {
    width: 100%;
    right: -100%;
  }

  .cart-header {
    padding: 15px;
  }

  .cart-body {
    padding: 15px;
  }

  .cart-item {
    padding: 12px;
    gap: 12px;
  }

  .item-image {
    width: 50px;
    height: 50px;
  }

  .item-actions {
    gap: 8px;
  }

  .quantity-btn,
  .remove-btn {
    width: 28px;
    height: 28px;
  }
}
</style> 
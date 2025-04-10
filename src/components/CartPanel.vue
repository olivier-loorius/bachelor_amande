<template>
  <div class="cart-overlay" :class="{ 'active': isOpen }" @click.self="closeCart">
    <div class="cart-panel" :class="{ 'mobile-view': isMobile }">
      <div class="cart-header">
        <h2>Mon Panier</h2>
        <button @click="closeCart" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="cart-content">
        <div v-if="currentStep === 1" class="step">
          <div v-if="!isLoggedIn">
            <h3>Connexion</h3>
            <button @click="login" class="btn-primary">
              <i class="fas fa-sign-in-alt"></i> Se connecter
            </button>
            <p class="guest-option" @click="nextStep">
              Continuer sans compte <i class="fas fa-arrow-right"></i>
            </p>
          </div>
          <div v-else class="user-info">
            <p>Connecté en tant que <strong>{{ userName }}</strong></p>
            <button @click="nextStep" class="btn-primary">
              Continuer <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <div v-if="currentStep === 2" class="step">
          <div v-if="items.length === 0" class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <p>Votre panier est vide</p>
            <button @click="closeCart" class="btn-primary">
              Continuer mes achats
            </button>
          </div>

          <div v-else>
            <div class="cart-items">
              <div v-for="(item, index) in items" :key="item.id" class="cart-item">
                <img :src="item.image" :alt="item.name" class="item-image">
                <div class="item-details">
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.price.toFixed(2) }} €</p>
                  <div class="quantity-controls">
                    <button @click.stop="updateQuantity(index, -1)">-</button>
                    <span>{{ item.quantity }}</span>
                    <button @click.stop="updateQuantity(index, 1)">+</button>
                  </div>
                </div>
                <button @click.stop="removeItem(index)" class="remove-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <div class="cart-total">
              <p>Total: <strong>{{ total.toFixed(2) }} €</strong></p>
              <button @click="validateOrder" class="btn-checkout">
                Valider la commande
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean
  },
  data() {
    return {
      currentStep: 1,
      isMobile: false
    }
  },
  computed: {
    isLoggedIn() {
      return this.$root.isLoggedIn
    },
    userName() {
      return this.$root.userName
    },
    items() {
      return this.$root.cartItems || []
    },
    total() {
      return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }
  },
  methods: {
    closeCart() {
      this.$emit('close')
    },
    login() {
      this.$root.isLoggedIn = true
    },
    nextStep() {
      this.currentStep++
    },
    updateQuantity(index, change) {
      this.$root.updateCartItemQuantity(index, change)
    },
    removeItem(index) {
      this.$root.removeFromCart(index)
    },
    validateOrder() {
      alert(`Commande validée! Total: ${this.total.toFixed(2)} €`)
      this.closeCart()
    },
    checkViewport() {
      this.isMobile = window.innerWidth < 768
    }
  },
  mounted() {
    this.checkViewport()
    window.addEventListener('resize', this.checkViewport)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkViewport)
  }
}
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.cart-overlay.active {
  opacity: 1;
  visibility: visible;
}

.cart-panel {
  width: 400px;
  height: 100vh;
  background: white;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.cart-overlay.active .cart-panel {
  transform: translateX(0);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cart-item {
  display: flex;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 1rem;
}

.item-details {
  flex: 1;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quantity-controls button {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
}

.cart-total {
  padding: 1.5rem 0;
  text-align: right;
  border-top: 2px solid #eee;
}

.btn-checkout {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
}

.empty-cart {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.btn-primary {
  background: #FF6F61;
  color: white;
  border: none;
  padding: 0.8rem;
  width: 100%;
  border-radius: 5px;
  margin: 1rem 0;
  cursor: pointer;
}

.guest-option {
  color: #FF6F61;
  text-decoration: underline;
  cursor: pointer;
  text-align: center;
}

@media (max-width: 768px) {
  .cart-panel {
    width: 100%;
  }
}
</style>
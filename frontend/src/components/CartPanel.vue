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
          <!-- Étape connexion -->
        </div>

        <div v-if="currentStep === 2" class="step">
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
</template>

<script>
export default {
  props: { isOpen: Boolean },
  data() {
    return {
      currentStep: 1,
      isMobile: window.innerWidth < 768
    }
  },
  mounted() {
    window.addEventListener('resize', this.checkViewport)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkViewport)
  },
  computed: {
    items() { return this.$root.cartItems || [] },
    total() { return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) }
  },
  methods: {
    checkViewport() {
      this.isMobile = window.innerWidth < 768
    },
    closeCart() { this.$emit('close') },
    updateQuantity(index, change) { this.$root.updateCartItemQuantity(index, change) },
    removeItem(index) { this.$root.removeFromCart(index) },
    validateOrder() { alert(`Commande validée ! Total: ${this.total.toFixed(2)} €`) }
  }
}
</script>

<style lang="scss" scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  display: flex;
  justify-content: flex-end;

  &.active {
    opacity: 1;
    visibility: visible;
  }
}

.cart-panel {
  width: 400px;
  height: 100vh;
  background: var(--secondary-color);
  color: var(--text-color);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  .cart-overlay.active & {
    transform: translateX(0);
  }

  &.mobile-view {
    width: 100%;
    max-width: 100%;
    height: 85vh;
    max-height: 85vh;
    bottom: 0;
    top: auto;
    left: 0;
    border-radius: 20px 20px 0 0;
    transform: translateY(100%);
    transition: transform 0.3s ease;

    .cart-overlay.active & {
      transform: translateY(0);
    }
  }
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--cart-border-color);
  position: sticky;
  top: 0;
  background: var(--secondary-color);
  z-index: 10;

  h2 {
    margin: 0;
    color: var(--accent-color);
    font-family: var(--font-family-title);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 1.5rem;
  }
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s;
  padding: 0.5rem;

  &:hover {
    color: var(--accent-color);
  }
}

.cart-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid var(--cart-border-color);
  align-items: center;
  position: relative;

  .item-image {
    width: 80px;
    height: 80px;
    min-width: 80px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 1rem;
    border: 1px solid var(--cart-border-color);
  }

  .item-details {
    flex: 1;
    min-width: 0;

    h4 {
      margin: 0 0 0.5rem 0;
      color: var(--text-color);
      font-family: var(--font-family-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    p {
      margin: 0;
      color: var(--cart-text-light);
      font-weight: bold;
    }
  }
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;

  button {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid var(--accent-color);
    background: transparent;
    color: var(--accent-color);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;

    &:hover {
      background: var(--accent-color);
      color: var(--secondary-color);
    }
  }

  span {
    min-width: 20px;
    text-align: center;
  }
}

.remove-btn {
  background: none;
  border: none;
  color: var(--cart-remove-color);
  cursor: pointer;
  font-size: 1.2rem;
  margin-left: 1rem;
  transition: color 0.3s;
  padding: 0.5rem;

  &:hover {
    color: var(--cart-remove-hover);
  }
}

.cart-total {
  padding: 1.5rem;
  border-top: 2px solid var(--cart-border-color);
  text-align: right;
  position: sticky;
  bottom: 0;
  background: var(--secondary-color);
  margin-top: auto;

  p {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: var(--text-color);

    strong {
      color: var(--accent-color);
    }
  }
}

.btn-checkout {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 20px;
  cursor: pointer;
  width: 100%;
  font-family: var(--font-family-text);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  transition: background 0.3s;
  font-size: 1rem;

  &:hover {
    background: var(--cart-btn-hover);
  }
}

@media (max-width: 768px) {
  .cart-panel.mobile-view {
    .cart-header {
      padding: 1rem;
      
      h2 {
        font-size: 1.3rem;
      }
    }

    .cart-item {
      padding: 0.8rem;

      .item-image {
        width: 60px;
        height: 60px;
        min-width: 60px;
      }
    }

    .btn-checkout {
      padding: 0.8rem;
    }
  }
}
</style>
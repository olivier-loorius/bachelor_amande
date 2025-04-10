<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Footer />
    <CartPanel :isOpen="showCart" @close="showCart = false" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CartPanel from './components/CartPanel.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer,
    CartPanel
  },
  data() {
    return {
      showCart: false,
      cartItems: [],
      isLoggedIn: false,
      userName: "Jean Dupont"
    }
  },
  methods: {
    addToCart(product) {
      const existingItem = this.cartItems.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.cartItems.push({ ...product, quantity: 1 })
      }
    },
    removeFromCart(index) {
      this.cartItems.splice(index, 1)
    },
    updateCartItemQuantity(index, change) {
      const newQty = this.cartItems[index].quantity + change
      if (newQty > 0) {
        this.cartItems[index].quantity = newQty
      } else {
        this.removeFromCart(index)
      }
    }
  }
}
</script>
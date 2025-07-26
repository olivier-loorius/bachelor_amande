<template>
  <div class="cart-overlay" :class="{ 'active': isOpen }" @click.self="closeCart">
    <div class="cart-panel" :class="{ 'mobile-view': isMobile }">
      <!-- En-tête -->
      <div class="cart-header">
        <h2 class="section-title">Mon Panier</h2>
        <button @click="closeCart" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Contenu -->
      <div class="cart-content">
        <!-- Étape 1 - Connexion -->
        <div v-if="currentStep === 1" class="step">
          <div v-if="!isAuthenticated">
            <h3 class="step-title">Connexion</h3>
            <button @click="login" class="btn-primary">
              <i class="fas fa-sign-in-alt"></i> Se connecter
            </button>
            <button @click="nextStep" class="btn-secondary">
              Continuer sans compte <i class="fas fa-arrow-right"></i>
            </button>
          </div>
          <div v-else class="user-info">
            <div class="user-status-display">
              <i class="fas fa-user-check status-icon"></i>
              <p>Connecté en tant que <strong>{{ currentUser?.prenom }}</strong></p>
            </div>
            <button @click="nextStep" class="btn-primary">
              Continuer <i class="fas fa-arrow-right"></i>
            </button>
            <button @click="handleLogout" class="btn-secondary">
              <i class="fas fa-sign-out-alt"></i> Se déconnecter
            </button>
          </div>
        </div>

        <!-- Étape 2 - Contenu du panier -->
        <div v-if="currentStep === 2" class="step">
          <div v-if="panier.length === 0" class="empty-cart">
            <div class="empty-cart-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <h3 class="empty-cart-title">
              <span v-if="isAuthenticated">Bonjour {{ currentUser?.prenom }},</span>
              Votre panier est vide
            </h3>
            <p class="empty-cart-text">
              <span v-if="isAuthenticated">Prêt à passer commande ?</span>
              <span v-else>Ajoutez des tartelettes depuis notre catalogue pour commencer vos achats !</span>
            </p>
            <div class="empty-cart-actions">
              <button @click="closeCart" class="btn-primary">
                Parcourir le catalogue
              </button>
              <button @click="goToComposer" class="btn-secondary">
                Créer ma tartelette
              </button>
            </div>
          </div>

          <div v-else>
            <div v-if="isAuthenticated" class="cart-welcome">
              <h3 class="cart-welcome-title">Bonjour {{ currentUser?.prenom }}, prêt à finaliser votre commande ?</h3>
            </div>
            <div class="cart-items">
              <div v-for="item in panier" :key="item.id" class="cart-item">
                <img :src="item.image" :alt="item.nom" class="item-image">
                <div class="item-details">
                  <h4>{{ item.nom }}</h4>
                  <p>{{ item.prix }} €</p>
                  <div class="quantity-controls">
                    <button @click="updateQuantity(item.id, -1)">-</button>
                    <span>{{ item.quantite }}</span>
                    <button @click="updateQuantity(item.id, 1)">+</button>
                  </div>
                </div>
                <button @click="removeItem(item.id)" class="remove-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>

            <div class="cart-total">
              <p class="order-summary">Vous allez commander <strong>{{ nombreArticles }} tartelette{{ nombreArticles > 1 ? 's' : '' }}</strong></p>
              <p class="total-text">Total: <strong>{{ total.toFixed(2) }} €</strong></p>
              <div class="checkout-container">
                <button class="btn-checkout">
                  <i class="fas fa-check"></i> Valider la commande
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <LogoutModal 
      :show="isLogoutModalOpen" 
      :userName="currentUser?.prenom"
      @close="closeLogoutModal"
      @confirm="handleLogoutConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { usePanier } from '@/composables/usePanier'
import { useAuthStore } from '@/stores/auth'
import LogoutModal from '@/components/LogoutModal.vue'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const currentStep = ref(1)
const isMobile = ref(false)
const isLogoutModalOpen = ref(false)

const { 
  panier, 
  total, 
  nombreArticles,
  modifierQuantite, 
  supprimerDuPanier, 
  fermerPanier 
} = usePanier()

const authStore = useAuthStore()
const { currentUser, isAuthenticated } = authStore

const closeCart = () => {
  emit('close')
  fermerPanier()
}

const login = () => {
  // Ouvrir le panel de connexion
  // Pour l'instant, on simule une connexion
  console.log('Ouvrir panel de connexion')
}

const openLogoutModal = () => {
  isLogoutModalOpen.value = true
}

const closeLogoutModal = () => {
  isLogoutModalOpen.value = false
}

const handleLogoutConfirm = () => {
  authStore.logout()
  currentStep.value = 1
  console.log('Utilisateur déconnecté du panier')
}

const handleLogout = () => {
  openLogoutModal()
}

const nextStep = () => {
  currentStep.value++
}

const prevStep = () => {
  currentStep.value--
}

const updateQuantity = (id: number, change: number) => {
  const produit = panier.value.find(item => item.id === id)
  if (produit) {
    const nouvelleQuantite = produit.quantite + change
    modifierQuantite(id, nouvelleQuantite)
  }
}

const removeItem = (id: number) => {
  supprimerDuPanier(id)
}

const goToComposer = () => {
  closeCart()
  // Navigation vers la page composer
  window.location.href = '/composer'
}

const checkViewport = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkViewport()
  window.addEventListener('resize', checkViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkViewport)
})
</script>

<style scoped>
/* Overlay flouté */
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
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

/* Panneau latéral */
.cart-panel {
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.cart-overlay.active .cart-panel {
  transform: translateX(0);
}

/* Version mobile */
.cart-panel.mobile-view {
  width: 100%;
  height: 80vh;
  position: fixed;
  bottom: 0;
  border-radius: 20px 20px 0 0;
  transform: translateY(100%);
}

.cart-overlay.active .cart-panel.mobile-view {
  transform: translateY(0);
}

/* En-tête */
.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.cart-header .section-title {
  font-family: var(--font-family-title);
  font-size: 1.5rem;
  color: #90aeb0;
  margin: 0;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Contenu */
.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* Articles */
.cart-item {
  display: flex;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  align-items: center;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-family: var(--font-family-title);
  font-size: 1rem;
  color: #90aeb0;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.item-details p {
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quantity-controls button {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-controls button:hover {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.quantity-controls span {
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  color: var(--text-color);
  font-weight: 500;
  min-width: 20px;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 50%;
}

.remove-btn:hover {
  background: rgba(255, 107, 107, 0.1);
  transform: scale(1.1);
}

/* Total */
.cart-total {
  padding: 1.5rem 0;
  text-align: right;
  border-top: 2px solid rgba(0, 0, 0, 0.05);
}

.total-text {
  font-family: var(--font-family-text);
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--text-color);
  font-weight: 500;
}

.total-text strong {
  color: #90aeb0;
  font-weight: 700;
}

.btn-checkout {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  max-width: 250px;
}

.btn-checkout:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.order-summary {
  font-family: var(--font-family-text);
  font-size: 1rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  text-align: center;
}

.order-summary strong {
  color: #90aeb0;
  font-weight: 600;
}

.checkout-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

/* État vide */
.empty-cart {
  text-align: center;
  padding: 2rem;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-cart-icon {
  margin-bottom: 1rem;
}

.empty-cart-icon i {
  font-size: 4rem;
  color: #ddd;
  opacity: 0.5;
}

.empty-cart-title {
  font-family: var(--font-family-title);
  font-size: 1.3rem;
  color: #90aeb0;
  margin: 0;
  font-weight: 600;
}

.empty-cart-text {
  font-family: var(--font-family-text);
  font-size: 1rem;
  color: var(--text-color);
  opacity: 0.7;
  line-height: 1.5;
  max-width: 300px;
}

.cart-welcome {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(144, 174, 176, 0.1);
  border-radius: 8px;
  border: 1px solid #90aeb0;
}

.cart-welcome-title {
  font-family: var(--font-family-title);
  font-size: 1.2rem;
  color: #90aeb0;
  margin: 0;
  font-weight: 600;
  text-align: center;
}

.empty-cart-actions {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  max-width: 280px;
}

/* Boutons */
.btn-primary {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.8rem;
  width: 100%;
  border-radius: 8px;
  margin: 1rem 0;
  cursor: pointer;
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: #fff;
  color: #90aeb0;
  border: 2px solid #90aeb0;
  padding: 0.8rem;
  width: 100%;
  border-radius: 8px;
  margin: 0.5rem 0;
  cursor: pointer;
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-secondary:hover {
  background: #90aeb0;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.step-title {
  font-family: var(--font-family-title);
  font-size: 1.2rem;
  color: #90aeb0;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.user-info p {
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.user-info strong {
  color: #90aeb0;
  font-weight: 600;
}

.user-status-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.8rem;
  background: rgba(144, 174, 176, 0.1);
  border-radius: 8px;
  border: 1px solid #90aeb0;
}

.user-status-display .status-icon {
  color: #4CAF50;
  font-size: 1rem;
}

.user-status-display p {
  margin: 0;
  color: var(--text-color);
}

@media (max-width: 768px) {
  .cart-panel {
    padding-bottom: 2rem;
  }
}
</style>
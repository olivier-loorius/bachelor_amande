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
        <div v-if="!isAuthenticated" class="step">
          <div class="step">
            <h3 class="step-title">Connexion</h3>
            <button @click="login" class="btn-primary">
              <i class="fas fa-sign-in-alt"></i> Se connecter
            </button>
            <button @click="nextStep" class="btn-secondary">
              Continuer sans compte <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Étape 2 - Contenu du panier -->
        <div v-if="isAuthenticated" class="step">
          <div v-if="panierStore.panier.length === 0" class="empty-cart">
            <div class="empty-cart-icon">
              <i class="fas fa-shopping-basket"></i>
            </div>
            <h3 class="empty-cart-title">
              <span v-if="isAuthenticated">Bonjour {{ currentUser?.name }},</span>
              Votre panier est vide
            </h3>
            <p class="empty-cart-text">
              <span v-if="isAuthenticated">Prêt à découvrir nos délicieuses tartelettes ?</span>
              <span v-else>Ajoutez des tartelettes depuis notre catalogue pour commencer vos achats !</span>
            </p>
            <div class="empty-cart-actions">
              <button @click="goToCatalogue" class="btn-primary">
                <i class="fas fa-store"></i>
                Parcourir le catalogue
              </button>
              <button @click="goToComposer" class="btn-secondary">
                <i class="fas fa-magic"></i>
                Créer ma tartelette
              </button>
            </div>
          </div>

          <div v-else>
            <div v-if="isAuthenticated" class="cart-welcome">
              <h3 class="cart-welcome-title">Bonjour {{ currentUser?.name }}, prêt à finaliser votre commande ?</h3>
            </div>
            <div class="cart-items">
              <div v-for="item in panierStore.panier" :key="item.id" class="cart-item">
                <div class="item-image-container">
                  <img :src="item.image" :alt="item.nom" class="item-image">
                </div>
                
                <div class="item-content">
                  <div class="item-header">
                    <h4 class="item-name">{{ item.nom }}</h4>
                  </div>
                  
                  <div class="item-actions">
                    <div class="quantity-controls">
                      <button @click="updateQuantity(item.id, -1)" class="qty-btn" :disabled="item.quantite <= 1">
                        <i class="fas fa-minus"></i>
                      </button>
                      <span class="quantity-display">{{ item.quantite }}</span>
                      <button @click="updateQuantity(item.id, 1)" class="qty-btn" :disabled="item.quantite >= 10">
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
                    
                    <button @click="removeItem(item.id)" class="remove-btn" title="Supprimer">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="cart-total">
              <div class="cart-summary">
                <div class="summary-header">
                  <h4 class="summary-title">Résumé de votre commande</h4>
                  <div class="summary-icon">
                    <i class="fas fa-receipt"></i>
                  </div>
                </div>
                
                <div class="summary-details">
                  <div class="summary-row">
                    <span class="summary-label">Articles commandés</span>
                    <span class="summary-value">{{ nombreArticlesPanier }} tartelettes</span>
                  </div>
                  
                  <div class="summary-row">
                    <span class="summary-label">Prix unitaire</span>
                    <span class="summary-value">6,00€</span>
                  </div>
                  
                  <div class="summary-divider"></div>
                  
                  <div class="summary-row total-row">
                    <span class="summary-label total-label">Total à payer</span>
                    <span class="summary-value total-price">{{ totalPanier.toFixed(2) }}€</span>
                  </div>
                </div>
              </div>
              
              <div class="checkout-container">
                <button class="btn-checkout" @click="finaliserCommande">
                  <i class="fas fa-credit-card"></i>
                  <span>Finaliser ma commande</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <LogoutModal 
      :show="isLogoutModalOpen" 
      :userName="currentUser?.name"
      @close="closeLogoutModal"
      @confirm="handleLogoutConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { usePanierStore } from '@/stores/panier'
import { useAuthStore } from '@/stores/auth'
import AddToCartModal from '@/components/AddToCartModal.vue'
import LogoutModal from '@/components/LogoutModal.vue'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const isMobile = ref(false)
const isLogoutModalOpen = ref(false)

const panierStore = usePanierStore()

const authStore = useAuthStore()

const router = useRouter()

// Computed
const totalPanier = computed(() => panierStore.total)
const nombreArticlesPanier = computed(() => panierStore.nombreArticles)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.currentUser)

// Watcher pour déboguer l'authentification
watch(isAuthenticated, (newValue) => {
  console.log('🔄 État d\'authentification changé:', newValue, 'User:', currentUser.value)
}, { immediate: true })

// Watcher pour l'ouverture du panier
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    openCart()
  }
})

// Méthodes
const modifierQuantitePanier = (id: number, nouvelleQuantite: number) => {
  panierStore.modifierQuantite(id, nouvelleQuantite)
}

const supprimerDuPanierPanier = (id: number) => {
  panierStore.supprimerDuPanier(id)
}

const fermerPanierPanier = () => {
  panierStore.fermerPanier()
}

const closeCart = () => {
  emit('close')
}

const openCart = () => {
  // Pas besoin de gérer currentStep, le template utilise directement isAuthenticated
  console.log('Panier ouvert, authentifié:', isAuthenticated.value, 'User:', currentUser.value)
}

const login = () => {
  // Ouvrir le panel de connexion
  // Pour l'instant, on simule une connexion
}

const openLogoutModal = () => {
  isLogoutModalOpen.value = true
}

const closeLogoutModal = () => {
  isLogoutModalOpen.value = false
}

const handleLogoutConfirm = () => {
  authStore.logout()
  // currentStep.value = 1 // This line is removed as per the edit hint
}

const handleLogout = () => {
  openLogoutModal()
}

const nextStep = () => {
  // currentStep.value++ // This line is removed as per the edit hint
}

const prevStep = () => {
  // currentStep.value-- // This line is removed as per the edit hint
}

const updateQuantity = (id: number, change: number) => {
  const produit = panierStore.panier.find(item => item.id === id)
  if (produit) {
    const nouvelleQuantite = produit.quantite + change
    modifierQuantitePanier(id, nouvelleQuantite)
  }
}

const removeItem = (id: number) => {
  supprimerDuPanierPanier(id)
}

const goToComposer = () => {
  closeCart()
  // Navigation vers la page composer
  router.push('/composer')
}

const goToCatalogue = () => {
  closeCart()
  // Navigation vers le catalogue
  router.push('/catalogue')
}

const finaliserCommande = () => {
  console.log('🚀 Finalisation de la commande...')
  console.log('📍 Redirection vers /en-construction')
  
  // Fermer le panier d'abord
  closeCart()
  
  // Attendre un peu puis rediriger avec paramètre
  setTimeout(() => {
    console.log('🔄 Redirection en cours...')
    router.push('/en-construction?from=panier')
  }, 100)
}

const checkViewport = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkViewport()
  window.addEventListener('resize', checkViewport)
  
  // Debug de l'initialisation
  console.log('🚀 Composant Panier monté')
  console.log('🔐 État d\'authentification:', isAuthenticated.value)
  console.log('👤 Utilisateur actuel:', currentUser.value)
  console.log('📦 Panier ouvert:', props.isOpen)
  
  // Initialiser l'étape en fonction de l'authentification
  openCart()
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
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  border-radius: 0;
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
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
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
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

/* Contenu */
.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f8f9fa;
}

/* Articles */
.cart-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.8rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(144, 174, 176, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cart-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-color), var(--teal-color));
}

.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-color: rgba(144, 174, 176, 0.2);
}

.item-image-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin-right: 1.2rem;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.cart-item:hover .item-image {
  transform: scale(1.05);
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80px;
}

.item-header {
  margin-bottom: 1rem;
}

.item-name {
  font-family: var(--font-family-title);
  font-size: 1.1rem;
  color: var(--teal-color);
  margin: 0;
  font-weight: 600;
  line-height: 1.3;
}

.item-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.4rem;
  border: 1px solid #e9ecef;
}

.qty-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--accent-color);
  font-size: 0.9rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
}

.qty-btn:hover:not(:disabled) {
  background: var(--accent-color);
  color: white;
  transform: scale(1.1);
}

.qty-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.quantity-display {
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--teal-color);
  min-width: 24px;
  text-align: center;
}

.remove-btn {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.remove-btn:hover {
  background: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
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

/* État vide */
.empty-cart {
  text-align: center;
  padding: 2rem 1rem;
}

.empty-cart-icon {
  font-size: 4rem;
  color: var(--accent-color);
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.empty-cart-title {
  font-family: var(--font-family-title);
  font-size: 1.5rem;
  color: var(--teal-color);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.empty-cart-text {
  font-family: var(--font-family-text);
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.empty-cart-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.btn-primary, .btn-secondary {
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 200px;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-color), #e05a4e);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(255, 111, 97, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 111, 97, 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--teal-color);
  border: 2px solid var(--teal-color);
}

.btn-secondary:hover {
  background: var(--teal-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(144, 174, 176, 0.3);
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

/* Résumé de la commande */
.cart-summary {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.summary-title {
  font-family: var(--font-family-title);
  font-size: 1.1rem;
  color: #90aeb0;
  margin: 0;
  font-weight: 600;
}

.summary-icon {
  font-size: 1.2rem;
  color: var(--accent-color);
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.summary-value {
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  color: #90aeb0;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 0.8rem 0;
}

.total-row {
  margin-top: 0.8rem;
}

.total-label {
  font-size: 1.1rem;
  color: #90aeb0;
  font-weight: 600;
}

.total-price {
  font-size: 1.1rem;
  color: #90aeb0;
  font-weight: 700;
}

.btn-checkout {
  background: linear-gradient(135deg, var(--accent-color), #e05a4e);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-family: var(--font-family-text);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  width: 100%;
  box-shadow: 0 4px 15px rgba(255, 111, 97, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-checkout:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 111, 97, 0.4);
  background: linear-gradient(135deg, #e05a4e, var(--accent-color));
}

.btn-checkout:active {
  transform: translateY(0);
}

.btn-checkout i {
  font-size: 1.1rem;
}

.checkout-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

/* Responsive et améliorations */
@media (max-width: 768px) {
  .cart-panel {
    width: 100%;
    height: 100vh;
    border-radius: 0;
  }
  
  .cart-header {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .cart-content {
    padding: 0.8rem;
  }
  
  .cart-item {
    padding: 1rem;
    margin-bottom: 0.8rem;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .item-image-container {
    width: 80px;
    height: 80px;
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .item-content {
    width: 100%;
    min-height: auto;
    align-items: center;
  }
  
  .item-header {
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .item-name {
    font-size: 1rem;
  }
  
  .item-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  
  .quantity-controls {
    order: 1;
  }
  
  .remove-btn {
    order: 2;
  }
  
  .summary-header {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .summary-title {
    font-size: 1rem;
  }
  
  .btn-checkout {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
  
  .empty-cart-actions {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .btn-primary, .btn-secondary {
    min-width: 180px;
    padding: 0.7rem 1.2rem;
    font-size: 0.8rem;
  }
}

/* Animations et transitions */
.cart-item {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.cart-summary {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Amélioration de l'accessibilité */
.qty-btn:focus,
.remove-btn:focus,
.btn-checkout:focus,
.btn-primary:focus,
.btn-secondary:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

/* États de chargement */
.btn-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Effet de survol amélioré pour les articles */
.cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
</style>
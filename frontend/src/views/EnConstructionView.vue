<template>
  <div class="en-construction">
    <div class="construction-content">
      <div class="construction-icon">
        <i class="fas fa-hammer"></i>
      </div>
      
      <h1 class="construction-title">Page en construction</h1>
      
      <p class="construction-text">
        Cette page sera bientôt disponible ! Nous travaillons actuellement sur la finalisation de votre commande.
      </p>
      
      <div class="construction-actions">
        <button 
          v-if="fromCart && isAuthenticated" 
          class="btn-secondary" 
          @click="goToCart"
        >
          <i class="fas fa-shopping-cart"></i>
          Retour au panier
        </button>
        <button 
          v-else 
          class="btn-secondary" 
          @click="goBack"
        >
          <i class="fas fa-arrow-left"></i>
          Retour
        </button>
        
        <router-link class="btn-primary" to="/">
          <i class="fas fa-home"></i>
          Accueil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Détecter si l'utilisateur vient du panier
const fromCart = ref(false)

// Vérifier l'authentification
const isAuthenticated = computed(() => authStore.isAuthenticated)

function goBack() {
  router.back()
}

function goToCart() {
  // Rediriger vers la page d'accueil où le panier peut être ouvert
  router.push('/')
}

onMounted(() => {
  // Détecter si on vient du panier en vérifiant le referrer
  const referrer = document.referrer
  const currentHost = window.location.origin
  
  // Si le referrer est sur le même site et contient "panier" ou si on vient de la route /panier
  if (referrer && referrer.includes(currentHost)) {
    fromCart.value = referrer.includes('panier') || referrer.includes('/panier')
  }
  
  // Alternative : vérifier si on vient de la route /panier via l'historique
  if (route.query.from === 'panier') {
    fromCart.value = true
  }
  
  console.log('📍 Page EnConstruction - Venant du panier:', fromCart.value)
  console.log('🔐 Utilisateur authentifié:', isAuthenticated.value)
})
</script>

<style scoped>
.en-construction {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary-color);
  padding: var(--spacing-xxl);
}

.construction-content {
  text-align: center;
  max-width: 600px;
  background: var(--white);
  padding: var(--spacing-card);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  animation: fadeInUp 0.6s ease-out;
}

.construction-icon {
  font-size: 4rem;
  color: var(--accent-color);
  margin-bottom: var(--spacing-xl);
  animation: bounce 2s infinite;
}

.construction-title {
  color: var(--accent-color);
  font-size: 2.5rem;
  font-family: var(--font-family-title);
  letter-spacing: 1px;
  margin-bottom: var(--spacing-lg);
  text-transform: uppercase;
}

.construction-text {
  color: var(--text-color);
  font-family: var(--font-family-text);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-xxl);
  opacity: 0.8;
}

.construction-actions {
  display: flex;
  gap: var(--spacing-lg);
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: var(--btn-padding);
  border-radius: var(--btn-radius);
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: var(--btn-font-size);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  border: none;
  min-width: 160px;
}

.btn-primary {
  background: var(--accent-color);
  color: var(--white);
}

.btn-primary:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--box-shadow-hover);
}

.btn-secondary {
  background: var(--white);
  color: var(--teal-color);
  border: 2px solid var(--teal-color);
}

.btn-secondary:hover {
  background: var(--teal-color);
  color: var(--white);
  transform: translateY(-2px);
  box-shadow: var(--box-shadow-hover);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .en-construction {
    padding: var(--spacing-lg);
  }
  
  .construction-content {
    padding: var(--spacing-lg);
  }
  
  .construction-icon {
    font-size: 3rem;
  }
  
  .construction-title {
    font-size: 2rem;
  }
  
  .construction-text {
    font-size: 1rem;
  }
  
  .construction-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    max-width: 280px;
  }
}
</style> 
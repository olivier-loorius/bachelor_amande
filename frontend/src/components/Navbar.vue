<template>
  <nav :class="{ 'nav-hidden': isNavHidden }" role="navigation" aria-label="Navigation principale">
    <div class="logo">
      <router-link to="/" aria-label="Accueil">
        <img src="@/assets/images/LogoAmande.png" alt="Amande Pâtisserie" />
      </router-link>
    </div>
    
    <button 
      class="menu" 
      @click="toggleMenu" 
      :aria-expanded="isMenuOpen"
      aria-label="Menu de navigation"
      aria-controls="navigation-menu"
    >
      <div :class="{ 'menu-icon': true, open: isMenuOpen }"></div>
    </button>
    
    <ul 
      id="navigation-menu"
      :class="{ open: isMenuOpen }" 
      @click="closeMenu"
      role="menu"
    >
      <li class="composer" role="none">
        <router-link to="/composer" role="menuitem">COMPOSER</router-link>
      </li>
      <li class="actualite" role="none">
        <router-link to="/actualite" role="menuitem">ACTUALITE</router-link>
      </li>
      <li class="catalogue" role="none">
        <router-link to="/catalogue" role="menuitem">CATALOGUE</router-link>
      </li>
    </ul>
    
    <div class="cta-container">
      <!-- CTA Admin (visible seulement pour les admins) -->
      <div v-if="authStore.isAuthenticated && authStore.currentUser?.role === 'admin'" class="cta-item admin">
        <router-link to="/admin" class="cta-button admin-btn" title="Administration">
          <i class="fas fa-cog"></i>
        </router-link>
      </div>
      
      <div class="cta-item connexion">
        <button 
          @click="openLogin" 
          class="cta-button login-btn" 
          :class="{ 'connected': authStore.isAuthenticated }"
          :title="authStore.isAuthenticated ? 'Mon compte' : 'Se connecter'"
          :aria-label="authStore.isAuthenticated ? 'Mon compte' : 'Se connecter'"
        >
          <i :class="authStore.isAuthenticated ? 'fas fa-user-check' : 'fas fa-user'"></i>
          <div v-if="authStore.isAuthenticated" class="status-indicator" aria-label="Connecté"></div>
        </button>
      </div>
      
      <div class="cta-item panier">
        <button 
          @click="openCart" 
          class="cta-button cart-btn" 
          :class="{ 'disabled': !authStore.isAuthenticated }" 
          :title="authStore.isAuthenticated ? 'Mon panier' : 'Connectez-vous pour accéder au panier'"
          :aria-label="authStore.isAuthenticated ? 'Mon panier' : 'Connectez-vous pour accéder au panier'"
        >
          <i class="fas fa-shopping-cart"></i>
          <span v-if="nombreArticles > 0" class="cart-count" aria-label="Nombre d'articles">{{ nombreArticles }}</span>
        </button>
      </div>
    </div>
    
    <LoginPanel 
      :isOpen="isLoginOpen" 
      :openCartAfterLogin="openCartAfterLogin"
      @close="closeLogin"
      @loginSuccess="handleLoginSuccess"
      @openCart="openCart"
    />
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginPanel from '@/components/auth/LoginPanel.vue'
import { usePanierStore } from '@/stores/panier'
import { useAuthStore } from '@/stores/auth'

// État local
const isMenuOpen = ref(false)
const isLoginOpen = ref(false)
const openCartAfterLogin = ref(false)
const isNavHidden = ref(false)

// Scroll tracking
let lastScrollY = 0

// Stores et composables
const panierStore = usePanierStore()
const authStore = useAuthStore()
const router = useRouter()

// Computed
const nombreArticles = computed(() => {
  // Ne montrer le compteur que si l'utilisateur est connecté
  if (!authStore.isAuthenticated) return 0
  return panierStore.panier.reduce((sum, item) => sum + item.quantite, 0)
})

// Watchers
watch(() => authStore.isAuthenticated, (newValue) => {
  // État d'authentification changé
})

// Méthodes de navigation
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

// Fermer le menu lors d'un clic ailleurs
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  const nav = document.querySelector('nav')
  
  if (nav && !nav.contains(target) && isMenuOpen.value) {
    closeMenu()
  }
}

// Fermer le menu lors d'une navigation
const handleNavigation = () => {
  if (isMenuOpen.value) {
    closeMenu()
  }
}

// Méthodes d'authentification
const openLogin = () => {
  openCartAfterLogin.value = false
  isLoginOpen.value = true
  // Fermer le menu mobile lors de l'ouverture de la connexion
  closeMenu()
}

const closeLogin = () => {
  isLoginOpen.value = false
  openCartAfterLogin.value = false
}

const handleLoginSuccess = () => {
  // Connexion réussie - rester sur la page actuelle
  
  // Si l'utilisateur est sur la page /login, le rediriger vers l'accueil
  if (router.currentRoute.value.path === '/login') {
    router.push('/')
  }
  
  // Aucune autre redirection, l'utilisateur reste sur la page où il était
}

// Méthodes de panier
const openCart = () => {
  // Fermer le menu mobile lors de l'ouverture du panier
  closeMenu()
  
  if (authStore.isAuthenticated) {
    panierStore.ouvrirPanier()
  } else {
    openLoginForCart()
  }
}

const openLoginForCart = () => {
  openCartAfterLogin.value = true
  isLoginOpen.value = true
}

// Gestion du scroll
const handleScroll = () => {
  const currentScrollY = window.scrollY
  const scrollThreshold = 5
  const hideThreshold = 80
  
  if (Math.abs(currentScrollY - lastScrollY) < scrollThreshold) return
  
  if (currentScrollY > lastScrollY && currentScrollY > hideThreshold) {
    isNavHidden.value = true
  } else if (currentScrollY < lastScrollY) {
    isNavHidden.value = false
  }
  
  lastScrollY = currentScrollY
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)
  router.afterEach(handleNavigation)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
  router.afterEach(() => {}) // Remove the listener after the component is unmounted
})
</script>

<style lang="scss">


// Variables locales
$navbar-height-desktop: 80px;
$navbar-height-mobile: 65px;
$transition-duration: 0.4s;
$transition-timing: cubic-bezier(0.4, 0, 0.2, 1);

// Navbar principale
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--secondary-color);
  color: var(--text-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: $navbar-height-desktop;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: transform $transition-duration $transition-timing;
  will-change: transform;
}

.nav-hidden {
  transform: translateY(-100%);
}

// Logo
.logo {
  margin-left: 20px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.logo img {
  height: 80px; /* Réduit de 120px à 80px */
  width: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  margin-bottom: -15px;
}

.logo img:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

// S'assurer que le logo n'a jamais de bordure
.logo a,
.logo a:focus,
.logo a:hover,
.logo a:active,
.logo a.router-link-active {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

// Menu burger (mobile)
.menu {
  display: none;
  background: transparent;
  border: none;
  padding: 0;
  width: 30px;
  height: 30px;
  cursor: pointer;
  outline: none;
  
  // Supprimer la bordure au focus/survol
  &:focus,
  &:hover {
    outline: none;
    box-shadow: none;
    border: none;
  }
  
  // Supprimer la bordure au clic
  &:active {
    outline: none;
    box-shadow: none;
    border: none;
  }
}

.menu-icon {
  width: 30px;
  height: 3px;
  background-color: var(--accent-color);
  transition: all 0.3s ease-in-out;
  position: relative;
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  width: 30px;
  height: 3px;
  background-color: var(--accent-color);
  position: absolute;
  transition: all 0.3s ease-in-out;
}

.menu-icon::before {
  top: -10px;
  left: 0;
}

.menu-icon::after {
  top: 10px;
  left: 0;
}

.menu-icon.open {
  background-color: transparent;
}

.menu-icon.open::before {
  transform: rotate(45deg);
  top: 0;
}

.menu-icon.open::after {
  transform: rotate(-45deg);
  top: 0;
}

// Navigation principale
ul {
  list-style: none;
  display: flex;
  gap: 1.8rem;
  padding: 0;
  margin: 0;
  align-items: center;
}

li {
  font-family: var(--font-family-text);
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  font-weight: 600;
}

a {
  display: inline-block;
  padding: 0.6rem 0;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 600;
  position: relative;
}

// Effet de soulignement au hover
.actualite a::after,
.composer a::after,
.catalogue a::after {
  content: '';
  display: block;
  width: 0;
  height: 2px;
  background: var(--accent-color);
  transition: width 0.3s ease;
  position: absolute;
  left: 0;
  bottom: 0;
}

.actualite a:hover::after,
.composer a:hover::after,
.catalogue a:hover::after {
  width: 100%;
}

a:hover {
  color: var(--accent-color);
  transform: translateY(-1px);
}

// Indication de la page active - bordure simple
.actualite a.router-link-active,
.composer a.router-link-active,
.catalogue a.router-link-active {
  color: var(--accent-color);
  outline: 2px solid var(--accent-color);
  outline-offset: 4px;
  border-radius: 6px;
  
  // Pas de soulignement pour la page active
  &::after {
    display: none;
  }
}

// CTA Container
.cta-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

// CTA Items
.cta-item {
  position: relative;
}

.cta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 35px;
  border-radius: 8px;
  border: 2px solid;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-sizing: border-box;
  position: relative;
  background: none;
  outline: none; /* Supprime la bordure de focus par défaut */
}

/* Styles de focus personnalisés pour chaque CTA */
.cta-button:focus {
  outline: none; /* Supprime la bordure de focus par défaut */
}

.login-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(144, 174, 176, 0.3); /* Bordure de focus pour le bouton login */
}

.login-btn.connected:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.3); /* Bordure de focus pour le bouton connecté */
}

.cart-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 111, 97, 0.3); /* Bordure de focus pour le bouton panier */
}

.admin-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(56, 57, 97, 0.3); /* Bordure de focus pour le bouton admin */
}

// Bouton de connexion
.login-btn {
  background-color: #90aeb0;
  color: white;
  border-color: #90aeb0;
}

.login-btn:hover {
  background-color: transparent;
  color: #90aeb0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(144, 174, 176, 0.3);
}

// État connecté
.login-btn.connected {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border-color: #28a745;
}

.login-btn.connected:hover {
  background: transparent;
  color: #28a745;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

// Bouton de panier
.cart-btn {
  background-color: var(--accent-color);
  color: var(--secondary-color);
  border-color: var(--accent-color);
}

.cart-btn:hover {
  background-color: transparent;
  color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 111, 97, 0.3);
}

.cart-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cart-btn.disabled:hover {
  opacity: 0.7;
  background-color: var(--accent-color) !important;
  color: var(--secondary-color) !important;
  transform: none;
  box-shadow: none;
}

// Bouton admin (desktop)
.admin-btn {
  background: #383961;
  color: white;
  border-color: #383961;
}

.admin-btn:hover {
  background: transparent;
  color: #383961;
}

// Icônes des CTA
.cta-button i {
  font-size: 1rem;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

// Compteur d'articles
.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--secondary-color);
  color: var(--accent-color);
  border-radius: 50%;
  padding: 0;
  font-size: 0.65rem;
  font-weight: bold;
  border: 1px solid var(--accent-color);
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

// Indicateur de statut connecté
.status-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #4CAF50;
  border: 1px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

// Styles responsives
@media (max-width: 768px) {
  // Menu burger visible
  .menu {
    display: flex;
    z-index: 1000;
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-right: 1.5rem;
    flex: 0 0 auto;
    order: 4;
  }

  // Navbar mobile
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.5rem;
    height: $navbar-height-mobile;
  }

  // Logo mobile
  .logo {
    margin-left: 6px;
    flex: 0 0 auto;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  
  .logo img {
    height: 75px;
    width: auto;
    margin-bottom: -10px;
  }

  // CTA mobile
  .cta-container {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-left: auto;
    margin-right: 1.5rem;
    flex: 0 0 auto;
    order: 3;
  }
  
  .cta-button {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin: 0;
    padding: 0;
    font-size: 1.2rem;
    justify-content: center;
    align-items: center;
    display: flex;
    position: relative;
    text-align: center;
    outline: none; /* Supprime la bordure de focus par défaut */
  }
  
  /* Styles de focus pour mobile */
  .cta-button:focus {
    outline: none;
  }
  
  .login-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(144, 174, 176, 0.3);
  }
  
  .login-btn.connected:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.3);
  }
  
  .cart-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 111, 97, 0.3);
  }
  
  .admin-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(56, 57, 97, 0.3);
  }
  
  .cart-count {
    font-size: 0.7rem;
    width: 15px;
    height: 15px;
    top: -6px;
    right: -6px;
  }
  
  .status-indicator {
    width: 8px;
    height: 8px;
    top: -1px;
    right: -1px;
  }
  
  /* Styles pour le CTA Admin */
  .admin-btn {
    background: #383961;
    color: white;
  }
  
  .admin-btn:hover {
    background: transparent;
    color: #383961;
  }
  
  /* Styles pour le CTA Admin mobile */
  .login-btn.connected {
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
  }
  
  .login-btn.connected:hover {
    background: transparent;
    color: #28a745;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4);
  }

  // Menu dropdown mobile
  ul {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    right: -100%;
    width: 100vw;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--secondary-color);
    padding: 1rem;
    z-index: 999;
    text-align: center;
    gap: 0.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    transition: right 0.3s ease-in-out;
    margin: 0;
    margin-top: -1px;
    color: var(--text-color);
  }
  
  ul.open {
    display: flex;
    right: 0;
  }

  // Liens du menu mobile
  ul li {
    font-family: var(--font-family-text);
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.5px;
    font-weight: 600;
    padding: 0;
    margin: 0;
  }
  
  ul li a {
    display: block;
    padding: 0.8rem 1rem;
    color: var(--text-color);
    text-decoration: none;
    transition: all 0.3s ease;
    font-weight: 600;
    position: relative;
    text-align: center;
    width: 100%;
    max-width: 100%;
  }
  
  .actualite a::after,
  .composer a::after,
  .catalogue a::after {
    content: '';
    display: block;
    width: 0;
    height: 2px;
    background: var(--accent-color);
    transition: width 0.3s ease;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  
  .actualite a:hover::after,
  .composer a:hover::after,
  .catalogue a:hover::after {
    width: 100%;
  }
  
  ul li a:hover {
    color: var(--accent-color);
    transform: translateY(-1px);
  }
}
</style>

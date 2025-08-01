<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-left">
        <router-link to="/" class="nav-logo">
          <img src="@/assets/images/logo-amande.png" alt="Amande Pâtisserie" />
        </router-link>
      </div>

      <div class="nav-center">
        <div class="nav-menu" :class="{ 'mobile-open': isMobileMenuOpen }">
          <router-link to="/" class="nav-link">Accueil</router-link>
          <router-link to="/catalogue" class="nav-link">Catalogue</router-link>
          <router-link to="/composer" class="nav-link">Composer</router-link>
          <router-link to="/actualite" class="nav-link">Actualités</router-link>
          <router-link to="/contact" class="nav-link">Contact</router-link>
        </div>
      </div>

      <div class="nav-right">
        <div class="nav-actions">
          <CartIndicator />
          <div class="auth-section">
            <button v-if="!isLoggedIn" @click="openLogin" class="login-btn">
              <i class="fas fa-user"></i>
              <span class="login-text">Se connecter</span>
            </button>
            <div v-else class="user-menu">
              <button @click="toggleUserMenu" class="user-btn">
                <i class="fas fa-user-circle"></i>
                <span class="user-name">{{ user?.name || 'Utilisateur' }}</span>
                <i class="fas fa-chevron-down"></i>
              </button>
              <div v-if="isUserMenuOpen" class="user-dropdown">
                <router-link to="/panier" class="dropdown-item">
                  <i class="fas fa-shopping-cart"></i>
                  Mon panier
                </router-link>
                <button v-if="isAdmin" @click="goToAdmin" class="dropdown-item">
                  <i class="fas fa-cog"></i>
                  Administration
                </button>
                <button @click="logout" class="dropdown-item logout-item">
                  <i class="fas fa-sign-out-alt"></i>
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>

        <button @click="toggleMobileMenu" class="mobile-menu-btn">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>

    <!-- Panier latéral -->
    <CartPanel />

    <!-- Modale de connexion -->
    <LoginPanel :is-open="isLoginOpen" @close="closeLogin" />

    <!-- Modale de déconnexion -->
    <LogoutModal
      :isOpen="showLogoutModal"
      @close="closeLogoutModal"
      @confirm="confirmLogout"
    />
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import CartIndicator from '@/components/cart/CartIndicator.vue'
import CartPanel from '@/components/cart/CartPanel.vue'
import LoginPanel from '@/components/auth/LoginPanel.vue'
import LogoutModal from '@/components/LogoutModal.vue'

const router = useRouter()
const authStore = useAuthStore()

// États réactifs
const isMobileMenuOpen = ref(false)
const isLoginOpen = ref(false)
const isUserMenuOpen = ref(false)
const showLogoutModal = ref(false)
const isMobile = ref(false)

// Computed properties
const isLoggedIn = computed(() => authStore.isLoggedIn)
const user = computed(() => authStore.user)
const isAdmin = computed(() => authStore.user?.role === 'admin')

// Méthodes
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const openLogin = () => {
  isLoginOpen.value = true
}

const closeLogin = () => {
  isLoginOpen.value = false
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const logout = () => {
  showLogoutModal.value = true
}

const closeLogoutModal = () => {
  showLogoutModal.value = false
}

const confirmLogout = () => {
  authStore.logout(router)
  showLogoutModal.value = false
  isUserMenuOpen.value = false
}

const goToAdmin = () => {
  router.push('/admin')
  isUserMenuOpen.value = false
}

// Gestion du responsive
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu') && !target.closest('.mobile-menu-btn')) {
    isUserMenuOpen.value = false
  }
  if (!target.closest('.nav-menu') && !target.closest('.mobile-menu-btn')) {
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--primary-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  height: 80px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-logo img {
  height: 50px;
  width: auto;
}

.nav-center {
  display: flex;
  align-items: center;
}

.nav-menu {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--accent-color);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--accent-color);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.auth-section {
  display: flex;
  align-items: center;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.login-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: var(--text-color);
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 25px;
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1001;
  margin-top: 10px;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  color: var(--text-color);
  text-decoration: none;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 14px;
}

.dropdown-item:hover {
  background: var(--background-light);
}

.logout-item {
  color: var(--error-color);
}

.logout-item:hover {
  background: var(--error-light);
}

.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    height: 65px;
  }

  .nav-container {
    padding: 0 15px;
  }

  .nav-logo img {
    height: 40px;
  }

  .nav-center {
    display: none;
  }

  .nav-menu {
    position: fixed;
    top: 65px;
    left: 0;
    right: 0;
    background: var(--primary-color);
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    transform: translateY(-100%);
    transition: transform 0.3s ease;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }

  .nav-menu.mobile-open {
    transform: translateY(0);
  }

  .nav-link {
    font-size: 18px;
    padding: 10px 0;
  }

  .mobile-menu-btn {
    display: block;
  }

  .nav-actions {
    gap: 10px;
  }

  .login-text {
    display: none;
  }

  .user-name {
    display: none;
  }

  .user-btn {
    padding: 8px 12px;
  }
}
</style> 
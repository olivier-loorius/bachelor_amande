<template>
  <div class="login-overlay" :class="{ 'active': isOpen }" @click.self="closeLogin">
    <div class="login-panel" :class="{ 'mobile-view': isMobile }">
      <!-- En-tête -->
      <div class="login-header">
        <h2>{{ authStore.isAuthenticated ? 'Mon Compte' : 'Connexion' }}</h2>
        <button @click="closeLogin" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Contenu -->
      <div class="login-content">
        <!-- Si connecté : afficher les informations du compte -->
        <div v-if="authStore.isAuthenticated" class="account-section">
          <div class="account-header">
            <div class="user-avatar">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="user-details">
              <h3>{{ authStore.currentUser?.nom || 'Utilisateur' }}</h3>
              <p class="user-email">{{ maskEmail(authStore.currentUser?.email) }}</p>
              <span class="member-since">Membre depuis {{ getMemberSince() }}</span>
            </div>
          </div>

          <div class="account-actions">
            <button class="account-btn">
              <i class="fas fa-user-edit"></i>
              Modifier mon profil
            </button>
            <button class="account-btn">
              <i class="fas fa-shopping-bag"></i>
              Mes commandes
            </button>
            <button class="account-btn">
              <i class="fas fa-heart"></i>
              Mes favoris
            </button>
            <button class="account-btn">
              <i class="fas fa-cog"></i>
              Paramètres
            </button>
            <button @click="handleLogout" class="logout-btn">
              <i class="fas fa-sign-out-alt"></i>
              Se déconnecter
            </button>
          </div>
        </div>

        <!-- Si non connecté : afficher le formulaire de connexion -->
        <div v-else>
          <p>Entrez votre email et mot de passe pour vous connecter à votre compte.</p>
          
          <!-- Message d'erreur/succès -->
          <div v-if="message" :class="['message', messageType]">
            {{ message }}
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="formData.email"
                type="email"
                id="email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Entrez votre email"
                autocomplete="username"
                required
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                v-model="formData.password"
                type="password"
                id="password"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Entrez votre mot de passe"
                autocomplete="current-password"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Connexion...' : 'Connexion' }}
            </button>
          </form>
          <p class="text-sm text-center mt-4">
            Vous n'avez pas de compte ?
            <a href="#" class="text-indigo-600 hover:underline" @click.prevent="openRegister">Créez-en un</a>
          </p>
        </div>
      </div>
    </div>
    <RegisterPanel :isOpen="isRegisterOpen" @close="closeRegister" />
    
    <!-- Modale de déconnexion -->
    <LogoutModal 
      :show="isLogoutModalOpen" 
      :userName="authStore.currentUser?.nom"
      @close="closeLogoutModal"
      @confirm="handleLogoutConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
import RegisterPanel from '@/components/auth/RegisterPanel.vue'
import LogoutModal from '@/components/LogoutModal.vue'
import { useAuthStore } from '@/stores/auth'

interface Props {
  isOpen: boolean
  openCartAfterLogin?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  loginSuccess: []
  openCart: []
  openRegister: []
}>()

const authStore = useAuthStore()


const isMobile = ref(false)
const isRegisterOpen = ref(false)
const isLogoutModalOpen = ref(false)
const isLoading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('error')

const formData = reactive({
  email: '',
  password: ''
})

const closeLogin = () => {
  emit('close')
  resetForm()
}

const openRegister = () => {
  isRegisterOpen.value = true
}

const closeRegister = () => {
  isRegisterOpen.value = false
}

const resetForm = () => {
  formData.email = ''
  formData.password = ''
  message.value = ''
  isLoading.value = false
}

// Reset le formulaire quand le modal s'ouvre
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    resetForm()
  }
})

// Surveiller les changements d'état d'authentification
watch(() => authStore.isAuthenticated, (newValue) => {
  // État d'authentification changé
})

const showMessage = (msg: string, type: 'success' | 'error') => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const handleLogin = async () => {
  
  isLoading.value = true
  
  try {
    const result = await authStore.login({
      email: formData.email,
      password: formData.password
    })

    if (result.success) {
      showMessage(result.message, 'success')
      // Fermer immédiatement le modal après connexion réussie
      closeLogin()
      emit('loginSuccess')
      // Si l'utilisateur était connecté pour le panier, l'ouvrir automatiquement
      if (props.openCartAfterLogin) {
        emit('openCart')
      }
    } else {
      showMessage(result.message, 'error')
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    showMessage('Erreur lors de la connexion', 'error')
  } finally {
    isLoading.value = false
  }
}

const handleLogout = () => {
  isLogoutModalOpen.value = true
}

const closeLogoutModal = () => {
  isLogoutModalOpen.value = false
}

const handleLogoutConfirm = () => {
  authStore.logout()
  showMessage('Vous avez été déconnecté avec succès.', 'success')
  closeLogin()
  isLogoutModalOpen.value = false
}

const getMemberSince = () => {
  if (!authStore.currentUser?.dateCreation) return 'récemment'
  const date = new Date(authStore.currentUser.dateCreation)
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

const maskEmail = (email: string | undefined) => {
  if (!email) return ''
  
  const [localPart, domain] = email.split('@')
  if (!domain) return email
  
  // Masquer la partie locale (avant @)
  const maskedLocal = localPart.length > 2 
    ? localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1)
    : localPart
  
  // Masquer partiellement le domaine
  const domainParts = domain.split('.')
  const maskedDomain = domainParts.length > 1
    ? domainParts[0].charAt(0) + '*'.repeat(domainParts[0].length - 1) + '.' + domainParts.slice(1).join('.')
    : domain
  
  return `${maskedLocal}@${maskedDomain}`
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
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 99999;
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.login-overlay.active {
  opacity: 1;
  visibility: visible;
}

.login-panel {
  width: 400px;
  height: 100vh;
  background: var(--secondary-color);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  border-radius: 0 0 0 20px;
}

.login-overlay.active .login-panel {
  transform: translateX(0);
}

.login-panel.mobile-view {
  width: 100%;
  height: 80vh;
  position: fixed;
  bottom: 0;
  border-radius: 20px 20px 0 0;
  transform: translateY(100%);
}

.login-overlay.active .login-panel.mobile-view {
  transform: translateY(0);
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--secondary-color);
}

.login-header h2 {
  margin: 0;
  color: #90aeb0;
  font-family: var(--font-family-title);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: var(--accent-color);
}

.login-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  font-family: var(--font-family-text);
  color: var(--text-color);
}

.login-content p {
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

form label {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--text-color);
  display: block;
  margin-bottom: 0.5rem;
}

form input {
  padding: 0.75rem;
  border: 1px solid #90aeb0;
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-color);
  background: var(--secondary-color);
  width: 100%;
  box-sizing: border-box;
}

form input::placeholder {
  color: var(--cart-text-light);
  font-size: 0.9rem;
}

form a {
  font-size: 0.9rem;
  color: var(--accent-color);
  text-decoration: none;
  align-self: flex-end;
}

form a:hover {
  text-decoration: underline;
}

form button {
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  width: 100%;
}

form button[type='submit'] {
  background: #ff6f61;
  color: white;
  border: 2px solid #ff6f61;
}

form button[type='submit']:hover {
  background: transparent;
  color: #ff6f61;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 111, 97, 0.3);
}

form button[type='button'] {
  background: var(--secondary-color);
  color: var(--text-color);
  border: 1px solid var(--accent-color);
}

form button[type='button']:hover {
  background: var(--accent-color);
  color: var(--secondary-color);
}

.login-content .text-center {
  margin-top: 1.5rem;
  font-size: 0.9rem;
}

.login-content .text-center a {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: bold;
}

.login-content .text-center a:hover {
  text-decoration: underline;
}

.message {
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.account-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.account-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem;
  /* Suppression du background et de la bordure */
}

.user-avatar {
  font-size: 3rem;
  color: #ff6f61;
}

.user-details h3 {
  margin: 0 0 0.25rem 0;
  color: var(--text-color);
  font-family: var(--font-family-title);
  font-size: 1.25rem;
  font-weight: 600;
}

.user-email {
  margin: 0 0 0.5rem 0;
  color: var(--cart-text-light);
  font-size: 0.9rem;
}

.member-since {
  color: #ff6f61;
  font-size: 0.8rem;
  font-weight: 500;
}

.account-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.account-btn {
  background: none;
  color: var(--text-color);
  padding: 0.75rem 0;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.account-btn:hover {
  color: #ff6f61;
}

.logout-btn {
  background: #ff6f61;
  color: white;
  padding: 0.75rem 1.5rem;
  border: 2px solid #ff6f61;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.logout-btn:hover {
  background: transparent;
  color: #ff6f61;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 111, 97, 0.3);
}
</style>

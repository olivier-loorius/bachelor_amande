<template>
  <div class="login-overlay" :class="{ 'active': isOpen }" @click.self="closeLogin">
    <div class="login-panel" :class="{ 'mobile-view': isMobile }">
      <!-- En-tête -->
      <div class="login-header">
        <h2>{{ getHeaderTitle() }}</h2>
        <button @click="closeLogin" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Contenu -->
      <div class="login-content">
        <!-- Mode Compte (utilisateur connecté) -->
        <div v-if="currentMode === 'account'">
          <div class="account-section">
            <div class="account-header">
              <div class="user-avatar">
                <i class="fas fa-user-circle"></i>
              </div>
              <div class="user-details">
                <h3>{{ authStore.currentUser?.name || 'Utilisateur' }}</h3>
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
        </div>

        <!-- Mode Connexion -->
        <div v-else-if="currentMode === 'login'">
          <p>Entrez votre email et mot de passe pour vous connecter à votre compte.</p>
          
          <!-- Comptes de démonstration -->
          <div class="demo-accounts">
            <h4>📋 Comptes de démonstration :</h4>
            <div class="demo-account">
              <strong>Utilisateur :</strong> olivier@tarte.fr / <em>mot de passe quelconque</em>
            </div>
            <div class="demo-account">
              <strong>Admin :</strong> olivier-admin@tarte.fr / <em>mot de passe quelconque</em>
            </div>
            <div class="demo-account">
              <strong>Admin :</strong> admin.tarte@fr / <em>mot de passe : admin123</em>
            </div>
          </div>
          
          <!-- Message d'erreur/succès -->
          <div v-if="message" :class="['message', messageType]">
            {{ message }}
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="loginForm.email"
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
                v-model="loginForm.password"
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
            <a href="#" class="text-indigo-600 hover:underline" @click.prevent="switchToRegister">Créez-en un</a>
          </p>
        </div>

        <!-- Mode Inscription -->
        <div v-else>
          <p>Remplissez les informations ci-dessous pour créer votre compte.</p>
          
          <div v-if="message" :class="['message', messageType]">
            {{ message }}
          </div>

          <form @submit.prevent="handleRegister" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
              <input
                v-model="registerForm.name"
                type="text"
                id="name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Entrez votre nom"
                required
              />
            </div>
            
            <div>
              <label for="registerEmail" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                v-model="registerForm.email"
                type="email"
                id="registerEmail"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Entrez votre email"
                autocomplete="username"
                required
              />
            </div>
            
            <div>
              <label for="registerPassword" class="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                v-model="registerForm.password"
                type="password"
                id="registerPassword"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Entrez votre mot de passe"
                autocomplete="new-password"
                required
              />
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                id="confirmPassword"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Confirmez votre mot de passe"
                autocomplete="new-password"
                required
              />
            </div>
            
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span v-if="!isLoading">Créer un compte</span>
              <span v-else>Création...</span>
            </button>
          </form>

          <p class="text-sm text-center mt-4">
            Vous avez déjà un compte ? <a @click="switchToLogin" class="text-indigo-600 hover:underline">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const authStore = useAuthStore()
const isLoading = ref(false)
const isMobile = ref(false)
const currentMode = ref<'login' | 'register' | 'account'>('login')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const closeLogin = () => {
  emit('close')
}

const getHeaderTitle = () => {
  if (currentMode.value === 'account') return 'Mon Compte'
  if (currentMode.value === 'login') return 'Connexion'
  return 'Créer un compte'
}

const switchToRegister = () => {
  currentMode.value = 'register'
  message.value = ''
}

const switchToLogin = () => {
  currentMode.value = 'login'
  message.value = ''
}

const switchToAccount = () => {
  currentMode.value = 'account'
  message.value = ''
}

const handleLogout = () => {
  authStore.logout()
  closeLogin()
}

const maskEmail = (email: string | undefined) => {
  if (!email) return ''
  const [local, domain] = email.split('@')
  return `${local.charAt(0)}***@${domain}`
}

const getMemberSince = () => {
  if (!authStore.currentUser?.dateCreation) return 'récemment'
  const date = new Date(authStore.currentUser.dateCreation)
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

// Surveiller l'état de connexion pour basculer automatiquement vers le mode compte
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    switchToAccount()
  } else {
    switchToLogin()
  }
})

const handleLogin = async () => {
  if (!loginForm.email || !loginForm.password) {
    message.value = 'Veuillez remplir tous les champs'
    messageType.value = 'error'
    return
  }

  isLoading.value = true
  message.value = ''
  
  try {
    const result = await authStore.login({
      email: loginForm.email,
      password: loginForm.password
    })
    
    if (result.success) {
      message.value = result.message
      messageType.value = 'success'
      // Le mode compte sera automatiquement activé par le watcher
    } else {
      message.value = result.message
      messageType.value = 'error'
    }
  } catch (error) {
    console.error('Erreur de connexion:', error)
    message.value = 'Erreur lors de la connexion'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
    message.value = 'Veuillez remplir tous les champs'
    messageType.value = 'error'
    return
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    message.value = 'Les mots de passe ne correspondent pas'
    messageType.value = 'error'
    return
  }

  isLoading.value = true
  message.value = ''
  
  try {
    await authStore.register(registerForm.name, registerForm.email, registerForm.password)
    message.value = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.'
    messageType.value = 'success'
    
    // Réinitialiser le formulaire
    registerForm.name = ''
    registerForm.email = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    
    // Basculer vers le mode connexion après 2 secondes
    setTimeout(() => {
      switchToLogin()
    }, 2000)
    
  } catch (error) {
    console.error('Erreur d\'inscription:', error)
    message.value = 'Erreur lors de la création du compte. Veuillez réessayer.'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Vérifier l'état de connexion au montage
  if (authStore.isAuthenticated) {
    switchToAccount()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
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

.demo-accounts {
  background: rgba(255, 111, 97, 0.1);
  border: 1px solid rgba(255, 111, 97, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.demo-accounts h4 {
  margin: 0 0 0.75rem 0;
  color: #ff6f61;
  font-size: 0.9rem;
  font-weight: 600;
}

.demo-account {
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.demo-account:last-child {
  margin-bottom: 0;
}

.demo-account strong {
  color: #ff6f61;
}

.demo-account em {
  color: var(--cart-text-light);
  font-style: italic;
}
</style> 
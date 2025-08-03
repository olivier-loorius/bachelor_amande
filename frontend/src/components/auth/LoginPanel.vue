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
           <!-- Message d'erreur/succès -->
           <div v-if="message" :class="['message', messageType]">
             {{ message }}
           </div>
           
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
             </div>

             <!-- Section discrète pour la déconnexion et suppression -->
             <div class="account-footer">
               <div class="footer-actions">
                 <button @click="handleLogout" class="discrete-btn logout-discrete">
                   <i class="fas fa-sign-out-alt"></i>
                   Se déconnecter
                 </button>
                 <button @click="startDeleteProcess" class="discrete-btn delete-discrete">
                   <i class="fas fa-trash-alt"></i>
                   Supprimer mon compte
                 </button>
               </div>
             </div>

             <!-- Processus de suppression intégré -->
             <div v-if="deleteStep > 0" class="delete-process">
               <div v-if="deleteStep === 1" class="delete-step">
                 <h4>Confirmer la suppression</h4>
                 <p>Cette action est irréversible. Toutes vos données seront définitivement supprimées.</p>
                 <div class="delete-actions">
                   <button @click="cancelDelete" class="cancel-discrete">
                     Annuler
                   </button>
                   <button @click="confirmDelete" class="confirm-discrete">
                     Confirmer la suppression
                   </button>
                 </div>
               </div>

               <div v-if="deleteStep === 2" class="delete-step">
                 <h4>Suppression en cours...</h4>
                 <div class="loading-spinner"></div>
                 <p>Votre compte est en cours de suppression...</p>
               </div>

               <div v-if="deleteStep === 3" class="delete-step">
                 <h4>Compte supprimé</h4>
                 <p>Votre compte a été supprimé avec succès.</p>
                 <p>Vous allez être redirigé dans quelques secondes...</p>
               </div>
             </div>
          </div>
        </div>

        <!-- Mode Connexion -->
        <div v-else-if="currentMode === 'login'">
          <p>Entrez votre email et mot de passe pour vous connecter à votre compte.</p>
          
          <!-- Message d'erreur/succès -->
          <div v-if="message" :class="['message', messageType]">
            {{ message }}
          </div>

          <form @submit.prevent="handleLogin">
            <div>
              <label for="email">Email</label>
                             <input
                 v-model="loginForm.email"
                 type="email"
                 id="email"
                 placeholder="Entrez votre email"
                 autocomplete="off"
                 required
               />
            </div>
                         <div>
               <label for="password">Mot de passe</label>
               <input
                 v-model="loginForm.password"
                 :type="showPassword ? 'text' : 'password'"
                 id="password"
                 placeholder="Entrez votre mot de passe"
                 autocomplete="off"
                 required
                 style="padding-right: 2.5rem;"
               />
               <i 
                 :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                 @click="showPassword = !showPassword"
                 style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%) translateY(12px); cursor: pointer; color: var(--text-color); font-size: 14px;"
                 :title="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
               ></i>
             </div>
            <button type="submit" :disabled="isLoading">
              {{ isLoading ? 'Connexion...' : 'Connexion' }}
            </button>
          </form>
          
          <!-- Lien d'inscription -->
          <p class="text-center">
            Vous n'avez pas de compte ?
            <a href="#" @click.prevent="switchToRegister">Créez-en un</a>
          </p>
        </div>

        <!-- Mode Inscription -->
        <div v-else>
          <p>Remplissez les informations ci-dessous pour créer votre compte.</p>
          
          <div v-if="message" :class="['message', messageType]">
            {{ message }}
          </div>

          <form @submit.prevent="handleRegister">
            <div>
              <label for="name">Nom</label>
              <input
                v-model="registerForm.name"
                type="text"
                id="name"
                placeholder="Entrez votre nom"
                required
              />
            </div>
            
            <div>
              <label for="registerEmail">Email</label>
              <input
                v-model="registerForm.email"
                type="email"
                id="registerEmail"
                placeholder="Entrez votre email"
                autocomplete="username"
                required
              />
            </div>
            
                         <div>
               <label for="registerPassword">Mot de passe</label>
               <input
                 v-model="registerForm.password"
                 :type="showPassword ? 'text' : 'password'"
                 id="registerPassword"
                 placeholder="Entrez votre mot de passe"
                 autocomplete="new-password"
                 required
                 style="padding-right: 2.5rem;"
               />
               <i 
                 :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                 @click="showPassword = !showPassword"
                 style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%) translateY(12px); cursor: pointer; color: var(--text-color); font-size: 14px;"
                 :title="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
               ></i>
             </div>
            
                         <div>
               <label for="confirmPassword">Confirmer le mot de passe</label>
               <input
                 v-model="registerForm.confirmPassword"
                 :type="showConfirmPassword ? 'text' : 'password'"
                 id="confirmPassword"
                 placeholder="Confirmez votre mot de passe"
                 autocomplete="new-password"
                 required
                 style="padding-right: 2.5rem;"
               />
               <i 
                 :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                 @click="showConfirmPassword = !showConfirmPassword"
                 style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%) translateY(12px); cursor: pointer; color: var(--text-color); font-size: 14px;"
                 :title="showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
               ></i>
             </div>
            
            <button type="submit" :disabled="isLoading">
              <span v-if="!isLoading">Créer un compte</span>
              <span v-else>Création...</span>
            </button>
          </form>

          <!-- Lien de connexion -->
          <p class="text-center">
            Vous avez déjà un compte ? 
            <a @click="switchToLogin">Se connecter</a>
          </p>
        </div>
             </div>
     </div>
   </div>
   
   
   
 </template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, watch } from 'vue'
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
}>()

const authStore = useAuthStore()
const isLoading = ref(false)
const isMobile = ref(false)
const currentMode = ref<'login' | 'register' | 'account'>('login')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showDeleteConfirmation = ref(false)
const deleteStep = ref(0) // 0: normal, 1: confirmation, 2: loading, 3: success

const loginForm = reactive({
  email: '',
  password: ''
})

// Forcer l'initialisation à vide
onMounted(() => {
  loginForm.email = ''
  loginForm.password = ''
})



const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const clearForms = () => {
  // Vider les données réactives
  loginForm.email = ''
  loginForm.password = ''
  registerForm.name = ''
  registerForm.email = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
  showPassword.value = false
  showConfirmPassword.value = false
  message.value = ''
  
  // Forcer le vidage des champs DOM immédiatement
  const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]')
  inputs.forEach((input) => {
    if (input instanceof HTMLInputElement) {
      input.value = ''
      input.setAttribute('value', '')
      input.removeAttribute('value')
      // Forcer la mise à jour du DOM
      input.dispatchEvent(new Event('input', { bubbles: true }))
      // Forcer aussi un événement change
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  })
  
  // Vider aussi après plusieurs délais pour s'assurer
  setTimeout(() => {
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]')
    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        input.value = ''
        input.setAttribute('value', '')
        input.removeAttribute('value')
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
  }, 50)
  
  setTimeout(() => {
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]')
    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        input.value = ''
        input.setAttribute('value', '')
        input.removeAttribute('value')
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
  }, 200)
  
  setTimeout(() => {
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]')
    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        input.value = ''
        input.setAttribute('value', '')
        input.removeAttribute('value')
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
  }, 500)
  
  // Vider encore après 1 seconde pour être sûr
  setTimeout(() => {
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]')
    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement) {
        input.value = ''
        input.setAttribute('value', '')
        input.removeAttribute('value')
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
  }, 1000)
}

const closeLogin = () => {
  clearForms()
  emit('close')
}

const getHeaderTitle = () => {
  if (currentMode.value === 'account') return 'Mon Compte'
  if (currentMode.value === 'login') return 'Connexion'
  return 'Créer un compte'
}

const switchToRegister = () => {
  currentMode.value = 'register'
  clearForms()
}

const switchToLogin = () => {
  currentMode.value = 'login'
  clearForms()
}

const switchToAccount = () => {
  currentMode.value = 'account'
  message.value = ''
}

const handleLogout = () => {
  // Vider les champs immédiatement avant la déconnexion
  clearForms()
  
  authStore.logout()
  
  // Vider encore après la déconnexion
  setTimeout(() => {
    clearForms()
  }, 100)
  
  closeLogin()
}

const startDeleteProcess = () => {
  deleteStep.value = 1
  
  // Scroll automatique vers la section de confirmation après un court délai
  setTimeout(() => {
    const deleteProcess = document.querySelector('.delete-process')
    if (deleteProcess) {
      deleteProcess.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }, 100)
}

const cancelDelete = () => {
  deleteStep.value = 0
}

const confirmDelete = async () => {
  deleteStep.value = 2
  
  try {
    // Appeler la fonction de suppression du store
    const result = await authStore.deleteAccount()
    
    if (result.success) {
      deleteStep.value = 3
      
                    // Afficher le message de succès dans la vue compte
              message.value = 'Compte désactivé avec succès !'
              messageType.value = 'success'
      
      // Forcer la déconnexion et fermer après un délai
      setTimeout(() => {
        authStore.logout()
        closeLogin()
        // Recharger la page pour s'assurer que tout est bien nettoyé
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }, 2000)
    } else {
      deleteStep.value = 0
      message.value = result.message || 'Erreur lors de la suppression du compte'
      messageType.value = 'error'
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error)
    deleteStep.value = 0
    message.value = 'Erreur lors de la suppression du compte'
    messageType.value = 'error'
  }
}



const handleDeleteAccount = async () => {
  try {
    isLoading.value = true
    message.value = ''
    
    // Appeler la fonction de suppression du store
    const result = await authStore.deleteAccount()
    
    if (result.success) {
      message.value = 'Compte supprimé avec succès'
      messageType.value = 'success'
      
      // Fermer la modale de confirmation
      showDeleteConfirmation.value = false
      
      // Fermer le panneau après un délai
      setTimeout(() => {
        closeLogin()
      }, 2000)
    } else {
      message.value = result.message || 'Erreur lors de la suppression du compte'
      messageType.value = 'error'
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error)
    message.value = 'Erreur lors de la suppression du compte'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}

const maskEmail = (email: string | undefined) => {
  if (!email) return ''
  const [local, domain] = email.split('@')
  return `${local.charAt(0)}***@${domain}`
}

const getMemberSince = () => {
  if (!authStore.currentUser?.created_at) return 'récemment'
  const date = new Date(authStore.currentUser.created_at)
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

// Surveiller l'état de connexion pour vider les champs lors de la déconnexion
watch(() => authStore.isAuthenticated, (isAuthenticated, wasAuthenticated) => {
  if (!isAuthenticated && props.isOpen) {
    // Si le panneau est ouvert mais l'utilisateur n'est pas connecté
    switchToLogin()
    
    // Si l'utilisateur était connecté et maintenant déconnecté, vider les champs
    if (wasAuthenticated) {
      clearForms()
    }
  }
})

// Surveiller l'ouverture du panneau pour déterminer le mode d'affichage
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (authStore.isAuthenticated) {
      // Si l'utilisateur est connecté, afficher la page compte
      switchToAccount()
    } else {
      // Si l'utilisateur n'est pas connecté, afficher le formulaire de connexion
      switchToLogin()
      // Vider les champs immédiatement et après plusieurs délais
      clearForms()
      setTimeout(() => clearForms(), 50)
      setTimeout(() => clearForms(), 200)
      setTimeout(() => clearForms(), 500)
    }
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
      // Fermer automatiquement le panneau après connexion réussie
      setTimeout(() => {
        closeLogin()
      }, 1000)
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
    message.value = 'Compte créé avec succès !'
    messageType.value = 'success'
    
    // Fermer automatiquement le panneau après création réussie
    setTimeout(() => {
      closeLogin()
    }, 1500)
    
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
  
  // Ne pas basculer automatiquement vers le mode compte au montage
  // Le mode compte ne sera affiché que si l'utilisateur clique sur le CTA connexion
  // et qu'il est déjà connecté
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
  height: 100%;
  min-height: 100%;
  max-height: none;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 99999;
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  overflow: hidden;
}

.login-overlay.active {
  opacity: 1;
  visibility: visible;
  height: 100%;
  min-height: 100%;
  max-height: none;
}

/* Forcer l'overlay à couvrir tout le contenu scrollable */
.login-overlay.active {
  height: 100vh !important;
  min-height: 100vh !important;
  max-height: 100vh !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  z-index: 99999 !important;
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
  top: 0;
  border-radius: 0 0 20px 20px;
  transform: translateY(-100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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

form div {
  position: relative;
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

.text-center {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.text-center a {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: bold;
}

.text-center a:hover {
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

.delete-btn {
  background: #dc3545;
  color: white;
  padding: 0.75rem 1.5rem;
  border: 2px solid #dc3545;
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

.delete-btn:hover {
  background: transparent;
  color: #dc3545;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* Styles pour le footer discret */
.account-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(144, 174, 176, 0.2);
}

.footer-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.discrete-btn {
  background: none;
  border: none;
  color: var(--cart-text-light);
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.discrete-btn:hover {
  color: var(--text-color);
  background: rgba(144, 174, 176, 0.1);
}

.logout-discrete:hover {
  color: #ff6f61;
}

.delete-discrete:hover {
  color: #dc3545;
}

/* Styles pour le processus de suppression intégré */
.delete-process {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(144, 174, 176, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(144, 174, 176, 0.2);
}

.delete-step h4 {
  margin: 0 0 1rem 0;
  color: var(--text-color);
  font-family: var(--font-family-title);
  font-size: 1.1rem;
  font-weight: 600;
}

.delete-step p {
  margin-bottom: 1rem;
  color: var(--cart-text-light);
  font-size: 0.9rem;
  line-height: 1.4;
}

.delete-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-discrete {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid rgba(144, 174, 176, 0.3);
  border-radius: 6px;
  background: transparent;
  color: var(--text-color);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-discrete:hover {
  background: rgba(144, 174, 176, 0.1);
  border-color: rgba(144, 174, 176, 0.5);
}

.confirm-discrete {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #dc3545;
  border-radius: 6px;
  background: #dc3545;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-discrete:hover {
  background: transparent;
  color: #dc3545;
}

/* Spinner de chargement */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(144, 174, 176, 0.3);
  border-top: 2px solid #ff6f61;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 1rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


</style> 
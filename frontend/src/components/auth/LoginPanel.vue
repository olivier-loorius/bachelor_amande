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
                        <h3>{{ authStore.user?.name || 'Utilisateur' }}</h3>
        <p class="user-email">{{ maskEmail(authStore.user?.email) }}</p>
                <span class="member-since">Membre depuis {{ getMemberSince() }}</span>
              </div>
            </div>

                         <div class="account-actions">
               <button 
                 v-if="authStore.user?.role !== 'admin'"
                 @click="openEditProfile" 
                 class="account-btn"
               >
                 <i class="fas fa-user-edit"></i>
                 Modifier mon profil
               </button>
               <button @click="redirectToConstruction('commandes')" class="account-btn">
                 <i class="fas fa-shopping-bag"></i>
                 Mes commandes
               </button>
               <button @click="redirectToConstruction('favoris')" class="account-btn">
                 <i class="fas fa-heart"></i>
                 Mes favoris
               </button>
               <button @click="redirectToConstruction('parametres')" class="account-btn">
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
                 <button 
                   v-if="authStore.user?.role !== 'admin'"
                   @click="startDeleteProcess" 
                   class="discrete-btn delete-discrete"
                 >
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

        <!-- Mode Vérification du mot de passe -->
        <div v-else-if="currentMode === 'password-verification'">
          
          <!-- Message d'erreur/succès -->
          <div v-if="message" :class="['message', messageType]">
            {{ message }}
          </div>

          <form @submit.prevent="verifyPassword" class="verification-form">
            <div class="form-group">
              <label for="current-password">Mot de passe actuel</label>
              <div class="input-wrapper">
                <input
                  v-model="passwordVerification"
                  :type="showPasswordVerification ? 'text' : 'password'"
                  id="current-password"
                  placeholder="Entrez votre mot de passe actuel"
                  autocomplete="current-password"
                  required
                  class="form-input"
                  style="padding-right: 2.5rem;"
                />
                <i 
                  :class="showPasswordVerification ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  @click="showPasswordVerification = !showPasswordVerification"
                  style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); cursor: pointer; color: var(--text-color); font-size: 14px;"
                  :title="showPasswordVerification ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                ></i>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" :disabled="isLoading" class="btn-primary">
                <i class="fas fa-check"></i>
                {{ isLoading ? 'Vérification...' : 'Confirmer' }}
              </button>
              
              <button type="button" @click="handleBackFromVerification" class="btn-secondary">
                <i class="fas fa-arrow-left"></i>
                Retour
              </button>
            </div>
          </form>
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
                 :placeholder="authStore.isLoggedIn ? 'Laissez vide pour ne pas changer' : 'Entrez votre mot de passe'"
                 autocomplete="new-password"
                 :required="!authStore.isLoggedIn"
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
                 :placeholder="authStore.isLoggedIn ? 'Confirmez si vous changez le mot de passe' : 'Confirmez votre mot de passe'"
                 autocomplete="new-password"
                 :required="!authStore.isLoggedIn"
                 style="padding-right: 2.5rem;"
               />
               <i 
                 :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                 @click="showConfirmPassword = !showConfirmPassword"
                 style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%) translateY(12px); cursor: pointer; color: var(--text-color); font-size: 14px;"
                 :title="showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
               ></i>
             </div>
            
            <div class="form-actions">
              <button type="submit" :disabled="isLoading" class="btn-primary">
                <i :class="authStore.isLoggedIn ? 'fas fa-edit' : 'fas fa-user-plus'"></i>
                <span v-if="!isLoading">{{ authStore.isLoggedIn ? 'Mettre à jour' : 'Créer un compte' }}</span>
                <span v-else>{{ authStore.isLoggedIn ? 'Mise à jour...' : 'Création...' }}</span>
              </button>
              
              <button v-if="authStore.isLoggedIn" type="button" @click="currentMode = 'account'" class="btn-secondary">
                <i class="fas fa-arrow-left"></i>
                Annuler
              </button>
            </div>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/services/supabaseService'

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
const router = useRouter()
const isLoading = ref(false)
const isMobile = ref(false)
const currentMode = ref<'login' | 'register' | 'account' | 'password-verification'>('login')
const message = ref('')
const messageType = ref<'success' | 'error' | 'info'>('success')
const passwordVerification = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showPasswordVerification = ref(false)
const showDeleteConfirmation = ref(false)
const deleteStep = ref(0) // 0: normal, 1: confirmation, 2: loading, 3: success
const showEditProfile = ref(false)

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
  
  // Déconnexion avec redirection
  authStore.logout(router)
  
  // Vider encore après la déconnexion
  setTimeout(() => {
    clearForms()
  }, 100)
  
  closeLogin()
  
  // Forcer un refresh pour s'assurer que la vue se met à jour
  setTimeout(() => {
    window.location.reload()
  }, 500)
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

const openEditProfile = () => {
  // Vérification de sécurité : s'assurer que l'utilisateur est connecté
  if (!authStore.isLoggedIn || !authStore.user) {
    message.value = 'Vous devez être connecté pour modifier votre profil'
    messageType.value = 'error'
    return
  }
  
  // Vérification de sécurité : empêcher les admins de modifier leur profil
  if (authStore.user.role === 'admin') {
    message.value = 'Les administrateurs ne peuvent pas modifier leur profil depuis l\'interface pour des raisons de sécurité. Contactez le support technique.'
    messageType.value = 'error'
    return
  }
  
  // Vider le formulaire de vérification
  passwordVerification.value = ''
  showPasswordVerification.value = false
  
  // Demander d'abord le mot de passe actuel
  currentMode.value = 'password-verification'
  message.value = 'Veuillez entrer votre mot de passe actuel pour modifier votre profil'
  messageType.value = 'info'
}

const handleBackFromVerification = () => {
  // Vider le formulaire de vérification
  passwordVerification.value = ''
  showPasswordVerification.value = false
  message.value = ''
  
  // Retourner au mode compte
  currentMode.value = 'account'
}

const verifyPassword = async () => {
  if (!passwordVerification.value.trim()) {
    message.value = 'Veuillez entrer votre mot de passe'
    messageType.value = 'error'
    return
  }

  try {
    isLoading.value = true
    message.value = 'Vérification en cours...'
    
    // Vérification de sécurité supplémentaire
    if (!authStore.user?.email) {
      message.value = 'Erreur : Impossible de récupérer vos informations'
      messageType.value = 'error'
      return
    }
    
    // Vérifier le mot de passe avec Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: authStore.user.email,
      password: passwordVerification.value
    })
    
    if (error) {
      message.value = 'Mot de passe incorrect'
      messageType.value = 'error'
      passwordVerification.value = ''
    } else {
      // Mot de passe correct, ouvrir la modification
      currentMode.value = 'register'
      
      // Pré-remplir le formulaire avec les données actuelles
      registerForm.name = authStore.user?.name || ''
      registerForm.email = authStore.user?.email || ''
      registerForm.password = '' // Laisser vide pour indiquer qu'il est optionnel
      registerForm.confirmPassword = '' // Laisser vide pour indiquer qu'il est optionnel
      
      // Message informatif
      message.value = 'Modifiez vos informations. Le mot de passe est optionnel - laissez vide pour ne pas le changer.'
      messageType.value = 'info'
    }
  } catch (error) {
    message.value = 'Erreur lors de la vérification'
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
  if (!authStore.user?.created_at) return 'récemment'
  const date = new Date(authStore.user.created_at)
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

// Surveiller l'état de connexion pour vider les champs lors de la déconnexion
watch(() => authStore.isLoggedIn, (isAuthenticated, wasAuthenticated) => {
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
    if (authStore.isLoggedIn) {
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
  // Vérification de sécurité : s'assurer que l'utilisateur est connecté pour les modifications
  if (authStore.isLoggedIn && (!authStore.user || !authStore.user.id)) {
    message.value = 'Erreur de sécurité : Impossible de récupérer vos informations'
    messageType.value = 'error'
    return
  }
  
  // Si l'utilisateur est connecté, c'est une mise à jour
  if (authStore.isLoggedIn) {
    // Validation pour la mise à jour (mot de passe optionnel)
    if (!registerForm.name || !registerForm.email) {
      message.value = 'Veuillez remplir le nom et l\'email'
      messageType.value = 'error'
      return
    }
    
    // Si un mot de passe est saisi, vérifier qu'il est confirmé
    if (registerForm.password && !registerForm.confirmPassword) {
      message.value = 'Veuillez confirmer votre nouveau mot de passe'
      messageType.value = 'error'
      return
    }
    
    if (registerForm.password && registerForm.password !== registerForm.confirmPassword) {
      message.value = 'Les mots de passe ne correspondent pas'
      messageType.value = 'error'
      return
    }
  } else {
    // Validation pour l'inscription (tous les champs requis)
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
  }

  isLoading.value = true
  message.value = ''
  
  try {
    // Si l'utilisateur est connecté, c'est une mise à jour
    if (authStore.isLoggedIn) {
      // Mise à jour du nom
      if (registerForm.name !== authStore.user?.name) {
        const { error } = await supabase
          .from('users')
          .update({ 
            name: registerForm.name.trim(),
            updated_at: new Date().toISOString()
          })
          .eq('id', authStore.user?.id)
        
        if (error) {
          message.value = 'Erreur lors de la modification du nom'
          messageType.value = 'error'
          return
        }
        
        // Mettre à jour le store local
        if (authStore.user) {
          authStore.user.name = registerForm.name.trim()
        }
        
        // Rafraîchir les données utilisateur depuis Supabase
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authStore.user?.id)
          .single()
        
        if (!userError && userData) {
          // Mettre à jour le store avec les nouvelles données
          authStore.user = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            created_at: userData.created_at
          }
        }
      }
      
      // Mise à jour du mot de passe si fourni
      if (registerForm.password) {
        const { error } = await supabase.auth.updateUser({ 
          password: registerForm.password 
        })
        
        if (error) {
          message.value = 'Erreur lors du changement de mot de passe'
          messageType.value = 'error'
          return
        }
      }
      
      message.value = 'Profil mis à jour avec succès !'
      messageType.value = 'success'
      
      // Émettre un événement pour rafraîchir le dashboard admin
      window.dispatchEvent(new CustomEvent('profile-updated'))
      
      // Fermer automatiquement le panneau après modification réussie
      setTimeout(() => {
        closeLogin()
      }, 1500)
    } else {
      // Inscription normale
      await authStore.register({
        nom: registerForm.name,
        email: registerForm.email,
        password: registerForm.password
      })
      message.value = 'Compte créé avec succès !'
      messageType.value = 'success'
      
      // Fermer automatiquement le panneau après création réussie
      setTimeout(() => {
        closeLogin()
      }, 1500)
    }
    
  } catch (error) {
    console.error('Erreur:', error)
    message.value = authStore.isLoggedIn ? 'Erreur lors de la modification' : 'Erreur lors de la création du compte. Veuillez réessayer.'
    messageType.value = 'error'
  } finally {
    isLoading.value = false
  }
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Fonction pour rediriger vers la page en construction avec fermeture automatique
const redirectToConstruction = (section: string) => {
  // Fermer le panneau de connexion
  closeLogin()
  
  // Rediriger vers la page en construction
  router.push('/en-construction')
  
  // Fermer automatiquement après 4 secondes et retourner à l'accueil
  setTimeout(() => {
    router.push('/')
  }, 4000)
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
  height: 100vh;
  position: fixed;
  top: 0;
  border-radius: 0 0 20px 20px;
  transform: translateY(-100%);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
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
  min-height: 20px; /* Hauteur minimale pour éviter le décalage */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease; /* Transition fluide */
  opacity: 1;
  transform: translateY(0);
}

.message:empty {
  min-height: 0;
  margin-bottom: 0;
  opacity: 0;
  transform: translateY(-10px);
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

.message.info {
  background: rgba(255, 111, 97, 0.1);
  color: #ff6f61;
  border: 1px solid rgba(255, 111, 97, 0.3);
}



.verification-form {
  margin-top: var(--spacing-lg);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  color: var(--text-color);
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-md) 2.5rem;
  border: 2px solid #e0e0e0;
  border-radius: var(--btn-radius);
  font-family: var(--font-family-text);
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: var(--white);
}

.form-input:focus {
  outline: none;
  border-color: #ff6f61;
  box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.1);
}

.input-icon {
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.btn-primary {
  background: #ff6f61;
  color: var(--white);
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--btn-radius);
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  justify-content: center;
}

.btn-primary:hover:not(:disabled) {
  background: #e55a4f;
  box-shadow: 0 4px 12px rgba(255, 111, 97, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: transparent;
  color: #ff6f61;
  border: none;
  border-bottom: 2px solid #ff6f61;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--btn-radius);
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  justify-content: center;
}

.btn-secondary:hover {
  background: #ff6f61;
  color: var(--white);
  box-shadow: 0 4px 12px rgba(255, 111, 97, 0.3);
}

/* Responsive pour la vérification */
@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
    margin-top: 1rem;
  }
  
  .login-panel.mobile-view {
    height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
  }
  
  .login-content {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
  
  form {
    gap: 0.8rem;
  }
  
  .btn-primary, .btn-secondary {
    padding: 0.8rem 1.2rem;
    font-size: 0.9rem;
  }
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

.account-btn:focus {
  outline: none;
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

.logout-btn:focus {
  outline: none;
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

.delete-btn:focus {
  outline: none;
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

.discrete-btn:focus {
  outline: none;
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
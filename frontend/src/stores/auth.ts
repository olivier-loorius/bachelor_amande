import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabaseService'
import { registerUser, loginUser, getUserInfos, logoutUser } from '@/services/authService'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  created_at: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const isAuthenticated = computed(() => !!user.value)
  const currentUser = computed(() => user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Inscription
  const register = async (nom: string, email: string, password: string) => {
    isLoading.value = true
    
    try {
      const authData = await registerUser({ email, password, name: nom })
      
      // Le trigger créera automatiquement l'utilisateur dans public.users
      // On récupère les infos utilisateur
      const userInfos = await getUserInfos(authData.user.id)
      
      user.value = {
        id: userInfos.id,
        email: userInfos.email,
        name: userInfos.name,
        role: userInfos.role,
        created_at: userInfos.created_at
      }
      
      return { 
        success: true, 
        message: userInfos.role === 'admin' ? 'Compte admin créé avec succès' : 'Compte créé avec succès' 
      }
    } catch (error) {
      console.error('Erreur register:', error)
      return { success: false, message: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // Connexion
  const login = async (credentials: { email: string; password: string }) => {
    isLoading.value = true
    
    try {
      const authData = await loginUser(credentials)
      const userInfos = await getUserInfos(authData.user.id)
      
      user.value = {
        id: userInfos.id,
        email: userInfos.email,
        name: userInfos.name,
        role: userInfos.role,
        created_at: userInfos.created_at
      }
      
      return { 
        success: true, 
        message: userInfos.role === 'admin' ? 'Connexion admin réussie' : 'Connexion réussie' 
      }
    } catch (error) {
      return { success: false, message: error.message }
    } finally {
      isLoading.value = false
    }
  }

  // Déconnexion
  const logout = async (router?: any) => {
    try {
      await logoutUser()
      user.value = null
      if (router) {
        router.push('/')
      }
    } catch (error) {
      console.error('Erreur logout:', error)
    }
  }

  // Suppression de compte
  const deleteAccount = async () => {
    try {
      console.log('🗑️ Début de la suppression du compte...')
      
      if (!user.value) {
        throw new Error('Aucun utilisateur connecté')
      }

      console.log('👤 Utilisateur à supprimer:', user.value.email)

                    // Désactiver le compte directement avec Supabase
      const { error } = await supabase
        .from('users')
        .update({ deleted: true })
        .eq('id', user.value.id)

      if (error) {
        throw new Error('Erreur lors de la désactivation: ' + error.message)
      }

      console.log('✅ Compte désactivé avec succès')

      // Déconnexion après soft delete réussi
      await logoutUser()
      user.value = null

      return { 
        success: true, 
        message: 'Compte désactivé avec succès' 
      }
    } catch (error) {
      console.error('❌ Erreur deleteAccount:', error)
      return { 
        success: false, 
        message: error.message || 'Erreur lors de la suppression du compte' 
      }
    }
  }

  // Initialiser la session
  const initialize = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const userInfos = await getUserInfos(session.user.id)
        user.value = {
          id: userInfos.id,
          email: userInfos.email,
          name: userInfos.name,
          role: userInfos.role,
          created_at: userInfos.created_at
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error)
    }
  }

  // Initialiser au démarrage
  // initialize() // Commenté pour éviter la connexion automatique

  return {
    user,
    isLoading,
    isLoggedIn,
    isAuthenticated,
    currentUser,
    isAdmin,
    login,
    register,
    logout,
    deleteAccount
  }
}) 
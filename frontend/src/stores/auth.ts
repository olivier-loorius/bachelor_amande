import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dataService } from '@/services/dataService'
import { jwtService } from '@/services/jwtService'

interface User {
  id: string
  email: string
  nom: string
  dateCreation: string
  role: 'user' | 'admin'
  panierId: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  nom: string
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const currentUser = computed(() => user.value)

  const initialize = () => {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken && !jwtService.isTokenExpired(storedToken)) {
      const userData = jwtService.getUserFromToken(storedToken)
      if (userData) {
        user.value = userData
        token.value = storedToken
      }
    } else {
      logout()
    }
  }

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    
    try {
      const existingUser = dataService.getUserByEmail(credentials.email)
      
      if (!existingUser) {
        return {
          success: false,
          message: 'Email ou mot de passe incorrect'
        }
      }

      const tokenData = {
        id: existingUser.id,
        email: existingUser.email,
        nom: existingUser.nom,
        role: existingUser.role,
        panierId: existingUser.panierId
      }
      
      const newToken = jwtService.generateToken(tokenData)
      localStorage.setItem('auth_token', newToken)
      
      user.value = existingUser
      token.value = newToken
      
      return {
        success: true,
        message: 'Connexion réussie'
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      return {
        success: false,
        message: 'Erreur lors de la connexion'
      }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    isLoading.value = true
    
    try {
      const existingUser = dataService.getUserByEmail(credentials.email)
      
      if (existingUser) {
        return {
          success: false,
          message: 'Un compte avec cet email existe déjà'
        }
      }

      const newUser = dataService.createUser({
        email: credentials.email,
        nom: credentials.nom,
        role: 'user'
      })

      const tokenData = {
        id: newUser.id,
        email: newUser.email,
        nom: newUser.nom,
        role: newUser.role,
        panierId: newUser.panierId
      }
      
      const newToken = jwtService.generateToken(tokenData)
      localStorage.setItem('auth_token', newToken)
      
      user.value = newUser
      token.value = newToken
      
      return {
        success: true,
        message: 'Compte créé avec succès'
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      return {
        success: false,
        message: 'Erreur lors de la création du compte'
      }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('panier')
    
    user.value = null
    token.value = null
  }

  const refreshToken = () => {
    if (!token.value) return false
    
    const newToken = jwtService.refreshToken(token.value)
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
      token.value = newToken
      return true
    }
    
    logout()
    return false
  }

  const checkTokenStatus = () => {
    if (!token.value) return false
    
    if (jwtService.isTokenExpired(token.value)) {
      logout()
      return false
    }
    
    return true
  }

  initialize()

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    currentUser,
    login,
    register,
    logout,
    refreshToken,
    checkTokenStatus
  }
}) 
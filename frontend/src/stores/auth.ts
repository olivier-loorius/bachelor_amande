import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  email: string
  nom?: string
  prenom?: string
  dateCreation: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResult {
  success: boolean
  message: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const currentUser = computed(() => user.value)

  // Actions
  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    isLoading.value = true
    
    try {
      // Simulate API call - replace with actual API endpoint
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // })
      
      // For now, simulate successful login with mock data
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      
      // Mock successful login
      if (credentials.email && credentials.password) {
        const mockUser: User = {
          id: 1,
          email: credentials.email,
          nom: 'Doe',
          prenom: 'John',
          dateCreation: new Date().toISOString()
        }
        
        const mockToken = 'mock-jwt-token-' + Date.now()
        
        user.value = mockUser
        token.value = mockToken
        
        // Store in localStorage for persistence
        localStorage.setItem('auth_user', JSON.stringify(mockUser))
        localStorage.setItem('auth_token', mockToken)
        
        return {
          success: true,
          message: 'Connexion réussie !'
        }
      } else {
        return {
          success: false,
          message: 'Email et mot de passe requis'
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'Erreur lors de la connexion'
      }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    
    // Clear localStorage
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  const initializeAuth = () => {
    // Check for existing auth data in localStorage
    const storedUser = localStorage.getItem('auth_user')
    const storedToken = localStorage.getItem('auth_token')
    
    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser)
        token.value = storedToken
      } catch (error) {
        console.error('Error parsing stored auth data:', error)
        logout()
      }
    }
  }

  // Initialize auth state on store creation
  initializeAuth()

  return {
    // State
    user,
    token,
    isLoading,
    
    // Getters
    isAuthenticated,
    currentUser,
    
    // Actions
    login,
    logout,
    initializeAuth
  }
}) 
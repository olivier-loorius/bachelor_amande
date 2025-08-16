import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  updated_at?: string
  deleted?: boolean
  deleted_at?: string
}

export const useAuthStore = defineStore('auth', () => {
  // COPIE EXACTE de l'état d'authentification
  const user = ref<User | null>(null)
  const isAdmin = ref(false)

  // COPIE EXACTE des computed properties
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || 'user')

  // COPIE EXACTE des actions d'authentification
  const setUser = (userData: any) => {
    user.value = userData
    isAdmin.value = userData?.role === 'admin'
  }

  const clearUser = () => {
    user.value = null
    isAdmin.value = false
  }

  const checkAdminStatus = () => {
    isAdmin.value = user.value?.role === 'admin'
  }

  return {
    // État
    user,
    isAdmin,
    
    // Computed properties
    isAuthenticated,
    userRole,
    
    // Actions
    setUser,
    clearUser,
    checkAdminStatus
  }
})

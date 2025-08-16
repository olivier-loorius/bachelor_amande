import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

// COPIE EXACTE de la logique d'authentification d'AdminView.vue
export const requireAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    // Rediriger vers la page de connexion si non authentifié
    next('/login')
    return
  }
  
  next()
}

export const requireAdmin = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    // Rediriger vers la page de connexion si non authentifié
    next('/login')
    return
  }
  
  if (!authStore.isAdmin) {
    // Rediriger vers la page d'accueil si non admin
    next('/')
    return
  }
  
  next()
}

export const requireGuest = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated) {
    // Rediriger vers le dashboard si déjà authentifié
    next('/admin')
    return
  }
  
  next()
}

// Fonction utilitaire pour vérifier l'authentification
export const checkAuth = () => {
  const authStore = useAuthStore()
  return authStore.isAuthenticated
}

// Fonction utilitaire pour vérifier le statut admin
export const checkAdmin = () => {
  const authStore = useAuthStore()
  return authStore.isAdmin
}

// Fonction utilitaire pour obtenir l'utilisateur actuel
export const getCurrentUser = () => {
  const authStore = useAuthStore()
  return authStore.user
}

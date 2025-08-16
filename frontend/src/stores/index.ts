import { createPinia } from 'pinia'

export const pinia = createPinia()

// Export des stores pour un accès facile
export { useAuthStore } from './useAuthStore'
export { useUserStore } from './useUserStore'
export { useProductStore } from './useProductStore'

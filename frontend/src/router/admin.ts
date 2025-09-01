import type { RouteRecordRaw } from 'vue-router'
import { requireAdmin } from '@/utils/authGuard'

// COPIE EXACTE structure routes admin
export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'AdminHome',
    component: () => import('@/views/admin/AdminHome.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Dashboard Administrateur'
    },
    beforeEnter: requireAdmin
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: () => import('@/views/admin/ProductsView.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Gestion des Produits'
    },
    beforeEnter: requireAdmin
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/admin/UsersView.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Gestion des Utilisateurs'
    },
    beforeEnter: requireAdmin
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: () => import('@/views/admin/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Paramètres'
    },
    beforeEnter: requireAdmin
  }
]

// Fonction pour ajouter les routes admin au router principal
export const addAdminRoutes = (router: any) => {
  adminRoutes.forEach(route => {
    router.addRoute(route)
  })
}

// Fonction pour vérifier si une route est admin
export const isAdminRoute = (path: string): boolean => {
  return path.startsWith('/admin')
}

// Fonction pour obtenir le titre d'une route admin
export const getAdminRouteTitle = (path: string): string => {
  const route = adminRoutes.find(r => r.path === path)
  return route?.meta?.title as string || 'Administration'
}

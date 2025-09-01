import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/catalogue/HomeView.vue'
import ActualiteView from '@/views/info/ActualiteView.vue'
import MentionsLegales from '@/views/info/MentionsLegales.vue'
import ContactView from '@/views/info/ContactView.vue'
import CGVView from '@/views/info/CGVView.vue'
import PanierView from '@/views/panier/Panier.vue'
import LoginView from '@/views/auth/LoginView.vue'
import ErrorView from '@/views/utils/ErrorView.vue'
import ComposerView from '@/views/composer/ComposerView.vue'
import CatalogueView from '@/views/catalogue/CatalogueView.vue'
import ConstructionView from '@/views/utils/ConstructionView.vue'
import EnConstructionView from '@/views/EnConstructionView.vue'
import AdminHome from '@/views/admin/AdminHome.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/actualite',
    name: 'actualite',
    component: ActualiteView,
  },
  {
    path: '/actualite/:id',
    name: 'actualite-detail',
    component: ErrorView,
    props: true,
    meta: {
      title: 'Page non trouvée - Amande Pâtisserie',
    },
  },
  {
    path: '/mentions-legales',
    name: 'mentions-legales',
    component: MentionsLegales,
    meta: {
      title: 'Mentions Légales - Amande Pâtisserie',
    },
  },
  {
    path: '/cgv',
    name: 'cgv',
    component: CGVView,
    meta: {
      title: 'CGV - Amande Pâtisserie',
    },
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView,
    meta: {
      title: 'Contact - Amande Pâtisserie',
    },
  },
  {
    path: '/panier',
    name: 'panier',
    component: PanierView,
    meta: {
      title: 'Panier - Amande Pâtisserie',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      title: 'Connexion - Amande Pâtisserie',
    },
  },
  {
    path: '/composer',
    name: 'composer',
    component: ComposerView,
    meta: {
      title: 'Composer - Amande Pâtisserie',
    },
  },
  {
    path: '/catalogue',
    name: 'catalogue',
    component: CatalogueView,
    meta: {
      title: 'Catalogue - Amande Pâtisserie',
    },
  },
  {
    path: '/not-found',
    name: 'not-found',
    component: ErrorView,
    meta: {
      title: 'Page non trouvée - Amande Pâtisserie',
    },
  },
  {
    path: '/construction',
    name: 'construction',
    component: ConstructionView,
    meta: {
      title: 'Page en construction - Amande Pâtisserie',
    },
  },
  {
    path: '/en-construction',
    name: 'en-construction',
    component: EnConstructionView,
    meta: {
      title: 'Page en construction - Amande Pâtisserie',
    },
  },
  {
    path: '/reseau-en-construction/:reseau',
    name: 'reseau-en-construction',
    component: EnConstructionView,
    props: true,
    meta: {
      title: 'Page en construction - Amande Pâtisserie',
    },
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminHome,
    meta: {
      title: 'Dashboard Admin - Amande Pâtisserie',
      requiresAuth: true,
      requiresAdmin: true
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/not-found',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const title = to.meta?.title || 'Amande Pâtisserie'
  document.title = typeof title === 'string' ? title : 'Amande Pâtisserie'
  window.scrollTo(0, 0)
  
  // Protection des routes admin
  if (to.meta?.requiresAdmin) {
    // Importer le store auth
    const { useAuthStore } = await import('@/stores/auth')
    const authStore = useAuthStore()
    
    if (!authStore.user || !authStore.isAdmin) {
      console.log('❌ Accès admin refusé, redirection vers /')
      next('/')
      return
    }
  }
  
  next()
})

export default router

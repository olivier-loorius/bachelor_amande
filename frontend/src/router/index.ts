import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ActualiteView from '@/views/ActualiteView.vue'
import MentionsLegales from '@/views/MentionsLegales.vue'
import ContactView from '@/views/ContactView.vue'
import CGVView from '@/views/CGVView.vue'
import PanierView from '@/views/Panier.vue'
import LoginView from '@/views/LoginView.vue' // Importation du composant ConnexionView
import ErrorView from '@/views/ErrorView.vue'
import ComposerView from '@/views/ComposerView.vue'
import CatalogueView from '@/views/CatalogueView.vue'

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
    path: '/:pathMatch(.*)*',
    redirect: '/not-found',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Gestion des titres de page
router.beforeEach((to, from, next) => {
  const title = to.meta?.title || 'Amande Pâtisserie'
  document.title = typeof title === 'string' ? title : 'Amande Pâtisserie'
  
  // Scroll vers le haut de la page
  window.scrollTo(0, 0)
  
  next()
})

export default router

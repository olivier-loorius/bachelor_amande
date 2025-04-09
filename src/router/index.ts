import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ActualiteView from '@/views/actualite/ActualiteView.vue';
import MentionsLegales from '@/views/MentionsLegales.vue'; 
import ContactView from '@/views/ContactView.vue'; 
import CGVView from '@/views/CGVView.vue'

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
    path: '/mentions-legales',
    name: 'mentions-legales',
    component: MentionsLegales,
    meta: {
      title: 'Mentions Légales - Amande Pâtisserie'
    }
  },
  {
    path: '/cgv',
    name: 'cgv',
    component: CGVView, // Nouvelle route CGV
    meta: {
      title: 'CGV - Amande Pâtisserie'
    }
  },  // <-- Virgule ajoutée ici
  {
    path: '/contact',
    name: 'contact',
    component: ContactView,
    meta: {
      title: 'Contact - Amande Pâtisserie'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
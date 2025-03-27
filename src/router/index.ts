import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ActualiteView from '@/views/actualite/ActualiteView.vue'; // Assurez-vous du bon chemin

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/actualite',
    name: 'actualite',
    component: ActualiteView, // Lien vers la vue actualité
  },
  // D'autres routes...
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

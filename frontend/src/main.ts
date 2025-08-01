import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './assets/styles/main.scss'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Import des utilitaires admin (disponibles globalement) - après Pinia
// Temporairement désactivé pour éviter les erreurs
// try {
//   import('./utils/adminLogin.js')
// } catch (error) {
//   console.warn('⚠️ Erreur lors du chargement des utilitaires admin:', error)
// }

app.mount('#app')
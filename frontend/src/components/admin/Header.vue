<template>
  <header class="admin-header">
    <div class="header-content">
      <h1 class="dashboard-title">Dashboard Admin</h1>
      <p class="welcome-message">
        <strong class="welcome-bold">Bienvenue Amande !</strong><br>
        Gérez vos utilisateurs et votre contenu depuis cet espace.
      </p>
    </div>
    
         <button 
       @click="logout"
       class="admin-logout-btn"
       title="Se déconnecter"
     >
       <svg class="logout-icon" viewBox="0 0 24 24" fill="currentColor">
         <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
       </svg>
       Déconnexion
     </button>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Émettre l'événement de déconnexion vers le parent
const emit = defineEmits<{
  logout: []
}>()

const logout = () => {
  emit('logout')
}
</script>

<style lang="scss" scoped>
/* Variables admin */
$admin-primary: #383961;
$admin-danger: #dc3545;

/* Header admin - style simple et sobre */
.admin-header {
  background: $admin-primary;
  color: white;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  border-radius: 8px;
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

/* Titre principal - style scolaire */
.dashboard-title {
  font-family: 'Open Sans', sans-serif;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

/* Message de bienvenue - style sobre avec aération */
.welcome-message {
  font-family: 'Open Sans', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.9;
  margin: 0;
}

/* Mise en gras de "Bienvenue Amande !" */
.welcome-bold {
  font-weight: 700;
  font-size: 1.1rem;
  color: white;
}

/* Bouton de déconnexion - style simple */
.admin-logout-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: $admin-danger;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: 'Open Sans', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: darken($admin-danger, 10%);
  }
}

/* Icône de déconnexion SVG */
.logout-icon {
  width: 16px;
  height: 16px;
  color: white;
}

/* Responsive - règles simples et réutilisables */
@media (max-width: 768px) {
  .admin-header {
    padding: 1rem;
    text-align: center;
  }
  
  .dashboard-title {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  .welcome-message {
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  .welcome-bold {
    font-size: 1rem;
  }
  
  /* Bouton de déconnexion centré sur mobile */
  .admin-logout-btn {
    position: static;
    margin: 1rem auto 0 auto;
    width: auto;
    justify-content: center;
    min-width: 140px;
  }
}

@media (max-width: 480px) {
  /* Très petits écrans */
  .admin-header {
    padding: 0.75rem;
  }
  
  .dashboard-title {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
  
  .welcome-message {
    font-size: 0.85rem;
  }
  
  .welcome-bold {
    font-size: 0.95rem;
  }
  
  .admin-logout-btn {
    margin-top: 0.75rem;
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
    min-width: 120px;
  }
  
  .logout-icon {
    width: 14px;
    height: 14px;
  }
}
</style>

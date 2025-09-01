<template>
  <header class="admin-header">
    <div class="header-content">
      <h1 class="header-title">
        <i class="fas fa-cogs" aria-hidden="true"></i>
        Administration Amande
      </h1>
      
      <button class="logout-btn" @click="handleLogout">
        <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
        Déconnexion
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

// Déclenche la déconnexion via le store (navigation gérée par le store)
const handleLogout = () => {
  authStore.logout(router)
}
</script>

<style lang="scss" scoped>
.admin-header {
  background: #383961;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.header-title {
  font-family: var(--font-family-title);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  i {
    color: #FCD581;
  }
}

.logout-btn {
  font-family: var(--font-family-text);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  i {
    font-size: 1rem;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .admin-header {
    padding: 1rem;
  }
  
  .header-title {
    font-size: 1.2rem;
  }
  
  .logout-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>

<!-- En-tête d’administration affichant le titre et un bouton de déconnexion.
Dépend de useAuthStore et vue-router.
Action: au clic, appelle authStore.logout(router) pour gérer la déconnexion/navigation. -->
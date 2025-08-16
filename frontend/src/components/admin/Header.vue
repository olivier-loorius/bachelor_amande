<template>
  <header class="admin-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="admin-title">
          <i class="fas fa-shield-alt"></i>
          Dashboard Administrateur
        </h1>
        <p class="admin-subtitle">Gestion complète de la plateforme</p>
      </div>
      
      <div class="header-right">
        <div class="user-info">
          <div class="user-avatar">
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="user-details">
            <div class="user-name">{{ authStore.user?.name || 'Administrateur' }}</div>
            <div class="user-role">{{ authStore.user?.role || 'admin' }}</div>
          </div>
        </div>
        
        <div class="header-actions">
          <button @click="logout" class="logout-btn" title="Se déconnecter">
            <i class="fas fa-sign-out-alt"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
    
    <div class="header-stats">
      <div class="stat-item">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ userStore.activeUsers }}</div>
          <div class="stat-label">Utilisateurs Actifs</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon">
          <i class="fas fa-box"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ productStore.totalProducts }}</div>
          <div class="stat-label">Produits Configurés</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ productStore.totalPending }}</div>
          <div class="stat-label">En Attente</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ overallProgress }}%</div>
          <div class="stat-label">Progression Globale</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUserStore } from '@/stores/useUserStore'
import { useProductStore } from '@/stores/useProductStore'

// COPIE EXACTE de la logique d'AdminView.vue
const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const productStore = useProductStore()

// COPIE EXACTE des computed properties
const overallProgress = computed(() => {
  const totalPossible = 3 + 4 + 4 + 4 // fonds + douceurs + finitions
  if (totalPossible === 0) return 0
  return Math.round((productStore.totalProducts / totalPossible) * 100)
})

// COPIE EXACTE des fonctions
const logout = async () => {
  try {
    // Logique de déconnexion à implémenter
    console.log('Déconnexion...')
    authStore.clearUser()
    router.push('/')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}
</script>

<style scoped>
/* COPIE EXACTE des styles d'AdminView.vue */
.admin-header {
  background: linear-gradient(135deg, #01192b 0%, #1a2a3a 100%);
  border-bottom: 3px solid #fab92e;
  padding: 20px;
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.header-left {
  flex: 1;
}

.admin-title {
  color: #fab92e;
  margin: 0 0 5px 0;
  font-size: 2.2em;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 15px;
}

.admin-title i {
  font-size: 1.2em;
  background: #fab92e;
  color: #01192b;
  padding: 10px;
  border-radius: 50%;
}

.admin-subtitle {
  color: #fab92e80;
  margin: 0;
  font-size: 1.1em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #1a2a3a;
  padding: 15px 20px;
  border-radius: 25px;
  border: 2px solid #fab92e;
}

.user-avatar {
  font-size: 2.5em;
  color: #fab92e;
}

.user-details {
  text-align: right;
}

.user-name {
  color: #fab92e;
  font-weight: bold;
  font-size: 1.1em;
  margin-bottom: 2px;
}

.user-role {
  color: #fab92e80;
  font-size: 0.9em;
  text-transform: uppercase;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logout-btn:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
}

.logout-btn i {
  font-size: 1.1em;
}

.header-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-item {
  background: #1a2a3a;
  border: 2px solid #fab92e;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(250, 185, 46, 0.2);
  border-color: #28a745;
}

.stat-icon {
  background: #fab92e;
  color: #01192b;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5em;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  color: #fab92e;
  line-height: 1;
  margin-bottom: 5px;
}

.stat-label {
  color: #fab92e80;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .header-right {
    flex-direction: column;
    gap: 15px;
  }
  
  .user-info {
    flex-direction: column;
    text-align: center;
  }
  
  .user-details {
    text-align: center;
  }
  
  .header-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .admin-title {
    font-size: 1.8em;
    flex-direction: column;
    gap: 10px;
  }
  
  .admin-title i {
    font-size: 1em;
    padding: 8px;
  }
  
  .header-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-item {
    padding: 15px;
  }
  
  .stat-value {
    font-size: 1.5em;
  }
}
</style>

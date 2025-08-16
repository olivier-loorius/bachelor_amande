<template>
  <div class="admin-home">
    <Header />
    
    <div class="main-content">
      <Sidebar />
      
      <div class="content-area">
        <div class="welcome-section">
          <h1>Bienvenue dans votre Dashboard</h1>
          <p>Gérez vos produits et utilisateurs en toute simplicité</p>
        </div>
        
        <div class="quick-actions">
          <div class="action-card" @click="navigateToProducts">
            <div class="action-icon">
              <i class="fas fa-box"></i>
            </div>
            <div class="action-content">
              <h3>Gérer les Produits</h3>
              <p>Configurez vos fonds, douceurs et finitions</p>
              <div class="action-stats">
                <span class="stat">{{ productStore.totalProducts }} configurés</span>
                <span class="stat">{{ productStore.totalPending }} en attente</span>
              </div>
            </div>
          </div>
          
          <div class="action-card" @click="navigateToUsers">
            <div class="action-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="action-content">
              <h3>Gérer les Utilisateurs</h3>
              <p>Contrôlez les accès et permissions</p>
              <div class="action-stats">
                <span class="stat">{{ userStore.activeUsers }} actifs</span>
                <span class="stat">{{ userStore.deletedUsers }} supprimés</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="progress-overview">
          <h2>Aperçu de la Progression</h2>
          
          <div class="progress-grid">
            <div class="progress-item">
              <div class="progress-header">
                <h4>Fonds</h4>
                <span class="progress-value">{{ productStore.fondsConfigured }}/3</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: productStore.fondsProgress + '%' }"></div>
              </div>
              <div class="progress-percentage">{{ Math.round(productStore.fondsProgress) }}%</div>
            </div>
            
            <div class="progress-item">
              <div class="progress-header">
                <h4>Première Couche</h4>
                <span class="progress-value">{{ productStore.premiereCoucheConfigured }}/4</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: productStore.premiereCoucheProgress + '%' }"></div>
              </div>
              <div class="progress-percentage">{{ Math.round(productStore.premiereCoucheProgress) }}%</div>
            </div>
            
            <div class="progress-item">
              <div class="progress-header">
                <h4>Seconde Couche</h4>
                <span class="progress-value">{{ productStore.secondeCoucheConfigured }}/4</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: productStore.secondeCoucheProgress + '%' }"></div>
              </div>
              <div class="progress-percentage">{{ Math.round(productStore.secondeCoucheProgress) }}%</div>
            </div>
            
            <div class="progress-item">
              <div class="progress-header">
                <h4>Touche Finale</h4>
                <span class="progress-value">{{ productStore.toucheFinaleConfigured }}/4</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: productStore.toucheFinaleProgress + '%' }"></div>
              </div>
              <div class="progress-percentage">{{ Math.round(productStore.toucheFinaleProgress) }}%</div>
            </div>
          </div>
          
          <div class="overall-progress">
            <h3>Progression Globale</h3>
            <div class="overall-progress-bar">
              <div class="overall-progress-fill" :style="{ width: overallProgress + '%' }"></div>
            </div>
            <div class="overall-progress-text">
              <span class="overall-percentage">{{ overallProgress }}%</span>
              <span class="overall-stats">{{ productStore.totalProducts }}/15 produits configurés</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/useProductStore'
import { useUserStore } from '@/stores/useUserStore'
import Header from '@/components/admin/Header.vue'
import Sidebar from '@/components/admin/Sidebar.vue'

// COPIE EXACTE de la logique d'AdminView.vue
const router = useRouter()
const productStore = useProductStore()
const userStore = useUserStore()

// COPIE EXACTE des computed properties
const overallProgress = computed(() => {
  const totalPossible = 3 + 4 + 4 + 4 // fonds + douceurs + finitions
  if (totalPossible === 0) return 0
  return Math.round((productStore.totalProducts / totalPossible) * 100)
})

// COPIE EXACTE des fonctions
const navigateToProducts = () => {
  router.push('/admin/products')
}

const navigateToUsers = () => {
  router.push('/admin/users')
}

// COPIE EXACTE de la logique de chargement
onMounted(async () => {
  await Promise.all([
    productStore.loadProductConfig(),
    userStore.loadUsers()
  ])
})
</script>

<style scoped>
/* COPIE EXACTE des styles d'AdminView.vue */
.admin-home {
  min-height: 100vh;
  background: #01192b;
}

.main-content {
  display: flex;
  min-height: calc(100vh - 200px); /* Hauteur moins le header */
}

.content-area {
  flex: 1;
  padding: 20px;
  margin-left: 280px; /* Espace pour la sidebar */
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
}

.welcome-section h1 {
  color: #fab92e;
  font-size: 2.8em;
  margin: 0 0 15px 0;
  font-weight: bold;
}

.welcome-section p {
  color: #fab92e80;
  font-size: 1.3em;
  margin: 0;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.action-card {
  background: #1a2a3a;
  border: 2px solid #fab92e;
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 20px;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(250, 185, 46, 0.2);
  border-color: #28a745;
}

.action-icon {
  background: #fab92e;
  color: #01192b;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  flex-shrink: 0;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  color: #fab92e;
  margin: 0 0 10px 0;
  font-size: 1.4em;
  font-weight: bold;
}

.action-content p {
  color: #fab92e80;
  margin: 0 0 15px 0;
  font-size: 1em;
}

.action-stats {
  display: flex;
  gap: 15px;
}

.stat {
  background: #01192b;
  color: #fab92e;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9em;
  font-weight: bold;
}

.progress-overview {
  background: #1a2a3a;
  border: 2px solid #fab92e;
  border-radius: 15px;
  padding: 30px;
}

.progress-overview h2 {
  color: #fab92e;
  margin: 0 0 25px 0;
  font-size: 1.8em;
  text-align: center;
}

.progress-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.progress-item {
  background: #01192b;
  border: 1px solid #fab92e30;
  border-radius: 10px;
  padding: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.progress-header h4 {
  color: #fab92e;
  margin: 0;
  font-size: 1.1em;
}

.progress-value {
  color: #fab92e80;
  font-size: 0.9em;
  font-weight: bold;
}

.progress-bar {
  background: #1a2a3a;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  background: linear-gradient(90deg, #fab92e, #28a745);
  height: 100%;
  transition: width 0.5s ease;
}

.progress-percentage {
  color: #fab92e;
  font-size: 1.1em;
  font-weight: bold;
  text-align: center;
}

.overall-progress {
  text-align: center;
  padding-top: 20px;
  border-top: 2px solid #fab92e30;
}

.overall-progress h3 {
  color: #fab92e;
  margin: 0 0 20px 0;
  font-size: 1.5em;
}

.overall-progress-bar {
  background: #1a2a3a;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 15px;
}

.overall-progress-fill {
  background: linear-gradient(90deg, #fab92e, #28a745);
  height: 100%;
  transition: width 0.5s ease;
}

.overall-progress-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.overall-percentage {
  color: #fab92e;
  font-size: 1.3em;
  font-weight: bold;
}

.overall-stats {
  color: #fab92e80;
  font-size: 1em;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-area {
    margin-left: 250px;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .content-area {
    margin-left: 0;
    padding: 15px;
  }
  
  .welcome-section h1 {
    font-size: 2.2em;
  }
  
  .welcome-section p {
    font-size: 1.1em;
  }
  
  .action-card {
    flex-direction: column;
    text-align: center;
  }
  
  .action-stats {
    justify-content: center;
  }
  
  .progress-grid {
    grid-template-columns: 1fr;
  }
  
  .overall-progress-text {
    flex-direction: column;
    gap: 10px;
  }
}
</style>

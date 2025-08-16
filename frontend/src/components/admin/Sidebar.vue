<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <i class="fas fa-shield-alt"></i>
        <span>Admin</span>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h3 class="nav-title">Navigation</h3>
        
        <ul class="nav-list">
          <li class="nav-item">
            <a href="#dashboard" class="nav-link active">
              <i class="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </a>
          </li>
          
          <li class="nav-item">
            <a href="#products" class="nav-link">
              <i class="fas fa-box"></i>
              <span>Produits</span>
            </a>
          </li>
          
          <li class="nav-item">
            <a href="#users" class="nav-link">
              <i class="fas fa-users"></i>
              <span>Utilisateurs</span>
            </a>
          </li>
          
          <li class="nav-item">
            <a href="#settings" class="nav-link">
              <i class="fas fa-cog"></i>
              <span>Paramètres</span>
            </a>
          </li>
        </ul>
      </div>
      
      <div class="nav-section">
        <h3 class="nav-title">Actions Rapides</h3>
        
        <ul class="nav-list">
          <li class="nav-item">
            <button @click="resetAllProducts" class="nav-link action-link">
              <i class="fas fa-undo"></i>
              <span>Reset Produits</span>
            </button>
          </li>
          
          <li class="nav-item">
            <button @click="loadProductConfig" class="nav-link action-link">
              <i class="fas fa-sync"></i>
              <span>Recharger</span>
            </button>
          </li>
          
          <li class="nav-item">
            <button @click="exportData" class="nav-link action-link">
              <i class="fas fa-download"></i>
              <span>Exporter</span>
            </button>
          </li>
        </ul>
      </div>
      
      <div class="nav-section">
        <h3 class="nav-title">Statistiques</h3>
        
        <div class="stats-summary">
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ userStore.activeUsers }}</div>
              <div class="stat-label">Utilisateurs</div>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-box"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ productStore.totalProducts }}</div>
              <div class="stat-label">Produits</div>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ overallProgress }}%</div>
              <div class="stat-label">Progression</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <div class="sidebar-footer">
      <div class="user-status">
        <div class="status-indicator online"></div>
        <span>Connecté</span>
      </div>
      
      <div class="version-info">
        <span>v1.0.0</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { useProductStore } from '@/stores/useProductStore'

// COPIE EXACTE de la logique d'AdminView.vue
const userStore = useUserStore()
const productStore = useProductStore()

// COPIE EXACTE des computed properties
const overallProgress = computed(() => {
  const totalPossible = 3 + 4 + 4 + 4 // fonds + douceurs + finitions
  if (totalPossible === 0) return 0
  return Math.round((productStore.totalProducts / totalPossible) * 100)
})

// COPIE EXACTE des fonctions
const resetAllProducts = async () => {
  await productStore.resetAllProducts()
}

const loadProductConfig = async () => {
  await productStore.loadProductConfig()
}

const exportData = () => {
  // Logique d'export à implémenter
  console.log('Export des données...')
}
</script>

<style scoped>
/* COPIE EXACTE des styles d'AdminView.vue */
.admin-sidebar {
  width: 280px;
  background: #01192b;
  border-right: 3px solid #fab92e;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 2px solid #fab92e30;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fab92e;
  font-size: 1.5em;
  font-weight: bold;
}

.logo i {
  font-size: 1.8em;
  background: #fab92e;
  color: #01192b;
  padding: 8px;
  border-radius: 50%;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-section {
  margin-bottom: 30px;
}

.nav-title {
  color: #fab92e;
  font-size: 1.1em;
  font-weight: bold;
  margin: 0 20px 15px 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #fab92e30;
  padding-bottom: 8px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #fab92e;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 1em;
  cursor: pointer;
}

.nav-link:hover {
  background: #1a2a3a;
  color: #fab92e;
  transform: translateX(5px);
}

.nav-link.active {
  background: #fab92e;
  color: #01192b;
  font-weight: bold;
}

.nav-link i {
  font-size: 1.2em;
  width: 20px;
  text-align: center;
}

.action-link {
  color: #fab92e80;
}

.action-link:hover {
  color: #fab92e;
}

.stats-summary {
  padding: 0 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #fab92e20;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-icon {
  background: #fab92e;
  color: #01192b;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-value {
  color: #fab92e;
  font-weight: bold;
  font-size: 1.1em;
  line-height: 1;
}

.stat-label {
  color: #fab92e80;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 2px solid #fab92e30;
  background: #1a2a3a;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #28a745;
}

.status-indicator.online {
  background: #28a745;
  box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
}

.user-status span {
  color: #fab92e;
  font-size: 0.9em;
  font-weight: bold;
}

.version-info {
  text-align: center;
}

.version-info span {
  color: #fab92e80;
  font-size: 0.8em;
  font-family: monospace;
}

/* Scrollbar personnalisée */
.admin-sidebar::-webkit-scrollbar {
  width: 6px;
}

.admin-sidebar::-webkit-scrollbar-track {
  background: #01192b;
}

.admin-sidebar::-webkit-scrollbar-thumb {
  background: #fab92e;
  border-radius: 3px;
}

.admin-sidebar::-webkit-scrollbar-thumb:hover {
  background: #e6a800;
}

/* Responsive */
@media (max-width: 1024px) {
  .admin-sidebar {
    width: 250px;
  }
  
  .nav-link {
    padding: 10px 15px;
    font-size: 0.9em;
  }
  
  .logo {
    font-size: 1.3em;
  }
  
  .logo i {
    font-size: 1.5em;
    padding: 6px;
  }
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    border-right: none;
    border-bottom: 3px solid #fab92e;
  }
  
  .sidebar-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 15px;
  }
  
  .nav-section {
    margin-bottom: 20px;
    min-width: 200px;
  }
  
  .stats-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
}
</style>

<template>
  <div class="settings-view">
    <div class="view-header">
      <h1>Paramètres</h1>
      <p>Configurez les paramètres de votre plateforme</p>
    </div>
    
    <div class="view-content">
      <div class="settings-section">
        <h3>Paramètres Généraux</h3>
        <div class="settings-grid">
          <div class="setting-card">
            <div class="setting-header">
              <i class="fas fa-cog"></i>
              <h4>Configuration de la Plateforme</h4>
            </div>
            <div class="setting-content">
              <p>Gérez les paramètres globaux de votre plateforme</p>
              <button class="setting-btn">Configurer</button>
            </div>
          </div>
          
          <div class="setting-card">
            <div class="setting-header">
              <i class="fas fa-shield-alt"></i>
              <h4>Sécurité</h4>
            </div>
            <div class="setting-content">
              <p>Paramètres de sécurité et permissions</p>
              <button class="setting-btn">Configurer</button>
            </div>
          </div>
          
          <div class="setting-card">
            <div class="setting-header">
              <i class="fas fa-database"></i>
              <h4>Base de Données</h4>
            </div>
            <div class="setting-content">
              <p>Gestion de la base de données</p>
              <button class="setting-btn">Configurer</button>
            </div>
          </div>
          
          <div class="setting-card">
            <div class="setting-header">
              <i class="fas fa-backup"></i>
              <h4>Sauvegarde</h4>
            </div>
            <div class="setting-content">
              <p>Système de sauvegarde et restauration</p>
              <button class="setting-btn">Configurer</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="settings-section">
        <h3>Maintenance</h3>
        <div class="maintenance-actions">
          <button class="maintenance-btn warning">
            <i class="fas fa-tools"></i>
            Mode Maintenance
          </button>
          <button class="maintenance-btn info">
            <i class="fas fa-sync"></i>
            Vider le Cache
          </button>
          <button class="maintenance-btn danger">
            <i class="fas fa-trash"></i>
            Nettoyer les Données
          </button>
        </div>
      </div>
      
      <div class="settings-section">
        <h3>Logs et Monitoring</h3>
        <div class="logs-info">
          <div class="log-stat">
            <span class="log-label">Logs d'Erreur</span>
            <span class="log-value">0</span>
          </div>
          <div class="log-stat">
            <span class="log-label">Logs d'Accès</span>
            <span class="log-value">0</span>
          </div>
          <div class="log-stat">
            <span class="log-label">Performance</span>
            <span class="log-value">Excellent</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// COPIE EXACTE de la logique d'AdminView.vue
// Cette vue sera implémentée plus tard avec la logique spécifique
</script>

<style scoped>
/* COPIE EXACTE des styles d'AdminView.vue */
.settings-view {
  padding: 20px;
  margin-left: 280px; /* Espace pour la sidebar */
}

.view-header {
  text-align: center;
  margin-bottom: 30px;
}

.view-header h1 {
  color: #fab92e;
  font-size: 2.5em;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.view-header p {
  color: #fab92e80;
  font-size: 1.2em;
  margin: 0;
}

.view-content {
  background: #01192b;
  border-radius: 15px;
  border: 2px solid #fab92e;
  overflow: hidden;
  padding: 30px;
}

.settings-section {
  margin-bottom: 40px;
}

.settings-section h3 {
  color: #fab92e;
  margin-bottom: 20px;
  font-size: 1.8em;
  border-bottom: 2px solid #fab92e30;
  padding-bottom: 10px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.setting-card {
  background: #1a2a3a;
  border: 2px solid #fab92e;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.setting-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(250, 185, 46, 0.2);
  border-color: #28a745;
}

.setting-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.setting-header i {
  background: #fab92e;
  color: #01192b;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
}

.setting-header h4 {
  color: #fab92e;
  margin: 0;
  font-size: 1.2em;
}

.setting-content p {
  color: #fab92e80;
  margin-bottom: 15px;
  font-size: 0.9em;
}

.setting-btn {
  background: #fab92e;
  color: #01192b;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.setting-btn:hover {
  background: #e6a800;
  transform: translateY(-2px);
}

.maintenance-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.maintenance-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  font-size: 1em;
}

.maintenance-btn.warning {
  background: #ffc107;
  color: #01192b;
}

.maintenance-btn.warning:hover {
  background: #e0a800;
  transform: translateY(-2px);
}

.maintenance-btn.info {
  background: #17a2b8;
  color: white;
}

.maintenance-btn.info:hover {
  background: #138496;
  transform: translateY(-2px);
}

.maintenance-btn.danger {
  background: #dc3545;
  color: white;
}

.maintenance-btn.danger:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.logs-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.log-stat {
  background: #1a2a3a;
  border: 1px solid #fab92e30;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.log-label {
  display: block;
  color: #fab92e80;
  font-size: 0.9em;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.log-value {
  display: block;
  color: #fab92e;
  font-size: 1.5em;
  font-weight: bold;
}

/* Responsive */
@media (max-width: 1024px) {
  .settings-view {
    margin-left: 250px;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .settings-view {
    margin-left: 0;
    padding: 15px;
  }
  
  .view-header h1 {
    font-size: 2em;
  }
  
  .view-header p {
    font-size: 1.1em;
  }
  
  .maintenance-actions {
    flex-direction: column;
  }
  
  .logs-info {
    grid-template-columns: 1fr;
  }
}
</style>

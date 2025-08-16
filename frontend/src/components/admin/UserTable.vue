<template>
  <div class="users-section">
    <div class="section-header">
      <h2>Gestion des Utilisateurs</h2>
      <div class="section-actions">
        <div class="search-box">
          <input 
            v-model="userStore.searchQuery"
            type="text"
            placeholder="Rechercher un utilisateur..."
            class="search-input"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
        <button @click="userStore.toggleUsersSection" class="toggle-btn">
          <i class="fas" :class="userStore.isUsersSectionOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          {{ userStore.isUsersSectionOpen ? 'Masquer' : 'Afficher' }}
        </button>
      </div>
    </div>

    <div v-if="userStore.isUsersSectionOpen" class="users-content">
      <div class="users-stats">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ userStore.activeUsers }}</div>
            <div class="stat-label">Utilisateurs Actifs</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-user-times"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ userStore.deletedUsers }}</div>
            <div class="stat-label">Utilisateurs Supprimés</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-user-shield"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ adminUsersCount }}</div>
            <div class="stat-label">Administrateurs</div>
          </div>
        </div>
      </div>

      <div class="users-table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Date de Création</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="user in userStore.filteredUsers" 
              :key="user.id"
              :class="{ 'deleted-user': user.deleted }"
            >
              <td>
                <div class="user-name">
                  <i class="fas fa-user user-icon"></i>
                  {{ user.name }}
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge" :class="user.role">
                  {{ user.role }}
                </span>
              </td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td>
                <span class="status-badge" :class="{ 'deleted': user.deleted }">
                  {{ user.deleted ? 'Supprimé' : 'Actif' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    v-if="!user.deleted"
                    @click="deleteUser(user.id)"
                    class="action-btn delete-btn"
                    title="Supprimer l'utilisateur"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                  <button 
                    v-else
                    @click="restoreUser(user.id)"
                    class="action-btn restore-btn"
                    title="Restaurer l'utilisateur"
                  >
                    <i class="fas fa-undo"></i>
                  </button>
                  <button 
                    @click="editUser(user)"
                    class="action-btn edit-btn"
                    title="Modifier l'utilisateur"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

// COPIE EXACTE de la logique d'AdminView.vue
const userStore = useUserStore()

// COPIE EXACTE des computed properties
const adminUsersCount = computed(() => {
  return userStore.users.filter(user => user.role === 'admin' && !user.deleted).length
})

// COPIE EXACTE des fonctions utilitaires
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const deleteUser = async (userId: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    try {
      // Logique de suppression à implémenter
      console.log('Suppression de l\'utilisateur:', userId)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

const restoreUser = async (userId: string) => {
  if (confirm('Êtes-vous sûr de vouloir restaurer cet utilisateur ?')) {
    try {
      // Logique de restauration à implémenter
      console.log('Restauration de l\'utilisateur:', userId)
    } catch (error) {
      console.error('Erreur lors de la restauration:', error)
    }
  }
}

const editUser = (user: any) => {
  // Logique de modification à implémenter
  console.log('Modification de l\'utilisateur:', user)
}
</script>

<style scoped>
/* COPIE EXACTE des styles d'AdminView.vue */
.users-section {
  background: #01192b;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  color: #fab92e;
  margin: 0;
  font-size: 1.8em;
}

.section-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.search-box {
  position: relative;
}

.search-input {
  background: #1a2a3a;
  border: 2px solid #fab92e;
  color: #fab92e;
  padding: 10px 40px 10px 15px;
  border-radius: 25px;
  font-size: 1em;
  width: 300px;
}

.search-input::placeholder {
  color: #fab92e80;
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #fab92e;
}

.toggle-btn {
  background: #fab92e;
  color: #01192b;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: #e6a800;
  transform: translateY(-2px);
}

.users-content {
  animation: slideDown 0.3s ease;
}

.users-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #1a2a3a;
  border: 2px solid #fab92e;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(250, 185, 46, 0.2);
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
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  color: #fab92e;
  line-height: 1;
}

.stat-label {
  color: #fab92e80;
  font-size: 0.9em;
  margin-top: 5px;
}

.users-table-container {
  background: #1a2a3a;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #fab92e;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #fab92e30;
}

.users-table th {
  background: #fab92e;
  color: #01192b;
  font-weight: bold;
  font-size: 1.1em;
}

.users-table tbody tr {
  transition: all 0.3s ease;
}

.users-table tbody tr:hover {
  background: #2a3a4a;
}

.users-table tbody tr.deleted-user {
  opacity: 0.6;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-icon {
  color: #fab92e;
  font-size: 1.2em;
}

.role-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9em;
  font-weight: bold;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #dc3545;
  color: white;
}

.role-badge.user {
  background: #17a2b8;
  color: white;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.9em;
  font-weight: bold;
  background: #28a745;
  color: white;
}

.status-badge.deleted {
  background: #6c757d;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.delete-btn:hover {
  background: #c82333;
  transform: scale(1.1);
}

.restore-btn {
  background: #28a745;
  color: white;
}

.restore-btn:hover {
  background: #218838;
  transform: scale(1.1);
}

.edit-btn {
  background: #fab92e;
  color: #01192b;
}

.edit-btn:hover {
  background: #e6a800;
  transform: scale(1.1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .section-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .search-input {
    width: 100%;
  }
  
  .users-stats {
    grid-template-columns: 1fr;
  }
  
  .users-table-container {
    overflow-x: auto;
  }
  
  .users-table {
    min-width: 600px;
  }
}
</style>

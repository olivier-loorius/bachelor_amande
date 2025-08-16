<template>
    <section class="dashboard-section accordion-section">
        <div class="section-header accordion-header" @click="toggleUsersSection">
            <div class="header-left">
                <h2 class="section-title">
                    <span class="title-icon">👤</span>
                    <span class="title-text">Gestion des Utilisateurs</span>
                </h2>
                    <div class="section-stats">
                        <span class="stat-item">
                            {{ activeUsers }} utilisateurs
                        </span>
                        <span class="stat-item deleted-stat" v-if="deletedUsers > 0">
                     {{ deletedUsers }} supprimés
                        </span>
                    </div>
            </div>
            <div class="accordion-icon" :class="{ 'rotated': isUsersSectionOpen }">
                <span class="accordion-arrow">▼</span>
            </div>
        </div>
        <div class="accordion-content" :class="{ 'open': isUsersSectionOpen }">
            <div class="search-container">
                <div class="search-input-wrapper">
                    <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <input
                        :value="searchQuery"
                        type="text"
                        placeholder="Rechercher un utilisateur..."
                        class="search-input"
                        @input="(event) => updateSearchQuery((event.target as HTMLInputElement).value)"
                    />
                    <button 
                        v-if="searchQuery"
                        @click="updateSearchQuery('')"
                        class="clear-search-btn"
                        title="Effacer la recherche"
                    >
                    <svg class="clear-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                    </button>
                </div>
                <div v-if="searchQuery" class="search-results">
                    <span class="results-text">{{ filteredUsers.length }} résultat(s) trouvé(s)</span>
                </div>
            </div>
            <div class="table-container">
                <table class="users-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Créé le</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="filteredUsers.length === 0 && !isLoading" class="empty-state">
                            <td colspan="5">
                                <div class="empty-message">🔍<p>{{ searchQuery ? 'Aucun utilisateur trouvé pour "' + searchQuery + '"' : 'Aucun utilisateur trouvé' }}</p>
                                </div>
                            </td>
                        </tr>
                        <tr 
                            v-for="user in filteredUsers" 
                            :key="user.id" 
                            :class="[
                            'user-row',
                            { 'deleted': user.deleted }]"
                        >
                        <td class="user-name" data-label="Nom">
                            <span :class="{ 'deleted-text': user.deleted }">
                                {{ user.name }}
                            </span>
                            <span v-if="user.deleted" class="deleted-badge">Compte désactivé</span>
                 <span v-else-if="user.updated_at && user.updated_at !== user.created_at" class="modified-badge">
                   ✏️ Modifié
                 </span>
               </td>
              
              <td class="user-email" data-label="Email">
                <span :class="{ 'deleted-text': user.deleted }" :title="user.email">
                  {{ maskEmail(user.email) }}
                </span>
              </td>
              
                             <td class="user-role" data-label="Rôle">
                 <span 
                   v-if="user.role === 'admin'"
                   class="role-icon admin-icon"
                   title="Administrateur"
                 >
                   👑
                 </span>
                 <span v-else class="role-icon user-icon" title="Utilisateur">
                   👤
                 </span>
               </td>
              
              <td class="user-date" data-label="Créé le">
                <span :class="{ 'deleted-text': user.deleted }">
                  {{ formatDate(user.created_at) }}
                </span>
              </td>
              
                             <td class="user-actions" data-label="Actions">
                 <div class="action-buttons">
                   <button 
                     v-if="!user.deleted && user.role !== 'admin'"
                     @click="deleteUser(user.id)"
                     class="action-btn delete-btn"
                     title="Désactiver cet utilisateur"
                   >
                     <span class="btn-icon">🗑️</span>
                     <span class="btn-text">Désactiver</span>
                   </button>
                                    <span v-else-if="user.deleted" class="deleted-status">
                   Désactivé
                 </span>
                   <span v-else-if="user.role === 'admin'" class="admin-protected">
                     <span class="status-icon">🛡️</span>
                     Protégé
                   </span>
                 </div>
               </td>
            </tr>
          </tbody>
                 </table>
       </div>
       
       <!-- Vignettes utilisateurs pour mobile -->
       <div class="users-cards">
         <div 
           v-for="user in filteredUsers" 
           :key="user.id"
           :class="[
             'user-card',
             { 'deleted': user.deleted }
           ]"
         >
           <div class="card-header">
             <div class="user-info">
               <h3 class="user-name" :class="{ 'deleted-text': user.deleted }">
                 {{ user.name }}
               </h3>
               <span class="user-role">
                 <span v-if="user.role === 'admin'" class="role-icon admin-icon" title="Administrateur">👑</span>
                 <span v-else class="role-icon user-icon" title="Utilisateur">👤</span>
                 {{ user.role === 'admin' ? 'Administrateur' : 'Utilisateur' }}
               </span>
             </div>
             <div class="user-date">
               {{ formatDate(user.created_at) }}
             </div>
           </div>
           
           <div class="card-content">
             <div class="user-email">
               <span :class="{ 'deleted-text': user.deleted }" :title="user.email">
                 {{ maskEmail(user.email) }}
               </span>
             </div>
             
             <div class="user-status">
               <span v-if="user.deleted" class="deleted-badge">Compte désactivé</span>
               <span v-else-if="user.updated_at && user.updated_at !== user.created_at" class="modified-badge">✏️ Modifié</span>
             </div>
           </div>
           
           <div class="card-actions">
             <button 
               v-if="!user.deleted && user.role !== 'admin'"
               @click="deleteUser(user.id)"
               class="action-btn delete-btn"
               title="Désactiver cet utilisateur"
             >
               <span class="btn-icon">🗑️</span>
               <span class="btn-text">Désactiver</span>
             </button>
             <span v-else-if="user.deleted" class="deleted-status">Désactivé</span>
             <span v-else-if="user.role === 'admin'" class="admin-protected">
               <span class="status-icon">🛡️</span>
               Protégé
             </span>
           </div>
         </div>
         
         <!-- État vide pour les vignettes -->
         <div v-if="filteredUsers.length === 0 && !isLoading" class="empty-cards">
           <div class="empty-message">
             🔍
             <p>{{ searchQuery ? 'Aucun utilisateur trouvé pour "' + searchQuery + '"' : 'Aucun utilisateur trouvé' }}</p>
           </div>
         </div>
       </div>
     </div>
   </section>
</template>

<script setup lang="ts">
// Utilisation directe du store pour la gestion des utilisateurs
import { useUserStore } from '@/stores/useUserStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const userStore = useUserStore()

// Accès direct aux données du store
const {
  users,
  isLoading,
  isUsersSectionOpen,
  searchQuery,
  filteredUsers,
  activeUsers,
  deletedUsers
} = storeToRefs(userStore)

// Actions directes du store
const { toggleUsersSection, updateSearchQuery, deleteUser, loadUsers } = userStore

// Charger les utilisateurs au montage du composant
onMounted(() => {
  loadUsers()
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const maskEmail = (email: string) => {
  const [username, domain] = email.split('@')
  if (username.length <= 2) return email
  
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1)
  return `${maskedUsername}@${domain}`
}
</script>

<style lang="scss" scoped>
/* Variables admin */
$admin-primary: #383961;
$admin-secondary: #FCD581;
$admin-text-dark: #2c3e50;
$admin-text-light: #6c757d;
$admin-success: #28a745;
$admin-danger: #dc3545;

/* Section admin - utilise vos styles existants */
.dashboard-section {
  background: white;
  margin-bottom: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  background: rgba($admin-primary, 0.02);
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba($admin-primary, 0.05);
  }
  
     h2 {
     margin: 0 0 1rem 0;
     color: $admin-primary;
     font-family: 'Open Sans', sans-serif;
     font-weight: 600;
     font-size: 2rem;
     display: flex;
     align-items: baseline;
     gap: 0.75rem;
   }
   
   .title-icon {
     font-size: 2.2rem;
     line-height: 1;
     display: flex;
     align-items: center;
   }
   
   .title-text {
     font-weight: 700;
     color: $admin-primary;
     line-height: 1.2;
   }
}

/* Icône accordéon */
.accordion-icon {
  transition: transform 0.3s ease;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  
  &:hover {
    background: rgba($admin-primary, 0.1);
  }
  
  &.rotated {
    transform: rotate(180deg);
  }
  
  .accordion-arrow {
    font-size: 1.2rem;
    color: $admin-primary;
    font-weight: bold;
    display: block;
    transition: transform 0.3s ease;
  }
}

/* Contenu accordéon - ouverture/fermeture */
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  
  &.open {
    max-height: 2000px; /* Hauteur suffisante pour le contenu */
  }
}

/* Boutons d'action - utilise vos styles existants */
.refresh-btn {
  background: $admin-secondary;
  color: $admin-primary;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  
  &:hover {
    opacity: 0.9;
  }
}

/* Tableau des utilisateurs - utilise vos styles existants */
.users-table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
     th, td {
     padding: 1rem;
     text-align: left;
     border-bottom: 1px solid #e9ecef;
   }
   
   th:nth-child(1), td:nth-child(1) { width: 25%; } /* Nom */
   th:nth-child(2), td:nth-child(2) { width: 30%; } /* Email */
   th:nth-child(3), td:nth-child(3) { width: 10%; } /* Rôle */
   th:nth-child(4), td:nth-child(4) { width: 20%; } /* Créé le */
   th:nth-child(5), td:nth-child(5) { width: 15%; } /* Actions */
  
  th {
    background: $admin-primary;
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  td {
    color: $admin-text-dark;
    font-size: 0.9rem;
  }
  
  tr:hover {
    background: #f8f9fa;
  }
  
     tr.deleted {
     opacity: 0.6;
     background: #f8f9fa;
   }
}

/* Texte barré pour utilisateurs supprimés */
.deleted-text {
  text-decoration: line-through;
  text-decoration-color: #999;
  text-decoration-thickness: 1px;
  opacity: 0.6;
}

/* Badge supprimé */
.deleted-badge {
  display: inline-block;
  background: rgba($admin-danger, 0.1);
  color: $admin-danger;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
}

/* Badge modifié */
.modified-badge {
  display: inline-block;
  background: rgba($admin-secondary, 0.1);
  color: $admin-secondary;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
}

/* Badges et boutons - utilise vos styles existants */
.role-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  &.admin {
    background: $admin-primary;
    color: white;
  }
  
  &.user {
    background: $admin-text-light;
    color: white;
  }
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  
  &.active {
    background: $admin-success;
    color: white;
  }
  
  &.deleted {
    background: $admin-danger;
    color: white;
  }
}

.action-btn {
  background: $admin-danger;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: darken($admin-danger, 10%);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-icon {
    font-size: 1rem;
  }
  
  .btn-text {
    font-weight: 500;
  }
}

.deleted-status, .admin-protected {
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
}

.deleted-status {
  background: rgba($admin-text-light, 0.1);
  color: $admin-text-light;
}

.admin-protected {
  background: rgba($admin-primary, 0.1);
  color: $admin-primary;
}

/* Statistiques de la section */
.section-stats {
  display: flex;
  gap: 1rem;
  align-items: center;
  
  .stat-item {
    font-size: 0.9rem;
    color: $admin-text-light;
    
    &.deleted-stat {
      color: $admin-danger;
      font-weight: 500;
    }
  }
}

/* Barre de recherche - style du projet */
.search-container {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.search-input-wrapper {
  position: relative;
  max-width: 400px;
  display: flex;
  align-items: center;
  border: 1px solid #ced4da;
  border-radius: 6px;
  background-color: white;
  padding: 0.75rem 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-input {
  border: none;
  outline: none;
  flex-grow: 1;
  padding: 0;
  font-size: 0.9rem;
  color: #495057;
  background: transparent;
}

/* Icône de recherche */
.search-icon {
  color: #6c757d;
  margin-right: 0.75rem;
  width: 18px;
  height: 18px;
  opacity: 0.8;
  flex-shrink: 0;
}

/* Résultats de recherche */
.search-results {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: rgba($admin-primary, 0.03);
  border-radius: 6px;
  border-left: 3px solid $admin-primary;
  
  .results-text {
    font-family: 'Open Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    color: $admin-primary;
    letter-spacing: 0.3px;
  }
}

.clear-search-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.75rem;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  .clear-icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  
  &:hover {
    color: #dc3545;
    background: rgba(#dc3545, 0.1);
  }
}

/* Vignettes utilisateurs pour mobile */
.users-cards {
  display: none; /* Caché par défaut sur desktop */
}

.user-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &.deleted {
    opacity: 0.6;
    background: #f8f9fa;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  
  .user-info {
    flex: 1;
    
    .user-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: $admin-text-dark;
      margin: 0 0 0.25rem 0;
    }
    
    .user-role {
      font-size: 0.85rem;
      color: $admin-text-light;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      
      .role-icon {
        font-size: 1rem;
      }
    }
  }
  
  .user-date {
    font-size: 0.8rem;
    color: $admin-text-light;
    text-align: right;
  }
}

.card-content {
  margin-bottom: 1rem;
  
  .user-email {
    font-size: 0.9rem;
    color: $admin-text-dark;
    margin-bottom: 0.5rem;
  }
  
  .user-status {
    .deleted-badge, .modified-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }
  }
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  
  .action-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
    
    .btn-icon {
      font-size: 0.9rem;
    }
    
    .btn-text {
      font-size: 0.8rem;
    }
  }
  
  .deleted-status, .admin-protected {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}

.empty-cards {
  text-align: center;
  padding: 2rem;
  color: $admin-text-light;
  
  .empty-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    
    p {
      margin: 0;
      font-size: 0.9rem;
    }
  }
}

/* Responsive - règles simples et réutilisables */
@media (max-width: 768px) {
  /* Titre plus petit sur mobile */
  .section-header h2 {
    font-size: 1.5rem;
    margin: 0 0 0.75rem 0;
  }
  
  .title-icon {
    font-size: 1.8rem;
  }
  
  /* Statistiques plus compactes */
  .section-stats {
    gap: 0.75rem;
    
    .stat-item {
      font-size: 0.8rem;
    }
  }
  
  /* Accordéon plus compact */
  .accordion-icon {
    padding: 0.4rem;
    
    .accordion-arrow {
      font-size: 1rem;
    }
  }
  
  /* Barre de recherche adaptée mobile */
  .search-container {
    padding: 1rem;
  }
  
  .search-input-wrapper {
    max-width: 100%;
    padding: 0.6rem 0.8rem;
  }
  
  .search-input {
    font-size: 0.85rem;
  }
  
  .search-icon {
    width: 16px;
    height: 16px;
    margin-right: 0.6rem;
  }
  
  .clear-icon {
    width: 14px;
    height: 14px;
  }
  
  /* Résultats de recherche plus compacts */
  .search-results {
    margin-top: 0.75rem;
    padding: 0.6rem 0.8rem;
    
    .results-text {
      font-size: 0.8rem;
    }
  }
  
  /* Basculer vers les vignettes sur mobile */
  .users-table {
    display: none;
  }
  
  .users-cards {
    display: block;
  }
  
  /* Optimisations des vignettes sur mobile */
  .user-card {
    padding: 0.8rem;
    margin-bottom: 0.8rem;
  }
  
  .card-header {
    margin-bottom: 0.6rem;
    
    .user-info .user-name {
      font-size: 1rem;
    }
    
    .user-role {
      font-size: 0.8rem;
    }
    
    .user-date {
      font-size: 0.75rem;
    }
  }
  
  .card-content {
    margin-bottom: 0.8rem;
    
    .user-email {
      font-size: 0.85rem;
    }
  }
  
  .card-actions .action-btn {
    padding: 0.35rem 0.7rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  /* Très petits écrans */
  .section-header h2 {
    font-size: 1.3rem;
    margin: 0 0 0.5rem 0;
  }
  
  .title-icon {
    font-size: 1.6rem;
  }
  
  .section-stats {
    gap: 0.5rem;
    
    .stat-item {
      font-size: 0.75rem;
    }
  }
  
  .search-container {
    padding: 0.75rem;
  }
  
  .search-input-wrapper {
    padding: 0.5rem 0.7rem;
  }
}
</style>

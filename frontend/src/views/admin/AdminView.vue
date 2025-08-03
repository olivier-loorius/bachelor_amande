<template>
  <div class="admin-dashboard">
    <!-- Header du Dashboard -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">Dashboard Admin</h1>
        <p class="welcome-message">
          Bienvenue, <strong>{{ authStore.currentUser?.name || 'Administrateur' }}</strong> ! 
          Gérez vos utilisateurs et votre contenu depuis cet espace.
        </p>
      </div>
      
      <!-- Barre d'actions -->
      <div class="action-bar">
        <button 
          @click="loadUsers"
          :disabled="isLoading"
          class="action-btn refresh-btn"
          :title="isLoading ? 'Chargement...' : 'Rafraîchir les données'"
        >
          <i class="fas fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
          <span>{{ isLoading ? 'Chargement...' : 'Rafraîchir' }}</span>
        </button>
        
        <button 
          @click="logout"
          class="action-btn logout-btn"
          title="Se déconnecter"
        >
          <i class="fas fa-sign-out-alt"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="dashboard-content">
            <!-- Section Gestion des Utilisateurs -->
      <section class="dashboard-section accordion-section">
        <div class="section-header accordion-header" @click="toggleUsersSection">
          <div class="header-left">
            <h2 class="section-title">
              <i class="fas fa-users"></i>
              Gestion des Utilisateurs
            </h2>
            <div class="section-stats">
              <span class="stat-item">
                <i class="fas fa-user-check"></i>
                {{ activeUsers }} actifs
              </span>
              <span class="stat-item">
                <i class="fas fa-user-times"></i>
                {{ deletedUsers }} supprimés
              </span>
            </div>
          </div>
          <div class="accordion-icon">
            <i class="fas fa-chevron-down" :class="{ 'rotated': isUsersSectionOpen }"></i>
          </div>
        </div>

        <div class="accordion-content" :class="{ 'open': isUsersSectionOpen }">
          <!-- Barre de recherche -->
          <div class="search-container">
            <div class="search-input-wrapper">
              <i class="fas fa-search search-icon"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un utilisateur..."
                class="search-input"
                @input="searchQuery = $event.target.value"
              />
              <button 
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="clear-search-btn"
                title="Effacer la recherche"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div v-if="searchQuery" class="search-results">
              <span>{{ filteredUsers.length }} résultat(s) trouvé(s)</span>
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
                    <div class="empty-message">
                      <i class="fas fa-search"></i>
                      <p>{{ searchQuery ? 'Aucun utilisateur trouvé pour "' + searchQuery + '"' : 'Aucun utilisateur trouvé' }}</p>
                    </div>
                  </td>
                </tr>
                
                <tr 
                  v-for="user in filteredUsers" 
                  :key="user.id" 
                  :class="[
                    'user-row',
                    { 'deleted': user.deleted }
                  ]"
                >
                  <td class="user-name" data-label="Nom">
                    <span :class="{ 'deleted-text': user.deleted }">
                      {{ user.name }}
                    </span>
                    <span v-if="user.deleted" class="deleted-badge">
                      🗑️ Supprimé
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
                      <i class="fas fa-crown"></i>
                    </span>
                    <span v-else class="role-icon user-icon" title="Utilisateur">
                      <i class="fas fa-user"></i>
                    </span>
                  </td>
                  
                  <td class="user-date" data-label="Créé le">
                    <span :class="{ 'deleted-text': user.deleted }">
                      {{ formatDate(user.created_at) }}
                    </span>
                  </td>
                  
                  <td class="user-actions" data-label="Actions">
                    <button 
                      v-if="!user.deleted"
                      @click="deleteUser(user.id)"
                      class="action-btn delete-btn"
                      title="Désactiver cet utilisateur"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                    <span v-else class="deleted-status">
                      Désactivé
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Section Gestion Composer (à venir) -->
      <section class="dashboard-section coming-soon">
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-palette"></i>
            Gestion Composer
          </h2>
        </div>
        
        <div class="coming-soon-content">
          <div class="coming-soon-icon">
            <i class="fas fa-tools"></i>
          </div>
          <h3>Fonctionnalité en cours de développement</h3>
          <p>La gestion du module Composer sera bientôt disponible. Vous pourrez gérer les fonds, garnitures et configurations.</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/services/supabaseService'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  deleted?: boolean
  deleted_at?: string
}

const users = ref<User[]>([])
const isLoading = ref(false)
const isUsersSectionOpen = ref(false) // Par défaut fermé
const searchQuery = ref('')
const router = useRouter()
const authStore = useAuthStore()

// Computed properties
const activeUsers = computed(() => users.value.filter(user => !user.deleted).length)
const deletedUsers = computed(() => users.value.filter(user => user.deleted).length)

// Filtrage des utilisateurs par recherche
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

onMounted(async () => {
  // Vérifier si l'utilisateur est connecté et admin
  if (!authStore.user || !authStore.isAdmin) {
    console.log('❌ Accès refusé: utilisateur non connecté ou non admin')
    router.push('/')
    return
  }
  
  console.log('✅ Accès admin autorisé')
  await loadUsers()
  
  // Auto-refresh toutes les 30 secondes
  setInterval(async () => {
    await loadUsers()
  }, 30000)
})

const loadUsers = async () => {
  isLoading.value = true
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
  } else {
    users.value = data || []
  }
  isLoading.value = false
}

const deleteUser = async (id: string) => {
  if (confirm('Confirmer la désactivation de cet utilisateur ?')) {
    const { error } = await supabase
      .from('users')
      .update({ 
        deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      alert('Erreur lors de la désactivation')
      console.error('Erreur lors de la désactivation:', error)
    } else {
      // Recharger la liste après désactivation
      await loadUsers()
    }
  }
}

const logout = async () => {
  try {
    await authStore.logout(router)
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}

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

const toggleUsersSection = () => {
  isUsersSectionOpen.value = !isUsersSectionOpen.value
}
</script>

<style scoped>
/* Dashboard Container */
.admin-dashboard {
  min-height: 100vh;
  background: var(--secondary-color);
  font-family: var(--font-family-text);
}

/* Header du Dashboard */
.dashboard-header {
  background: var(--white);
  padding: var(--spacing-xl) var(--spacing-xxl);
  box-shadow: var(--box-shadow);
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  margin-bottom: var(--spacing-lg);
}

.dashboard-title {
  color: #383961;
  font-family: var(--font-family-title);
  font-size: 2.5rem;
  margin: 0 0 var(--spacing-sm) 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.welcome-message {
  color: var(--text-color);
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.8;
}

/* Barre d'actions */
.action-bar {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--btn-radius);
  border: none;
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.refresh-btn {
  background: #383961;
  color: var(--white);
}

.refresh-btn:hover {
  background: #2a2b4a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(56, 57, 97, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.logout-btn {
  background: var(--accent-color);
  color: var(--white);
}

.logout-btn:hover {
  background: #e05a4e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 111, 97, 0.3);
}

/* Contenu principal */
.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xxl);
}

/* Sections */
.dashboard-section {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: var(--spacing-xxl);
  overflow: hidden;
}

.section-header {
  padding: var(--spacing-xl) var(--spacing-xxl);
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

/* Accordéon */
.accordion-section {
  cursor: pointer;
}

.accordion-header {
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none;
}

.accordion-header:hover {
  background-color: #f8f9fa;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  flex: 1;
}

.accordion-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(56, 57, 97, 0.1);
  color: #383961;
  transition: all 0.3s ease;
}

.accordion-icon i {
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.accordion-icon i.rotated {
  transform: rotate(180deg);
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.accordion-content.open {
  max-height: 2000px; /* Valeur suffisamment grande pour le contenu */
}

/* Barre de recherche */
.search-container {
  padding: var(--spacing-lg) var(--spacing-xxl);
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: var(--spacing-md);
  color: #666;
  font-size: 0.9rem;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-md) 2.5rem;
  border: 2px solid #e0e0e0;
  border-radius: var(--btn-radius);
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: var(--white);
}

.search-input:focus {
  outline: none;
  border-color: #383961;
  box-shadow: 0 0 0 3px rgba(56, 57, 97, 0.1);
}

.search-input::placeholder {
  color: #999;
}

.clear-search-btn {
  position: absolute;
  right: var(--spacing-md);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search-btn:hover {
  background: #e0e0e0;
  color: #333;
}

.search-results {
  margin-top: var(--spacing-sm);
  font-size: 0.8rem;
  color: #666;
  font-style: italic;
}

.section-title {
  color: #383961;
  font-family: var(--font-family-title);
  font-size: 1.5rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.section-stats {
  display: flex;
  gap: var(--spacing-lg);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-color);
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Tableau des utilisateurs */
.table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: #f8f9fa;
  color: var(--text-color);
  font-weight: 600;
  text-align: left;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.users-table td {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.user-row {
  transition: background-color 0.2s ease;
}

.user-row:hover {
  background-color: #f8f9fa;
}

.user-row.deleted {
  opacity: 0.6;
  background-color: #f8f9fa;
}

.user-name {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.deleted-text {
  text-decoration: line-through;
  color: #999;
}

.deleted-badge {
  background: #ff6b6b;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

.user-email {
  color: var(--text-color);
  opacity: 0.8;
}

.role-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.admin-icon {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border: 2px solid rgba(255, 107, 107, 0.3);
}

.admin-icon:hover {
  background: rgba(255, 107, 107, 0.2);
  transform: scale(1.1);
}

.user-icon {
  color: #383961;
  background: rgba(56, 57, 97, 0.1);
  border: 2px solid rgba(56, 57, 97, 0.3);
}

.user-icon:hover {
  background: rgba(56, 57, 97, 0.2);
  transform: scale(1.1);
}

.user-date {
  color: var(--text-color);
  opacity: 0.7;
  font-size: 0.9rem;
}

.user-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.delete-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
}

.delete-btn:hover {
  background: #ff5252;
  transform: translateY(-1px);
}

.deleted-status {
  color: #999;
  font-size: 0.8rem;
  font-style: italic;
}

/* État vide */
.empty-state td {
  text-align: center;
  padding: var(--spacing-xxl);
}

.empty-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  color: #999;
}

.empty-message i {
  font-size: 2rem;
  opacity: 0.5;
}

/* Section à venir */
.coming-soon {
  opacity: 0.7;
}

.coming-soon-content {
  padding: var(--spacing-xxl);
  text-align: center;
}

.coming-soon-icon {
  font-size: 3rem;
  color: var(--accent-color);
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

.coming-soon-content h3 {
  color: var(--text-color);
  font-family: var(--font-family-title);
  font-size: 1.3rem;
  margin-bottom: var(--spacing-md);
}

.coming-soon-content p {
  color: var(--text-color);
  opacity: 0.8;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-header {
    padding: var(--spacing-lg);
  }
  
  .dashboard-title {
    font-size: 2rem;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-btn {
    justify-content: center;
  }
  
  .dashboard-content {
    padding: var(--spacing-lg);
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .accordion-icon {
    width: 28px;
    height: 28px;
  }
  
  .search-container {
    padding: var(--spacing-md);
  }
  
  .search-input-wrapper {
    max-width: 100%;
  }
  
  .section-stats {
    width: 100%;
    justify-content: space-between;
  }
  
  /* Transformation du tableau en cartes sur mobile */
  .users-table {
    display: block;
  }
  
  .users-table thead {
    display: none;
  }
  
  .users-table tbody {
    display: block;
  }
  
  .users-table tr {
    display: block;
    background: var(--white);
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: var(--spacing-md);
    padding: var(--spacing-lg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .users-table td {
    display: block;
    padding: var(--spacing-sm) 0;
    border: none;
    text-align: left;
  }
  
  .users-table td:before {
    content: attr(data-label) ": ";
    font-weight: 600;
    color: var(--text-color);
    opacity: 0.7;
  }
  
  .user-name {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-sm);
  }
  
  .user-name:before {
    content: "Nom: ";
  }
  
  .user-email:before {
    content: "Email: ";
  }
  
  .user-role:before {
    content: "Rôle: ";
  }
  
  .user-date:before {
    content: "Créé le: ";
  }
  
  .user-actions:before {
    content: "Actions: ";
  }
  
  .deleted-badge {
    align-self: flex-end;
  }
  
  .role-icon {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }
  
  .user-actions {
    justify-content: flex-end;
  }
}

@media (max-width: 480px) {
  .dashboard-title {
    font-size: 1.8rem;
  }
  
  .welcome-message {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .users-table {
    font-size: 0.75rem;
  }
  
  .users-table th,
  .users-table td {
    padding: var(--spacing-sm);
  }
}
</style>

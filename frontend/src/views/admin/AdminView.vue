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
                @input="(event) => searchQuery = (event.target as HTMLInputElement).value"
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
                      v-if="!user.deleted && user.role !== 'admin'"
                      @click="deleteUser(user.id)"
                      class="action-btn delete-btn"
                      title="Désactiver cet utilisateur"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                    <span v-else-if="user.deleted" class="deleted-status">
                      Désactivé
                    </span>
                    <span v-else-if="user.role === 'admin'" class="admin-protected">
                      <i class="fas fa-shield-alt"></i>
                      Protégé
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Section Configuration des Produits -->
      <section class="dashboard-section accordion-section">
        <div class="section-header accordion-header" @click="toggleProductsSection">
          <div class="header-left">
            <h2 class="section-title">
              <i class="fas fa-cog"></i>
              Configuration des Produits
            </h2>
            <div class="section-stats">
              <span class="stat-item">
                <i class="fas fa-layer-group"></i>
                {{ totalProducts }} produits configurés
              </span>
            </div>
          </div>
          <div class="accordion-icon">
            <i class="fas fa-chevron-down" :class="{ 'rotated': isProductsSectionOpen }"></i>
          </div>
        </div>

        <div class="accordion-content" :class="{ 'open': isProductsSectionOpen }">
          <!-- Étape 1: Fonds de base -->
          <div class="product-step-section">
            <h3 class="subsection-title">
              <span class="step-number">1</span>
              Pour commencer, choisissez votre fond de tartelette
            </h3>
            <p class="step-description">Configurez les 3 fonds de base disponibles pour les tartelettes</p>
            
            <div class="products-grid">
              <div v-for="(fond, index) in fonds" :key="index" class="product-config-card">
                <div class="card-header">
                  <h4>Fond {{ index + 1 }}</h4>
                  <button @click="editFond(index)" class="edit-btn" title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
                
                <div class="product-preview">
                  <img :src="fond.image || '/placeholder.jpg'" :alt="fond.nom" />
                  <div class="product-info">
                    <strong>{{ fond.nom || 'Nom à définir' }}</strong>
                    <span class="status" :class="{ 'configured': fond.nom && fond.image, 'pending': !fond.nom || !fond.image }">
                      {{ fond.nom && fond.image ? 'Configuré' : 'En attente' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 2: Première couche de douceur -->
          <div class="product-step-section">
            <h3 class="subsection-title">
              <span class="step-number">2</span>
              Votre première couche de douceur
            </h3>
            <p class="step-description">Configurez les 4 CTA/liens de la première couche avec leurs 3 images d'évolution</p>
            
            <div class="products-grid">
              <div v-for="(douceur, index) in premiereCoucheDouceur" :key="index" class="product-config-card">
                <div class="card-header">
                  <h4>CTA {{ index + 1 }}</h4>
                  <button @click="editPremiereCouche(index)" class="edit-btn" title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
                
                <div class="product-preview">
                  <div class="image-gallery">
                    <img v-for="(img, imgIndex) in douceur.images" :key="imgIndex" 
                         :src="img || '/placeholder.jpg'" :alt="`${douceur.nom} - Image ${imgIndex + 1}`" />
                  </div>
                  <div class="product-info">
                    <strong>{{ douceur.nom || 'Nom du CTA à définir' }}</strong>
                    <span class="status" :class="{ 'configured': douceur.nom && douceur.images.every(img => img), 'pending': !douceur.nom || douceur.images.some(img => !img) }">
                      {{ douceur.nom && douceur.images.every(img => img) ? 'Configuré' : 'En attente' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 3: Seconde couche de douceur -->
          <div class="product-step-section">
            <h3 class="subsection-title">
              <span class="step-number">3</span>
              Votre seconde couche de douceur
            </h3>
            <p class="step-description">Configurez les 4 CTA/liens de la seconde couche avec leurs 3 images d'évolution</p>
            
            <div class="products-grid">
              <div v-for="(douceur, index) in secondeCoucheDouceur" :key="index" class="product-config-card">
                <div class="card-header">
                  <h4>CTA {{ index + 1 }}</h4>
                  <button @click="editSecondeCouche(index)" class="edit-btn" title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
                
                <div class="product-preview">
                  <div class="image-gallery">
                    <img v-for="(img, imgIndex) in douceur.images" :key="imgIndex" 
                         :src="img || '/placeholder.jpg'" :alt="`${douceur.nom} - Image ${imgIndex + 1}`" />
                  </div>
                  <div class="product-info">
                    <strong>{{ douceur.nom || 'Nom du CTA à définir' }}</strong>
                    <span class="status" :class="{ 'configured': douceur.nom && douceur.images.every(img => img), 'pending': !douceur.nom || douceur.images.some(img => !img) }">
                      {{ douceur.nom && douceur.images.every(img => img) ? 'Configuré' : 'En attente' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 4: La touche finale -->
          <div class="product-step-section">
            <h3 class="subsection-title">
              <span class="step-number">4</span>
              La touche finale
            </h3>
            <p class="step-description">Configurez les 4 CTA/liens de la touche finale avec leurs 3 images d'évolution</p>
            
            <div class="products-grid">
              <div v-for="(finition, index) in toucheFinale" :key="index" class="product-config-card">
                <div class="card-header">
                  <h4>CTA {{ index + 1 }}</h4>
                  <button @click="editToucheFinale(index)" class="edit-btn" title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
                
                <div class="product-preview">
                  <div class="image-gallery">
                    <img v-for="(img, imgIndex) in finition.images" :key="imgIndex" 
                         :src="img || '/placeholder.jpg'" :alt="`${finition.nom} - Image ${imgIndex + 1}`" />
                  </div>
                  <div class="product-info">
                    <strong>{{ finition.nom || 'Nom du CTA à définir' }}</strong>
                    <span class="status" :class="{ 'configured': finition.nom && finition.images.every(img => img), 'pending': !finition.nom || finition.images.some(img => !img) }">
                      {{ finition.nom && finition.images.every(img => img) ? 'Configuré' : 'En attente' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Modal de configuration des produits -->
      <div v-if="showProductModal" class="modal-overlay" @click="closeProductModal">
        <div class="product-modal" @click.stop>
          <div class="modal-header">
            <h3>{{ modalTitle }}</h3>
            <button @click="closeProductModal" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-content">
            <!-- Configuration des fonds -->
            <div v-if="editingType === 'fond'" class="product-config">
              <div class="form-group">
                <label for="fondName">Nom du fond *</label>
                <input 
                  id="fondName"
                  v-model="editingProduct.nom" 
                  type="text" 
                  placeholder="Ex: Pâte sucrée vanille"
                  required
                />
              </div>
              <div class="form-group">
                <label for="fondImage">Image du fond *</label>
                <input 
                  id="fondImage"
                  v-model="editingProduct.image" 
                  type="url" 
                  placeholder="https://exemple.com/image.jpg"
                  required
                />
                <div class="image-preview" v-if="editingProduct.image">
                  <img :src="editingProduct.image" alt="Aperçu" />
                </div>
              </div>
            </div>

            <!-- Configuration des douceurs -->
            <div v-if="editingType === 'douceur'" class="product-config">
              <div class="form-group">
                <label for="douceurName">Nom du CTA/Lien *</label>
                <input 
                  id="douceurName"
                  v-model="editingProduct.nom" 
                  type="text" 
                  placeholder="Ex: Crème pâtissière vanille"
                  required
                />
              </div>
              <div class="form-group">
                <label>Images d'évolution (3 images) *</label>
                <div class="image-inputs">
                  <div v-for="(img, index) in editingProduct.images" :key="index" class="image-input">
                    <label :for="`douceurImage${index + 1}`">Image {{ index + 1 }}</label>
                    <input 
                      :id="`douceurImage${index + 1}`"
                      v-model="editingProduct.images[index]" 
                      type="url" 
                      :placeholder="`URL de l'image ${index + 1}`"
                      required
                    />
                    <div class="image-preview" v-if="editingProduct.images[index]">
                      <img :src="editingProduct.images[index]" alt="Aperçu" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Configuration des finitions -->
            <div v-if="editingType === 'finition'" class="product-config">
              <div class="form-group">
                <label for="finitionName">Nom du CTA/Lien *</label>
                <input 
                  id="finitionName"
                  v-model="editingProduct.nom" 
                  type="text" 
                  placeholder="Ex: Meringue italienne"
                  required
                />
              </div>
              <div class="form-group">
                <label>Images d'évolution (3 images) *</label>
                <div class="image-inputs">
                  <div v-for="(img, index) in editingProduct.images" :key="index" class="image-input">
                    <label :for="`finitionImage${index + 1}`">Image {{ index + 1 }}</label>
                    <input 
                      :id="`finitionImage${index + 1}`"
                      v-model="editingProduct.images[index]" 
                      type="url" 
                      :placeholder="`URL de l'image ${index + 1}`"
                      required
                    />
                    <div class="image-preview" v-if="editingProduct.images[index]">
                      <img :src="editingProduct.images[index]" alt="Aperçu" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="modal-actions">
              <button @click="closeProductModal" class="btn-secondary">
                Annuler
              </button>
              <button @click="saveProductConfig" class="btn-primary" :disabled="!canSave">
                <i class="fas fa-save"></i>
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { supabase } from '@/services/supabaseService'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  updated_at?: string
  deleted?: boolean
  deleted_at?: string
}

const users = ref<User[]>([])
const isLoading = ref(false)
const isUsersSectionOpen = ref(false) // Par défaut fermé
const isProductsSectionOpen = ref(true) // Par défaut ouvert pour voir toutes les étapes

const searchQuery = ref('')
const router = useRouter()
const authStore = useAuthStore()

// Variables pour la configuration des produits
const showProductModal = ref(false)
const editingProduct = ref<any>(null)
const editingType = ref<string | null>(null) // 'fond', 'douceur', 'finition'
const isSaving = ref(false)

// Data for product configurations
const fonds = ref([
  { nom: 'Pâte sucrée vanille', image: null },
  { nom: 'Pâte sucrée chocolat', image: null },
  { nom: 'Pâte sucrée framboise', image: null }
])

const premiereCoucheDouceur = ref([
  { nom: 'Crème pâtissière vanille', images: [null, null, null] },
  { nom: 'Crème pâtissière chocolat', images: [null, null, null] },
  { nom: 'Crème pâtissière framboise', images: [null, null, null] },
  { nom: 'Crème pâtissière fraise', images: [null, null, null] }
])

const secondeCoucheDouceur = ref([
  { nom: 'Crème pâtissière vanille', images: [null, null, null] },
  { nom: 'Crème pâtissière chocolat', images: [null, null, null] },
  { nom: 'Crème pâtissière framboise', images: [null, null, null] },
  { nom: 'Crème pâtissière fraise', images: [null, null, null] }
])

const toucheFinale = ref([
  { nom: 'Meringue italienne', images: [null, null, null] },
  { nom: 'Meringue chantilly', images: [null, null, null] },
  { nom: 'Glaçage miroir', images: [null, null, null] },
  { nom: 'Décors chocolat', images: [null, null, null] }
])



// Computed properties
const activeUsers = computed(() => users.value.filter(user => !user.deleted).length)
const deletedUsers = computed(() => users.value.filter(user => user.deleted).length)

// Computed properties pour les produits de configuration
const totalProducts = computed(() => {
  const fondsConfigured = fonds.value.filter(f => f.nom && f.image).length
  const premiereCoucheConfigured = premiereCoucheDouceur.value.filter(d => d.nom && d.images.every((img: any) => img)).length
  const secondeCoucheConfigured = secondeCoucheDouceur.value.filter(d => d.nom && d.images.every((img: any) => img)).length
  const toucheFinaleConfigured = toucheFinale.value.filter(f => f.nom && f.images.every((img: any) => img)).length
  return fondsConfigured + premiereCoucheConfigured + secondeCoucheConfigured + toucheFinaleConfigured
})

const modalTitle = computed(() => {
  switch (editingType.value) {
    case 'fond': return 'Configurer le fond'
    case 'douceur': return 'Configurer le CTA de douceur'
    case 'finition': return 'Configurer le CTA de finition'
    default: return 'Configuration'
  }
})

const canSave = computed(() => {
  if (!editingProduct.value) return false
  
  switch (editingType.value) {
    case 'fond':
      return editingProduct.value.nom && editingProduct.value.image
    case 'douceur':
    case 'finition':
      return editingProduct.value.nom && editingProduct.value.images.every((img: any) => img)
    default:
      return false
  }
})



// Filtrage des utilisateurs par recherche
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(user => 
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

// Fonctions pour la configuration des produits
const toggleProductsSection = () => {
  isProductsSectionOpen.value = !isProductsSectionOpen.value
}

const editFond = (index: number) => {
  editingProduct.value = fonds.value[index]
  editingType.value = 'fond'
  showProductModal.value = true
}

const editPremiereCouche = (index: number) => {
  editingProduct.value = premiereCoucheDouceur.value[index]
  editingType.value = 'douceur'
  showProductModal.value = true
}

const editSecondeCouche = (index: number) => {
  editingProduct.value = secondeCoucheDouceur.value[index]
  editingType.value = 'douceur'
  showProductModal.value = true
}

const editToucheFinale = (index: number) => {
  editingProduct.value = toucheFinale.value[index]
  editingType.value = 'finition'
  showProductModal.value = true
}

const saveProductConfig = async () => {
  if (!canSave.value) return

  isSaving.value = true

  try {
    // Sauvegarder dans localStorage pour l'instant
    if (editingType.value === 'fond') {
      const fondIndex = fonds.value.findIndex(f => f === editingProduct.value)
      if (fondIndex !== -1) {
        fonds.value[fondIndex] = { ...editingProduct.value }
      }
    } else if (editingType.value === 'douceur') {
      let douceurIndex = premiereCoucheDouceur.value.findIndex(d => d === editingProduct.value)
      if (douceurIndex !== -1) {
        premiereCoucheDouceur.value[douceurIndex] = { ...editingProduct.value }
      } else {
        douceurIndex = secondeCoucheDouceur.value.findIndex(d => d === editingProduct.value)
        if (douceurIndex !== -1) {
          secondeCoucheDouceur.value[douceurIndex] = { ...editingProduct.value }
        }
      }
    } else if (editingType.value === 'finition') {
      const finitionIndex = toucheFinale.value.findIndex(f => f === editingProduct.value)
      if (finitionIndex !== -1) {
        toucheFinale.value[finitionIndex] = { ...editingProduct.value }
      }
    }

    // Sauvegarder dans localStorage
    localStorage.setItem('amande_product_config', JSON.stringify({
      fonds: fonds.value,
      premiereCoucheDouceur: premiereCoucheDouceur.value,
      secondeCoucheDouceur: secondeCoucheDouceur.value,
      toucheFinale: toucheFinale.value
    }))

    console.log('✅ Configuration sauvegardée avec succès')
    closeProductModal()

  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde de la configuration:', error)
    alert('Erreur lors de la sauvegarde de la configuration')
  } finally {
    isSaving.value = false
  }
}

const closeProductModal = () => {
  showProductModal.value = false
  editingProduct.value = null
  editingType.value = null
}

const loadProductConfig = () => {
  try {
    const config = localStorage.getItem('amande_product_config')
    if (config) {
      const parsedConfig = JSON.parse(config)
      if (parsedConfig.fonds) fonds.value = parsedConfig.fonds
      if (parsedConfig.premiereCoucheDouceur) premiereCoucheDouceur.value = parsedConfig.premiereCoucheDouceur
      if (parsedConfig.secondeCoucheDouceur) secondeCoucheDouceur.value = parsedConfig.secondeCoucheDouceur
      if (parsedConfig.toucheFinale) toucheFinale.value = parsedConfig.toucheFinale
    }
  } catch (error) {
    console.error('Erreur lors du chargement de la configuration:', error)
  }
}

onMounted(async () => {
  // Vérifier si l'utilisateur est connecté et admin
  if (!authStore.user || !authStore.isAdmin) {
    console.log('❌ Accès refusé: utilisateur non connecté ou non admin')
    router.push('/')
    return
  }
  
  console.log('✅ Accès admin autorisé')
  await loadUsers()
  loadProductConfig() // Charger la configuration depuis localStorage au chargement
  
  // Auto-refresh toutes les 30 secondes
  setInterval(async () => {
    await loadUsers()
    loadProductConfig() // Recharger la configuration au refresh
  }, 30000)
  
  // Écouter les modifications de profil pour rafraîchir le dashboard
  const handleProfileUpdate = () => {
    loadUsers()
  }
  
  // Ajouter un listener pour les modifications de profil
  window.addEventListener('profile-updated', handleProfileUpdate)
  
  // Cleanup
  onUnmounted(() => {
    window.removeEventListener('profile-updated', handleProfileUpdate)
  })
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
/* Variables CSS pour les espacements */
:root {
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-xxl: 3rem;
}

/* Styles du dashboard admin */
.admin-dashboard {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
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
  max-height: 6000px; /* Valeur plus grande pour afficher toutes les 4 étapes sur tous les écrans */
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

.modified-badge {
  background: #383961;
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

.admin-protected {
  color: #ff6f61;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
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

/* Styles pour la gestion des produits */
.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th {
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

.products-table td {
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.product-row {
  transition: background-color 0.2s ease;
}

.product-row:hover {
  background-color: #f8f9fa;
}

.product-image img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.product-name {
  font-weight: 600;
  color: var(--text-color);
}

.product-category {
  color: var(--text-color);
  opacity: 0.8;
  font-size: 0.9rem;
}

.product-price {
  font-weight: 600;
  color: var(--accent-color);
  font-size: 1.1rem;
}

.product-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.stat-link {
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
  padding: 0;
}

.stat-link:hover {
  color: var(--accent-color-dark);
}

.subsection-title {
  color: var(--text-color);
  font-family: var(--font-family-title);
  font-size: 1.2rem;
  margin: var(--spacing-lg) 0 var(--spacing-md) 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--accent-color);
}

.create-first-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.create-first-btn:hover {
  background: var(--accent-color-dark);
  transform: translateY(-1px);
}

/* Modal de produit */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.product-modal {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: var(--text-color);
  font-family: var(--font-family-title);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: var(--spacing-xs);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-content {
  padding: var(--spacing-xl);
}

/* Barre de progression des étapes */
.product-progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
  gap: var(--spacing-xs);
}

.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e0e0e0;
  transition: all 0.3s ease;
}

.progress-dot.active {
  background: var(--accent-color);
  transform: scale(1.2);
}

.progress-dot.done {
  background: var(--accent-color);
}

.progress-bar {
  width: 40px;
  height: 2px;
  background: #e0e0e0;
  transition: all 0.3s ease;
}

.progress-bar.done {
  background: var(--accent-color);
}

/* Étapes du produit */
.product-step {
  margin-bottom: var(--spacing-xl);
}

.step-title {
  color: var(--text-color);
  font-family: var(--font-family-title);
  font-size: 1.3rem;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid var(--accent-color);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  color: var(--text-color);
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: var(--font-family-text);
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.1);
}

.form-help {
  display: block;
  margin-top: var(--spacing-xs);
  color: #666;
  font-size: 0.85rem;
  font-style: italic;
}

/* Aperçu d'image */
.image-preview {
  margin-top: var(--spacing-md);
  text-align: center;
}

.image-preview img {
  max-width: 200px;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.preview-text {
  margin-top: var(--spacing-sm);
  color: #666;
  font-size: 0.9rem;
}

/* Résumé du produit */
.product-summary {
  background: #f8f9fa;
  padding: var(--spacing-lg);
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.summary-item {
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid #e0e0e0;
}

.summary-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.summary-item strong {
  color: var(--text-color);
  display: inline-block;
  min-width: 100px;
}

.final-preview {
  max-width: 150px;
  max-height: 100px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  margin-top: var(--spacing-xs);
}

/* Navigation des étapes */
.product-step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid #e0e0e0;
}

.step-btn {
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.step-btn.primary {
  background: var(--accent-color);
  color: white;
}

.step-btn.primary:hover:not(:disabled) {
  background: var(--accent-color-dark);
  transform: translateY(-2px);
}

.step-btn.primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.step-btn.secondary {
  background: #f0f0f0;
  color: var(--text-color);
}

.step-btn.secondary:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

/* Responsive pour les produits */
@media (max-width: 768px) {
  .product-modal {
    max-width: 95vw;
    margin: var(--spacing-sm);
  }
  
  .modal-content {
    padding: var(--spacing-lg);
  }
  
  .product-step-navigation {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .step-btn {
    width: 100%;
    justify-content: center;
  }
  
  .products-table {
    display: block;
  }
  
  .products-table thead {
    display: none;
  }
  
  .products-table tbody {
    display: block;
  }
  
  .products-table tr {
    display: block;
    background: var(--white);
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: var(--spacing-md);
    padding: var(--spacing-lg);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .products-table td {
    display: block;
    padding: var(--spacing-sm) 0;
    border: none;
    text-align: left;
  }
  
  .product-image img {
    width: 80px;
    height: 80px;
  }
  
  .product-actions {
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

/* Assurer que le contenu principal a un padding-bottom suffisant */
.dashboard-content {
  padding-bottom: var(--spacing-xxl);
  min-height: calc(100vh - 100px);
  position: relative;
  z-index: 1;
}

/* Styles for product configurations */
.product-step-section {
  margin-bottom: var(--spacing-xxl);
  padding: var(--spacing-lg);
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-step-section:last-child {
  margin-bottom: var(--spacing-xxl);
  padding-bottom: var(--spacing-xxl);
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--accent-color);
  color: white;
  border-radius: 50%;
  font-weight: bold;
  margin-right: var(--spacing-md);
  font-size: 1.1rem;
}

.step-description {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: var(--spacing-lg);
  font-style: italic;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.product-config-card {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-config-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: #e0e0e0;
  border-bottom: 1px solid #d0d0d0;
}

.card-header h4 {
  margin: 0;
  color: var(--text-color);
  font-family: var(--font-family-title);
  font-size: 1rem;
}

.edit-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: rgba(255, 111, 97, 0.1);
  color: var(--accent-color-dark);
}

.product-preview {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.product-preview img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-gallery {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--spacing-sm);
}

.image-gallery img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-info {
  width: 100%;
  text-align: center;
}

.product-info strong {
  display: block;
  color: var(--text-color);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-xs);
}

.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status.configured {
  background-color: #d4edda;
  color: #155724;
}

.status.pending {
  background-color: #fff3cd;
  color: #856404;
}

/* Modal de configuration */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid #e0e0e0;
}

.btn-primary, .btn-secondary {
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.btn-primary {
  background: var(--accent-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--accent-color-dark);
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #f0f0f0;
  color: var(--text-color);
}

.btn-secondary:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

/* Configuration des images multiples */
.image-inputs {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.image-input {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.image-input label {
  font-size: 0.85rem;
  color: var(--text-color);
  font-weight: 600;
}

.image-input input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
}

.image-input input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.1);
}

.image-input .image-preview {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.image-input .image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

/* Responsive pour les configurations */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .image-inputs {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .image-input {
    width: 100%;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  
  /* Ajuster l'espacement sur mobile pour éviter le chevauchement */
  .dashboard-content {
    padding-bottom: calc(var(--spacing-xxl) * 3);
  }
  
  .product-step-section {
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-md);
  }
  
  .product-step-section:last-child {
    margin-bottom: calc(var(--spacing-xxl) * 3);
    padding-bottom: calc(var(--spacing-xxl) * 3);
  }
}

</style>

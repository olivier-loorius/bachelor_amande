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
              <span class="stat-item">
                <i class="fas fa-edit"></i>
                {{ totalPending }} en attente
              </span>
            </div>
          </div>
          <div class="accordion-icon">
            <i class="fas fa-chevron-down" :class="{ 'rotated': isProductsSectionOpen }"></i>
          </div>
        </div>

        <div class="accordion-content" :class="{ 'open': isProductsSectionOpen }">
          <!-- Barre d'actions rapides -->
          <div class="products-action-bar">
            <div class="action-group">
              <button @click="loadProductConfig" class="action-btn secondary-btn" :disabled="isLoadingProducts || hasUnlockedProducts" :title="hasUnlockedProducts ? 'Sauvegardez d\'abord vos modifications avant d\'actualiser' : 'Actualiser la configuration'">
                <i class="fas fa-sync-alt"></i>
                <span>{{ isLoadingProducts ? 'Chargement...' : 'Actualiser' }}</span>
              </button>
              <button @click="resetAllProducts" class="action-btn danger-btn" :disabled="hasUnlockedProducts" :title="hasUnlockedProducts ? 'Sauvegardez d\'abord vos modifications avant de remettre à zéro' : 'Remettre à zéro tous les produits'">
                <i class="fas fa-undo"></i>
                Reset complet
              </button>
              <button @click="initializeSupabaseConfig" class="action-btn primary-btn">
                <i class="fas fa-database"></i>
                Initialiser Supabase
              </button>
            </div>
            <div class="view-toggle">
              <button 
                @click="productsViewMode = 'grid'" 
                class="view-btn" 
                :class="{ active: productsViewMode === 'grid' }"
                title="Vue en grille"
              >
                <i class="fas fa-th"></i>
              </button>
              <button 
                @click="productsViewMode = 'list'" 
                class="view-btn" 
                :class="{ active: productsViewMode === 'list' }"
                title="Vue en liste"
              >
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>

          <!-- Étape 1: Fonds -->
          <div class="product-step-section">
            <div class="step-header">
              <h3 class="subsection-title">
                <span class="step-number">1</span>
                Fonds
              </h3>
              <p class="step-description">3 produits avec 1 image chacun</p>
              <div class="step-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: fondsProgress + '%' }"></div>
                </div>
                <span class="progress-text">{{ fondsConfigured }}/3 configurés</span>
              </div>
            </div>
            
            <div class="products-container" :class="productsViewMode">
              <div v-for="(fond, index) in fonds" :key="index" class="product-card">
                <div class="card-header">
                  <div class="product-index">Produit {{ index + 1 }}</div>
                  <div class="card-actions">
                    <button @click="toggleLock('fond', index)" class="action-btn edit-btn" :class="{ 'unlocked': !lockedProducts.fonds[index] }" :title="lockedProducts.fonds[index] ? 'Déverrouiller pour modifier' : 'Verrouiller'">
                      <i class="fas" :class="lockedProducts.fonds[index] ? 'fa-lock' : 'fa-unlock'"></i>
                    </button>
                    <button @click="resetFond(index)" class="action-btn reset-btn" :disabled="lockedProducts.fonds[index]" :title="lockedProducts.fonds[index] ? 'Déverrouillez d\'abord pour remettre à zéro' : 'Remettre à zéro'">
                      <i class="fas fa-undo"></i>
                    </button>
                  </div>
                </div>
                
                <div class="product-content">
                  <div class="product-details">
                    <div class="product-name">
                      <input 
                        v-model="fond.nom" 
                        type="text" 
                        :placeholder="`Nom du produit ${index + 1}`"
                        class="inline-input"
                        :disabled="lockedProducts.fonds[index]"
                        @blur="saveFond(index)"
                      />
                    </div>
                    
                    <div class="product-status">
                      <span class="status-badge" :class="{ 
                        'configured': lockedProducts.fonds[index] && fond.nom && fond.image, 
                        'pending': !lockedProducts.fonds[index] || !fond.nom || !fond.image 
                      }">
                        {{ lockedProducts.fonds[index] && fond.nom && fond.image ? '✅ Configuré' : '⏳ En attente' }}
                      </span>
                    </div>
                    
                    <div class="image-upload-group" :class="{ 'locked': lockedProducts.fonds[index] }">
                      <label>Image du produit :</label>
                      <div class="upload-container">
                        <div class="upload-area" @click="lockedProducts.fonds[index] ? null : triggerFileUpload(index, 'fond')" @drop="lockedProducts.fonds[index] ? null : handleFileDrop($event, index, 'fond')" @dragover.prevent @dragenter.prevent @dragleave.prevent @dragenter="handleDragEnter($event, index, 'fond')" @dragleave="handleDragLeave($event, index, 'fond')" :class="{ 'disabled': lockedProducts.fonds[index], 'dragover': dragStates.fonds[index] }">
                          <i class="fas fa-cloud-upload-alt" v-if="!isUploadingImages"></i>
                          <i class="fas fa-spinner fa-spin" v-else></i>
                          <span v-if="!isUploadingImages">Glissez une image depuis un dossier ou cliquez pour sélectionner</span>
                          <span v-else>Upload en cours...</span>
                        </div>
                        <input 
                          :id="`fileInput-${index}-fond`"
                          type="file" 
                          accept="image/*"
                          @change="handleFileSelect($event, index, 'fond')"
                          style="display: none;"
                          :disabled="lockedProducts.fonds[index]"
                        />
                      </div>
                    </div>
                    
                    <!-- Bouton de validation -->
                    <div v-if="!lockedProducts.fonds[index]" class="validation-actions">
                      <button @click="validateProduct('fond', index)" class="action-btn validate-btn" :disabled="!fond.nom || !fond.image">
                        <i class="fas fa-check"></i>
                        Valider
                      </button>
                    </div>
                  </div>
                  
                  <!-- Vignette agrandie de l'image -->
                  <div class="image-preview-large">
                    <div v-if="fond.image" class="image-with-actions">
                      <img 
                        :src="fond.image" 
                        :alt="`${fond.nom || 'Produit'} - Image`"
                        @error="(event: Event) => { const target = event.target as HTMLImageElement; if (target) target.src = '/placeholder-fond.svg' }"
                      />
                      <button @click="removeImage('fond', index)" class="remove-image-btn" title="Supprimer l'image">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                    <div v-else class="image-placeholder-large">
                      <i class="fas fa-image"></i>
                      <span>Aucune image</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 2: Première couche de douceur -->
          <div class="product-step-section">
            <div class="step-header">
              <h3 class="subsection-title">
                <span class="step-number">2</span>
                Première couche de douceur
              </h3>
              <p class="step-description">4 produits avec 3 images d'évolution chacune</p>
              <div class="step-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: premiereCoucheProgress + '%' }"></div>
                </div>
                <span class="progress-text">{{ premiereCoucheConfigured }}/4 configurés</span>
              </div>
            </div>
            
            <div class="products-container" :class="productsViewMode">
              <div v-for="(douceur, index) in premiereCoucheDouceur" :key="index" class="product-card">
                <div class="card-header">
                  <div class="product-index">Produit {{ index + 1 }}</div>
                  <div class="card-actions">
                    <button @click="toggleLock('premiere', index)" class="action-btn edit-btn" :class="{ 'unlocked': !lockedProducts.premiereDouceur[index] }" :title="lockedProducts.premiereDouceur[index] ? 'Déverrouiller pour modifier' : 'Verrouiller'">
                      <i class="fas" :class="lockedProducts.premiereDouceur[index] ? 'fa-lock' : 'fa-unlock'"></i>
                    </button>
                    <button @click="resetDouceur(index, 'premiere')" class="action-btn reset-btn" :disabled="lockedProducts.premiereDouceur[index]" :title="lockedProducts.premiereDouceur[index] ? 'Déverrouillez d\'abord pour remettre à zéro' : 'Remettre à zéro'">
                      <i class="fas fa-undo"></i>
                    </button>
                  </div>
                </div>
                
                <div class="product-content">
                  <div class="product-details">
                    <div class="product-name">
                      <input 
                        v-model="douceur.nom" 
                        type="text" 
                        :placeholder="`Nom du produit ${index + 1}`"
                        class="inline-input"
                        :disabled="lockedProducts.premiereDouceur[index]"
                        @blur="saveDouceur(index, 'premiere')"
                      />
                    </div>
                    
                    <div class="product-status">
                      <span class="status-badge" :class="{ 
                        'configured': lockedProducts.premiereDouceur[index] && douceur.nom && douceur.images.every(img => img), 
                        'pending': !lockedProducts.premiereDouceur[index] || !douceur.nom || douceur.images.some(img => !img) 
                      }">
                        {{ lockedProducts.premiereDouceur[index] && douceur.nom && douceur.images.every(img => img) ? '✅ Configuré' : '⏳ En attente' }}
                      </span>
                    </div>
                    
                    <div class="image-upload-group" :class="{ 'locked': lockedProducts.premiereDouceur[index] }">
                      <label>Images d'évolution :</label>
                      <div class="upload-container">
                        <div class="upload-area" @click="lockedProducts.premiereDouceur[index] ? null : triggerFileUpload(index, 'premiere')" @drop="lockedProducts.premiereDouceur[index] ? null : handleFileDrop($event, index, 'premiere')" @dragover.prevent @dragenter.prevent @dragleave.prevent @dragenter="handleDragEnter($event, index, 'premiere')" @dragleave="handleDragLeave($event, index, 'premiere')" :class="{ 'disabled': lockedProducts.premiereDouceur[index], 'dragover': dragStates.premiereDouceur[index] }">
                          <i class="fas fa-cloud-upload-alt"></i>
                          <span>Glissez 3 images depuis un dossier ou cliquez pour sélectionner</span>
                        </div>
                        <input 
                          :id="`fileInput-${index}-premiere`"
                          type="file" 
                          accept="image/*"
                          multiple
                          @change="handleFileSelect($event, index, 'premiere')"
                          style="display: none;"
                          :disabled="lockedProducts.premiereDouceur[index]"
                        />
                      </div>
                    </div>
                    
                    <!-- Bouton de validation -->
                    <div v-if="!lockedProducts.premiereDouceur[index]" class="validation-actions">
                      <button @click="validateProduct('premiere', index)" class="action-btn validate-btn" :disabled="!douceur.nom || !douceur.images.every(img => img)">
                        <i class="fas fa-check"></i>
                        Valider
                      </button>
                    </div>
                  </div>
                  
                  <!-- Affichage des 3 images sur lignes séparées -->
                  <div class="selected-images-preview">
                    <h4>Images sélectionnées :</h4>
                    <div class="images-vertical">
                      <div v-for="(img, imgIndex) in douceur.images" :key="imgIndex" class="preview-image-vertical">
                        <div class="image-container">
                          <img 
                            :src="img || '/placeholder-garniture.svg'" 
                            :alt="`${douceur.nom || 'Produit'} - Image ${imgIndex + 1}`"
                            @error="(event: Event) => { const target = event.target as HTMLImageElement; if (target) target.src = '/placeholder-garniture.svg' }"
                          />
                          <div v-if="!img" class="image-placeholder">
                            <i class="fas fa-image"></i>
                            <span>Image {{ imgIndex + 1 }}</span>
                          </div>
                          <span class="image-number">{{ imgIndex + 1 }}</span>
                        </div>
                        <button v-if="img" @click="removeImage('premiere', index, imgIndex)" class="remove-image-btn" title="Supprimer l'image">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 3: Seconde couche de douceur -->
          <div class="product-step-section">
            <div class="step-header">
              <h3 class="subsection-title">
                <span class="step-number">3</span>
                Seconde couche de douceur
              </h3>
              <p class="step-description">4 produits avec 3 images d'évolution chacune</p>
              <div class="step-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: secondeCoucheProgress + '%' }"></div>
                </div>
                <span class="progress-text">{{ secondeCoucheConfigured }}/4 configurés</span>
              </div>
            </div>
            
            <div class="products-container" :class="productsViewMode">
              <div v-for="(douceur, index) in secondeCoucheDouceur" :key="index" class="product-card">
                <div class="card-header">
                  <div class="product-index">Produit {{ index + 1 }}</div>
                  <div class="card-actions">
                    <button @click="toggleLock('seconde', index)" class="action-btn edit-btn" :class="{ 'unlocked': !lockedProducts.secondeDouceur[index] }" :title="lockedProducts.secondeDouceur[index] ? 'Déverrouiller pour modifier' : 'Verrouiller'">
                      <i class="fas" :class="lockedProducts.secondeDouceur[index] ? 'fa-lock' : 'fa-unlock'"></i>
                    </button>
                    <button @click="resetDouceur(index, 'seconde')" class="action-btn reset-btn" :disabled="lockedProducts.secondeDouceur[index]" :title="lockedProducts.secondeDouceur[index] ? 'Déverrouillez d\'abord pour remettre à zéro' : 'Remettre à zéro'">
                      <i class="fas fa-undo"></i>
                    </button>
                  </div>
                </div>
                
                <div class="product-content">
                  <div class="product-details">
                    <div class="product-name">
                      <input 
                        v-model="douceur.nom" 
                        type="text" 
                        :placeholder="`Nom du produit ${index + 1}`"
                        class="inline-input"
                        :disabled="lockedProducts.secondeDouceur[index]"
                        @blur="saveDouceur(index, 'seconde')"
                      />
                    </div>
                    
                    <div class="product-status">
                      <span class="status-badge" :class="{ 
                        'configured': lockedProducts.secondeDouceur[index] && douceur.nom && douceur.images.every(img => img), 
                        'pending': !lockedProducts.secondeDouceur[index] || !douceur.nom || douceur.images.some(img => !img) 
                      }">
                        {{ lockedProducts.secondeDouceur[index] && douceur.nom && douceur.images.every(img => img) ? '✅ Configuré' : '⏳ En attente' }}
                      </span>
                    </div>
                    
                    <div class="image-upload-group" :class="{ 'locked': lockedProducts.secondeDouceur[index] }">
                      <label>Images d'évolution :</label>
                      <div class="upload-container">
                        <div class="upload-area" @click="lockedProducts.secondeDouceur[index] ? null : triggerFileUpload(index, 'seconde')" @drop="lockedProducts.secondeDouceur[index] ? null : handleFileDrop($event, index, 'seconde')" @dragover.prevent @dragenter.prevent @dragleave.prevent @dragenter="handleDragEnter($event, index, 'seconde')" @dragleave="handleDragLeave($event, index, 'seconde')" :class="{ 'disabled': lockedProducts.secondeDouceur[index], 'dragover': dragStates.secondeDouceur[index] }">
                          <i class="fas fa-cloud-upload-alt"></i>
                          <span>Glissez 3 images depuis un dossier ou cliquez pour sélectionner</span>
                        </div>
                        <input 
                          :id="`fileInput-${index}-seconde`"
                          type="file" 
                          accept="image/*"
                          multiple
                          @change="handleFileSelect($event, index, 'seconde')"
                          style="display:none;"
                          :disabled="lockedProducts.secondeDouceur[index]"
                        />
                      </div>
                    </div>
                    
                    <!-- Bouton de validation -->
                    <div v-if="!lockedProducts.secondeDouceur[index]" class="validation-actions">
                      <button @click="validateProduct('seconde', index)" class="action-btn validate-btn" :disabled="!douceur.nom || !douceur.images.every(img => img)">
                        <i class="fas fa-check"></i>
                        Valider
                      </button>
                    </div>
                  </div>
                  
                  <!-- Affichage des 3 images sur lignes séparées -->
                  <div class="selected-images-preview">
                    <h4>Images sélectionnées :</h4>
                    <div class="images-vertical">
                      <div v-for="(img, imgIndex) in douceur.images" :key="imgIndex" class="preview-image-vertical">
                        <div class="image-container">
                          <img 
                            :src="img || '/placeholder-garniture.svg'" 
                            :alt="`${douceur.nom || 'Produit'} - Image ${imgIndex + 1}`"
                            @error="(event: Event) => { const target = event.target as HTMLImageElement; if (target) target.src = '/placeholder-garniture.svg' }"
                          />
                          <div v-if="!img" class="image-placeholder">
                            <i class="fas fa-image"></i>
                            <span>Image {{ imgIndex + 1 }}</span>
                          </div>
                          <span class="image-number">{{ imgIndex + 1 }}</span>
                        </div>
                        <button v-if="img" @click="removeImage('seconde', index, imgIndex)" class="remove-image-btn" title="Supprimer l'image">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Étape 4: La touche finale -->
          <div class="product-step-section">
            <div class="step-header">
              <h3 class="subsection-title">
                <span class="step-number">4</span>
                La touche finale
              </h3>
              <p class="step-description">4 produits avec 3 images d'évolution chacune</p>
              <div class="step-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: toucheFinaleProgress + '%' }"></div>
                </div>
                <span class="progress-text">{{ toucheFinaleConfigured }}/4 configurés</span>
              </div>
            </div>
            
            <div class="products-container" :class="productsViewMode">
              <div v-for="(finition, index) in toucheFinale" :key="index" class="product-card">
                <div class="card-header">
                  <div class="product-index">Produit {{ index + 1 }}</div>
                  <div class="card-actions">
                    <button @click="toggleLock('finition', index)" class="action-btn edit-btn" :class="{ 'unlocked': !lockedProducts.finitions[index] }" :title="lockedProducts.finitions[index] ? 'Déverrouiller pour modifier' : 'Verrouiller'">
                      <i class="fas" :class="lockedProducts.finitions[index] ? 'fa-lock' : 'fa-unlock'"></i>
                    </button>
                    <button @click="resetFinition(index)" class="action-btn reset-btn" :disabled="lockedProducts.finitions[index]" :title="lockedProducts.finitions[index] ? 'Déverrouillez d\'abord pour remettre à zéro' : 'Remettre à zéro'">
                      <i class="fas fa-undo"></i>
                    </button>
                  </div>
                </div>
                
                <div class="product-content">
                  <div class="product-details">
                    <div class="product-name">
                      <input 
                        v-model="finition.nom" 
                        type="text" 
                        :placeholder="`Nom du produit ${index + 1}`"
                        class="inline-input"
                        :disabled="lockedProducts.finitions[index]"
                        @blur="saveFinition(index)"
                      />
                    </div>
                    
                    <div class="product-status">
                      <span class="status-badge" :class="{ 
                        'configured': lockedProducts.finitions[index] && finition.nom && finition.images.every(img => img), 
                        'pending': !lockedProducts.finitions[index] || !finition.nom || finition.images.some(img => !img) 
                      }">
                        {{ lockedProducts.finitions[index] && finition.nom && finition.images.every(img => img) ? '✅ Configuré' : '⏳ En attente' }}
                      </span>
                    </div>
                    
                    <div class="image-upload-group" :class="{ 'locked': lockedProducts.finitions[index] }">
                      <label>Images d'évolution :</label>
                      <div class="upload-container">
                        <div class="upload-area" @click="lockedProducts.finitions[index] ? null : triggerFileUpload(index, 'finition')" @drop="lockedProducts.finitions[index] ? null : handleFileDrop($event, index, 'finition')" @dragover.prevent @dragenter.prevent @dragleave.prevent @dragenter="handleDragEnter($event, index, 'finition')" @dragleave="handleDragLeave($event, index, 'finition')" :class="{ 'disabled': lockedProducts.finitions[index], 'dragover': dragStates.finitions[index] }">
                          <i class="fas fa-cloud-upload-alt"></i>
                          <span>Glissez 3 images depuis un dossier ou cliquez pour sélectionner</span>
                        </div>
                        <input 
                          :id="`fileInput-${index}-finition`"
                          type="file" 
                          accept="image/*"
                          multiple
                          @change="handleFileSelect($event, index, 'finition')"
                          style="display: none;"
                          :disabled="lockedProducts.finitions[index]"
                        />
                      </div>
                    </div>
                    
                    <!-- Bouton de validation -->
                    <div v-if="!lockedProducts.finitions[index]" class="validation-actions">
                      <button @click="validateProduct('finition', index)" class="action-btn validate-btn" :disabled="!finition.nom || !finition.images.every(img => img)">
                        <i class="fas fa-check"></i>
                        Valider
                      </button>
                    </div>
                  </div>
                  
                  <!-- Affichage des 3 images sur lignes séparées -->
                  <div class="selected-images-preview">
                    <h4>Images sélectionnées :</h4>
                    <div class="images-vertical">
                      <div v-for="(img, imgIndex) in finition.images" :key="imgIndex" class="preview-image-vertical">
                        <div class="image-container">
                          <img 
                            :src="img || '/placeholder-garniture.svg'" 
                            :alt="`${finition.nom || 'Produit'} - Image ${imgIndex + 1}`"
                            @error="(event: Event) => { const target = event.target as HTMLImageElement; if (target) target.src = '/placeholder-garniture.svg' }"
                          />
                          <div v-if="!img" class="image-placeholder">
                            <i class="fas fa-image"></i>
                            <span>Image {{ imgIndex + 1 }}</span>
                          </div>
                          <span class="image-number">{{ imgIndex + 1 }}</span>
                        </div>
                        <button v-if="img" @click="removeImage('finition', index, imgIndex)" class="remove-image-btn" title="Supprimer l'image">
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
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
                <label for="douceurName">Nom du produit *</label>
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
                <label for="finitionName">Nom du produit *</label>
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
import { productConfigService } from '@/services/productConfigService'
import type { ProductConfig } from '@/services/productConfigService'
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
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
const isLoadingProducts = ref(false)
const isUploadingImages = ref(false)
const productsViewMode = ref<'grid' | 'list'>('grid')

// État de verrouillage pour chaque produit
const lockedProducts = ref({
  fonds: [true, true, true],
  premiereDouceur: [true, true, true, true],
  secondeDouceur: [true, true, true, true],
  finitions: [true, true, true, true]
})

// État de drag & drop pour chaque zone d'upload
const dragStates = ref({
  fonds: [false, false, false],
  premiereDouceur: [false, false, false, false],
  secondeDouceur: [false, false, false, false],
  finitions: [false, false, false, false]
})

// Data for product configurations
const fonds = ref([
  { nom: '', image: null as string | null },
  { nom: '', image: null as string | null },
  { nom: '', image: null as string | null }
])

const premiereCoucheDouceur = ref([
  { nom: '', images: [null as string | null, null as string | null, null as string | null] },
  { nom: '', images: [null as string | null, null as string | null, null as string | null] },
  { nom: '', images: [null as string | null, null as string | null, null as string | null] },
  { nom: '', images: [null as string | null, null as string | null, null as string | null] }
])

const secondeCoucheDouceur = ref([
  { nom: '', images: [null as string | null, null as string | null, null as string | null] },
  { nom: '', images: [null as string | null, null as string | null, null as string | null] },
  { nom: '', images: [null as string | null, null as string | null, null as string | null] },
  { nom: '', images: [null as string | null, null as string | null, null as string | null] }
])

const toucheFinale = ref([
  { nom: '', images: [null as string | null, null as string | null, null as string | null] },
  { nom: '', images: [null as string | null, null as string | null, null as string | null] },
  { nom: '', images: [null as string | null, null as string | null, null as string | null] },
  { nom: '', images: [null as string | null, null as string | null, null as string | null] }
])

// Computed properties
const activeUsers = computed(() => users.value.filter(user => !user.deleted).length)
const deletedUsers = computed(() => users.value.filter(user => user.deleted).length)

// Computed properties pour les produits de configuration
const fondsConfigured = computed(() => fonds.value.filter(f => f.nom && f.image).length)
const premiereCoucheConfigured = computed(() => premiereCoucheDouceur.value.filter(d => d.nom && d.images.every((img: any) => img)).length)
const secondeCoucheConfigured = computed(() => secondeCoucheDouceur.value.filter(d => d.nom && d.images.every((img: any) => img)).length)
const toucheFinaleConfigured = computed(() => toucheFinale.value.filter(f => f.nom && f.images.every((img: any) => img)).length)

const totalProducts = computed(() => {
  return fondsConfigured.value + premiereCoucheConfigured.value + secondeCoucheConfigured.value + toucheFinaleConfigured.value
})

const totalPending = computed(() => {
  const totalPossible = 4 + 4 + 4 + 4 // fonds + 3 couches
  return totalPossible - totalProducts.value
})

// Progress bars pour chaque étape
const fondsProgress = computed(() => (fondsConfigured.value / 3) * 100)
const premiereCoucheProgress = computed(() => (premiereCoucheConfigured.value / 4) * 100)
const secondeCoucheProgress = computed(() => (secondeCoucheConfigured.value / 4) * 100)
const toucheFinaleProgress = computed(() => (toucheFinaleConfigured.value / 4) * 100)

// Vérifier s'il y a des produits déverrouillés (modifications en cours)
const hasUnlockedProducts = computed(() => {
  return lockedProducts.value.fonds.some(locked => !locked) ||
         lockedProducts.value.premiereDouceur.some(locked => !locked) ||
         lockedProducts.value.secondeDouceur.some(locked => !locked) ||
         lockedProducts.value.finitions.some(locked => !locked)
})

const modalTitle = computed(() => {
  switch (editingType.value) {
    case 'fond': return 'Configurer le fond'
            case 'douceur': return 'Configurer le produit de douceur'
        case 'finition': return 'Configurer le produit de finition'
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

// Fonctions de verrouillage/déverrouillage
const toggleLock = async (type: string, index: number) => {
  try {
    let configType: string = ''
    let newLockedState: boolean = false
    
    if (type === 'fond') {
      lockedProducts.value.fonds[index] = !lockedProducts.value.fonds[index]
      configType = 'fonds'
      newLockedState = lockedProducts.value.fonds[index]
    } else if (type === 'premiere') {
      lockedProducts.value.premiereDouceur[index] = !lockedProducts.value.premiereDouceur[index]
      configType = 'premiere_couche_douceur'
      newLockedState = lockedProducts.value.premiereDouceur[index]
    } else if (type === 'seconde') {
      lockedProducts.value.secondeDouceur[index] = !lockedProducts.value.secondeDouceur[index]
      configType = 'seconde_couche_douceur'
      newLockedState = lockedProducts.value.secondeDouceur[index]
    } else if (type === 'finition') {
      lockedProducts.value.finitions[index] = !lockedProducts.value.finitions[index]
      configType = 'touche_finale'
      newLockedState = lockedProducts.value.finitions[index]
    }
    
    // Sauvegarder l'état de verrouillage dans Supabase
    if (configType) {
      await productConfigService.updateProductLock(configType, index, newLockedState)
      console.log(`✅ État de verrouillage mis à jour pour ${configType} index ${index}: ${newLockedState}`)
    }
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du verrouillage:', error)
    // Annuler le changement en cas d'erreur
    if (type === 'fond') {
      lockedProducts.value.fonds[index] = !lockedProducts.value.fonds[index]
    } else if (type === 'premiere') {
      lockedProducts.value.premiereDouceur[index] = !lockedProducts.value.premiereDouceur[index]
    } else if (type === 'seconde') {
      lockedProducts.value.secondeDouceur[index] = !lockedProducts.value.secondeDouceur[index]
    } else if (type === 'finition') {
      lockedProducts.value.finitions[index] = !lockedProducts.value.finitions[index]
    }
  }
}

// Fonctions de validation (sauvegarde + re-verrouillage)
const validateProduct = async (type: string, index: number) => {
  try {
    // Sauvegarder le produit
    if (type === 'fond') {
      await saveFond(index)
    } else if (type === 'premiere') {
      await saveDouceur(index, 'premiere')
    } else if (type === 'seconde') {
      await saveDouceur(index, 'seconde')
    } else if (type === 'finition') {
      await saveFinition(index)
    }
    
    // Re-verrouiller le produit (sauvegarde automatique dans Supabase)
    await toggleLock(type, index)
    
    console.log('✅ Produit validé et verrouillé')
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error)
  }
}

// Fonctions de suppression d'images individuelles
const removeImage = async (type: string, index: number, imageIndex?: number) => {
  if (type === 'fond') {
    if (confirm('Supprimer cette image ?')) {
      const currentImage = fonds.value[index].image
      if (currentImage) {
        // Supprimer de Supabase Storage
        await productConfigService.deleteImage(currentImage)
      }
      fonds.value[index].image = null
      await saveFond(index)
    }
  } else {
    if (confirm(`Supprimer l'image ${imageIndex! + 1} ?`)) {
      const array = type === 'premiere' ? premiereCoucheDouceur : 
                    type === 'seconde' ? secondeCoucheDouceur : toucheFinale
      const currentImage = array.value[index].images[imageIndex!]
      if (currentImage) {
        // Supprimer de Supabase Storage
        await productConfigService.deleteImage(currentImage)
      }
      array.value[index].images[imageIndex!] = null
      
      if (type === 'premiere') {
        await saveDouceur(index, 'premiere')
      } else if (type === 'seconde') {
        await saveDouceur(index, 'seconde')
      } else {
        await saveFinition(index)
      }
    }
  }
}

// Fonctions CRUD pour les fonds
// Fonctions de sauvegarde pour les fonds
const saveFond = async (index: number) => {
  try {
    const fond = fonds.value[index]
    const config: ProductConfig = {
      config_type: 'fonds',
      product_index: index,
      nom: fond.nom,
      images: fond.image ? [fond.image] : []
    }
    
    await productConfigService.upsertProductConfig(config)
    console.log('✅ Fond sauvegardé dans Supabase')
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde du fond:', error)
  }
}

// Fonctions de sauvegarde pour les douceurs
const saveDouceur = async (index: number, type: 'premiere' | 'seconde') => {
  try {
    const array = type === 'premiere' ? premiereCoucheDouceur : secondeCoucheDouceur
    const douceur = array.value[index]
    const configType = type === 'premiere' ? 'premiere_couche_douceur' : 'seconde_couche_douceur'
    
    const config: ProductConfig = {
      config_type: configType,
      product_index: index,
      nom: douceur.nom,
      images: douceur.images.filter((img): img is string => img !== null)
    }
    
    await productConfigService.upsertProductConfig(config)
    console.log(`✅ Douceur ${type} sauvegardée dans Supabase`)
  } catch (error) {
    console.error(`❌ Erreur lors de la sauvegarde de la douceur ${type}:`, error)
  }
}

// Fonctions de sauvegarde pour les finitions
const saveFinition = async (index: number) => {
  try {
    const finition = toucheFinale.value[index]
    const config: ProductConfig = {
      config_type: 'touche_finale',
      product_index: index,
      nom: finition.nom,
      images: finition.images.filter((img): img is string => img !== null)
    }
    
    await productConfigService.upsertProductConfig(config)
    console.log('✅ Finition sauvegardée dans Supabase')
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde de la finition:', error)
  }
}



// Fonction pour reset complet
const resetAllProducts = async () => {
  if (confirm('Êtes-vous sûr de vouloir remettre à zéro tous les produits ? Cette action est irréversible.')) {
    try {
      // Supprimer toutes les images de Supabase Storage
      for (let i = 0; i < 3; i++) {
        if (fonds.value[i]?.image) {
          await productConfigService.deleteImage(fonds.value[i].image!)
        }
      }
      
      for (let i = 0; i < 4; i++) {
        if (premiereCoucheDouceur.value[i]?.images) {
          for (const image of premiereCoucheDouceur.value[i].images) {
            if (image) {
              await productConfigService.deleteImage(image)
            }
          }
        }
        if (secondeCoucheDouceur.value[i]?.images) {
          for (const image of secondeCoucheDouceur.value[i].images) {
            if (image) {
              await productConfigService.deleteImage(image)
            }
          }
        }
        if (toucheFinale.value[i]?.images) {
          for (const image of toucheFinale.value[i].images) {
            if (image) {
              await productConfigService.deleteImage(image)
            }
          }
        }
      }
      
      // Réinitialiser les arrays
      fonds.value = [
        { nom: '', image: null as string | null },
        { nom: '', image: null as string | null },
        { nom: '', image: null as string | null }
      ]
      
      premiereCoucheDouceur.value = [
        { nom: '', images: [null as string | null, null as string | null, null as string | null] },
        { nom: '', images: [null as string | null, null as string | null, null as string | null] },
        { nom: '', images: [null as string | null, null as string | null, null as string | null] },
        { nom: '', images: [null as string | null, null as string | null, null as string | null] }
      ]
      
      secondeCoucheDouceur.value = [
        { nom: '', images: [null as string | null, null as string | null, null as string | null] },
        { nom: '', images: [null as string | null, null as string | null, null as string | null] },
        { nom: '', images: [null as string | null, null as string | null, null as string | null] },
        { nom: '', images: [null as string | null, null as string | null, null as string | null] }
      ]
      
      toucheFinale.value = [
        { nom: '', images: [null as string | null, null as string | null, null as string | null] },
        { nom: '', images: [null as string | null, null as string | null, null as string | null] },
        { nom: '', images: [null as string | null, null as string | null, null as string | null] },
        { nom: '', images: [null as string | null, null as string | null, null as string | null] }
      ]
      
      // Sauvegarder la configuration vide dans Supabase
      for (let i = 0; i < 3; i++) {
        await saveFond(i)
      }
      for (let i = 0; i < 4; i++) {
        await saveDouceur(i, 'premiere')
        await saveDouceur(i, 'seconde')
        await saveFinition(i)
      }
      
      console.log('✅ Tous les produits ont été remis à zéro')
    } catch (error) {
      console.error('❌ Erreur lors du reset complet:', error)
      alert('Erreur lors du reset complet')
    }
  }
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

const loadProductConfig = async () => {
  try {
    isLoadingProducts.value = true
    console.log('🔄 Chargement de la configuration depuis Supabase...')
    
    // Charger depuis Supabase
    const configs = await productConfigService.getAllProductConfig()
    console.log('📦 Configuration chargée:', configs)
    
    // Réinitialiser les arrays
    fonds.value = []
    premiereCoucheDouceur.value = []
    secondeCoucheDouceur.value = []
    toucheFinale.value = []
    
    // Réinitialiser l'état de verrouillage
    lockedProducts.value.fonds = [true, true, true]
    lockedProducts.value.premiereDouceur = [true, true, true, true]
    lockedProducts.value.secondeDouceur = [true, true, true, true]
    lockedProducts.value.finitions = [true, true, true, true]
    
    // Organiser les configurations par type
    configs.forEach(config => {
      switch (config.config_type) {
        case 'fonds':
          fonds.value[config.product_index] = {
            nom: config.nom || '',
            image: config.images && config.images.length > 0 ? config.images[0] : null
          }
          // Charger l'état de verrouillage
          if (config.locked !== undefined) {
            lockedProducts.value.fonds[config.product_index] = config.locked
          } else {
            lockedProducts.value.fonds[config.product_index] = true // Verrouillé par défaut
          }
          break
        case 'premiere_couche_douceur':
          premiereCoucheDouceur.value[config.product_index] = {
            nom: config.nom || '',
            images: config.images && config.images.length > 0 ? config.images : [null, null, null]
          }
          // Charger l'état de verrouillage
          if (config.locked !== undefined) {
            lockedProducts.value.premiereDouceur[config.product_index] = config.locked
          } else {
            lockedProducts.value.premiereDouceur[config.product_index] = true // Verrouillé par défaut
          }
          break
        case 'seconde_couche_douceur':
          secondeCoucheDouceur.value[config.product_index] = {
            nom: config.nom || '',
            images: config.images && config.images.length > 0 ? config.images : [null, null, null]
          }
          // Charger l'état de verrouillage
          if (config.locked !== undefined) {
            lockedProducts.value.secondeDouceur[config.product_index] = config.locked
          } else {
            lockedProducts.value.secondeDouceur[config.product_index] = true // Verrouillé par défaut
          }
          break
        case 'touche_finale':
          toucheFinale.value[config.product_index] = {
            nom: config.nom || '',
            images: config.images && config.images.length > 0 ? config.images : [null, null, null]
          }
          // Charger l'état de verrouillage
          if (config.locked !== undefined) {
            lockedProducts.value.finitions[config.product_index] = config.locked
          } else {
            lockedProducts.value.finitions[config.product_index] = true // Verrouillé par défaut
          }
          break
      }
    })
    
    // S'assurer que tous les indices sont définis
    for (let i = 0; i < 3; i++) {
      if (!fonds.value[i]) fonds.value[i] = { nom: '', image: null }
    }
    for (let i = 0; i < 4; i++) {
      if (!premiereCoucheDouceur.value[i]) premiereCoucheDouceur.value[i] = { nom: '', images: [null, null, null] }
      if (!secondeCoucheDouceur.value[i]) secondeCoucheDouceur.value[i] = { nom: '', images: [null, null, null] }
      if (!toucheFinale.value[i]) toucheFinale.value[i] = { nom: '', images: [null, null, null] }
    }
    
    console.log('✅ Configuration chargée avec succès')
  } catch (error) {
    console.error('❌ Erreur lors du chargement de la configuration:', error)
  } finally {
    isLoadingProducts.value = false
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
  await loadProductConfig() // Charger la configuration depuis Supabase au chargement
  
  // Auto-refresh toutes les 30 secondes
  setInterval(async () => {
    await loadUsers()
    await loadProductConfig() // Recharger la configuration au refresh
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

// Fonctions pour l'upload d'images
const triggerFileUpload = (index: number, type: string) => {
  // Utiliser nextTick pour s'assurer que le DOM est mis à jour
  nextTick(() => {
    const inputId = `fileInput-${index}-${type}`
    const input = document.getElementById(inputId) as HTMLInputElement
    if (input) {
      input.click()
    } else {
      console.error(`Input file non trouvé: ${inputId}`)
    }
  })
}

const handleDragEnter = (event: DragEvent, index: number, type: string) => {
  event.preventDefault()
  if (type === 'fond') {
    dragStates.value.fonds[index] = true
  } else if (type === 'premiere') {
    dragStates.value.premiereDouceur[index] = true
  } else if (type === 'seconde') {
    dragStates.value.secondeDouceur[index] = true
  } else if (type === 'finition') {
    dragStates.value.finitions[index] = true
  }
}

const handleDragLeave = (event: DragEvent, index: number, type: string) => {
  event.preventDefault()
  if (type === 'fond') {
    dragStates.value.fonds[index] = false
  } else if (type === 'premiere') {
    dragStates.value.premiereDouceur[index] = false
  } else if (type === 'seconde') {
    dragStates.value.secondeDouceur[index] = false
  } else if (type === 'finition') {
    dragStates.value.finitions[index] = false
  }
}

const handleFileDrop = (event: DragEvent, index: number, type: string) => {
  event.preventDefault()
  // Réinitialiser l'état de drag
  if (type === 'fond') {
    dragStates.value.fonds[index] = false
  } else if (type === 'premiere') {
    dragStates.value.premiereDouceur[index] = false
  } else if (type === 'seconde') {
    dragStates.value.secondeDouceur[index] = false
  } else if (type === 'finition') {
    dragStates.value.finitions[index] = false
  }
  
  const files = event.dataTransfer?.files
  if (files) {
    handleFiles(files, index, type)
  }
}



const handleFileSelect = (event: Event, index: number, type: string) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    handleFiles(target.files, index, type)
  }
}

const handleFiles = async (files: FileList, index: number, type: string) => {
  const fileArray = Array.from(files)
  
  try {
    isUploadingImages.value = true
    
    if (type === 'fond') {
      // Pour les fonds, prendre seulement la première image
      if (fileArray.length > 0) {
        const file = fileArray[0]
        // Upload vers Supabase Storage
        const imageUrl = await productConfigService.uploadImage(file, 'fonds', index)
        if (imageUrl) {
          fonds.value[index].image = imageUrl
          await saveFond(index)
        } else {
          alert('Erreur lors de l\'upload de l\'image')
        }
      }
    } else {
      // Pour les autres types, prendre jusqu'à 3 images
      const maxImages = Math.min(fileArray.length, 3)
      const array = type === 'premiere' ? premiereCoucheDouceur : 
                    type === 'seconde' ? secondeCoucheDouceur : toucheFinale
      
      for (let i = 0; i < maxImages; i++) {
        const file = fileArray[i]
        // Upload vers Supabase Storage
        const imageUrl = await productConfigService.uploadImage(file, type === 'premiere' ? 'premiere_couche_douceur' : type === 'seconde' ? 'seconde_couche_douceur' : 'touche_finale', index, i)
        if (imageUrl) {
          array.value[index].images[i] = imageUrl
        } else {
          alert(`Erreur lors de l'upload de l'image ${i + 1}`)
        }
      }
      
      if (type === 'premiere') {
        await saveDouceur(index, 'premiere')
      } else if (type === 'seconde') {
        await saveDouceur(index, 'seconde')
      } else {
        await saveFinition(index)
      }
    }
  } catch (error) {
    console.error('Erreur lors du traitement des fichiers:', error)
    alert('Erreur lors du traitement des fichiers')
  } finally {
    isUploadingImages.value = false
  }
}

const resetFond = async (index: number) => {
  if (confirm('Remettre à zéro ce produit ?')) {
    const currentImage = fonds.value[index].image
    if (currentImage) {
      // Supprimer de Supabase Storage
      await productConfigService.deleteImage(currentImage)
    }
    fonds.value[index] = { nom: '', image: null as string | null }
    await saveFond(index)
  }
}

const resetDouceur = async (index: number, type: 'premiere' | 'seconde') => {
  if (confirm('Remettre à zéro ce produit ?')) {
    const array = type === 'premiere' ? premiereCoucheDouceur : secondeCoucheDouceur
    const currentImages = array.value[index].images
    // Supprimer toutes les images de Supabase Storage
    for (const image of currentImages) {
      if (image) {
        await productConfigService.deleteImage(image)
      }
    }
    array.value[index] = { nom: '', images: [null as string | null, null as string | null, null as string | null] }
    await saveDouceur(index, type)
  }
}

const resetFinition = async (index: number) => {
  if (confirm('Remettre à zéro ce produit ?')) {
    const currentImages = toucheFinale.value[index].images
    // Supprimer toutes les images de Supabase Storage
    for (const image of currentImages) {
      if (image) {
        await productConfigService.deleteImage(image)
      }
    }
    toucheFinale.value[index] = { nom: '', images: [null as string | null, null as string | null, null as string | null] }
    await saveFinition(index)
  }
}

// Fonction pour initialiser la configuration Supabase
const initializeSupabaseConfig = async () => {
  try {
    isLoadingProducts.value = true
    const success = await productConfigService.initializeDefaultConfig()
    
    if (success) {
      alert('Configuration Supabase initialisée avec succès !')
      // Recharger les données
      await loadProductConfig()
    } else {
      alert('Erreur lors de l\'initialisation de la configuration Supabase')
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error)
    alert('Erreur lors de l\'initialisation de la configuration Supabase')
  } finally {
    isLoadingProducts.value = false
  }
}

// Fonction pour tester le verrouillage
const testLocking = async () => {
  try {
    isLoadingProducts.value = true
    const success = await productConfigService.testLocking()
    if (success) {
      alert('Le système de verrouillage fonctionne correctement !')
    } else {
      alert('Erreur lors du test du verrouillage.')
    }
  } catch (error) {
    console.error('Erreur lors du test du verrouillage:', error)
    alert('Erreur lors du test du verrouillage.')
  } finally {
    isLoadingProducts.value = false
  }
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

.step-header {
  margin-bottom: var(--spacing-lg);
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
  margin-bottom: var(--spacing-md);
  font-style: italic;
}

.step-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--accent-color);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
  min-width: 80px;
  text-align: right;
}

/* Barre d'actions des produits */
.products-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xxl);
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: var(--spacing-lg);
}

.action-group {
  display: flex;
  gap: var(--spacing-md);
}

.view-toggle {
  display: flex;
  gap: var(--spacing-xs);
}

.view-btn {
  background: none;
  border: 2px solid #e0e0e0;
  color: #666;
  padding: var(--spacing-sm);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.view-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.view-btn.active {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

/* Conteneur des produits */
.products-container {
  display: grid;
  gap: var(--spacing-lg);
}

.products-container.grid {
  grid-template-columns: repeat(2, 1fr);
  max-width: 1200px;
  margin: 0 auto;
}

.products-container.list {
  grid-template-columns: 1fr;
}

/* Cartes des produits */
.product-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.product-index {
  font-weight: 600;
  color: var(--text-color);
  font-size: 1rem;
}

.card-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.card-actions .action-btn {
  background: none;
  border: none;
  padding: var(--spacing-xs);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.edit-btn {
  color: #007bff;
}

.edit-btn:hover {
  background: rgba(0, 123, 255, 0.1);
}

.duplicate-btn {
  color: #28a745;
}

.duplicate-btn:hover {
  background: rgba(40, 167, 69, 0.1);
}

.delete-btn {
  color: #dc3545;
}

.delete-btn:hover {
  background: rgba(220, 53, 69, 0.1);
}

/* Contenu des cartes */
.product-content {
  padding: var(--spacing-lg);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--spacing-lg);
  align-items: start;
}

/* Conteneur d'image */
.image-container {
  width: 120px;
  height: 120px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.8rem;
  text-align: center;
}

.image-placeholder i {
  font-size: 2rem;
  margin-bottom: var(--spacing-xs);
}

/* Galerie d'images */
.image-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
  width: 120px;
}

.gallery-item {
  width: 100%;
  height: 80px;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-item .image-placeholder {
  font-size: 0.7rem;
}

.gallery-item .image-placeholder i {
  font-size: 1.5rem;
}

/* Détails des produits */
.product-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.product-name .inline-input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  transition: border-color 0.2s ease;
}

.product-name .inline-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

/* Groupes d'inputs d'images */
.images-input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.images-input-group label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9rem;
}

.image-input-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.image-label {
  font-size: 0.85rem;
  color: #666;
  min-width: 80px;
}

.input-with-preview {
  display: flex;
  gap: var(--spacing-xs);
  flex: 1;
}

.image-url-input {
  flex: 1;
  padding: var(--spacing-sm);
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.image-url-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.test-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: var(--spacing-sm);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.test-btn:hover:not(:disabled) {
  background: #5a6268;
}

.test-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Statut des produits */
.product-status {
  margin-top: var(--spacing-sm);
}

.status-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.configured {
  background: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

/* Boutons d'action */
.primary-btn {
  background: #007bff !important;
  color: white !important;
}

.primary-btn:hover {
  background: #0056b3 !important;
}

.secondary-btn {
  background: #383961 !important;
  color: white !important;
}

.secondary-btn:hover {
  background: #2a2d4a !important;
}

.danger-btn {
  background: #f0625e !important;
  color: white !important;
}

.danger-btn:hover {
  background: #e05a4e !important;
}

/* Responsive */
@media (max-width: 768px) {
  .products-container.grid {
    grid-template-columns: 1fr;
  }
  
  .product-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .image-container,
  .image-gallery {
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
  }
  
  .products-action-bar {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }
  
  .action-group {
    justify-content: center;
  }
  
  .view-toggle {
    justify-content: center;
  }
}

/* Styles pour l'upload d'images */
.image-upload-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.image-upload-group label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 0.9rem;
}

.upload-container {
  position: relative;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: var(--spacing-lg);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.upload-area:hover {
  border-color: var(--accent-color);
  background: rgba(255, 111, 97, 0.05);
}

.upload-area.dragover {
  border-color: #383961;
  background: #e3f2fd;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(56, 57, 97, 0.2);
}

.upload-area i {
  font-size: 2rem;
  color: #999;
  margin-bottom: var(--spacing-sm);
  display: block;
}

.upload-area span {
  color: #666;
  font-size: 0.9rem;
}

/* Affichage des images sélectionnées */
.selected-images-preview {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid #e0e0e0;
}

.selected-images-preview h4 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 600;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
}

.preview-image {
  position: relative;
  width: 100%;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-image .image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.7rem;
  text-align: center;
}

.preview-image .image-placeholder i {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-xs);
}

.image-number {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
  z-index: 9999;
}

/* Responsive pour les nouvelles fonctionnalités */
@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .images-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .upload-area {
    padding: var(--spacing-md);
  }
  
  .upload-area i {
    font-size: 1.5rem;
  }
  
  .upload-area span {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .images-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-image {
    height: 100px;
  }
}

.image-preview-large {
  margin-top: var(--spacing-md);
  text-align: center;
  position: relative;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview-large img {
  max-width: 200px;
  max-height: 150px;
  width: auto;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.image-placeholder-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.9rem;
  text-align: center;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: var(--spacing-lg);
  min-height: 120px;
  width: 200px;
}

.image-placeholder-large i {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-sm);
  color: #adb5bd;
}

/* Amélioration de l'affichage des 3 images pour les étapes 2-4 */
.selected-images-preview {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.selected-images-preview h4 {
  margin: 0 0 var(--spacing-md) 0;
  color: #495057;
  font-size: 0.9rem;
  font-weight: 600;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  align-items: start;
}

.preview-image {
  position: relative;
  text-align: center;
}

.preview-image img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 6px;
  height: 80px;
  color: #adb5bd;
  font-size: 0.7rem;
}

.image-placeholder i {
  font-size: 1.2rem;
  margin-bottom: var(--spacing-xs);
}

.image-number {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #383961;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 9999;
}

/* Style pour le bouton reset */
.reset-btn {
  background: #6c757d !important;
  color: white !important;
}

.reset-btn:hover {
  background: #5a6268 !important;
}

.reset-btn:disabled {
  background: #adb5bd !important;
  color: #6c757d !important;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Styles pour le système de verrouillage */
.edit-btn {
  background: #383961 !important;
  color: white !important;
}

.edit-btn.unlocked {
  background: #28a745 !important;
}

.edit-btn:hover {
  opacity: 0.9;
}

/* Styles pour les zones verrouillées */
.image-upload-group.locked .upload-area {
  opacity: 0.6;
  cursor: not-allowed;
}

.image-upload-group.locked .upload-area.disabled {
  background: #f8f9fa;
  border-color: #dee2e6;
}

/* Styles pour le bouton de validation */
.validation-actions {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid #e0e0e0;
}

.validate-btn {
  background: #383961 !important;
  color: white !important;
  width: 100%;
  justify-content: center;
}

.validate-btn:hover {
  background: #2a2d4a !important;
}

.validate-btn:disabled {
  background: #6c757d !important;
  cursor: not-allowed;
}

/* Styles pour l'affichage vertical des images */
.images-vertical {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.preview-image-vertical {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.image-container {
  position: relative;
  flex-shrink: 0;
  z-index: 10;
  overflow: visible;
}

.preview-image-vertical img {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid #e0e0e0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.preview-image-vertical .image-placeholder {
  width: 120px;
  height: 80px;
}

.preview-image-vertical .image-number {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #383961;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  z-index: 9999;
}

/* Styles pour les images avec actions */
.image-with-actions {
  position: relative;
  display: inline-block;
}

.remove-image-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
  z-index: 10000;
}

.remove-image-btn:hover {
  background: #c82333;
  transform: scale(1.1);
}

/* Responsive pour les images */
@media (max-width: 768px) {
  .images-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .preview-image img {
    height: 100px;
  }
  
  .image-placeholder {
    height: 100px;
  }
  
  .image-preview-large img {
    max-width: 150px;
    max-height: 120px;
  }
  
  .image-placeholder-large {
    width: 150px;
    min-height: 100px;
  }
  
  .preview-image-vertical {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .preview-image-vertical img {
    width: 100px;
    height: 70px;
  }
  
  .preview-image-vertical .image-placeholder {
    width: 100px;
    height: 70px;
  }
}
</style>

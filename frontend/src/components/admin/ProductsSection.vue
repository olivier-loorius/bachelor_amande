<template>
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

      <!-- Section Fonds -->
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
                <span class="status-badge-header" :class="{ 
                  'configured': lockedProducts.fonds[index] && fond.nom && fond.image, 
                  'pending': !lockedProducts.fonds[index] || !fond.nom || !fond.image 
                }">
                  {{ lockedProducts.fonds[index] && fond.nom && fond.image ? '✅' : '⏳' }}
                </span>
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
              </div>
              
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

      <!-- Section Première Couche de Douceur -->
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
                <span class="status-badge-header" :class="{ 
                  'configured': lockedProducts.premiereDouceur[index] && douceur.nom && douceur.images.every(img => img), 
                  'pending': !lockedProducts.premiereDouceur[index] || !douceur.nom || douceur.images.some(img => !img) 
                }">
                  {{ lockedProducts.premiereDouceur[index] && douceur.nom && douceur.images.every(img => img) ? '✅' : '⏳' }}
                </span>
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
              </div>
              
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

      <!-- Section Seconde Couche de Douceur -->
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
                <span class="status-badge-header" :class="{ 
                  'configured': lockedProducts.secondeDouceur[index] && douceur.nom && douceur.images.every(img => img), 
                  'pending': !lockedProducts.secondeDouceur[index] || !douceur.nom || douceur.images.some(img => !img) 
                }">
                  {{ lockedProducts.secondeDouceur[index] && douceur.nom && douceur.images.every(img => img) ? '✅' : '⏳' }}
                </span>
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
              </div>
              
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

      <!-- Section Touche Finale -->
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
                <span class="status-badge-header" :class="{ 
                  'configured': lockedProducts.finitions[index] && finition.nom && finition.images.every(img => img), 
                  'pending': !lockedProducts.finitions[index] || !finition.nom || finition.images.some(img => !img) 
                }">
                  {{ lockedProducts.finitions[index] && finition.nom && finition.images.every(img => img) ? '✅' : '⏳' }}
                </span>
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
                  
                  <div v-if="!lockedProducts.finitions[index]" class="validation-actions">
                    <button @click="validateProduct('finition', index)" class="action-btn validate-btn" :disabled="!finition.nom || !finition.images.every(img => img)">
                      <i class="fas fa-check"></i>
                      Valider
                    </button>
                  </div>
                </div>
              </div>
              
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
</template>

<script setup lang="ts">
// Props reçues du composant parent
const props = defineProps<{
  fonds: any[]
  premiereCoucheDouceur: any[]
  secondeCoucheDouceur: any[]
  toucheFinale: any[]
  lockedProducts: any
  dragStates: any
  productsViewMode: 'grid' | 'list'
  isLoadingProducts: boolean
  isUploadingImages: boolean
  isProductsSectionOpen: boolean
  fondsConfigured: number
  premiereCoucheConfigured: number
  secondeCoucheConfigured: number
  toucheFinaleConfigured: number
  totalProducts: number
  totalPending: number
  fondsProgress: number
  premiereCoucheProgress: number
  secondeCoucheProgress: number
  toucheFinaleProgress: number
  hasUnlockedProducts: boolean
}>()

// Émettre les événements vers le parent
const emit = defineEmits<{
  toggleProductsSection: []
  loadProductConfig: []
  resetAllProducts: []
  initializeSupabaseConfig: []
  toggleLock: [type: string, index: number]
  resetFond: [index: number]
  resetDouceur: [index: number, type: string]
  resetFinition: [index: number]
  saveFond: [index: number]
  saveDouceur: [index: number, type: string]
  saveFinition: [index: number]
  removeImage: [type: string, index: number, imageIndex?: number]
  triggerFileUpload: [index: number, type: string]
  handleFileDrop: [event: DragEvent, index: number, type: string]
  handleDragEnter: [event: DragEvent, index: number, type: string]
  handleDragLeave: [event: DragEvent, index: number, type: string]
  handleFileSelect: [event: Event, index: number, type: string]
  validateProduct: [type: string, index: number]
}>()

const toggleProductsSection = () => {
  emit('toggleProductsSection')
}

const loadProductConfig = () => {
  emit('loadProductConfig')
}

const resetAllProducts = () => {
  emit('resetAllProducts')
}

const initializeSupabaseConfig = () => {
  emit('initializeSupabaseConfig')
}

const toggleLock = (type: string, index: number) => {
  emit('toggleLock', type, index)
}

const resetFond = (index: number) => {
  emit('resetFond', index)
}

const resetDouceur = (index: number, type: string) => {
  emit('resetDouceur', index, type)
}

const resetFinition = (index: number) => {
  emit('resetFinition', index)
}

const saveFond = (index: number) => {
  emit('saveFond', index)
}

const saveDouceur = (index: number, type: string) => {
  emit('saveDouceur', index, type)
}

const saveFinition = (index: number) => {
  emit('saveFinition', index)
}

const removeImage = (type: string, index: number, imageIndex?: number) => {
  emit('removeImage', type, index, imageIndex)
}

const triggerFileUpload = (index: number, type: string) => {
  emit('triggerFileUpload', index, type)
}

const handleFileDrop = (event: DragEvent, index: number, type: string) => {
  emit('handleFileDrop', event, index, type)
}

const handleDragEnter = (event: DragEvent, index: number, type: string) => {
  emit('handleDragEnter', event, index, type)
}

const handleDragLeave = (event: DragEvent, index: number, type: string) => {
  emit('handleDragLeave', event, index, type)
}

const handleFileSelect = (event: Event, index: number, type: string) => {
  emit('handleFileSelect', event, index, type)
}

const validateProduct = (type: string, index: number) => {
  emit('validateProduct', type, index)
}
</script>

<style scoped>
/* Aucun style - utilise les styles existants de AdminView.vue */
</style>

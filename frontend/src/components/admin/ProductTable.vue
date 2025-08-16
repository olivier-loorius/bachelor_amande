<template>
  <div class="products-section">
    <!-- Section Fonds -->
    <div class="product-category">
      <h3>Fonds</h3>
      <div class="product-grid">
        <div 
          v-for="(fond, index) in productStore.fonds" 
          :key="`fond-${index}`"
          class="product-card"
          :class="{
            'configured': productStore.lockedProducts.fonds[index] && fond.nom && fond.image,
            'pending': !productStore.lockedProducts.fonds[index] || !fond.nom || !fond.image
          }"
        >
          <div class="product-header">
            <span class="status-icon">
              {{ productStore.lockedProducts.fonds[index] && fond.nom && fond.image ? '✅' : '⏳' }}
            </span>
            <input 
              v-model="fond.nom"
              type="text"
              placeholder="Nom du fond"
              class="product-name-input"
              :disabled="productStore.lockedProducts.fonds[index]"
            />
          </div>
          
          <div class="product-actions">
            <button @click="productStore.toggleLock('fond', index)" class="action-btn edit-btn" :class="{ 'unlocked': !productStore.lockedProducts.fonds[index] }" :title="productStore.lockedProducts.fonds[index] ? 'Déverrouiller pour modifier' : 'Verrouiller'">
              <i class="fas" :class="productStore.lockedProducts.fonds[index] ? 'fa-lock' : 'fa-unlock'"></i>
            </button>
            <button @click="productStore.resetFond(index)" class="action-btn reset-btn" :disabled="productStore.lockedProducts.fonds[index]" :title="productStore.lockedProducts.fonds[index] ? 'Déverrouillez d\'abord pour remettre à zéro' : 'Remettre à zéro'">
              <i class="fas fa-undo"></i>
            </button>
            <button @click="productStore.saveFond(index)" class="action-btn save-btn" :disabled="productStore.lockedProducts.fonds[index]">
              <i class="fas fa-save"></i>
            </button>
          </div>

          <div class="image-upload-group" :class="{ 'locked': productStore.lockedProducts.fonds[index] }">
            <label class="upload-label">Image du fond</label>
            <div class="upload-area" @click="productStore.lockedProducts.fonds[index] ? null : triggerFileUpload(index, 'fond')" @drop="productStore.lockedProducts.fonds[index] ? null : handleFileDrop($event, index, 'fond')" @dragover.prevent @dragenter.prevent @dragleave.prevent @dragenter="handleDragEnter($event, index, 'fond')" @dragleave="handleDragLeave($event, index, 'fond')" :class="{ 'disabled': productStore.lockedProducts.fonds[index], 'dragover': productStore.dragStates.fonds[index] }">
              <input 
                ref="fileInputs"
                type="file"
                accept="image/*"
                multiple
                @change="handleFileChange($event, index, 'fond')"
                :disabled="productStore.lockedProducts.fonds[index]"
                style="display: none"
              />
              <div v-if="fond.image" class="image-preview">
                <img :src="fond.image" alt="Image du fond" />
                <button @click="productStore.removeImage('fond', index)" class="remove-image-btn" :disabled="productStore.lockedProducts.fonds[index]">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div v-else class="upload-placeholder">
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Glissez une image ici ou cliquez pour sélectionner</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Première Couche de Douceur -->
    <div class="product-category">
      <h3>Première Couche de Douceur</h3>
      <div class="product-grid">
        <div 
          v-for="(douceur, index) in productStore.premiereCoucheDouceur" 
          :key="`premiere-${index}`"
          class="product-card"
          :class="{
            'configured': productStore.lockedProducts.premiereDouceur[index] && douceur.nom && douceur.images.every(img => img),
            'pending': !productStore.lockedProducts.premiereDouceur[index] || !douceur.nom || douceur.images.some(img => !img)
          }"
        >
          <div class="product-header">
            <span class="status-icon">
              {{ productStore.lockedProducts.premiereDouceur[index] && douceur.nom && douceur.images.every(img => img) ? '✅' : '⏳' }}
            </span>
            <input 
              v-model="douceur.nom"
              type="text"
              placeholder="Nom de la douceur"
              class="product-name-input"
              :disabled="productStore.lockedProducts.premiereDouceur[index]"
            />
          </div>
          
          <div class="product-actions">
            <button @click="productStore.toggleLock('premiere', index)" class="action-btn edit-btn" :class="{ 'unlocked': !productStore.lockedProducts.premiereDouceur[index] }" :title="productStore.lockedProducts.premiereDouceur[index] ? 'Déverrouiller pour modifier' : 'Verrouiller'">
              <i class="fas" :class="productStore.lockedProducts.premiereDouceur[index] ? 'fa-lock' : 'fa-unlock'"></i>
            </button>
            <button @click="productStore.resetDouceur(index, 'premiere')" class="action-btn reset-btn" :disabled="productStore.lockedProducts.premiereDouceur[index]" :title="productStore.lockedProducts.premiereDouceur[index] ? 'Déverrouillez d\'abord pour remettre à zéro' : 'Remettre à zéro'">
              <i class="fas fa-undo"></i>
            </button>
            <button @click="productStore.saveDouceur(index, 'premiere')" class="action-btn save-btn" :disabled="productStore.lockedProducts.premiereDouceur[index]">
              <i class="fas fa-save"></i>
            </button>
          </div>

          <div class="image-upload-group" :class="{ 'locked': productStore.lockedProducts.premiereDouceur[index] }">
            <label class="upload-label">Images de la douceur (3 max)</label>
            <div class="upload-area" @click="productStore.lockedProducts.premiereDouceur[index] ? null : triggerFileUpload(index, 'premiere')" @drop="productStore.lockedProducts.premiereDouceur[index] ? null : handleFileDrop($event, index, 'premiere')" @dragover.prevent @dragenter.prevent @dragleave.prevent @dragenter="handleDragEnter($event, index, 'premiere')" @dragleave="handleDragLeave($event, index, 'premiere')" :class="{ 'disabled': productStore.lockedProducts.premiereDouceur[index], 'dragover': productStore.dragStates.premiereDouceur[index] }">
              <input 
                ref="fileInputs"
                type="file"
                accept="image/*"
                multiple
                @change="handleFileChange($event, index, 'premiere')"
                :disabled="productStore.lockedProducts.premiereDouceur[index]"
                style="display: none"
              />
              <div class="images-grid">
                <div 
                  v-for="(image, imgIndex) in douceur.images" 
                  :key="`img-${imgIndex}`"
                  class="image-slot"
                  :class="{ 'has-image': image }"
                >
                  <div v-if="image" class="image-preview">
                    <img :src="image" :alt="`Image ${imgIndex + 1}`" />
                    <button @click="productStore.removeImage('premiere', index, imgIndex)" class="remove-image-btn" :disabled="productStore.lockedProducts.premiereDouceur[index]">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <div v-else class="upload-placeholder">
                    <i class="fas fa-plus"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Seconde Couche de Douceur -->
    <div class="product-category">
      <h3>Seconde Couche de Douceur</h3>
      <div class="product-grid">
        <div 
          v-for="(douceur, index) in productStore.secondeCoucheDouceur" 
          :key="`seconde-${index}`"
          class="product-card"
          :class="{
            'configured': productStore.lockedProducts.secondeDouceur[index] && douceur.nom && douceur.images.every(img => img),
            'pending': !productStore.lockedProducts.secondeDouceur[index] || !douceur.nom || douceur.images.some(img => !img)
          }"
        >
          <div class="product-header">
            <span class="status-icon">
              {{ productStore.lockedProducts.secondeDouceur[index] && douceur.nom && douceur.images.every(img => img) ? '✅' : '⏳' }}
            </span>
            <input 
              v-model="douceur.nom"
              type="text"
              placeholder="Nom de la douceur"
              class="product-name-input"
              :disabled="productStore.lockedProducts.secondeDouceur[index]"
            />
          </div>
          
          <div class="product-actions">
            <button @click="productStore.toggleLock('seconde', index)" class="action-btn edit-btn" :class="{ 'unlocked': !productStore.lockedProducts.secondeDouceur[index] }" :title="productStore.lockedProducts.secondeDouceur[index] ? 'Déverrouiller pour modifier' : 'Verrouiller'">
              <i class="fas" :class="productStore.lockedProducts.secondeDouceur[index] ? 'fa-lock' : 'fa-unlock'"></i>
            </button>
            <button @click="productStore.resetDouceur(index, 'seconde')" class="action-btn reset-btn" :disabled="productStore.lockedProducts.secondeDouceur[index]" :title="productStore.lockedProducts.secondeDouceur[index] ? 'Déverrouillez d\'abord pour remettre à zéro' : 'Remettre à zéro'">
              <i class="fas fa-undo"></i>
            </button>
            <button @click="productStore.saveDouceur(index, 'seconde')" class="action-btn save-btn" :disabled="productStore.lockedProducts.secondeDouceur[index]">
              <i class="fas fa-save"></i>
            </button>
          </div>

          <div class="image-upload-group" :class="{ 'locked': productStore.lockedProducts.secondeDouceur[index] }">
            <label class="upload-label">Images de la douceur (3 max)</label>
            <div class="upload-area" @click="productStore.lockedProducts.secondeDouceur[index] ? null : triggerFileUpload(index, 'seconde')" @drop="productStore.lockedProducts.secondeDouceur[index] ? null : handleFileDrop($event, index, 'seconde')" @dragover.prevent @dragenter.prevent @dragleave.prevent @dragenter="handleDragEnter($event, index, 'seconde')" @dragleave="handleDragLeave($event, index, 'seconde')" :class="{ 'disabled': productStore.lockedProducts.secondeDouceur[index], 'dragover': productStore.dragStates.secondeDouceur[index] }">
              <input 
                ref="fileInputs"
                type="file"
                accept="image/*"
                multiple
                @change="handleFileChange($event, index, 'seconde')"
                :disabled="productStore.lockedProducts.secondeDouceur[index]"
                style="display: none"
              />
              <div class="images-grid">
                <div 
                  v-for="(image, imgIndex) in douceur.images" 
                  :key="`img-${imgIndex}`"
                  class="image-slot"
                  :class="{ 'has-image': image }"
                >
                  <div v-if="image" class="image-preview">
                    <img :src="image" :alt="`Image ${imgIndex + 1}`" />
                    <button @click="productStore.removeImage('seconde', index, imgIndex)" class="remove-image-btn" :disabled="productStore.lockedProducts.secondeDouceur[index]">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <div v-else class="upload-placeholder">
                    <i class="fas fa-plus"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Touche Finale -->
    <div class="product-category">
      <h3>Touche Finale</h3>
      <div class="product-grid">
        <div 
          v-for="(finition, index) in productStore.toucheFinale" 
          :key="`finition-${index}`"
          class="product-card"
          :class="{
            'configured': productStore.lockedProducts.finitions[index] && finition.nom && finition.images.every(img => img),
            'pending': !productStore.lockedProducts.finitions[index] || !finition.nom || finition.images.some(img => !img)
          }"
        >
          <div class="product-header">
            <span class="status-icon">
              {{ productStore.lockedProducts.finitions[index] && finition.nom && finition.images.every(img => img) ? '✅' : '⏳' }}
            </span>
            <input 
              v-model="finition.nom"
              type="text"
              placeholder="Nom de la finition"
              class="product-name-input"
              :disabled="productStore.lockedProducts.finitions[index]"
            />
          </div>
          
          <div class="product-actions">
            <button @click="productStore.toggleLock('finition', index)" class="action-btn edit-btn" :class="{ 'unlocked': !productStore.lockedProducts.finitions[index] }" :title="productStore.lockedProducts.finitions[index] ? 'Déverrouiller pour modifier' : 'Verrouiller'">
              <i class="fas" :class="productStore.lockedProducts.finitions[index] ? 'fa-lock' : 'fa-unlock'"></i>
            </button>
            <button @click="productStore.resetFinition(index)" class="action-btn reset-btn" :disabled="productStore.lockedProducts.finitions[index]" :title="productStore.lockedProducts.finitions[index] ? 'Déverrouillez d\'abord pour remettre à zéro' : 'Remettre à zéro'">
              <i class="fas fa-undo"></i>
            </button>
            <button @click="productStore.saveFinition(index)" class="action-btn save-btn" :disabled="productStore.lockedProducts.finitions[index]">
              <i class="fas fa-save"></i>
            </button>
          </div>

          <div class="image-upload-group" :class="{ 'locked': productStore.lockedProducts.finitions[index] }">
            <label class="upload-label">Images de la finition (3 max)</label>
            <div class="upload-area" @click="productStore.lockedProducts.finitions[index] ? null : triggerFileUpload(index, 'finition')" @drop="productStore.lockedProducts.finitions[index] ? null : handleFileDrop($event, index, 'finition')" @dragover.prevent @dragenter.prevent @dragleave.prevent @dragenter="handleDragEnter($event, index, 'finition')" @dragleave="handleDragLeave($event, index, 'finition')" :class="{ 'disabled': productStore.lockedProducts.finitions[index], 'dragover': productStore.dragStates.finitions[index] }">
              <input 
                ref="fileInputs"
                type="file"
                accept="image/*"
                multiple
                @change="handleFileChange($event, index, 'finition')"
                :disabled="productStore.lockedProducts.finitions[index]"
                style="display: none"
              />
              <div class="images-grid">
                <div 
                  v-for="(image, imgIndex) in finition.images" 
                  :key="`img-${imgIndex}`"
                  class="image-slot"
                  :class="{ 'has-image': image }"
                >
                  <div v-if="image" class="image-preview">
                    <img :src="image" :alt="`Image ${imgIndex + 1}`" />
                    <button @click="productStore.removeImage('finition', index, imgIndex)" class="remove-image-btn" :disabled="productStore.lockedProducts.finitions[index]">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                  <div v-else class="upload-placeholder">
                    <i class="fas fa-plus"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="!productStore.lockedProducts.finitions[index]" class="validation-actions">
            <button @click="productStore.saveFinition(index)" class="validate-btn">
              <i class="fas fa-check"></i> Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProductStore } from '@/stores/useProductStore'

// COPIE EXACTE de la logique d'AdminView.vue
const productStore = useProductStore()

// COPIE EXACTE des fonctions de gestion des fichiers
const triggerFileUpload = (index: number, type: string) => {
  const fileInput = document.querySelector(`input[data-index="${index}"][data-type="${type}"]`) as HTMLInputElement
  if (fileInput) {
    fileInput.click()
  }
}

const handleFileChange = (event: Event, index: number, type: string) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    productStore.handleFiles(target.files, index, type)
  }
}

const handleFileDrop = (event: DragEvent, index: number, type: string) => {
  event.preventDefault()
  productStore.updateDragState(type, index, false)
  
  if (event.dataTransfer?.files) {
    productStore.handleFiles(event.dataTransfer.files, index, type)
  }
}

const handleDragEnter = (event: DragEvent, index: number, type: string) => {
  event.preventDefault()
  productStore.updateDragState(type, index, true)
}

const handleDragLeave = (event: DragEvent, index: number, type: string) => {
  event.preventDefault()
  productStore.updateDragState(type, index, false)
}
</script>

<style scoped>
/* COPIE EXACTE des styles d'AdminView.vue */
.products-section {
  padding: 20px;
}

.product-category {
  margin-bottom: 40px;
}

.product-category h3 {
  color: #fab92e;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.product-card {
  background: #01192b;
  border: 2px solid #fab92e;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.product-card.configured {
  border-color: #28a745;
  box-shadow: 0 0 15px rgba(40, 167, 69, 0.3);
}

.product-card.pending {
  border-color: #ffc107;
  box-shadow: 0 0 15px rgba(255, 193, 7, 0.3);
}

.product-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.status-icon {
  font-size: 1.2em;
  margin-right: 10px;
}

.product-name-input {
  flex: 1;
  background: #1a2a3a;
  border: 1px solid #fab92e;
  color: #fab92e;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 1em;
}

.product-name-input::placeholder {
  color: #fab92e80;
}

.product-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.action-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9em;
}

.edit-btn {
  background: #fab92e;
  color: #01192b;
}

.edit-btn.unlocked {
  background: #28a745;
  color: white;
}

.reset-btn {
  background: #dc3545;
  color: white;
}

.save-btn {
  background: #17a2b8;
  color: white;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-upload-group {
  margin-bottom: 15px;
}

.upload-label {
  display: block;
  color: #fab92e;
  margin-bottom: 10px;
  font-weight: bold;
}

.upload-area {
  border: 2px dashed #fab92e;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #1a2a3a;
}

.upload-area:hover {
  border-color: #28a745;
  background: #1f3a4a;
}

.upload-area.dragover {
  border-color: #28a745;
  background: #1f3a4a;
  transform: scale(1.02);
}

.upload-area.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upload-placeholder {
  color: #fab92e;
  font-size: 1.1em;
}

.upload-placeholder i {
  font-size: 2em;
  margin-bottom: 10px;
  display: block;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 5px;
}

.remove-image-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
  font-size: 0.8em;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.image-slot {
  aspect-ratio: 1;
  border: 2px dashed #fab92e;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a2a3a;
  transition: all 0.3s ease;
}

.image-slot.has-image {
  border-color: #28a745;
}

.image-slot .image-preview {
  width: 100%;
  height: 100%;
}

.image-slot .image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 3px;
}

.validation-actions {
  margin-top: 15px;
  text-align: center;
}

.validate-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s ease;
}

.validate-btn:hover {
  background: #218838;
  transform: translateY(-2px);
}

.validate-btn i {
  margin-right: 8px;
}
</style>

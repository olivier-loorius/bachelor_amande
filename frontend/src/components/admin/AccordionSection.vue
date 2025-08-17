<template>
  <section class="dashboard-section accordion-section">
    <div class="section-header accordion-header" @click="toggleProductsSection">
      <div class="header-left">
        <h2 class="section-title">
          <span class="title-icon"><i class="fas fa-cogs"></i></span>
          <span class="title-text">Gestion des Produits</span>
        </h2>
        <div class="section-stats">
          <span class="stat-item">
            {{ totalProducts }}/15 produits configurés
          </span>
          <span class="stat-item pending-stat" v-if="totalPending > 0">
            {{ totalPending }} en attente
          </span>
        </div>
      </div>
      <div class="header-actions">
        <button 
          class="clear-all-products-btn" 
          @click="showDeleteConfirmModal"
          title="Supprimer tous les produits"
        >
          <i class="fas fa-trash-alt"></i>
          Vider tous les produits
        </button>
      </div>
      <div class="accordion-icon" :class="{ 'rotated': isProductsSectionOpen }">
        <span class="accordion-arrow">▼</span>
      </div>
    </div>
    
    <div class="accordion-content" :class="{ 'open': isProductsSectionOpen }">
      <div class="products-accordion">
        <!-- Étape 1 : Fonds (1 image) -->
        <details class="product-step-details">
          <summary class="step-summary">
            <span class="step-number">1</span>
            <span class="step-title">Fonds</span>
            <span class="step-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: fondsProgress + '%' }"></div>
              </div>
              <span class="progress-text">{{ fondsConfigured }}/3</span>
            </span>
          </summary>
          <ProductStep
            :step="1"
            title="Fonds"
            description="Ajoutez ici une seule image de fond"
            :products="props.fonds"
            :locked="props.lockedProducts.fonds"
            :images-count="1"
            :start-index="0"
            @upload="handleUpload"
            @remove="handleRemove"
            @save="handleSave"
            @reset="handleReset"
            @toggleLock="handleToggleLock"
          />
        </details>

        <!-- Étape 2 : Première Couche de Douceur (3 images) -->
        <details class="product-step-details">
          <summary class="step-summary">
            <span class="step-number">2</span>
            <span class="step-title">Première Couche de Douceur</span>
            <span class="step-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: premiereCoucheProgress + '%' }"></div>
              </div>
              <span class="progress-text">{{ premiereCoucheConfigured }}/4</span>
            </span>
          </summary>
          <ProductStep
            :step="2"
            title="Première Couche de Douceur"
            description="Ajoutez jusqu'à 3 variantes de douceur"
            :products="props.premiereCoucheDouceur"
            :locked="props.lockedProducts.premiereCoucheDouceur"
            :images-count="3"
            :start-index="3"
            @upload="handleUpload"
            @remove="handleRemove"
            @save="handleSave"
            @reset="handleReset"
            @toggleLock="handleToggleLock"
          />
        </details>

        <!-- Étape 3 : Seconde Couche de Douceur (3 images) -->
        <details class="product-step-details">
          <summary class="step-summary">
            <span class="step-number">3</span>
            <span class="step-title">Seconde Couche de Douceur</span>
            <span class="step-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: secondeCoucheProgress + '%' }"></div>
              </div>
              <span class="progress-text">{{ secondeCoucheConfigured }}/4</span>
            </span>
          </summary>
          <ProductStep
            :step="3"
            title="Seconde Couche de Douceur"
            description="Ajoutez plusieurs déclinaisons de douceur"
            :products="props.secondeCoucheDouceur"
            :locked="props.lockedProducts.secondeCoucheDouceur"
            :images-count="3"
            :start-index="7"
            @upload="handleUpload"
            @remove="handleRemove"
            @save="handleSave"
            @reset="handleReset"
            @toggleLock="handleToggleLock"
          />
        </details>

        <!-- Étape 4 : Touche Finale (3 images) -->
        <details class="product-step-details">
          <summary class="step-summary">
            <span class="step-number">4</span>
            <span class="step-title">Touche Finale</span>
            <span class="step-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: toucheFinaleProgress + '%' }"></div>
              </div>
              <span class="progress-text">{{ toucheFinaleConfigured }}/4</span>
            </span>
          </summary>
          <ProductStep
            :step="4"
            title="Touche Finale"
            description="Ajoutez différentes finitions"
            :products="props.toucheFinale"
            :locked="props.lockedProducts.toucheFinale"
            :images-count="3"
            :start-index="11"
            @upload="handleUpload"
            @remove="handleRemove"
            @save="handleSave"
            @reset="handleReset"
            @toggleLock="handleToggleLock"
          />
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ProductStep from './ProductStep.vue'

// Props reçues du composant parent
const props = defineProps<{
  fonds: any[]
  premiereCoucheDouceur: any[]
  secondeCoucheDouceur: any[]
  toucheFinale: any[]
  lockedProducts: any
  totalProducts: number
  totalPending: number
  isProductsSectionOpen: boolean
  fondsProgress: number
  premiereCoucheProgress: number
  secondeCoucheProgress: number
  toucheFinaleProgress: number
  fondsConfigured: number
  premiereCoucheConfigured: number
  secondeCoucheConfigured: number
  toucheFinaleConfigured: number
}>()

// Log temporaire pour déboguer
console.log('🔍 AccordionSection - Props reçues:', {
  fonds: props.fonds,
  premiereCoucheDouceur: props.premiereCoucheDouceur,
  lockedProducts: props.lockedProducts
})

// Émettre les événements vers le parent
const emit = defineEmits<{
  upload: [{ productIndex: number, imageIndex: number, file: File }]
  remove: [{ productIndex: number, imageIndex: number }]
  save: [index: number]
  reset: [index: number]
  toggle: []
  toggleLock: [index: number]
  showDeleteConfirm: []
}>()

const toggleProductsSection = () => {
  emit('toggle')
}

// Fonctions pour gérer les événements
function handleUpload({ productIndex, imageIndex, file }: { productIndex: number, imageIndex: number, file: File }) {
  emit('upload', { productIndex, imageIndex, file })
}

function handleRemove({ productIndex, imageIndex }: { productIndex: number, imageIndex: number }) {
  emit('remove', { productIndex, imageIndex })
}

function handleSave(index: number) {
  emit('save', index)
}

function handleReset(index: number) {
  emit('reset', index)
}

function handleToggleLock(index: number) {
  emit('toggleLock', index)
}

function showDeleteConfirmModal() {
  emit('showDeleteConfirm')
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
  position: relative;
  
  &:hover {
    background: rgba($admin-primary, 0.05);
  }
  
  .header-left {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }
  
  h2 {
    margin: 0;
    color: $admin-primary;
    font-family: var(--font-family-title);
    font-weight: 600;
    font-size: 1.5rem;
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }
  
  .title-icon {
    font-size: 2.2rem;
    line-height: 1;
    display: flex;
    align-items: center;
    
    i {
      color: $admin-primary;
      font-size: 2.2rem;
      display: inline-block !important;
      font-family: "Font Awesome 5 Free" !important;
      font-weight: 900 !important;
    }
  }
  
  .title-text {
    font-weight: 700;
    color: $admin-primary;
  }
  
  .section-stats {
    display: flex;
    gap: 1rem;
    align-items: center;
    
    .stat-item {
      font-family: var(--font-family-text);
      color: $admin-text-light;
      font-size: 0.9rem;
      
      &.pending-stat {
        color: $admin-secondary;
        font-weight: 500;
      }
    }
  }
  
  .header-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-right: 2.5rem;
  }

  .clear-all-products-btn {
    background-color: $admin-danger;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-family-text);
    font-size: 0.9rem;
    font-weight: 500;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #c82333;
    }

    i {
      font-size: 1rem;
    }
  }
  
  .accordion-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.3s ease;
    
    &.rotated {
      transform: translateY(-50%) rotate(180deg);
    }
    
    .accordion-arrow {
      font-size: 1.2rem;
      color: $admin-primary;
    }
  }
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  
  &.open {
    max-height: 5000px;
  }
}

.products-accordion {
  padding: 1rem;
}

.product-step-details {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
  
  .step-summary {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba($admin-primary, 0.02);
    cursor: pointer;
    transition: background 0.2s ease;
    
    &:hover {
      background: rgba($admin-primary, 0.05);
    }
    
    .step-number {
      font-family: var(--font-family-title);
      background: $admin-primary;
      color: white;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.2rem;
    }
    
    .step-title {
      font-family: var(--font-family-title);
      font-weight: 600;
      color: $admin-text-dark;
      flex: 1;
    }
    
    .step-progress {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .progress-bar {
        width: 100px;
        height: 8px;
        background: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
        
        .progress-fill {
          height: 100%;
          background: $admin-success;
          transition: width 0.3s ease;
        }
      }
      
      .progress-text {
        font-family: var(--font-family-text);
        font-size: 0.9rem;
        color: $admin-text-light;
        min-width: 40px;
        text-align: center;
      }
    }
  }
}

/* Responsive */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    
    h2 {
      font-size: 1.5rem;
    }
    
    .section-stats {
      width: 100%;
      justify-content: space-between;
    }
  }
  
  .step-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    
    .step-progress {
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style>

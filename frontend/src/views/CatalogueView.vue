<template>
  <div class="page-container">
    <main class="content-container composer-content">
      <div class="catalogue-card card">
        <h1 class="section-title">Catalogue</h1>
        
        <section class="catalogue-section">
          <div class="section-desc">
            <p>Découvrez notre sélection de tartelettes et desserts artisanaux, créés avec passion et des ingrédients d'exception.</p>
          </div>
          
          <div class="catalogue-grid">
            <div 
              v-for="produit in produits" 
              :key="produit.id"
              class="produit-card"
            >
              <!-- Image (1/6) -->
              <div class="produit-image">
                <img 
                  :src="produit.image" 
                  :alt="produit.nom" 
                  @click="openImageZoom(produit.image, produit.nom)"
                  class="produit-image-clickable"
                />
              </div>

              <!-- Contenu principal (4/6) -->
              <div class="produit-content">
                <h3 class="produit-nom">{{ produit.nom }}</h3>
                
                <div class="produit-composition">
                  <div class="composition-item">
                    <span class="composition-label">Base:</span>
                    <span class="composition-value">{{ produit.base }}</span>
                  </div>
                  <div class="composition-item">
                    <span class="composition-label">Première douceur:</span>
                    <span class="composition-value">{{ produit.premiereDouceur }}</span>
                  </div>
                  <div class="composition-item">
                    <span class="composition-label">Seconde douceur:</span>
                    <span class="composition-value">{{ produit.secondeDouceur }}</span>
                  </div>
                  <div class="composition-item">
                    <span class="composition-label">Finition:</span>
                    <span class="composition-value">{{ produit.finition }}</span>
                  </div>
                </div>
              </div>

              <!-- Panier et quantité (1/6) -->
              <div class="produit-actions">
                <div class="quantite-selector">
                  <div class="quantite-label">Quantité</div>
                  <div class="quantite-row">
                    <button 
                      @click="produit.quantite = Math.max(1, produit.quantite - 1)" 
                      aria-label="Diminuer la quantité" 
                      class="quantite-btn" 
                      :disabled="produit.quantite <= 1"
                    >
                      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 15L5 9L11 3" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <input 
                      type="number" 
                      v-model="produit.quantite" 
                      min="1" 
                      max="10" 
                      class="quantite-input"
                    />
                    <button 
                      @click="produit.quantite = Math.min(10, produit.quantite + 1)" 
                      aria-label="Augmenter la quantité" 
                      class="quantite-btn" 
                      :disabled="produit.quantite >= 10"
                    >
                      <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 15L13 9L7 3" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <span class="quantite-text">
                      {{ produit.quantite > 1 ? 'tartelettes' : 'tartelette' }}
                    </span>
                  </div>
                </div>
                
                <div class="cta-group">
                  <button 
                    @click="ajouterAuPanier(produit)"
                    class="btn-panier"
                    :aria-label="`Ajouter ${produit.nom} au panier`"
                  >
                    <i class="fas fa-shopping-cart"></i>
                    <span class="btn-text">Ajouter</span>
                  </button>
                  
                  <button 
                    @click="annulerAction"
                    class="btn-refresh"
                    aria-label="Refresh avant ajout"
                  >
                    <i class="fas fa-redo"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
  
  <!-- Modal de confirmation -->
  <AddToCartModal 
    :show="showAddModal"
    :message="`${produitAjoute?.nom} a bien été ajouté au panier !`"
    @close="closeAddModal"
  />
  
  <!-- Modal de zoom d'image -->
  <div v-if="showImageZoom" class="image-zoom-overlay" @click="closeImageZoom">
    <div class="image-zoom-container" @click.stop>
      <button class="image-zoom-close" @click="closeImageZoom" aria-label="Fermer l'image">
        <i class="fas fa-times"></i>
      </button>
      <img :src="zoomedImage" :alt="zoomedImageAlt" class="image-zoom-img" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AddToCartModal from '@/components/AddToCartModal.vue'

// Données fictives pour les produits
const produits = ref([
  {
    id: 1,
    nom: 'Tarte citron meringuée',
    image: new URL('@/assets/images/TCitron.png', import.meta.url).href,
    base: 'Pâte sucrée vanille et citron',
    premiereDouceur: 'Gel au 2 citrons',
    secondeDouceur: 'Lemon curd citron jaune',
    finition: 'Meringue italienne',
    quantite: 1
  }
])

const showAddModal = ref(false)
const produitAjoute = ref<any>(null)
const showImageZoom = ref(false)
const zoomedImage = ref('')
const zoomedImageAlt = ref('')

const ajouterAuPanier = (produit: any) => {
  console.log(`Ajout au panier: ${produit.nom} - Quantité: ${produit.quantite}`)
  // Logique d'ajout au panier à implémenter
  
  // Afficher la modal de confirmation
  produitAjoute.value = produit
  showAddModal.value = true
}

const closeAddModal = () => {
  showAddModal.value = false
  produitAjoute.value = null
}

const openImageZoom = (image: string, alt: string) => {
  zoomedImage.value = image
  zoomedImageAlt.value = alt
  showImageZoom.value = true
}

const closeImageZoom = () => {
  showImageZoom.value = false
  zoomedImage.value = ''
  zoomedImageAlt.value = ''
}



const annulerAction = () => {
  console.log('Refresh avant ajout')
  // Reset quantité à 1 avant ajout au panier
  produits.value.forEach(produit => {
    produit.quantite = 1
  })
}
</script>

<style scoped>
@import '@/assets/styles/vues.scss';

.catalogue-section {
  width: 100%;
}



.catalogue-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.produit-card {
  display: grid;
  grid-template-columns: 1.5fr 3.5fr 1fr;
  gap: 1.5rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  max-width: 700px;
  margin: 0 auto;
}

.produit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.produit-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.produit-image img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.produit-image-clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.produit-image-clickable:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.produit-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.3rem 0;
}

.produit-nom {
  font-family: var(--font-family-title);
  font-size: 1.2rem;
  color: #90aeb0;
  margin-bottom: 1rem;
  font-weight: 600;
  opacity: 0.9;
  margin-top: 0;
}

.produit-composition {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.composition-item {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.composition-label {
  font-family: var(--font-family-text);
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.6;
  font-weight: 500;
  min-width: 120px;
}

.composition-value {
  font-family: var(--font-family-text);
  font-size: 0.8rem;
  color: var(--text-color);
  font-weight: 400;
  opacity: 0.8;
}

.produit-actions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.quantite-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.quantite-label {
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  color: var(--text-color);
  font-weight: 600;
}

.quantite-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.quantite-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: var(--accent-color);
}

.quantite-btn:hover:not(:disabled) {
  background: var(--accent-color);
  color: #fff;
  border-color: var(--accent-color);
}

.quantite-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantite-input {
  width: 40px;
  height: 28px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  text-align: center;
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  background: #fff;
  color: var(--text-color);
}

.quantite-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(255, 111, 97, 0.1);
}

.quantite-text {
  color: #888;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: var(--font-family-text);
  min-width: 60px;
  text-align: left;
}

.btn-panier {
  background: var(--accent-color);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: var(--font-family-text);
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-panier:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.btn-panier i {
  font-size: 1rem;
}

.btn-panier .btn-text {
  font-size: 0.9rem;
  font-weight: 600;
}

.cta-group {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
}

.btn-refresh {
  background: #90aeb0;
  color: #fff;
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-refresh:hover {
  background: #7a9a9c;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.btn-refresh i {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .produit-card {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .produit-image img {
    height: 100px;
  }

  .produit-nom {
    font-size: 1rem;
    text-align: center;
  }

  .composition-item {
    flex-direction: column;
    gap: 0.3rem;
  }

  .composition-label {
    min-width: auto;
  }

  .produit-actions {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0 0 0;
  }

  .cta-group {
    flex-direction: row;
    gap: 0.5rem;
  }

  .btn-panier {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }

  .btn-refresh {
    width: 35px;
    height: 40px;
  }

  .quantite-selector {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }

  .quantite-row {
    gap: 0.3rem;
  }

  .quantite-input {
    width: 35px;
  }

  .quantite-text {
    font-size: 0.7rem;
    min-width: 50px;
  }
}

/* Styles pour le zoom d'image */
.image-zoom-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

.image-zoom-container {
  position: relative;
  max-width: 50vw;
  max-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-zoom-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: zoomIn 0.3s ease;
}

.image-zoom-close {
  position: absolute;
  top: -50px;
  right: -50px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
  font-size: 1.2rem;
  z-index: 1;
}

.image-zoom-close:hover {
  background: #fff;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoomIn {
  from { 
    opacity: 0;
    transform: scale(0.8);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .image-zoom-container {
    max-width: 75vw;
    max-height: 60vh;
  }
  
  .image-zoom-close {
    top: -40px;
    right: -40px;
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}



@media (max-width: 480px) {
  .produit-card {
    padding: 1rem;
  }

  .produit-nom {
    font-size: 0.9rem;
  }

  .composition-value {
    font-size: 0.7rem;
  }
}
</style>

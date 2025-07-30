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
            <article 
              v-for="produit in produits" 
              :key="produit.id"
              class="produit-card"
            >
              <div class="produit-image">
                <img 
                  :src="produit.image" 
                  :alt="produit.nom" 
                  @click="openImageZoom(produit.image, produit.nom)"
                  class="produit-image-clickable"
                />
              </div>

              <div class="produit-content">
                <h3 class="produit-nom">{{ produit.nom }}</h3>
                
                <dl class="produit-composition">
                  <div class="composition-item">
                    <dt class="composition-label">Base:</dt><dd class="composition-value">{{ produit.base }}</dd>
                  </div>
                  <div class="composition-item">
                    <dt class="composition-label">Première douceur:</dt><dd class="composition-value">{{ produit.premiereDouceur }}</dd>
                  </div>
                  <div class="composition-item">
                    <dt class="composition-label">Seconde douceur:</dt><dd class="composition-value">{{ produit.secondeDouceur }}</dd>
                  </div>
                  <div class="composition-item">
                    <dt class="composition-label">Finition:</dt><dd class="composition-value">{{ produit.finition }}</dd>
                  </div>
                </dl>
              </div>

              <div class="produit-actions">
                <div class="quantite-selector">
                  <label class="quantite-label">Quantité</label>
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
                      aria-label="Quantité"
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
                    <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                    <span class="btn-text">Ajouter</span>
                  </button>
                  
                  <button 
                    @click="annulerAction"
                    class="btn-refresh"
                    aria-label="Réinitialiser la quantité"
                  >
                    <i class="fas fa-redo" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </article>

            <article 
              v-for="produit in produits" 
              :key="`mobile-${produit.id}`"
              class="produit-mobile" 
              @click="openProduitModal(produit)"
            >
              <div class="produit-mobile-image">
                <img 
                  :src="produit.image" 
                  :alt="produit.nom" 
                  class="produit-mobile-img"
                />
              </div>
              <div class="produit-mobile-info">
                <h3 class="produit-mobile-nom">{{ produit.nom }}</h3>
                <div class="produit-mobile-arrow">
                  <i class="fas fa-chevron-right" aria-hidden="true"></i>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  </div>
  
  <AddToCartModal 
    :show="showAddModal"
    :message="`${produitAjoute?.nom} a bien été ajouté au panier !`"
    @close="closeAddModal"
    @viewCart="ouvrirPanier"
  />

  <!-- Modal d'incitation à la connexion -->
  <LoginPromptModal 
    :isOpen="showLoginPrompt" 
    @close="closeLoginPrompt"
    @loginSuccess="handleLoginSuccess"
    @registerSuccess="handleRegisterSuccess"
    @openCart="openCartAfterLogin"
  />
  
  <div v-if="showImageZoom" class="image-zoom-overlay" @click="closeImageZoom">
    <div class="image-zoom-container" @click.stop>
      <button class="image-zoom-close" @click="closeImageZoom" aria-label="Fermer l'image">
        <i class="fas fa-times" aria-hidden="true"></i>
      </button>
      <img :src="zoomedImage" :alt="zoomedImageAlt" class="image-zoom-img" />
    </div>
  </div>

  <div v-if="showProduitModal" class="produit-modal-overlay" @click="closeProduitModal">
    <div class="produit-modal" @click.stop>
      <div class="produit-modal-header">
        <button class="produit-modal-close" @click="closeProduitModal" aria-label="Fermer">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
      
      <div class="produit-modal-content" v-if="produitModal">
        <div class="produit-modal-image">
          <img 
            :src="produitModal.image" 
            :alt="produitModal.nom" 
            class="produit-modal-img"
          />
        </div>
        
        <div class="produit-modal-details">
          <h2 class="produit-modal-nom">{{ produitModal.nom }}</h2>
          
          <dl class="produit-modal-composition">
            <div class="composition-item">
              <dt class="composition-label">Base:</dt>
              <dd class="composition-value">{{ produitModal.base }}</dd>
            </div>
            <div class="composition-item">
              <dt class="composition-label">Première douceur:</dt>
              <dd class="composition-value">{{ produitModal.premiereDouceur }}</dd>
            </div>
            <div class="composition-item">
              <dt class="composition-label">Seconde douceur:</dt>
              <dd class="composition-value">{{ produitModal.secondeDouceur }}</dd>
            </div>
            <div class="composition-item">
              <dt class="composition-label">Finition:</dt>
              <dd class="composition-value">{{ produitModal.finition }}</dd>
            </div>
          </dl>
          
          <div class="produit-modal-actions">
            <div class="quantite-selector">
              <label class="quantite-label">Quantité</label>
              <div class="quantite-row">
                <button 
                  @click="produitModal.quantite = Math.max(1, produitModal.quantite - 1)" 
                  aria-label="Diminuer la quantité" 
                  class="quantite-btn" 
                  :disabled="produitModal.quantite <= 1"
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 15L5 9L11 3" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <input 
                  type="number" 
                  v-model="produitModal.quantite" 
                  min="1" 
                  max="10" 
                  class="quantite-input"
                  aria-label="Quantité"
                />
                <button 
                  @click="produitModal.quantite = Math.min(10, produitModal.quantite + 1)" 
                  aria-label="Augmenter la quantité" 
                  class="quantite-btn" 
                  :disabled="produitModal.quantite >= 10"
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 15L13 9L7 3" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <span class="quantite-text">
                  {{ produitModal.quantite > 1 ? 'tartelettes' : 'tartelette' }}
                </span>
              </div>
            </div>
            
            <div class="cta-group">
              <button 
                @click="ajouterAuPanier(produitModal); closeProduitModal()"
                class="btn-panier"
                :aria-label="`Ajouter ${produitModal.nom} au panier`"
              >
                <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                <span class="btn-text">Ajouter</span>
              </button>
              
              <button 
                @click="annulerAction"
                class="btn-refresh"
                aria-label="Réinitialiser la quantité"
              >
                <i class="fas fa-redo" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AddToCartModal from '@/components/AddToCartModal.vue'
import LoginPromptModal from '@/components/LoginPromptModal.vue'
import { usePanierStore } from '@/stores/panier'
import { useAuthStore } from '@/stores/auth'
import CartAnimation from '@/components/CartAnimation.vue'

const panierStore = usePanierStore()
const authStore = useAuthStore()

interface Produit {
  id: number
  nom: string
  image: string
  base: string
  premiereDouceur: string
  secondeDouceur: string
  finition: string
  prix: number
  quantite: number
}

const produits = ref<Produit[]>([
  {
    id: 1,
    nom: 'Tarte citron meringuée',
    image: new URL('@/assets/images/TCitron.png', import.meta.url).href,
    base: 'Pâte sucrée vanille et citron',
    premiereDouceur: 'Gel au 2 citrons',
    secondeDouceur: 'Lemon curd citron jaune',
    finition: 'Meringue italienne',
    prix: 6,
    quantite: 1
  },
  {
    id: 2,
    nom: 'Tarte aux fraises',
    image: new URL('@/assets/images/TFraise.jpg', import.meta.url).href,
    base: 'Pâte sablée vanille',
    premiereDouceur: 'Crème pâtissière vanille',
    secondeDouceur: 'Fraise fraîche de saison',
    finition: 'Glaçage miroir fraise',
    prix: 6,
    quantite: 1
  },
  {
    id: 3,
    nom: 'Tarte au chocolat',
    image: new URL('@/assets/images/TChocolat.jpg', import.meta.url).href,
    base: 'Pâte sablée chocolat',
    premiereDouceur: 'Ganache chocolat noir 70%',
    secondeDouceur: 'Mousse chocolat au lait',
    finition: 'Décors chocolat et feuilles d\'or',
    prix: 6,
    quantite: 1
  },
  {
    id: 4,
    nom: 'Tarte aux poires',
    image: new URL('@/assets/images/Tpoire.jpg', import.meta.url).href,
    base: 'Pâte brisée amande',
    premiereDouceur: 'Crème d\'amandes',
    secondeDouceur: 'Poire Williams pochée',
    finition: 'Amandes effilées et sucre glace',
    prix: 6,
    quantite: 1
  }
])

const showAddModal = ref(false)
const produitAjoute = ref<Produit | null>(null)
const showImageZoom = ref(false)
const zoomedImage = ref('')
const zoomedImageAlt = ref('')
const showProduitModal = ref(false)
const produitModal = ref<Produit | null>(null)
const showLoginPrompt = ref(false)

const ajouterAuPanier = (produit: Produit) => {
  if (!authStore.isAuthenticated) {
    showLoginPrompt.value = true
    return
  }
  
  const success = panierStore.ajouterAuPanier(produit)
  if (success) {
    produitAjoute.value = produit
    showAddModal.value = true
    
    // Réinitialiser la quantité à 1 après ajout
    produit.quantite = 1
  }
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

const openProduitModal = (produit: Produit) => {
  produitModal.value = produit
  showProduitModal.value = true
}

const closeProduitModal = () => {
  showProduitModal.value = false
  produitModal.value = null
}

const annulerAction = () => {
  produits.value.forEach(produit => {
    produit.quantite = 1
  })
}

// Fonctions pour la modale d'incitation à la connexion
const closeLoginPrompt = () => {
  showLoginPrompt.value = false
}

const handleLoginSuccess = () => {
  // L'utilisateur s'est connecté avec succès
  // On peut maintenant ajouter le produit au panier
  if (produitModal.value) {
    ajouterAuPanierMobile(produitModal.value)
  }
}

const handleRegisterSuccess = () => {
  // L'utilisateur s'est inscrit avec succès
  // On peut maintenant ajouter le produit au panier
  if (produitModal.value) {
    ajouterAuPanierMobile(produitModal.value)
  }
}

const openCartAfterLogin = () => {
  ouvrirPanier()
}

const ajouterAuPanierMobile = (produit: Produit) => {
  if (!authStore.isAuthenticated) {
    showLoginPrompt.value = true
    return
  }
  
  panierStore.ajouterAuPanier(produit)
  produitAjoute.value = produit
  showAddModal.value = true
  closeProduitModal()
  
  // Réinitialiser la quantité à 1 après ajout
  produit.quantite = 1
}

const ouvrirPanier = () => panierStore.ouvrirPanier()
</script>

<style scoped>


.catalogue-section {
  width: 100%;
}

.catalogue-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.produit-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  max-width: 700px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2.5fr 1fr;
  gap: 1.5rem;
  width: 100%;
  align-items: stretch;
}

.produit-mobile {
  display: none;
}

.produit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.produit-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
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
  justify-content: space-between;
  padding: 0;
  height: 120px;
}

.produit-nom {
  font-family: var(--font-family-title);
  font-size: 1.2rem;
  color: #90aeb0;
  margin-bottom: 0.5rem;
  font-weight: 600;
  opacity: 0.9;
  margin-top: 0;
  padding-top: 0;
}

.produit-composition {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
}

.composition-item {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
  margin: 0;
  padding: 0;
}

.composition-label {
  font-family: var(--font-family-text);
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.6;
  font-weight: 500;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
}

.composition-value {
  font-family: var(--font-family-text);
  font-size: 0.8rem;
  color: var(--text-color);
  font-weight: 400;
  opacity: 0.8;
  flex: 1;
  margin: 0;
  padding: 0;
}

.produit-actions {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0;
  height: 120px;
  gap: 0;
}

.quantite-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  width: 100%;
  margin-top: 0;
}

.quantite-label {
  font-family: var(--font-family-text);
  font-size: 0.9rem;
  color: var(--text-color);
  font-weight: 600;
  text-align: left;
  width: 100%;
  margin: 0;
  padding: 0;
}

.quantite-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.5rem;
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
  justify-content: center;
  margin-top: auto;
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
    display: none;
  }

  .produit-mobile {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
    width: 90%;
    min-height: 80px;
    margin: 0 auto 1rem auto;
  }

  .produit-mobile:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .produit-mobile-image {
    flex-shrink: 0;
  }

  .produit-mobile-img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
  }

  .produit-mobile-info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
  }

  .produit-mobile-nom {
    font-family: var(--font-family-title);
    font-size: 1rem;
    color: #90aeb0;
    margin: 0;
    font-weight: 600;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .produit-mobile-arrow {
    color: #90aeb0;
    font-size: 1rem;
    flex-shrink: 0;
    margin-left: 0.5rem;
  }

  .produit-composition {
    gap: 0.2rem;
  }
  
  .composition-item {
    gap: 0.15rem;
  }
  
  .composition-label {
    font-size: 0.7rem;
  }
  
  .composition-value {
    font-size: 0.75rem;
  }
  
  .produit-nom {
    margin-top: 0;
    padding-top: 0;
    margin-bottom: 0.5rem;
  }
  
  .produit-content {
    padding-top: 0;
    margin-top: 0;
  }
  
  .produit-actions {
    padding-top: 0;
    margin-top: 0;
  }
  
  .quantite-label {
    margin-top: 0;
    padding-top: 0;
  }
}

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

.produit-modal-overlay {
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

.produit-modal {
  background: #fff;
  border-radius: 16px;
  max-width: 95vw;
  max-height: 90vh;
  width: 100%;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.produit-modal-header {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
}

.produit-modal-close {
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
}

.produit-modal-close:hover {
  background: #fff;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.produit-modal-content {
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.produit-modal-image {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.produit-modal-img {
  width: 100%;
  max-width: 400px;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.produit-modal-details {
  text-align: center;
}

.produit-modal-nom {
  font-family: var(--font-family-title);
  font-size: 1.5rem;
  color: #90aeb0;
  margin: 0 0 1.5rem 0;
  font-weight: 700;
}

.produit-modal-composition {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 2rem;
  text-align: left;
}

.produit-modal-composition .composition-item {
  display: flex;
  gap: 0.8rem;
  align-items: flex-start;
}

.produit-modal-composition .composition-label {
  min-width: 120px;
  font-weight: 600;
  color: #666;
}

.produit-modal-composition .composition-value {
  font-weight: 400;
  color: #333;
}

.produit-modal-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.produit-modal-actions .quantite-selector {
  width: 100%;
  max-width: 250px;
}

.produit-modal-actions .cta-group {
  justify-content: center;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

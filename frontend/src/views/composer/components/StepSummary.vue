<!-- src/views/composer/components/StepSummary.vue -->
<template>
  <section class="summary-section">
    <h2 class="summary-title">5) Récapitulatif de votre tartelette</h2>

    <!-- Prévisualisation du produit final -->
    <div v-if="previewSrc" class="final-preview">
      <img :src="previewSrc" alt="Produit final" class="final-preview-img" />
    </div>

    <div class="composition-card">
      <h3 class="composition-title">Votre composition</h3>
      <div class="ingredients-grid">
        <div v-if="fond" class="ingredient-card">
          <div class="ingredient-content">
            <span class="ingredient-label">Fond</span>
            <span class="ingredient-name">{{ fond.nom }}</span>
          </div>
        </div>
        <div v-if="g1" class="ingredient-card">
          <div class="ingredient-content">
            <span class="ingredient-label">1ère couche</span>
            <span class="ingredient-name">{{ g1.nom }}</span>
          </div>
        </div>
        <div v-if="g2" class="ingredient-card">
          <div class="ingredient-content">
            <span class="ingredient-label">2ème couche</span>
            <span class="ingredient-name">{{ g2.nom }}</span>
          </div>
        </div>
        <div v-if="g3" class="ingredient-card">
          <div class="ingredient-content">
            <span class="ingredient-label">Finition</span>
            <span class="ingredient-name">{{ g3.nom }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="quantity-section">
      <label class="quantity-label">Quantité</label>
      <div class="quantity-controls">
        <button 
          class="quantity-btn" 
          @click="$emit('setQty', Math.max(1, quantity-1))" 
          :disabled="quantity<=1"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <input 
          :value="quantity" 
          type="number" 
          min="1" 
          max="20" 
          class="quantity-input"
          @input="$emit('setQty', clamp(($event.target as HTMLInputElement).value))" 
        />
        <button 
          class="quantity-btn" 
          @click="$emit('setQty', Math.min(20, quantity+1))" 
          :disabled="quantity>=20"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="price-section">
      <div class="price-line">
        <span>Prix unitaire :</span>
        <span class="unit-price">{{ unitPrice.toFixed(2) }} €</span>
      </div>
      <div class="price-line total">
        <span>Total :</span>
        <span class="total-price">{{ (unitPrice * quantity).toFixed(2) }} €</span>
      </div>
    </div>

    <div class="actions-section">
      <div class="left-actions">
        <button class="btn-tertiary" @click="$emit('restart')" type="button">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3v12M3 9h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Recommencer
        </button>
        <button class="btn-secondary" @click="$emit('prev')" type="button">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 5l-4 4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Précédent
        </button>
      </div>
      <button class="btn-primary" @click="handleAddToCart" type="button">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 3v12M3 9h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Ajouter au panier
      </button>
    </div>

    <!-- Modal de confirmation/connexion -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ modalTitle }}</h3>
          <button class="modal-close" @click="closeModal" type="button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5l-10 10M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-message">{{ modalMessage }}</p>
          <div class="modal-actions">
            <button v-if="!isLoggedIn" class="btn-primary" @click="openLoginModal" type="button">
              Se connecter
            </button>
            <button v-else class="btn-primary" @click="confirmAddToCart" type="button">
              Confirmer
            </button>
            <button class="btn-secondary" @click="closeModal" type="button">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { Item } from '../types'

const authStore = useAuthStore()

const props = defineProps<{
  fond: Item | null
  g1: Item | null
  g2: Item | null
  g3: Item | null
  quantity: number
  unitPrice: number
  previewSrc?: string
}>()

const emit = defineEmits<{ 
  prev: []; 
  add: []; 
  setQty: [number];
  restart: [];
}>()

const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')

const isLoggedIn = computed(() => authStore.isLoggedIn)

function clamp(v: string) { 
  const n = Math.max(1, Math.min(20, parseInt(v||'1',10))); 
  return Number.isFinite(n) ? n : 1 
}



function handleAddToCart() {
  if (!isLoggedIn.value) {
    modalTitle.value = 'Connexion requise'
    modalMessage.value = 'Vous devez être connecté pour ajouter des produits à votre panier.'
    showModal.value = true
  } else {
    modalTitle.value = 'Confirmer l\'ajout'
    modalMessage.value = `Voulez-vous ajouter ${props.quantity} tartelette${props.quantity > 1 ? 's' : ''} à votre panier ?`
    showModal.value = true
  }
}

function closeModal() {
  showModal.value = false
}

function openLoginModal() {
  closeModal()
  window.dispatchEvent(new CustomEvent('open-login-modal'))
}

function confirmAddToCart() {
  emit('add')
  closeModal()
}
</script>

<style scoped>
.summary-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
  text-align: left;
}

.summary-title {
  font-family: var(--font-family-title, 'Poppins', sans-serif);
  color: var(--teal-color, #90aeb0);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  text-align: left;
}

.final-preview {
  text-align: center;
  margin: 1.5rem 0;
}

.final-preview-img {
  max-width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.composition-card {
  background: transparent;
  border: none;
  padding: 0;
  box-shadow: none;
  text-align: left;
  align-items: flex-start;
  justify-content: flex-start;
}

.composition-title {
  font-family: var(--font-family-title, 'Poppins', sans-serif);
  color: var(--teal-color, #90aeb0);
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.8rem 0;
  text-align: left;
}

.ingredients-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  text-align: left;
  align-items: flex-start;
  justify-content: flex-start;
}

.ingredient-card {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0.2rem 0;
  border: none;
  text-align: left;
  width: 100%;
}



.ingredient-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ingredient-label {
  font-family: var(--font-family-text, 'Inter', sans-serif);
  color: #333;
  font-size: 0.85rem;
  font-weight: 500;
  margin-right: 0.5rem;
  min-width: 80px;
  text-align: left;
  flex-shrink: 0;
}

.ingredient-name {
  font-family: var(--font-family-text, 'Inter', sans-serif);
  color: var(--accent-color, #e05a4e);
  font-size: 0.85rem;
  font-weight: 600;
  text-align: left;
  flex: 1;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-start;
}

.quantity-label {
  font-family: var(--font-family-text, 'Inter', sans-serif);
  color: var(--teal-color, #90aeb0);
  font-size: 1rem;
  font-weight: 600;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--white, #fff);
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 0.3rem;
}

.quantity-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f8f9fa;
  border-radius: 8px;
  color: var(--accent-color, #e05a4e);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: var(--accent-color, #e05a4e);
  color: white;
}

.quantity-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity-input {
  width: 60px;
  height: 36px;
  text-align: center;
  border: none;
  background: transparent;
  font-family: var(--font-family-text, 'Inter', sans-serif);
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent-color, #e05a4e);
}

.quantity-input:focus {
  outline: none;
}

.price-section {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-family-text, 'Inter', sans-serif);
  font-size: 0.95rem;
}

.price-line.total {
  border-top: 1px solid #dee2e6;
  padding-top: 0.5rem;
  font-weight: 600;
  font-size: 1.1rem;
}

.unit-price {
  color: #6c757d;
  font-weight: 500;
}

.total-price {
  color: var(--accent-color, #e05a4e);
  font-weight: 700;
}

.actions-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  gap: 1rem;
  flex-direction: row;
}

.left-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-start;
}

@media (max-width: 768px) {
  .summary-section {
    gap: 1rem;
    padding: 0.5rem 0;
  }

  .summary-title {
    font-size: 1.3rem;
  }

  .composition-title {
    font-size: 0.95rem;
  }

  .ingredient-label {
    font-size: 0.8rem;
    min-width: 70px;
  }

  .ingredient-name {
    font-size: 0.8rem;
  }

  .quantity-controls {
    padding: 0.2rem;
  }

  .quantity-btn {
    width: 32px;
    height: 32px;
  }

  .quantity-input {
    width: 50px;
    height: 32px;
    font-size: 0.9rem;
  }

  .price-section {
    padding: 0.8rem;
  }

  .price-line {
    font-size: 0.9rem;
  }

  .price-line.total {
    font-size: 1rem;
  }

  .actions-section {
    flex-direction: column;
    gap: 0.8rem;
    align-items: stretch;
  }

  .left-actions {
    justify-content: center;
    gap: 0.6rem;
  }

  .btn-tertiary, .btn-secondary, .btn-primary {
    padding: 0.8rem 1rem;
    font-size: 0.85rem;
    min-width: auto;
    flex: 1;
  }

  .btn-primary {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .summary-section {
    gap: 0.8rem;
  }

  .summary-title {
    font-size: 1.2rem;
  }

  .left-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .btn-tertiary, .btn-secondary, .btn-primary {
    padding: 0.7rem 0.8rem;
    font-size: 0.8rem;
  }

  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .modal-header {
    padding: 1rem 1rem 0.5rem 1rem;
  }

  .modal-title {
    font-size: 1.1rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .modal-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-actions .btn-primary,
  .modal-actions .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}

.btn-tertiary, .btn-secondary, .btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  font-family: var(--font-family-text, 'Inter', sans-serif);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid;
  min-width: 120px;
  justify-content: center;
  flex: 0 0 auto;
}

.btn-tertiary {
  background: var(--white, #fff);
  color: #6c757d;
  border-color: #6c757d;
}

.btn-tertiary:hover {
  background: #6c757d;
  color: white;
}

.btn-secondary {
  background: var(--white, #fff);
  color: var(--accent-color, #e05a4e);
  border-color: var(--accent-color, #e05a4e);
}

.btn-secondary:hover {
  background: var(--accent-color, #e05a4e);
  color: white;
}

.btn-primary {
  background: var(--accent-color, #e05a4e);
  color: white;
  border-color: var(--accent-color, #e05a4e);
  min-width: 140px;
  flex: 0 0 auto;
}

.btn-primary:hover {
  background: #d04a3e;
  border-color: #d04a3e;
}

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
}

.modal-content {
  background: var(--white, #fff);
  border-radius: 12px;
  padding: 0;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0.5rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-title {
  font-family: var(--font-family-title, 'Poppins', sans-serif);
  color: var(--teal-color, #90aeb0);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f8f9fa;
  color: #495057;
}

.modal-body {
  padding: 1.5rem;
}

.modal-message {
  font-family: var(--font-family-text, 'Inter', sans-serif);
  color: #495057;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
}

.modal-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
}

.modal-actions .btn-primary,
.modal-actions .btn-secondary {
  padding: 0.7rem 1.2rem;
  font-size: 0.9rem;
  min-width: auto;
}
</style>

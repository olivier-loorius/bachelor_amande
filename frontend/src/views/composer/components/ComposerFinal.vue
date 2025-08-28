<template>
  <!-- Étape 5 : Résumé et quantité -->
  <section v-if="currentStep === 5">
    <h2 class="composer-step-title">Et voilà, votre création finale !</h2>
    <p class="composer-step-desc">
      Il ne vous reste plus qu'à définir votre gourmandise… Choisissez le nombre de
      tartelettes à commander, pour vous faire plaisir ou pour partager !
    </p>
    <div class="composer-step5-wrapper">
      <div class="composer-step5-summary">
        <h3 class="composer-step-title summary-title">
          Votre création
        </h3>
        <div class="creation-items">
          <div
            v-if="selectedFond"
            class="creation-item"
          >
            <span class="item-dot"></span>
            {{ selectedFond.nom }}
          </div>
          <div
            v-if="selectedGarniture1"
            class="creation-item"
          >
            <span class="item-dot"></span>
            {{ selectedGarniture1.nom }}
          </div>
          <div
            v-if="selectedGarniture2"
            class="creation-item"
          >
            <span class="item-dot"></span>
            {{ selectedGarniture2.nom }}
          </div>
          <div
            v-if="selectedGarniture3"
            class="creation-item"
          >
            <span class="item-dot"></span>
            {{ selectedGarniture3.nom }}
          </div>
          <div
            v-if="selectedFinition"
            class="creation-item"
          >
            <span class="item-dot"></span>
            {{ selectedFinition.nom }}
          </div>
        </div>
        <div class="price-section">
          <div class="price-title">
            Prix total : {{ totalPrice }}€
          </div>
          <div class="price-calculation">
            {{ totalPrice }}€ × {{ quantity }} tartelette{{ quantity > 1 ? 's' : '' }} =
            <strong>{{ totalPrice * quantity }}€</strong>
          </div>
        </div>
      </div>
      <div class="composer-step5-actions">
        <div class="composer-step5-quantity">
          <label for="quantity" class="quantity-label">
            Quantité
          </label>
          <div class="quantity-controls">
            <button
              class="quantity-btn"
              @click="decreaseQuantity"
              :disabled="quantity <= 1"
              aria-label="Diminuer la quantité"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8h8"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
            <input
              id="quantity"
              :value="quantity"
              type="number"
              min="1"
              max="20"
              class="quantity-input"
              @input="validateQuantity"
            />
            <button
              class="quantity-btn"
              @click="increaseQuantity"
              :disabled="quantity >= 20"
              aria-label="Augmenter la quantité"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 4v8M4 8h8"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="composer-step5-buttons">
          <button class="composer-btn-secondary composer-btn-icon" @click="goToPrevStep">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 5l-4 4 4 4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="btn-text">Précédent</span>
          </button>
          <button
            class="composer-btn composer-btn-icon"
            @click="goToNextStep"
            aria-label="Suivant"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 5l4 4-4 4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="btn-text">Suivant</span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Étape 6 : Sélection de la finition -->
  <section v-if="currentStep === 6">
    <h2 class="composer-step-title">Dernière touche : la finition</h2>
    <p class="composer-step-desc">
      Choisissez la finition qui va sublimer votre création. C'est la cerise sur le gâteau !
    </p>
    <div class="composer-step6-wrapper">
      <div class="finition-grid">
        <div
          v-for="finition in finitions"
          :key="finition.id"
          :class="[
            'finition-cta-btn',
            { selected: selectedFinition?.id === finition.id },
          ]"
          @click="selectFinition(finition)"
        >
          {{ finition.nom }}
          <button
            v-if="selectedFinition && selectedFinition.id === finition.id"
            class="finition-deselect-btn"
            @click.stop="deselectFinition"
            aria-label="Désélectionner la finition"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3L9 9M9 3L3 9"
                stroke="#222"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="composer-footer">
        <div class="composer-progress-bar">
          <template v-for="step in 6" :key="step">
            <span
              class="progress-dot"
              :class="{
                done: currentStep > step,
                active: currentStep === step,
              }"
            ></span>
            <span
              v-if="step < 6"
              class="progress-bar"
              :class="{ done: currentStep > step }"
            ></span>
          </template>
        </div>
        <div class="composer-nav-btns">
          <button class="composer-btn-secondary composer-btn-icon" @click="goToPrevStep">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 5l-4 4 4 4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="btn-text">Précédent</span>
          </button>
          <button
            class="composer-btn composer-btn-icon"
            :disabled="!selectedFinition"
            @click="addToCart"
            aria-label="Ajouter au panier"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-13-2h13"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="btn-text">Ajouter au panier</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  currentStep: number
  selectedFond: { id: number; nom: string; image?: string } | null
  selectedGarniture1: { id: number; nom: string; image?: string } | null
  selectedGarniture2: { id: number; nom: string; image?: string } | null
  selectedGarniture3: { id: number; nom: string; image?: string } | null
  selectedFinition: { id: number; nom: string; image?: string } | null
  finitions: Array<{ id: number; nom: string; image?: string }>
  quantity: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectFinition: [finition: { id: number; nom: string; image?: string }]
  deselectFinition: []
  goToPrevStep: []
  goToNextStep: []
  addToCart: []
  updateQuantity: [quantity: number]
}>()

const totalPrice = 6

const decreaseQuantity = () => {
  if (props.quantity > 1) {
    emit('updateQuantity', props.quantity - 1)
  }
}

const increaseQuantity = () => {
  if (props.quantity < 20) {
    emit('updateQuantity', props.quantity + 1)
  }
}

const validateQuantity = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = parseInt(target.value)
  
  if (isNaN(value) || value < 1) {
    value = 1
  } else if (value > 20) {
    value = 20
  }
  
  emit('updateQuantity', value)
}

const selectFinition = (finition: { id: number; nom: string; image?: string }) => {
  emit('selectFinition', finition)
}

const deselectFinition = () => {
  emit('deselectFinition')
}

const goToPrevStep = () => {
  emit('goToPrevStep')
}

const goToNextStep = () => {
  emit('goToNextStep')
}

const addToCart = () => {
  emit('addToCart')
}
</script>

<style scoped>
/* Titres et descriptions - Utilisation des styles du projet de base */
.composer-step-title {
  font-family: var(--font-family-title);
  font-size: 1.6rem;
  color: var(--teal-color);
  margin-bottom: 0.2rem;
  margin-top: 4rem;
}

.composer-step-desc {
  font-family: var(--font-family-text);
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 3.5rem;
}

/* Étape 5 - Wrapper principal */
.composer-step5-wrapper {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
  margin-top: 2rem;
}

/* Résumé de la création */
.composer-step5-summary {
  flex: 1;
  background: var(--secondary-color);
  padding: var(--spacing-card);
  border-radius: var(--border-radius);
  border: 1px solid var(--cart-border-color);
}

.summary-title {
  font-size: 1.15rem;
  margin-top: 0;
  margin-bottom: 1.7rem;
}

.creation-items {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 1.7rem;
  width: 100%;
}

.creation-item {
  font-family: var(--font-family-text);
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.item-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-color);
}

/* Section prix */
.price-section {
  width: 100%;
  margin-bottom: 0.7rem;
}

.price-title {
  font-family: var(--font-family-title);
  font-size: 1.15rem;
  margin-top: 0;
  margin-bottom: 0.7rem;
  color: var(--accent-color);
}

.price-calculation {
  font-family: var(--font-family-text);
  color: var(--cart-text-light);
  font-size: 0.9rem;
  margin-bottom: 0;
  line-height: 1.4;
}

/* Actions et quantité */
.composer-step5-actions {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.composer-step5-quantity {
  display: flex;
  flex-direction: column;
}

.quantity-label {
  font-family: var(--font-family-title);
  font-size: 1.15rem;
  margin-bottom: 0.7rem;
  color: var(--teal-color);
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: 2px solid var(--cart-border-color);
  background: var(--white);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-color);
}

.quantity-btn:hover:not(:disabled) {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 80px;
  height: 40px;
  text-align: center;
  border: 2px solid var(--cart-border-color);
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  font-family: var(--font-family-text);
}

.quantity-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

/* Boutons de navigation */
.composer-step5-buttons {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.composer-btn,
.composer-btn-secondary {
  min-width: 160px;
  max-width: 160px;
  height: 40px;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(144, 174, 176, 0.1);
  margin: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  color: inherit;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-family: var(--font-family-text);
}

.composer-btn {
  background: var(--accent-color);
  color: var(--white);
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(144, 174, 176, 0.15);
}

.composer-btn:hover:not(:disabled) {
  background: var(--cart-btn-hover);
}

.composer-btn-secondary {
  background: var(--white);
  color: var(--accent-color);
  border: 2px solid var(--accent-color);
  transition: background 0.2s, color 0.2s;
}

.composer-btn-secondary:hover:not(:disabled) {
  background: var(--secondary-color);
  color: var(--cart-btn-hover);
}

.composer-btn:disabled,
.composer-btn-secondary:disabled {
  background: #ccc;
  cursor: not-allowed;
  color: #888;
}

.composer-btn-icon {
  min-width: 48px;
  max-width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 1.2rem;
  position: relative;
  border: 2px solid var(--accent-color);
  background: var(--white);
  transition: border 0.18s, background 0.18s, color 0.18s;
}

.composer-btn-icon:hover:not(:disabled) {
  border: 2.5px solid var(--cart-btn-hover);
  background: var(--accent-color);
  color: var(--white);
}

.composer-btn-icon:disabled {
  border: 2px solid #ccc;
  background: var(--secondary-color);
  color: #888;
}

.composer-btn-icon .btn-text {
  display: none;
}

/* Étape 6 - Sélection finition */
.composer-step6-wrapper {
  margin-top: 2rem;
}

.finition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.finition-cta-btn {
  position: relative;
  padding: 1.2rem;
  background: var(--white);
  border: 2px solid var(--cart-border-color);
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-size: 1.1rem;
  font-family: var(--font-family-text);
}

.finition-cta-btn:hover {
  border-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 111, 97, 0.15);
}

.finition-cta-btn.selected {
  border-color: var(--accent-color);
  background: #fff5f5;
  color: var(--accent-color);
}

.finition-deselect-btn {
  position: absolute;
  top: -12px;
  right: -12px;
  background: var(--cart-border-color);
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 3;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.finition-deselect-btn:hover {
  background: #d0d0d0;
}

/* Footer et barre de progression */
.composer-footer {
  width: 100%;
  background: var(--white);
  padding-top: 2rem;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

.composer-progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  margin-top: 1rem;
  gap: 0.5rem;
  min-width: 340px;
}

.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--cart-border-color);
  border: 2px solid var(--cart-border-color);
  box-sizing: border-box;
  transition: background 0.2s, border 0.2s;
  position: relative;
  z-index: 1;
  opacity: 0.7;
}

.progress-dot.active {
  background: var(--white);
  border: 2px solid var(--accent-color);
  opacity: 1;
}

.progress-dot.done {
  background: var(--accent-color);
  border: 2px solid var(--accent-color);
  opacity: 1;
}

.progress-bar {
  width: 48px;
  height: 2px;
  background: var(--cart-border-color);
  border-radius: 2px;
  margin: 0 8px;
  transition: background 0.2s;
  z-index: 0;
  opacity: 0.5;
}

.progress-bar.done {
  background: var(--accent-color);
  opacity: 1;
}

.composer-nav-btns {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 2.5rem;
  margin-bottom: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .composer-step5-wrapper {
    flex-direction: column;
    gap: 2rem;
  }
  
  .finition-grid {
    grid-template-columns: 1fr;
  }

  .composer-progress-bar {
    width: 80vw;
    max-width: 80vw;
    margin: 0.8rem auto 0.8rem auto;
    height: 4px;
    min-height: 4px;
  }

  .composer-progress-bar .progress-bar-inner {
    height: 4px;
    min-height: 4px;
  }

  .composer-progress-bar-label {
    font-size: 0.75rem;
    margin-bottom: 0.1rem;
  }
}

@media (max-width: 600px) {
  .composer-step5-wrapper {
    flex-direction: column;
    gap: 1.2rem;
    align-items: stretch;
  }
  
  .composer-step5-summary {
    width: 100%;
    height: auto;
    margin-bottom: 0.5rem;
  }
  
  .composer-step5-actions {
    width: 100%;
    height: auto;
    max-width: 90vw;
    margin: 0 auto 1.2rem auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

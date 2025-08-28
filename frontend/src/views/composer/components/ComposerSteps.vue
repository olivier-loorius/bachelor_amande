<!-- prettier-ignore -->
<template>
  <div>
    <!-- Étape 1-2 : Sélection du fond et première garniture -->
    <section v-if="currentStep === 1 || currentStep === 2">
      <h1 class="section-title">Composer sa tartelette</h1>
      <div class="composer-price-ux">
        Chez Amande, chaque tartelette est à prix unique :
        <span class="composer-price-ux-value">6€ / tartelette</span>
        Laissez-vous tenter, composez sans compter !
      </div>
      <p class="composer-intro">
        Créez la tartelette de vos rêves en quelques clics !<br />
        Choisissez chaque ingrédient, visualisez le résultat, et laissez parler votre
        gourmandise.<br />
        Chaque produit est préparé artisanalement dans notre atelier par nos pâtissiers
        passionnés, toujours à la recherche de qualité et de saveurs d'exception.<br />
        <span class="composer-intro-sub"
          >Personnalisez, savourez, partagez ! Disponible sous 2h en boutique.</span
        >
      </p>
      <h2 class="composer-step-title">Pour commencer, choisissez votre fond de tartelette</h2>
      <p class="composer-step-desc">
        Sélectionnez la base de votre tartelette parmi nos fonds maison.
      </p>
      
             <!-- Sélection des fonds -->
       <div class="fond-options" v-if="!isMobile">
         <div
           v-for="fond in fonds"
           :key="fond.id"
           :class="['fond-option-card', { selected: selectedFond?.id === fond.id }]"
           @click="selectFond(fond)"
         >
           <div class="fond-image-wrapper">
             <img
               v-if="fond.image"
               :src="fond.image"
               :alt="fond.nom"
               class="fond-image"
               @error="handleImageError"
             />
             <div v-else class="fond-img-error">
               Image du fond manquante<br>Vérifiez le dashboard ou Supabase
             </div>
             <div
               v-if="selectedFond?.id === fond.id"
               class="fond-overlay fond-hover-overlay"
             >
               <span class="fond-overlay-label">{{ fond.nom }}</span>
             </div>
           </div>
           
           <button
             v-if="selectedFond?.id === fond.id"
             class="fond-deselect-btn"
             @click.stop="deselectFond"
             aria-label="Désélectionner le fond"
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

      <!-- Mobile fonds -->
      <div v-else class="fond-carousel-mobile">
        <button
          class="fond-carousel-arrow"
          @click="prevFond"
          :disabled="fondIndex === 0"
          aria-label="Fond précédent"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              d="M12 15L6 9L12 3"
              stroke="#ff6f61"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <div
          class="fond-carousel-img-wrapper"
          @touchstart="handleFondSwipe"
          @touchend="handleFondSwipe"
        >
                     <div class="fond-card fond-card-mobile">
             <div
               :class="['fond-image-wrapper', { selected: selectedFond?.id === fonds[fondIndex].id }]"
               @click="selectFond(fonds[fondIndex])"
             >
              <img
                :src="fonds[fondIndex].image"
                :alt="fonds[fondIndex].nom"
                class="fond-image"
                @error="handleImageError"
              />
              <div
                v-if="selectedFond?.id === fonds[fondIndex].id"
                class="fond-overlay fond-hover-overlay"
              >
                <span class="fond-overlay-label">{{ fonds[fondIndex].nom }}</span>
              </div>
            </div>
            <button
              v-if="selectedFond?.id === fonds[fondIndex].id"
              class="fond-deselect-btn"
              @click.stop="deselectFond"
              aria-label="Désélectionner le fond"
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
          <div class="fond-carousel-dots">
            <span
              v-for="(fond, idx) in fonds"
              :key="fond.id"
              :class="['fond-dot', { active: idx === fondIndex }]"
            />
          </div>
        </div>
        <button
          class="fond-carousel-arrow"
          @click="nextFond"
          :disabled="fondIndex === fonds.length - 1"
          aria-label="Fond suivant"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              d="M6 15L12 9L6 3"
              stroke="#ff6f61"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <!-- Première garniture -->
      <h2 class="composer-step-title">Votre première couche de douceur</h2>
      <p class="composer-step-desc">
        C'est parti pour la douceur ! Choisissez parmi nos délicieuses crèmes maison. Chaque
        saveur a son petit caractère, à vous de jouer !
      </p>
      
      <!-- Mobile garniture 1 -->
      <div v-if="isMobile">
        <div class="garnitures-grid-mobile">
          <div
            v-for="garniture in garnitures1.slice(0, 4)"
            :key="garniture.id"
            :class="[
              'garniture-cta-btn',
              { selected: selectedGarniture1?.id === garniture.id },
            ]"
            @click="selectGarniture1(garniture)"
          >
            {{ garniture.nom }}
            <button
              v-if="selectedGarniture1 && selectedGarniture1.id === garniture.id"
              class="garniture-deselect-btn"
              @click.stop="deselectGarniture1"
              aria-label="Désélectionner la garniture"
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
        <div class="garniture-img-mobile-wrapper">
          <img
            v-if="selectedFond"
            :src="getGarnitureImage(selectedFond, getGarnitureToDisplay())"
            :alt="getGarnitureToDisplay()?.nom || selectedFond.nom"
            class="garniture-img-mobile"
            @error="handleImageError"
          />
          <div v-else class="garniture-img-placeholder garniture-img-mobile">
            Aucun fond sélectionné
          </div>
        </div>
      </div>

      <!-- Desktop garniture 1 -->
      <div v-else class="garniture-flex">
        <div class="garniture-cta-col">
          <div
            v-for="garniture in garnitures1.slice(0, 4)"
            :key="garniture.id"
            :class="[
              'garniture-cta-btn',
              { selected: selectedGarniture1?.id === garniture.id },
            ]"
            @click="selectGarniture1(garniture)"
          >
            {{ garniture.nom }}
            <button
              v-if="selectedGarniture1 && selectedGarniture1.id === garniture.id"
              class="garniture-deselect-btn"
              @click.stop="deselectGarniture1"
              aria-label="Désélectionner la garniture"
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
        <div class="garniture-img-col">
          <img
            v-if="selectedFond"
            :src="getGarnitureImage(selectedFond, getGarnitureToDisplay())"
            :alt="getGarnitureToDisplay()?.nom || selectedFond.nom"
            class="garniture-img"
            @error="handleImageError"
          />
          <div
            v-else
            class="garniture-img-placeholder"
          >
            Aucun fond sélectionné
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="composer-footer">
        <div class="composer-progress-bar">
          <template v-for="step in 5" :key="step">
            <span
              class="progress-dot"
              :class="{
                done: currentStep > step,
                active: currentStep === step,
              }"
            ></span>
            <span
              v-if="step < 5"
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
            :disabled="!selectedFond || !selectedGarniture1"
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
          </button>
        </div>
      </div>
    </section>

    <!-- Étape 3 : Seconde garniture -->
    <section v-if="currentStep === 3">
      <h2 class="composer-step-title">Votre seconde couche de douceur</h2>
      <p class="composer-step-desc">
        On continue la création ! Ajoutez une touche supplémentaire à votre tartelette. Et
        laissez-vous porter par votre envie !
      </p>
      
      <!-- Mobile garniture 2 -->
      <div v-if="isMobile">
        <div class="garnitures-grid-mobile">
          <div
            v-for="garniture in garnitures2.slice(0, 4)"
            :key="garniture.id"
            :class="[
              'garniture-cta-btn',
              { selected: selectedGarniture2?.id === garniture.id },
            ]"
            @click="selectGarniture2(garniture)"
          >
            {{ garniture.nom }}
            <button
              v-if="selectedGarniture2 && selectedGarniture2.id === garniture.id"
                class="garniture-deselect-btn"
                @click.stop="deselectGarniture2"
                aria-label="Désélectionner la garniture"
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
        <div class="garniture-img-mobile-wrapper">
          <img
            v-if="selectedFond"
            :src="getGarnitureImage(selectedFond, getGarnitureToDisplay())"
            :alt="getGarnitureToDisplay()?.nom || selectedFond.nom"
            class="garniture-img-mobile"
            @error="handleImageError"
          />
          <div v-else class="garniture-img-placeholder garniture-img-mobile">
            Aucun fond sélectionné
          </div>
        </div>
      </div>

      <!-- Desktop garniture 2 -->
      <div v-else class="garniture-flex">
        <div class="garniture-cta-col">
          <div
            v-for="garniture in garnitures2.slice(0, 4)"
            :key="garniture.id"
            :class="[
              'garniture-cta-btn',
              { selected: selectedGarniture2?.id === garniture.id },
            ]"
            @click="selectGarniture2(garniture)"
          >
            {{ garniture.nom }}
            <button
              v-if="selectedGarniture2 && selectedGarniture2.id === garniture.id"
                class="garniture-deselect-btn"
                @click.stop="deselectGarniture2"
                aria-label="Désélectionner la garniture"
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
        <div class="garniture-img-col">
          <img
            v-if="selectedFond"
            :src="getGarnitureImage(selectedFond, getGarnitureToDisplay())"
            :alt="getGarnitureToDisplay()?.nom || selectedFond.nom"
            class="garniture-img"
            @error="handleImageError"
          />
          <div
            v-else
            class="garniture-img-placeholder"
          >
            Aucun fond sélectionné
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="composer-footer">
        <div class="composer-progress-bar">
          <template v-for="step in 5" :key="step">
            <span
              class="progress-dot"
              :class="{
                done: currentStep > step,
                active: currentStep === step,
              }"
            ></span>
            <span
              v-if="step < 5"
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
            :disabled="!selectedGarniture2"
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
          </button>
        </div>
      </div>
    </section>

    <!-- Étape 4 : Troisième garniture -->
    <section v-if="currentStep === 4">
      <h2 class="composer-step-title">La touche finale</h2>
      <p class="composer-step-desc">
        On arrive au bout ! Ajoutez cette petite touche qui va faire toute la différence.
        Dernier moment pour laisser parler votre créativité !
      </p>
      
      <!-- Mobile garniture 3 -->
      <div v-if="isMobile">
        <div class="garnitures-grid-mobile">
          <div
            v-for="garniture in garnitures3.slice(0, 4)"
            :key="garniture.id"
            :class="[
              'garniture-cta-btn',
              { selected: selectedGarniture3?.id === garniture.id },
            ]"
            @click="selectGarniture3(garniture)"
          >
            {{ garniture.nom }}
            <button
              v-if="selectedGarniture3 && selectedGarniture3.id === garniture.id"
                class="garniture-deselect-btn"
                @click.stop="deselectGarniture3"
                aria-label="Désélectionner la garniture"
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
        <div class="garniture-img-mobile-wrapper">
          <img
            v-if="selectedFond"
            :src="getGarnitureImage(selectedFond, getGarnitureToDisplay())"
            :alt="getGarnitureToDisplay()?.nom || selectedFond.nom"
            class="garniture-img-mobile"
            @error="handleImageError"
          />
          <div v-else class="garniture-img-placeholder garniture-img-mobile">
            Aucun fond sélectionné
          </div>
        </div>
      </div>

      <!-- Desktop garniture 3 -->
      <div v-else class="garniture-flex">
        <div class="garniture-cta-col">
          <div
            v-for="garniture in garnitures3.slice(0, 4)"
            :key="garniture.id"
            :class="[
              'garniture-cta-btn',
              { selected: selectedGarniture3?.id === garniture.id },
            ]"
            @click="selectGarniture3(garniture)"
          >
            {{ garniture.nom }}
            <button
              v-if="selectedGarniture3 && selectedGarniture3.id === garniture.id"
                class="garniture-deselect-btn"
                @click.stop="deselectGarniture3"
                aria-label="Désélectionner la garniture"
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
        <div class="garniture-img-col">
          <img
            v-if="selectedFond"
            :src="getGarnitureImage(selectedFond, getGarnitureToDisplay())"
            :alt="getGarnitureToDisplay()?.nom || selectedFond.nom"
            class="garniture-img"
            @error="handleImageError"
          />
          <div
            v-else
            class="garniture-img-placeholder"
          >
            Aucun fond sélectionné
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="composer-footer">
        <div class="composer-progress-bar">
          <template v-for="step in 5" :key="step">
            <span
              class="progress-dot"
              :class="{
                done: currentStep > step,
                active: currentStep === step,
              }"
            ></span>
            <span
              v-if="step < 5"
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
            :disabled="!selectedGarniture3"
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
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Props reçues du parent
interface Props {
  currentStep: number
  selectedFond: any
  selectedGarniture1: any
  selectedGarniture2: any
  selectedGarniture3: any
  fonds: any[]
  garnitures1: any[]
  garnitures2: any[]
  garnitures3: any[]
  fondIndex: number
  isMobile: boolean
}

const props = defineProps<Props>()

// Emits vers le parent
const emit = defineEmits<{
  selectFond: [fond: any]
  selectGarniture1: [garniture: any]
  selectGarniture2: [garniture: any]
  selectGarniture3: [garniture: any]
  deselectFond: []
  deselectGarniture1: []
  deselectGarniture2: []
  deselectGarniture3: []
  goToNextStep: []
  goToPrevStep: []
  prevFond: []
  nextFond: []
  handleFondSwipe: [event: TouchEvent]
  handleImageError: [event: Event]
}>()

// Fonction pour obtenir la garniture à afficher selon l'étape
function getGarnitureToDisplay() {
  if (props.currentStep === 1) return props.selectedFond
  if (props.currentStep === 2) return props.selectedFond
  if (props.currentStep === 3) return props.selectedGarniture1
  if (props.currentStep === 4) return props.selectedGarniture2
  if (props.currentStep === 5) return props.selectedGarniture3
  return null
}

// Fonction pour obtenir l'image de la garniture
function getGarnitureImage(
  fond: { id: number; nom: string; image?: string } | null,
  garniture: { id: number; nom: string; image?: string } | null,
) {
  // Si on a une garniture, on l'affiche SEULEMENT
  if (garniture && garniture.image) {
    return garniture.image
  }
  
  // Sinon on affiche RIEN (pas le fond !)
  return ''
}

// Fonctions de sélection
function selectFond(fond: any) {
  emit('selectFond', fond)
}

function selectGarniture1(garniture: any) {
  emit('selectGarniture1', garniture)
}

function selectGarniture2(garniture: any) {
  emit('selectGarniture2', garniture)
}

function selectGarniture3(garniture: any) {
  emit('selectGarniture3', garniture)
}

function deselectFond() {
  emit('deselectFond')
}

function deselectGarniture1() {
  emit('deselectGarniture1')
}

function deselectGarniture2() {
  emit('deselectGarniture2')
}

function deselectGarniture3() {
  emit('deselectGarniture3')
}

function goToNextStep() {
  emit('goToNextStep')
}

function goToPrevStep() {
  emit('goToPrevStep')
}

function prevFond() {
  emit('prevFond')
}

function nextFond() {
  emit('nextFond')
}

function handleFondSwipe(event: TouchEvent) {
  emit('handleFondSwipe', event)
}

function handleImageError(event: Event) {
  emit('handleImageError', event)
}
</script>

<style scoped>
/* Styles de base */
.composer-step-title {
  font-family: var(--font-family-title);
  font-size: 1.6rem;
  color: #90aeb0;
  margin-bottom: 0.2rem;
  margin-top: 4rem;
}

.composer-step-desc {
  font-family: var(--font-family-text);
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 3.5rem;
}

.section-title {
  font-family: var(--font-family-title);
  font-size: 2.3rem;
  color: #90aeb0;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 1px;
}

.composer-intro {
  font-family: var(--font-family-text);
  font-size: 1.1rem;
  color: var(--text-color);
  margin-bottom: 2rem;
}

.composer-intro-sub {
  display: block;
  color: var(--text-color);
  font-weight: normal;
  margin-top: 0.7rem;
  font-size: 1.08rem;
  letter-spacing: 0.5px;
}

.composer-price-ux {
  margin: 0 0 1.2rem 0;
  text-align: left;
  font-size: 1.08rem;
  color: var(--text-color);
  font-family: var(--font-family-text);
  font-weight: normal;
  line-height: 1.5;
}

.composer-price-ux-value {
  color: #ff6f61;
  font-weight: bold;
  font-size: 1.08em;
  margin-left: 0.5em;
  margin-right: 0.5em;
}

/* Fonds */
.fond-options {
  gap: 2.5rem;
  justify-content: center;
  display: flex;
}

.fond-option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
  min-width: 140px;
  cursor: pointer;
  transition:
    transform 0.16s,
    border 0.16s;
  position: relative;
}

.fond-option-card .fond-image-wrapper {
  position: relative;
  width: 220px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  background: transparent;
  border: 1px solid #e0e0e0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.fond-option-card.selected .fond-image-wrapper {
  border: 1.5px solid var(--accent-color);
}

.fond-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 8px;
  margin: 0;
  background: none;
  border: none;
  padding: 0;
}

.fond-img-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b00;
  font-size: 1rem;
  background: #fff3f3;
  border-radius: 5px;
  border: 1px dashed #e0e0e0;
  text-align: center;
  line-height: 1.4;
}

.fond-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 8px;
  background: rgba(60, 60, 60, 0.45);
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}

.fond-option-card:hover .fond-overlay.fond-hover-overlay {
  opacity: 1;
  pointer-events: auto;
}

.fond-overlay-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 1.15rem;
  font-weight: bold;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  letter-spacing: 0.5px;
  text-align: center;
  white-space: pre-line;
  pointer-events: none;
}



.fond-deselect-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e0e0e0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: background 0.15s;
  position: absolute;
  top: -12px;
  right: -12px;
  z-index: 3;
  border: none;
  padding: 0;
}

.fond-deselect-btn:hover {
  background: #d0d0d0;
}

/* Garnitures */
.garniture-flex {
  display: flex;
  width: 100%;
  gap: 2.5rem;
  align-items: stretch;
}

.garniture-cta-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
}

.garniture-cta-btn {
  border: 1.5px solid #e0e0e0;
  position: relative;
  font-weight: bold;
  color: #222;
  background: #fff;
  transition:
    background 0.18s,
    color 0.18s,
    border 0.18s,
    outline 0.18s;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  padding: 1.1rem 1.2rem;
  min-width: 180px;
  max-width: 300px;
  font-size: 1.08rem;
  font-family: var(--font-family-text);
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 8px;
}

.garniture-cta-btn.selected {
  outline: 3px solid var(--accent-color);
  outline-offset: 2px;
  background: rgba(60, 60, 60, 0.45);
  color: #fff;
  font-weight: bold;
  z-index: 15;
}

.garniture-img-col {
  display: flex;
  justify-content: flex-start;
}

.garniture-img {
  width: 100%;
  height: 312px;
  object-fit: contain;
  border-radius: 8px;
  display: block;
}

.garniture-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0b0b0;
  font-size: 1rem;
  border: 1px dashed #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.garniture-deselect-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e0e0e0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: background 0.15s;
  position: absolute;
  top: -12px;
  right: -12px;
  z-index: 3;
  border: none;
  padding: 0;
}

.garniture-deselect-btn:hover {
  background: #d0d0d0;
}

/* Navigation */
.composer-footer {
  width: 100%;
  background: #fff;
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
  background: #e0e0e0;
  border: 2px solid #e0e0e0;
  box-sizing: border-box;
  transition:
    background 0.2s,
    border 0.2s;
  position: relative;
  z-index: 1;
  opacity: 0.7;
}

.progress-dot.active {
  background: #fff;
  border: 2px solid #ff6f61;
  opacity: 1;
}

.progress-dot.done {
  background: #ff6f61;
  border: 2px solid #ff6f61;
  opacity: 1;
}

.progress-bar {
  width: 48px;
  height: 2px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: 0 8px;
  transition: background 0.2s;
  z-index: 0;
  opacity: 0.5;
}

.progress-bar.done {
  background: #ff6f61;
  opacity: 1;
}

.composer-nav-btns {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 2.5rem;
  margin-bottom: 0;
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
  background: #fff;
  transition:
    border 0.18s,
    background 0.18s,
    color 0.18s;
}

.composer-btn-icon:hover:not(:disabled) {
  border: 2.5px solid var(--accent-hover-color);
  background: var(--accent-color);
  color: #fff;
}

.composer-btn-icon:disabled {
  border: 2px solid #ccc;
  background: #f5f5f5;
  color: #888;
}

.composer-btn-icon .btn-text {
  display: none;
}

/* Boutons spécifiques */
.composer-btn {
  background: var(--accent-color);
  color: #fff;
}

.composer-btn-secondary {
  background: #fff;
  color: var(--accent-color);
  border: 2px solid var(--accent-color);
}

.composer-btn-secondary:hover:not(:disabled) {
  background: #f0f0f0;
  color: #ff6f61;
}

.composer-btn:hover:not(:disabled) {
  background: var(--accent-hover-color);
  border: 2.5px solid var(--accent-color);
}

/* Mobile styles */
.fond-carousel-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.fond-carousel-img-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fond-card-mobile {
  width: 100%;
  max-width: 320px;
}

.fond-carousel-arrow {
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.15s;
}

.fond-carousel-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.fond-carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.7rem;
}

.fond-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e0e0e0;
  display: inline-block;
  transition: background 0.2s;
}

.fond-dot.active {
  background: #ff6f61;
}

.garnitures-grid-mobile {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.7rem;
  margin-bottom: 1.5rem;
  padding: 0 0.7rem;
  width: 100%;
  box-sizing: border-box;
}

.garnitures-grid-mobile .garniture-cta-btn {
  min-height: 32px;
  font-size: 0.8rem;
  border-radius: 6px;
  margin: 0;
  padding: 0.2rem 0.1rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  max-width: 100%;
  overflow-wrap: break-word;
  white-space: normal;
}

.garniture-img-mobile-wrapper {
  width: 100vw;
  max-width: 100vw;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.garniture-img-mobile {
  width: 80vw;
  max-width: 320px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

/* Responsive */
@media (min-width: 601px) {
  .garnitures-grid-mobile,
  .garniture-img-mobile-wrapper,
  .garniture-img-mobile {
    display: none !important;
  }
}

@media (max-width: 600px) {
  .composer-progress-bar {
    width: 80vw !important;
    max-width: 80vw !important;
    margin: 0.8rem auto 0.8rem auto !important;
    height: 4px !important;
    min-height: 4px !important;
  }
  
  .composer-progress-bar .progress-bar-inner {
    height: 4px !important;
    min-height: 4px !important;
  }
  
  .composer-progress-bar-label {
    font-size: 0.75rem !important;
    margin-bottom: 0.1rem !important;
  }
}
</style>

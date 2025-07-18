<template>
  <div class="page-container">
    <main class="content-container composer-content">
      <div class="composer-card">
        <!-- Barre de progression / Résumé -->
        <!-- 1. Supprimer la barre de progression du haut (enlever le bloc composer-stepper global) -->
        <!-- 2. Dans chaque étape, déplacer la barre de progression tout en bas, juste avant composer-nav-btns -->
        <!-- 3. Harmoniser le style des boutons CTA -->
        <!-- Étape 1 + 2 sur la même vue si currentStep === 1 ou 2 -->
        <section v-if="currentStep === 1 || currentStep === 2">
          <h1 class="composer-title">Composer sa tartelette</h1>
          <div class="composer-price-ux">
            Chez Amande, chaque tartelette est à prix unique :
            <span class="composer-price-ux-value">6 € / tartelette</span>
            Laissez-vous tenter, composez sans compter !
          </div>
          <p class="composer-intro composer-intro-left">
            Créez la tartelette de vos rêves en quelques clics !<br>
            Choisissez chaque ingrédient, visualisez le résultat, et laissez parler votre gourmandise.<br>
            <span class="composer-intro-sub">Personnalisez, savourez, partagez !</span>
          </p>
          <h2 class="composer-step-title">Pour commencer, choisissez votre fond de tartelette</h2>
          <p class="composer-step-desc">Sélectionnez la base de votre tartelette parmi nos fonds maison.</p>
          <!-- ... contenu étape 1 ... -->
          <div style="display: flex; gap: 24px; justify-content: center; align-items: flex-start; padding: 0; margin: 0;">
            <div v-for="fond in fonds" :key="fond.id" style="position: relative; display: inline-block;">
              <div
                @click="selectFond(fond)"
                :style="`
                  width:220px;
                  height:150px;
                  border-radius:8px;
                  overflow:hidden;
                  border:${selectedFond?.id === fond.id ? '3px solid var(--accent-color)' : '1px solid #e0e0e0'};
                  position:relative;
                  cursor:pointer;
                  background:none;
                  margin:0;
                  padding:0;
                  box-sizing:border-box;`
                "
              >
                <img
                  :src="fond.image"
                  :alt="fond.nom"
                  style="position:absolute;top:3px;left:3px;width:calc(100% - 6px);height:calc(100% - 6px);object-fit:cover;border-radius:5px !important;box-sizing:border-box;display:block;margin:0;background:none;border:none;padding:0;"
                />
                <div
                  v-if="selectedFond?.id === fond.id"
                  style="position:absolute;top:3px;left:3px;width:calc(100% - 6px);height:calc(100% - 6px);border-radius:5px !important;box-sizing:border-box;background:rgba(60,60,60,0.45);display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding-bottom:24px;z-index:1;"
                >
                  <span style="color:#fff;font-size:1.1rem;font-weight:bold;text-align:center;max-width:90%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:'Roboto',sans-serif;">{{ fond.nom }}</span>
                </div>
              </div>
              <button
                v-if="selectedFond?.id === fond.id"
                class="fond-deselect-btn"
                @click.stop="deselectFond"
                aria-label="Désélectionner le fond"
                style="position: absolute; top: -12px; right: -12px; background: #e0e0e0; border: none; cursor: pointer; padding: 0; z-index: 3; box-shadow: 0 1px 4px rgba(0,0,0,0.04); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3L9 9M9 3L3 9" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          <!-- Étape 2 (toujours visible sous l'étape 1) -->
          <h2 class="composer-step-title" style="margin-top: 3.5rem;">Votre première couche de douceur</h2>
          <p class="composer-step-desc">Faites votre choix parmi nos crèmes et ganaches maison.</p>
          <div style="display: flex; gap: 2.5rem; align-items: flex-start;">
            <div style="height: 312px; width: 220px; display: flex; flex-direction: column; justify-content: space-between;">
              <div v-for="garniture in garnitures1.slice(0, 4)" :key="garniture.id"
                :class="['garniture-cta-btn', { selected: selectedGarniture1?.id === garniture.id }]"
                style="display: flex; align-items: center; justify-content: flex-start; text-align: left; padding: 1.1rem 1.2rem; min-width: 180px; max-width: 300px; font-size: 1.08rem; font-family: var(--font-family-text); cursor: pointer; box-sizing: border-box; transition: border 0.18s, outline 0.18s; border-radius: 8px;"
                @click="selectGarniture1(garniture)"
              >
                {{ garniture.nom }}
                <button
                  v-if="selectedGarniture1 && selectedGarniture1.id === garniture.id"
                  class="garniture-deselect-btn"
                  @click.stop="selectedGarniture1 = null"
                  aria-label="Désélectionner la garniture"
                  style="position: absolute; top: -12px; right: -12px; background: #e0e0e0; border: none; cursor: pointer; padding: 0; z-index: 3; box-shadow: 0 1px 4px rgba(0,0,0,0.04); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L9 9M9 3L3 9" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div style="height: 312px; flex: 1; display: flex; align-items: stretch;">
              <img v-if="selectedFond" :src="getGarnitureImage(selectedFond, selectedGarniture1)" :alt="selectedGarniture1?.nom || selectedFond.nom" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; display: block;" />
              <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #b0b0b0; font-size: 1rem; border: 1px dashed #e0e0e0; border-radius: 8px; background: #fafafa;">Aucun fond sélectionné</div>
            </div>
          </div>
          <div class="composer-footer">
            <div class="composer-progress-bar">
              <template v-for="step in 5">
                <span
                  class="progress-dot"
                  :class="{
                    done: currentStep > step,
                    active: currentStep === step
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
              <button class="composer-btn" :disabled="!selectedFond || !selectedGarniture1" @click="goToNextStep">
                Suivant
                <svg style="margin-left:8px;vertical-align:middle;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 5l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        </section>

        <!-- Étape 3 et suivantes : une seule étape affichée -->
        <section v-if="currentStep === 3">
          <h2 class="composer-step-title">Votre seconde couche de douceur</h2>
          <p class="composer-step-desc">Ajoutez une touche fruitée ou crémeuse supplémentaire.</p>
          <div style="display: flex; gap: 2.5rem; align-items: flex-start; flex-direction: row-reverse;">
            <!-- CTA à droite -->
            <div style="height: 312px; width: 220px; display: flex; flex-direction: column; justify-content: space-between;">
              <div v-for="garniture in garnitures2.slice(0, 4)" :key="garniture.id"
                :class="['garniture-cta-btn', { selected: selectedGarniture2?.id === garniture.id }]"
                style="display: flex; align-items: center; justify-content: flex-start; text-align: left; padding: 1.1rem 1.2rem; min-width: 180px; max-width: 300px; font-size: 1.08rem; font-family: var(--font-family-text); cursor: pointer; box-sizing: border-box; transition: border 0.18s, outline 0.18s; border-radius: 8px;"
                @click="selectGarniture2(garniture)"
              >
                {{ garniture.nom }}
                <button
                  v-if="selectedGarniture2 && selectedGarniture2.id === garniture.id"
                  class="garniture-deselect-btn"
                  @click.stop="selectedGarniture2 = null"
                  aria-label="Désélectionner la garniture"
                  style="position: absolute; top: -12px; right: -12px; background: #e0e0e0; border: none; cursor: pointer; padding: 0; z-index: 3; box-shadow: 0 1px 4px rgba(0,0,0,0.04); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L9 9M9 3L3 9" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <!-- Image à gauche -->
            <div style="height: 312px; flex: 1; display: flex; align-items: stretch;">
              <img v-if="selectedFond" :src="getGarnitureImage(selectedFond, selectedGarniture1)" :alt="selectedGarniture1?.nom || selectedFond.nom" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; display: block;" />
              <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #b0b0b0; font-size: 1rem; border: 1px dashed #e0e0e0; border-radius: 8px; background: #fafafa;">Aucun fond sélectionné</div>
            </div>
          </div>
          <div class="composer-footer">
            <div class="composer-progress-bar">
              <template v-for="step in 5">
                <span
                  class="progress-dot"
                  :class="{
                    done: currentStep > step,
                    active: currentStep === step
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
              <button class="composer-btn-secondary" @click="currentStep = 2">
                <svg style="margin-right:8px;vertical-align:middle;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5l-4 4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Précédent
              </button>
              <button class="composer-btn" :disabled="!selectedGarniture2" @click="goToNextStep">
                Suivant
                <svg style="margin-left:8px;vertical-align:middle;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 5l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        </section>

        <!-- Étape 4 -->
        <section v-if="currentStep === 4">
          <h2 class="composer-step-title">Choisissez votre finition</h2>
          <p class="composer-step-desc">Ajoutez une touche de décoration pour votre tartelette.</p>
          <div style="display: flex; gap: 2.5rem; align-items: flex-start;">
            <div style="height: 312px; width: 220px; display: flex; flex-direction: column; justify-content: space-between;">
              <div v-for="finition in finitions" :key="finition.id"
                :class="['garniture-cta-btn', { selected: selectedFinition?.id === finition.id }]"
                style="display: flex; align-items: center; justify-content: flex-start; text-align: left; padding: 1.1rem 1.2rem; min-width: 180px; max-width: 300px; font-size: 1.08rem; font-family: var(--font-family-text); cursor: pointer; box-sizing: border-box; transition: border 0.18s, outline 0.18s; border-radius: 8px;"
                @click="selectFinition(finition)"
              >
                {{ finition.nom }}
                <button
                  v-if="selectedFinition && selectedFinition.id === finition.id"
                  class="garniture-deselect-btn"
                  @click.stop="selectedFinition = null"
                  aria-label="Désélectionner la finition"
                  style="position: absolute; top: -12px; right: -12px; background: #e0e0e0; border: none; cursor: pointer; padding: 0; z-index: 3; box-shadow: 0 1px 4px rgba(0,0,0,0.04); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L9 9M9 3L3 9" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div style="height: 312px; flex: 1; display: flex; align-items: stretch;">
              <img v-if="selectedFond" :src="getGarnitureImage(selectedFond, selectedGarniture1)" :alt="selectedGarniture1?.nom || selectedFond.nom" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; display: block;" />
              <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #b0b0b0; font-size: 1rem; border: 1px dashed #e0e0e0; border-radius: 8px; background: #fafafa;">Aucun fond sélectionné</div>
            </div>
          </div>
          <div class="composer-footer">
            <div class="composer-progress-bar">
              <template v-for="step in 5">
                <span
                  class="progress-dot"
                  :class="{
                    done: currentStep > step,
                    active: currentStep === step
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
              <button class="composer-btn-secondary" @click="currentStep = 3">
                <svg style="margin-right:8px;vertical-align:middle;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5l-4 4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Précédent
              </button>
              <button class="composer-btn" :disabled="!selectedFinition" @click="goToNextStep">
                Suivant
                <svg style="margin-left:8px;vertical-align:middle;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 5l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        </section>

        <!-- Étape 5 -->
        <section v-if="currentStep === 5">
          <h2 class="composer-step-title">Choisissez votre quantité</h2>
          <p class="composer-step-desc">Déterminez le nombre de tartelettes que vous souhaitez commander.</p>
          <div style="display: flex; gap: 2.5rem; align-items: flex-start;">
            <div style="height: 312px; width: 220px; display: flex; flex-direction: column; justify-content: space-between;">
              <div v-for="q in [1, 2, 3, 4, 5]" :key="q"
                :class="['garniture-cta-btn', { selected: quantite === q }]"
                style="display: flex; align-items: center; justify-content: flex-start; text-align: left; padding: 1.1rem 1.2rem; min-width: 180px; max-width: 300px; font-size: 1.08rem; font-family: var(--font-family-text); cursor: pointer; box-sizing: border-box; transition: border 0.18s, outline 0.18s; border-radius: 8px;"
                @click="quantite = q"
              >
                {{ q }} tartelette(s)
                <button
                  v-if="quantite === q"
                  class="garniture-deselect-btn"
                  @click.stop="quantite = 1"
                  aria-label="Désélectionner la quantité"
                  style="position: absolute; top: -12px; right: -12px; background: #e0e0e0; border: none; cursor: pointer; padding: 0; z-index: 3; box-shadow: 0 1px 4px rgba(0,0,0,0.04); width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L9 9M9 3L3 9" stroke="#222" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div style="height: 312px; flex: 1; display: flex; align-items: stretch;">
              <img v-if="selectedFond" :src="getGarnitureImage(selectedFond, selectedGarniture1)" :alt="selectedGarniture1?.nom || selectedFond.nom" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px; display: block;" />
              <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #b0b0b0; font-size: 1rem; border: 1px dashed #e0e0e0; border-radius: 8px; background: #fafafa;">Aucun fond sélectionné</div>
            </div>
          </div>
          <div class="composer-footer">
            <div class="composer-progress-bar">
              <template v-for="step in 5">
                <span
                  class="progress-dot"
                  :class="{
                    done: currentStep > step,
                    active: currentStep === step
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
              <button class="composer-btn-secondary" @click="currentStep = 4">
                <svg style="margin-right:8px;vertical-align:middle;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 5l-4 4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Précédent
              </button>
              <button class="composer-btn" :disabled="!quantite" @click="ajouterAuPanier">
                Valider
                <svg style="margin-left:8px;vertical-align:middle;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 5l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import fondNature from '@/assets/images/fondNature.jpg'
import fondCacao from '@/assets/images/fondCacao.jpg'
import fondNoisette from '@/assets/images/fondNoisette.jpg'
// Ajout des images de combinaison déjà disponibles
import fondNatureCremeDamande from '@/assets/images/fondNatureCrèmeDamande.jpg'
import fondNatureCajou from '@/assets/images/fondNatureCajou.jpg'

const fonds = [
  { id: 1, nom: 'Pâte sucrée amande', image: fondNature },
  { id: 2, nom: 'Pâte sucrée cacao', image: fondCacao },
  { id: 3, nom: 'Pâte sucrée noisette', image: fondNoisette },
]
const garnitures1 = [
  { id: 1, nom: 'Crème d’amande', image: '' },
  { id: 2, nom: 'Caramel cajou', image: '' },
  { id: 3, nom: 'Crème d’amande', image: '' },
  { id: 4, nom: 'Crème citron', image: '' },
  { id: 5, nom: 'Crème pralinée', image: '' },
]
const garnitures2 = [
  { id: 1, nom: 'Fraises' },
  { id: 2, nom: 'Framboises' },
  { id: 3, nom: 'Myrtilles' },
  { id: 4, nom: 'Crème chantilly' },
  { id: 5, nom: 'Coulis de fruits' },
]
const finitions = [
  { id: 1, nom: 'Coulis & fruits secs' },
  { id: 2, nom: 'Fruits frais' },
  { id: 3, nom: 'Rosace de crème' },
]

const selectedFond = ref(null as null | { id: number, nom: string })
const selectedGarniture1 = ref(null as null | { id: number, nom: string })
const selectedGarniture2 = ref(null as null | { id: number, nom: string })
const selectedFinition = ref(null as null | { id: number, nom: string })
const quantite = ref(1)
const hoveredGarniture1 = ref<number|null>(null)

const peutValider = computed(() => {
  return !!selectedFond.value && !!selectedGarniture1.value && !!selectedGarniture2.value && !!selectedFinition.value && quantite.value > 0
})

function selectFond(fond: { id: number, nom: string }) {
  selectedFond.value = fond
  if (currentStep.value < 2) currentStep.value = 2
}
function selectGarniture1(garniture: { id: number, nom: string }) {
  selectedGarniture1.value = garniture
}
function selectGarniture2(garniture: { id: number, nom: string }) {
  selectedGarniture2.value = garniture
}
function selectFinition(finition: { id: number, nom: string }) {
  selectedFinition.value = finition
}

function recommencer() {
  selectedFond.value = null
  selectedGarniture1.value = null
  selectedGarniture2.value = null
  selectedFinition.value = null
  quantite.value = 1
}
function ajouterAuPanier() {
  // À implémenter : ajout au panier global
  alert('Votre tartelette a été ajoutée au panier !')
  recommencer()
}

function deselectFond() {
  selectedFond.value = null
  selectedGarniture1.value = null
  selectedGarniture2.value = null
  selectedFinition.value = null
  // quantite.value = 1 // optionnel, à activer si tu veux tout réinitialiser
}

function deselectGarniture1() {
  selectedGarniture1.value = null
}

function getGarnitureImage(fond, garniture) {
  if (!fond) return '';
  if (!garniture) return fond.image;
  if (fond.image === fondNature && garniture.nom === 'Crème d’amande') {
    return fondNatureCremeDamande;
  }
  if (fond.image === fondNature && garniture.nom === 'Caramel cajou') {
    return fondNatureCajou;
  }
  return fond.image;
}

// Clic à l'extérieur pour désélectionner
function handleClickOutsideFond(event: MouseEvent) {
  const fondOptions = document.querySelector('.fond-options')
  if (fondOptions && !fondOptions.contains(event.target as Node)) {
    deselectFond()
  }
}
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutsideFond)
  // Initialiser selectedGarniture2 avec selectedGarniture1 si non défini
  if (!selectedGarniture2.value && selectedGarniture1.value) {
    selectedGarniture2.value = selectedGarniture1.value;
  }
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutsideFond)
})

function handleClickOutsideGarniture1(event: MouseEvent) {
  const ctaCol = document.querySelector('.garniture-cta-col');
  if (ctaCol && !ctaCol.contains(event.target as Node)) {
    selectedGarniture1.value = null;
  }
}
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutsideGarniture1)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutsideGarniture1)
})

const currentStep = ref(1)

const stepDone = computed(() => {
  if (!selectedFond.value) return 0;
  if (!selectedGarniture1.value) return 1;
  if (!selectedGarniture2.value) return 2;
  if (!selectedFinition.value) return 3;
  if (!quantite.value) return 4;
  return 5;
});

function goToNextStep() {
  if (currentStep.value < 5) {
    currentStep.value++
    // Scroll en haut de la carte à chaque changement d'étape
    setTimeout(() => {
      const card = document.querySelector('.composer-card');
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
}
function goToPrevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}
</script>

<style scoped>
/* Import supprimé : les variables CSS sont déjà globales via :root */

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: var(--secondary-color);
}
.content-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.composer-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.composer-card {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(180, 138, 120, 0.07);
  padding: 2.5rem 2rem;
  max-width: 800px;
  width: 100%;
  margin: 2rem 0;
  /* 4. Dans chaque étape, placer la barre de progression juste avant composer-nav-btns, et supprimer toute barre de progression en haut */
  /* Exemple pour une étape : */
  /* ... contenu principal ... */
  /* <div class="composer-stepper"> */
  /*   ... */
  /* </div> */
  /* <div class="composer-nav-btns"> */
  /*   ... */
  /* </div> */
  /* 1. Supprimer la barre de progression du haut (enlever le bloc composer-stepper global) */
  /* 2. Dans chaque étape, déplacer la barre de progression tout en bas, juste avant composer-nav-btns */
  /* 3. Harmoniser le style des boutons CTA */
  padding-bottom: 8rem;
}
.composer-title {
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
.composer-intro-left {
  text-align: left;
}
.composer-intro-sub {
  display: block;
  color: var(--text-color);
  font-weight: normal;
  margin-top: 0.7rem;
  font-size: 1.08rem;
  letter-spacing: 0.5px;
}
.composer-price {
  color: #90aeb0;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 0.5rem;
}
.composer-price-desc {
  color: #b0c7c8;
  font-size: 1.1rem;
  font-weight: 400;
}
.composer-price-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  background: #90aeb0;
  border-radius: 1.2rem;
  padding: 0.5rem 1.5rem;
  margin-bottom: 1.2rem;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 8px rgba(144, 174, 176, 0.08);
}
.composer-price-simple {
  margin: 0 0 1.2rem 0;
  text-align: left;
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
.composer-section {
  margin-bottom: 2.2rem;
}
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
  transition: transform 0.16s, border 0.16s;
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
.fond-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 8px;
  background: rgba(60,60,60,0.45);
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
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
  letter-spacing: 0.5px;
  text-align: center;
  white-space: pre-line;
  pointer-events: none;
}
.fond-label {
  margin-top: 0.15rem;
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--text-color);
  text-align: center;
}
.fond-deselect-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e0e0e0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
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
  transition: background 0.18s, color 0.18s, border 0.18s, outline 0.18s;
}
.garniture-cta-btn.selected {
  outline: 3px solid var(--accent-color);
  outline-offset: 2px;
  background: rgba(60,60,60,0.45);
  color: #fff;
  font-weight: bold;
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
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
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
.composer-btn {
  background: var(--accent-color);
  color: #fff;
  padding: 0.8rem 1.5rem;
  border-radius: 0.8rem;
  border: none;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(144, 174, 176, 0.15);
  display: flex;
  align-items: center;
}
.composer-btn:hover:not(:disabled) {
  background: var(--accent-hover-color);
  border: 2px solid var(--accent-color);
  box-sizing: border-box;
}
.composer-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  color: #888;
}
.composer-btn-secondary {
  background: #fff;
  color: var(--accent-color);
  border: 2px solid var(--accent-color);
  padding: 0.8rem 1.5rem;
  border-radius: 0.8rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 2px 8px rgba(144, 174, 176, 0.10);
  display: flex;
  align-items: center;
}
.composer-btn-secondary:hover:not(:disabled) {
  background: #f0f0f0;
  color: #ff6f61;
}
.composer-stepper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
}
.stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
  position: relative;
}
.stepper-index {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #90aeb0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
  border: 2px solid #90aeb0;
  transition: background 0.2s, color 0.2s;
}
.stepper-step.active .stepper-index {
  background: #90aeb0;
  color: #fff;
}
.stepper-step.done .stepper-index {
  background: #ff6f61;
  color: #fff;
  border-color: #ff6f61;
}
.stepper-label {
  font-size: 0.95rem;
  color: #90aeb0;
  font-weight: 500;
}
.stepper-step.active .stepper-label {
  color: #ff6f61;
  font-weight: bold;
}
.stepper-summary {
  font-size: 0.85rem;
  color: #222;
  margin-top: 0.1rem;
  text-align: center;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.composer-nav-btns {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-top: 1.2rem;
  margin-bottom: 2.5rem;
}
/* 1. Styles CTA uniformes et plus petits */
.composer-btn, .composer-btn-secondary {
  min-width: 160px;
  max-width: 160px;
  height: 40px;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(144, 174, 176, 0.10);
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
.composer-btn:disabled, .composer-btn-secondary:disabled {
  background: #ccc;
  cursor: not-allowed;
  color: #888;
}
/* Supprimer tous les styles de hover et transition sur les boutons */
/* 2. Déplacer la barre de progression sous le contenu principal de chaque étape */
/* 1. Regrouper la barre de progression et les CTA dans un footer sticky */
.composer-footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 -2px 12px rgba(144, 174, 176, 0.10);
  z-index: 10;
  padding-top: 1.2rem;
  padding-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.composer-card {
  padding-bottom: 8rem;
}
.composer-progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
  gap: 0.5rem;
  min-width: 340px;
}
.progress-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #e0e0e0;
  border: 2.5px solid #e0e0e0;
  box-sizing: border-box;
  transition: background 0.2s, border 0.2s;
  position: relative;
  z-index: 1;
}
.progress-dot.active {
  background: #fff;
  border: 2.5px solid #ff6f61;
}
.progress-dot.done {
  background: #ff6f61;
  border: 2.5px solid #ff6f61;
}
.progress-bar {
  width: 64px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin: 0 8px;
  transition: background 0.2s;
  z-index: 0;
}
.progress-bar.done {
  background: #ff6f61;
}
</style>

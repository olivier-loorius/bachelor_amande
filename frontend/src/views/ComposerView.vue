<template>
  <div class="page-container">
    <main class="content-container composer-content">
      <div class="composer-card">
        <h1 class="composer-title">Composer sa tartelette</h1>
        <p class="composer-intro">Composez votre tartelette unique pour <span class="composer-price">6 €</span> ! Laissez libre cours à votre imagination en choisissant chaque étape de votre dessert.</p>

        <!-- Étape 1 : Fond -->
        <section class="composer-section">
          <h2 class="composer-step-title">1. Choisissez votre fond de tartelette</h2>
          <p class="composer-step-desc">Sélectionnez la base de votre tartelette parmi nos fonds maison.</p>
          <div class="composer-options">
            <div v-for="fond in fonds" :key="fond.id"
              @click="selectFond(fond)"
              :class="['composer-option-card', selectedFond?.id === fond.id ? 'selected' : '']">
              <span class="option-label">{{ fond.nom }}</span>
            </div>
          </div>
        </section>

        <!-- Étape 2 : Première garniture -->
        <section class="composer-section">
          <h2 class="composer-step-title">2. Première garniture</h2>
          <p class="composer-step-desc">Choisissez une première garniture crémeuse pour sublimer votre fond.</p>
          <div class="composer-options">
            <div v-for="garniture in garnitures1" :key="garniture.id"
              @click="selectGarniture1(garniture)"
              :class="['composer-option-card', selectedGarniture1?.id === garniture.id ? 'selected' : '']">
              <span class="option-label">{{ garniture.nom }}</span>
            </div>
          </div>
        </section>

        <!-- Étape 3 : Seconde garniture -->
        <section class="composer-section">
          <h2 class="composer-step-title">3. Seconde garniture</h2>
          <p class="composer-step-desc">Ajoutez une touche fruitée ou crémeuse supplémentaire.</p>
          <div class="composer-options">
            <div v-for="garniture in garnitures2" :key="garniture.id"
              @click="selectGarniture2(garniture)"
              :class="['composer-option-card', selectedGarniture2?.id === garniture.id ? 'selected' : '']">
              <span class="option-label">{{ garniture.nom }}</span>
            </div>
          </div>
        </section>

        <!-- Étape 4 : Finition -->
        <section class="composer-section">
          <h2 class="composer-step-title">4. Finition</h2>
          <p class="composer-step-desc">Finalisez votre création avec une finition gourmande.</p>
          <div class="composer-options">
            <div v-for="finition in finitions" :key="finition.id"
              @click="selectFinition(finition)"
              :class="['composer-option-card', selectedFinition?.id === finition.id ? 'selected' : '']">
              <span class="option-label">{{ finition.nom }}</span>
            </div>
          </div>
        </section>

        <!-- Étape 5 : Quantité -->
        <section class="composer-section">
          <h2 class="composer-step-title">5. Quantité</h2>
          <p class="composer-step-desc">Indiquez la quantité souhaitée pour votre création.</p>
          <div class="composer-quantity">
            <select v-model="quantite" class="composer-select">
              <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
        </section>

        <!-- Récapitulatif -->
        <section class="composer-section composer-recap">
          <h2 class="composer-step-title text-center">Récapitulatif de votre tartelette</h2>
          <ul class="composer-recap-list">
            <li><strong>Fond :</strong> {{ selectedFond?.nom || 'Non choisi' }}</li>
            <li><strong>1ère garniture :</strong> {{ selectedGarniture1?.nom || 'Non choisi' }}</li>
            <li><strong>2ème garniture :</strong> {{ selectedGarniture2?.nom || 'Non choisi' }}</li>
            <li><strong>Finition :</strong> {{ selectedFinition?.nom || 'Non choisi' }}</li>
            <li><strong>Quantité :</strong> {{ quantite }}</li>
            <li><strong>Prix total :</strong> {{ (quantite * 6).toFixed(2) }} €</li>
          </ul>
        </section>

        <!-- Actions -->
        <div class="composer-actions">
          <button class="composer-btn" :disabled="!peutValider" @click="ajouterAuPanier">Ajouter au panier</button>
          <button class="composer-btn-secondary" @click="recommencer">Recommencer</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const fonds = [
  { id: 1, nom: 'Sablé' },
  { id: 2, nom: 'Pâte sucrée' },
  { id: 3, nom: 'Pâte brisée' },
]
const garnitures1 = [
  { id: 1, nom: 'Crème pâtissière' },
  { id: 2, nom: 'Ganache chocolat' },
  { id: 3, nom: 'Crème d’amande' },
  { id: 4, nom: 'Crème citron' },
  { id: 5, nom: 'Crème pralinée' },
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

const peutValider = computed(() => {
  return !!selectedFond.value && !!selectedGarniture1.value && !!selectedGarniture2.value && !!selectedFinition.value && quantite.value > 0
})

function selectFond(fond: { id: number, nom: string }) {
  selectedFond.value = fond
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
  max-width: 600px;
  width: 100%;
  margin: 2rem 0;
}
.composer-title {
  font-family: var(--font-family-title);
  font-size: 2.3rem;
  color: #b48a78;
  text-align: center;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}
.composer-intro {
  font-family: var(--font-family-text);
  font-size: 1.1rem;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 2rem;
}
.composer-price {
  color: #b48a78;
  font-weight: bold;
}
.composer-section {
  margin-bottom: 2.2rem;
}
.composer-step-title {
  font-family: var(--font-family-title);
  font-size: 1.3rem;
  color: #b48a78;
  margin-bottom: 0.2rem;
  text-align: left;
}
.composer-step-desc {
  font-family: var(--font-family-text);
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 1.1rem;
}
.composer-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.composer-option-card {
  background: var(--secondary-color);
  border: 2px solid #e0e0e0;
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  font-family: var(--font-family-text);
  font-size: 1.05rem;
  color: var(--text-color);
  cursor: pointer;
  min-width: 120px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(180, 138, 120, 0.04);
  transition: border 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s;
  position: relative;
  outline: none;
}
.composer-option-card.selected {
  border: 2.5px solid var(--accent-color);
  background: #fff6f2;
  color: var(--accent-color);
  box-shadow: 0 2px 8px rgba(255, 111, 97, 0.08);
}
.composer-option-card:hover {
  border: 2.5px solid var(--accent-color-light);
  color: var(--accent-color);
}
.option-label {
  font-weight: 500;
  font-family: var(--font-family-text);
}
.composer-quantity {
  display: flex;
  justify-content: center;
  align-items: center;
}
.composer-select {
  border: 2px solid #e0e0e0;
  border-radius: 0.7rem;
  padding: 0.5rem 1.2rem;
  font-size: 1.1rem;
  font-family: var(--font-family-text);
  color: var(--text-color);
  background: var(--secondary-color);
  outline: none;
  transition: border 0.2s;
}
.composer-select:focus {
  border: 2px solid var(--accent-color);
}
.composer-recap-list {
  font-family: var(--font-family-text);
  color: var(--text-color);
  font-size: 1.05rem;
  margin-bottom: 0.5rem;
  padding-left: 1.2rem;
}
.composer-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-top: 1.5rem;
}
@media (min-width: 640px) {
  .composer-actions {
    flex-direction: row;
    justify-content: center;
  }
}
.composer-btn {
  background: var(--accent-color);
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.8rem 2.2rem;
  font-size: 1.1rem;
  font-family: var(--font-family-text);
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.composer-btn:disabled {
  background: #e0e0e0;
  color: #fff;
  cursor: not-allowed;
}
.composer-btn:hover:enabled {
  background: var(--accent-color-light);
  transform: scale(1.04);
}
.composer-btn-secondary {
  background: #fff6f2;
  color: var(--accent-color);
  border: 2px solid var(--accent-color);
  border-radius: 2rem;
  padding: 0.8rem 2.2rem;
  font-size: 1.1rem;
  font-family: var(--font-family-text);
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, transform 0.2s;
}
.composer-btn-secondary:hover {
  background: var(--accent-color);
  color: #fff;
  transform: scale(1.04);
}
@media (max-width: 640px) {
  .composer-card {
    padding: 1.2rem 0.5rem;
    margin: 1rem 0;
  }
  .composer-title {
    font-size: 1.5rem;
  }
  .composer-step-title {
    font-size: 1.1rem;
  }
  .composer-section {
    margin-bottom: 1.2rem;
  }
}
</style>

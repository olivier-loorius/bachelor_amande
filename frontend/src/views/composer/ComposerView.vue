<!-- src/views/composer/ComposerView.vue -->
<template>
  <div class="page-container">
    <main class="content-container composer-content">
      <div class="composer-card card">
        <div class="page">
                      <div class="content" :class="{ 'with-right': step > 1 && step < 5 }">
                                          <div class="left">
                <ComposerHeader />

                <StepFond
                  v-if="step===1"
                  :fonds="fonds"
                  :selected-id="selections.fond?.id"
                  @select="({item,index}) => selectFond(item, index)"
                />

                <StepGarniture
                  v-else-if="step===2"
                  title="2) Première couche de douceur"
                  :items="g1"
                  :selected-id="selections.g1?.id"
                  :preview-url="previewUrl"
                  @select="selectG1"
                />

                <StepGarniture
                  v-else-if="step===3"
                  title="3) Seconde couche de douceur"
                  :items="g2"
                  :selected-id="selections.g2?.id"
                  :preview-url="previewUrl"
                  @select="selectG2"
                />

                <StepGarniture
                  v-else-if="step===4"
                  title="4) La touche finale"
                  :items="g3"
                  :selected-id="selections.g3?.id"
                  :preview-url="previewUrl"
                  @select="selectG3"
                />

                <StepSummary
                  v-else-if="step===5"
                  :fond="selections.fond"
                  :g1="selections.g1"
                  :g2="selections.g2"
                  :g3="selections.g3"
                  :quantity="quantity"
                  :unitPrice="unitPrice"
                  :preview-src="previewUrl"
                  @setQty="q => quantity = q"
                  @prev="prev"
                  @add="onAddToCart"
                  @restart="restart"
                />

                <WizardNav
                  v-if="step<=4"
                  :can-prev="canPrev"
                  :can-next="canNext"
                  @prev="prev"
                  @next="next"
                />
              </div>

              <!-- Colonne de droite avec prévisualisation desktop (étapes 2-4) -->
              <div class="right" v-if="step > 1 && step < 5">
                <div class="right-bottom">
                  <PreviewPane
                    :src="previewUrl"
                  />
                </div>
              </div>
                    </div>
                    </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePanierStore } from '@/stores/panier'
import { useProductStore } from '@/stores/useProductStore'

import ComposerHeader from './components/ComposerHeader.vue'
import StepFond from './components/StepFond.vue'
import StepGarniture from './components/StepGarniture.vue'
import StepSummary from './components/StepSummary.vue'
import WizardNav from './components/WizardNav.vue'
import PreviewPane from './components/PreviewPane.vue'
import { useComposer } from './composables/useComposer'
import type { Item } from './types'

// Stores
const productStore = useProductStore()
const auth = useAuthStore()
const panier = usePanierStore()

// Charger les données au montage
onMounted(async () => {
  try {
    await productStore.loadProductConfig()
  } catch (error) {
    console.error('❌ Erreur lors du chargement:', error)
  }
})

/** 1) Normalisation stable : 3/4/4/4 items, labels sûrs, IDs uniques, image fallback = 1ère non vide */
const firstNonEmpty = (arr?: any[]) => (Array.isArray(arr) ? arr.find(Boolean) : null) || null

const normalizeSlice = (arr: any[], limit: number, prefix: string): Item[] => {
  const src = Array.isArray(arr) ? arr : []
  const out: Item[] = []
  
  for (let i = 0; i < src.length && out.length < limit; i++) {
    const p = src[i] ?? {}
    const safeName = (p.nom && String(p.nom).trim()) || `${prefix} ${out.length + 1}`
    const safeImage = p.image || firstNonEmpty(p.images)
    
    out.push({
      // clé/ID 100% unique : on suffixe par index (évite collisions de l'admin)
      id: `${prefix}-${p.id ?? 'nil'}-${i}`,
      nom: safeName,
      image: safeImage,
      images: Array.isArray(p.images) ? p.images : [],
    })
  }
  
  return out
}

// ⚠️ PAS de dédup par nom ici → on garde bien 4 items même si 2 noms identiques dans le dashboard
const fonds = computed<Item[]>(() => normalizeSlice(productStore.fonds, 3, 'Fond'))
const g1 = computed<Item[]>(() => normalizeSlice(productStore.premiereCoucheDouceur, 4, 'Garniture1'))
const g2 = computed<Item[]>(() => normalizeSlice(productStore.secondeCoucheDouceur, 4, 'Garniture2'))
const g3 = computed<Item[]>(() => normalizeSlice(productStore.toucheFinale, 4, 'Garniture3'))

/** 2) Cerveau (navigation + sélections) */
const {
  step, quantity, selections,
  canNext, canPrev, next, prev,
  selectFond, selectG1, selectG2, selectG3,
  unitPrice, totalPrice, description,
  restart,
} = useComposer()

/** 3) Preview local robuste par variante de fond */
const fondIndex = computed(() => {
  const id = selections.value.fond?.id
  return id ? fonds.value.findIndex(f => f.id === id) : -1
})

const imageFor = (item: Item | null) => {
  const fallbackFond = selections.value.fond?.image || ''
  if (!item) return fallbackFond
  const imgs = Array.isArray(item.images) ? item.images : []
  if (fondIndex.value >= 0 && imgs[fondIndex.value]) return imgs[fondIndex.value] as string
  return item.image || firstNonEmpty(imgs) || fallbackFond
}

const previewUrl = computed(() => {
  if (step.value === 1) return selections.value.fond?.image || ''
  if (step.value === 2) return imageFor(selections.value.g1)
  if (step.value === 3) return imageFor(selections.value.g2)
  if (step.value === 4) return imageFor(selections.value.g3)
  // recap
  return imageFor(selections.value.g3 || selections.value.g2 || selections.value.g1)
})

// Panier / ajout
async function onAddToCart(){
  if (!auth.isLoggedIn) {
    // branche ta modale de connexion ici si tu en as une
    alert('Connectez-vous pour ajouter au panier.')
    return
  }
  const produit = {
    id: Date.now(),
    nom: 'Tartelette personnalisée',
    image: previewUrl || selections.value.fond?.image || '',
    prix: unitPrice,
    quantite: quantity,
    base: selections.value.fond?.nom || '',
    premiereDouceur: selections.value.g1?.nom || '',
    secondeDouceur: selections.value.g2?.nom || '',
    finition: selections.value.g3?.nom || '',
    user_id: auth.user?.id,
    description: description,
    total: totalPrice,
  }
  const ok = await panier.ajouterAuPanier(produit)
  if (ok) {
    // affiche ta modale AddToCartModal si besoin
    alert('Ajouté au panier 🎉')
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: var(--background-color, #f5f5f5);
  padding: 2rem 0;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.composer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.composer-card {
  background: var(--white);
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(180, 138, 120, 0.07);
  padding: 2.5rem 2rem;
  max-width: 1000px;
  width: 100%;
  margin: 2rem 0;
}

.page{ 
  padding: 1.5rem 0; 
}

.content{
  display: grid;
  grid-template-columns: 1fr; /* 1 colonne par défaut (étape 1) */
  gap: 2rem;
  align-items: start;
}

/* Quand la colonne de droite existe (étapes 2–4) */
.content.with-right{
  grid-template-columns: 450px 1fr;
}

@media (max-width: 768px) {
  .composer-card {
    padding: 0.3rem;
    margin: 0.3rem 0;
  }

  /* ⚠ On BASCULE en FLEX pour que `order` fonctionne */
  .content,
  .content.with-right {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .right {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: 450px;
  }
  
  .right-bottom {
    display: none;         /* cache seulement la preview de droite en mobile */
  }
  
  /* L'étape 5 reste en colonne normale */
  .content:not(.with-right) {
    display: block;
  }
  
  /* StepSummary en mobile ne doit pas être affecté par le Flexbox */
  .left section {
    display: block;
  }
}

.right {
  position: sticky;
  top: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 450px;
}

.right-top {
  flex: 1;
}

.right-bottom {
  margin-top: auto;
}
</style>

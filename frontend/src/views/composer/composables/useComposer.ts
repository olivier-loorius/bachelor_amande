// src/views/composer/composables/useComposer.ts
import { ref, computed } from 'vue'
import type { Item, Selection, Step } from '../types'

export function useComposer() {
  // --- état principal (source de vérité) ---
  const step = ref<Step>(1)
  const quantity = ref(1)
  const selections = ref<Selection>({ fond: null, g1: null, g2: null, g3: null })

  // --- navigation ---
  const canNext = computed(() => {
    if (step.value === 1) return !!selections.value.fond
    if (step.value === 2) return !!selections.value.g1
    if (step.value === 3) return !!selections.value.g2
    if (step.value === 4) return !!selections.value.g3
    return true
  })
  const canPrev = computed(() => step.value > 1)

  function next() { if (step.value < 5 && canNext.value) step.value++ }
  function prev() { if (step.value > 1) step.value-- }
  function goTo(s: Step) { step.value = s }

  // --- sélections ---
  function selectFond(item: Item, variantIndex: number) {
    selections.value.fond = { ...item, variantIndex }
    if (step.value < 2) step.value = 2
  }
  const selectG1 = (item: Item) => (selections.value.g1 = item)
  const selectG2 = (item: Item) => (selections.value.g2 = item)
  const selectG3 = (item: Item) => (selections.value.g3 = item)

  // --- résolveur d'image robuste ---
  function resolveImage(item: Item | null): string {
    const fond = selections.value.fond
    if (!fond) return item?.image || ''
    // variantes dépendantes du fond
    if (item?.images?.length) {
      const i = fond.variantIndex
      const byIndex = item.images[i]
      if (byIndex) return String(byIndex)
      const first = item.images.find(Boolean)
      if (first) return String(first)
    }
    // image générique de la garniture ou fallback fond
    return (item?.image as string) || (fond.image as string) || ''
  }

  // --- URL de preview selon l'étape (cascade simple et sûre) ---
  const previewUrl = computed(() => {
    const fondImage = selections.value.fond?.image || ''
    if (step.value === 1) return fondImage
    if (step.value === 2) return selections.value.g1?.image || fondImage
    if (step.value === 3) return selections.value.g2?.image || selections.value.g1?.image || fondImage
    if (step.value === 4) return selections.value.g3?.image || selections.value.g2?.image || selections.value.g1?.image || fondImage
    // recap (step 5)
    return selections.value.g3?.image || selections.value.g2?.image || selections.value.g1?.image || fondImage
  })

  // --- résumé / pricing ---
  const unitPrice = 6
  const description = computed(() =>
    [selections.value.fond?.nom, selections.value.g1?.nom, selections.value.g2?.nom, selections.value.g3?.nom]
      .filter(Boolean)
      .join(' • ')
  )
  const totalPrice = computed(() => unitPrice * quantity.value)

  function resetAll() {
    selections.value = { fond: null, g1: null, g2: null, g3: null }
    quantity.value = 1
    step.value = 1
  }

  return {
    // state
    step, quantity, selections,
    // nav
    canNext, canPrev, next, prev, goTo,
    // select
    selectFond, selectG1, selectG2, selectG3,
    // preview
    previewUrl, resolveImage,
    // pricing/summary
    unitPrice, totalPrice, description,
    // misc
    resetAll,
    restart: resetAll,
  }
}


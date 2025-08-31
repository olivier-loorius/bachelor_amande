import { ref, computed } from 'vue'
import type { Fond, Garniture, Selection } from './types'

export function useComposer() {
  const currentStep = ref<1|2|3|4|5>(1)
  const selection = ref<Selection>({ fond: null, g1: null, g2: null, g3: null })
  const quantite = ref(1)

  const setFond = (f: Fond) => (selection.value.fond = f)
  const setG1 = (g: Garniture) => (selection.value.g1 = g)
  const setG2 = (g: Garniture) => (selection.value.g2 = g)
  const setG3 = (g: Garniture) => (selection.value.g3 = g)

  const deselectFond = () => { selection.value = { fond: null, g1: null, g2: null, g3: null } }
  const deselectG1 = () => (selection.value.g1 = null)
  const deselectG2 = () => (selection.value.g2 = null)
  const deselectG3 = () => (selection.value.g3 = null)

  const canNext = computed(() => {
    if (currentStep.value === 1) return !!selection.value.fond
    if (currentStep.value === 2) return !!selection.value.g1
    if (currentStep.value === 3) return !!selection.value.g2
    if (currentStep.value === 4) return !!selection.value.g3
    return true
  })

  const next = () => { if (currentStep.value < 5 && canNext.value) currentStep.value++ }
  const prev = () => { if (currentStep.value > 1) currentStep.value-- }
  const reset = () => { selection.value = { fond: null, g1: null, g2: null, g3: null }; quantite.value = 1; currentStep.value = 1 }

  // --- IMAGES ----------------------------------------------------------------
  function getFondIndex(fonds: Fond[], fond: Fond | null) {
    if (!fond) return -1
    return fonds.findIndex(f => f.id === fond.id)
  }
  
  function getVariantImage(fond: Fond | null, item: Garniture | Fond | null, fonds: Fond[]): string {
    if (!fond && !item) return ''
    // Garniture avec variantes ?
    if (item && 'images' in item && item.images?.length) {
      const idx = getFondIndex(fonds, fond)
      if (idx >= 0 && item.images[idx]) return item.images[idx] as string
      const first = item.images.find(Boolean)
      if (first) return first as string
    }
    // Fallback image simple
    // @ts-ignore
    return (item?.image as string) || (fond?.image as string) || ''
  }

  function buildPreviews(fonds: Fond[]) {
    const { fond, g1, g2, g3 } = selection.value
    const step2 = g1 ? getVariantImage(fond, g1, fonds) : (fond?.image || '')
    const step3 = g2 ? getVariantImage(fond, g2, fonds) : step2
    const step4 = g3 ? getVariantImage(fond, g3, fonds) : step3
    const final = g3 ? step4 : (g2 ? step3 : (g1 ? step2 : (fond?.image || '')))
    return { step2, step3, step4, final }
  }

  return {
    // state
    currentStep, selection, quantite,
    // actions
    setFond, setG1, setG2, setG3,
    deselectFond, deselectG1, deselectG2, deselectG3,
    next, prev, reset,
    // guards
    canNext,
    // images
    getVariantImage, buildPreviews,
  }
}

import { ref, computed, readonly } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePanierStore } from '@/stores/panier'
import { useProductStore } from '@/stores/useProductStore'
import { productConfigService } from '@/services/productConfigService'
import { compositionsService } from '@/services/supabaseService'
import type { ComposerProduct, ComposerSelection, ComposerState, ComposerCRUD } from '../types/composer.types'

export function useComposer() {
  // Stores
  const authStore = useAuthStore()
  const panierStore = usePanierStore()
  const productStore = useProductStore()

  // État des sélections
  const selections = ref<ComposerSelection>({
    fond: null,
    garniture1: null,
    garniture2: null,
    garniture3: null,
    finition: null
  })

  // État de navigation
  const state = ref<ComposerState>({
    currentStep: 1,
    quantite: 1,
    animateQty: false
  })

  // État CRUD
  const crud = ref<ComposerCRUD>({
    compositionName: '',
    userCompositions: [],
    showCompositionsList: false,
    isLoading: false,
    saveMessage: '',
    saveMessageType: 'success'
  })

  // Computed properties
  const peutValider = computed(() => {
    return (
      !!selections.value.fond &&
      !!selections.value.garniture1 &&
      !!selections.value.garniture2 &&
      !!selections.value.garniture3 &&
      !!selections.value.finition &&
      state.value.quantite > 0
    )
  })

  // Fonctions de sélection
  function selectFond(fond: ComposerProduct) {
    selections.value.fond = fond
    if (state.value.currentStep < 2) state.value.currentStep = 2
  }

  function selectGarniture1(garniture: ComposerProduct) {
    selections.value.garniture1 = garniture
  }

  function selectGarniture2(garniture: ComposerProduct) {
    selections.value.garniture2 = garniture
  }

  function selectGarniture3(garniture: ComposerProduct) {
    selections.value.garniture3 = garniture
  }

  function selectFinition(finition: ComposerProduct) {
    selections.value.finition = finition
  }

  // Fonctions de navigation
  function goToNextStep() {
    if (state.value.currentStep < 6) {
      state.value.currentStep++
    }
  }

  function goToStep(step: number) {
    state.value.currentStep = step
  }

  // Fonctions utilitaires
  function triggerQtyAnim() {
    state.value.animateQty = false
    void state.value.quantite
    state.value.animateQty = true
  }

  function recommencer() {
    selections.value = {
      fond: null,
      garniture1: null,
      garniture2: null,
      garniture3: null,
      finition: null
    }
    state.value.quantite = 1
    state.value.currentStep = 1
  }

  // Fonction helper pour les images
  function getGarnitureImage(
    fond: ComposerProduct | null,
    garniture: ComposerProduct | null,
  ) {
    if (!fond) return ''
    
    if (garniture && garniture.image) {
      return garniture.image
    }
    
    return fond.image || ''
  }

  return {
    // État
    selections: readonly(selections),
    state: readonly(state),
    crud: readonly(crud),
    
    // Computed
    peutValider,
    
    // Fonctions
    selectFond,
    selectGarniture1,
    selectGarniture2,
    selectGarniture3,
    selectFinition,
    goToNextStep,
    goToStep,
    triggerQtyAnim,
    recommencer,
    getGarnitureImage,
    
    // Stores
    authStore,
    panierStore,
    productStore
  }
}


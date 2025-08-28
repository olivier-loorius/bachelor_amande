// Types pour le composant Composer
export interface ComposerProduct {
  id: number
  nom: string
  image?: string
  images?: string[]
}

export interface ComposerSelection {
  fond: ComposerProduct | null
  garniture1: ComposerProduct | null
  garniture2: ComposerProduct | null
  garniture3: ComposerProduct | null
  finition: ComposerProduct | null
}

export interface ComposerState {
  currentStep: number
  quantite: number
  animateQty: boolean
}

export interface ComposerCRUD {
  compositionName: string
  userCompositions: any[]
  showCompositionsList: boolean
  isLoading: boolean
  saveMessage: string
  saveMessageType: 'success' | 'error'
}


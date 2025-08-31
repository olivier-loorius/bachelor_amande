import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productConfigService } from '@/services/productConfigService'

// COPIE EXACTE des interfaces d'AdminView.vue
interface BaseProduct {
  nom: string
  saved?: boolean
}

interface FondProduct extends BaseProduct {
  image: string | null
}

interface MultiImageProduct extends BaseProduct {
  images: (string | null)[]
}

interface ProductConfig {
  config_type: string
  product_index: number
  nom: string
  images: string[]
}

export const useProductStore = defineStore('products', () => {
  // COPIE EXACTE de la configuration des types de produits
  const PRODUCT_TYPES = {
    fond: {
      array: 'fonds',
      configType: 'fonds',
      imageCount: 1,
      saveFunction: 'saveFond'
    },
    premiere: {
      array: 'premiereCoucheDouceur',
      configType: 'premiere_couche_douceur',
      imageCount: 3,
      saveFunction: 'saveDouceur'
    },
    seconde: {
      array: 'secondeCoucheDouceur',
      configType: 'seconde_couche_douceur',
      imageCount: 3,
      saveFunction: 'saveDouceur'
    },
    finition: {
      array: 'toucheFinale',
      configType: 'touche_finale',
      imageCount: 3,
      saveFunction: 'saveFinition'
    }
  } as const

  // COPIE EXACTE de la structure des états
  const productStates = ref({
    locked: {
      fonds: Array(3).fill(true),
      premiereCoucheDouceur: Array(4).fill(true),
      secondeCoucheDouceur: Array(4).fill(true),
      toucheFinale: Array(4).fill(true)
    },
    drag: {
      fonds: Array(3).fill(false),
      premiereCoucheDouceur: Array(4).fill(false),
      secondeCoucheDouceur: Array(4).fill(false),
      toucheFinale: Array(4).fill(false)
    }
  })

  // COPIE EXACTE de la structure des produits
  const products = ref({
    fonds: Array(3).fill(null).map(() => ({ nom: '', image: null as string | null })) as FondProduct[],
    premiereCoucheDouceur: Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] })) as MultiImageProduct[],
    secondeCoucheDouceur: Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] })) as MultiImageProduct[],
    toucheFinale: Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] })) as MultiImageProduct[]
  })

  // COPIE EXACTE des computed properties de compatibilité
  const fonds = computed({
    get: () => products.value.fonds,
    set: (value) => { products.value.fonds = value }
  })
  const premiereCoucheDouceur = computed({
    get: () => products.value.premiereCoucheDouceur,
    set: (value) => { products.value.premiereCoucheDouceur = value }
  })
  const secondeCoucheDouceur = computed({
    get: () => products.value.secondeCoucheDouceur,
    set: (value) => { products.value.secondeCoucheDouceur = value }
  })
  const toucheFinale = computed({
    get: () => products.value.toucheFinale,
    set: (value) => { products.value.toucheFinale = value }
  })

  const lockedProducts = computed({
    get: () => ({
      fonds: productStates.value.locked.fonds,
      premiereCoucheDouceur: productStates.value.locked.premiereCoucheDouceur,
      secondeCoucheDouceur: productStates.value.locked.secondeCoucheDouceur,
      toucheFinale: productStates.value.locked.toucheFinale
    }),
    set: (value) => {
      productStates.value.locked.fonds = value.fonds
      productStates.value.locked.premiereCoucheDouceur = value.premiereCoucheDouceur
      productStates.value.locked.secondeCoucheDouceur = value.secondeCoucheDouceur
      productStates.value.locked.toucheFinale = value.toucheFinale
    }
  })

  const dragStates = computed({
    get: () => ({
      fonds: productStates.value.drag.fonds,
      premiereCoucheDouceur: productStates.value.drag.premiereCoucheDouceur,
      secondeCoucheDouceur: productStates.value.drag.secondeCoucheDouceur,
      toucheFinale: productStates.value.drag.toucheFinale
    }),
    set: (value) => {
      productStates.value.drag.fonds = value.fonds
      productStates.value.drag.premiereCoucheDouceur = value.premiereCoucheDouceur
      productStates.value.drag.secondeCoucheDouceur = value.secondeCoucheDouceur
      productStates.value.drag.toucheFinale = value.toucheFinale
    }
  })

  // COPIE EXACTE des helpers génériques
  const getProductArray = (type: keyof typeof PRODUCT_TYPES) => {
    return products.value[PRODUCT_TYPES[type].array as keyof typeof products.value]
  }

  const getProductState = (type: keyof typeof PRODUCT_TYPES, stateType: 'locked' | 'drag') => {
    const arrayKey = PRODUCT_TYPES[type].array === 'premiereCoucheDouceur' ? 'premiereCoucheDouceur' :
                     PRODUCT_TYPES[type].array === 'secondeCoucheDouceur' ? 'secondeCoucheDouceur' :
                     PRODUCT_TYPES[type].array === 'toucheFinale' ? 'toucheFinale' : 'fonds'
    return productStates.value[stateType][arrayKey as keyof typeof productStates.value.locked]
  }

  const setProductState = (type: keyof typeof PRODUCT_TYPES, stateType: 'locked' | 'drag', index: number, value: boolean) => {
    const arrayKey = PRODUCT_TYPES[type].array === 'premiereCoucheDouceur' ? 'premiereCoucheDouceur' :
                     PRODUCT_TYPES[type].array === 'secondeCoucheDouceur' ? 'secondeCoucheDouceur' :
                     PRODUCT_TYPES[type].array === 'toucheFinale' ? 'toucheFinale' : 'fonds'
    productStates.value[stateType][arrayKey as keyof typeof productStates.value.locked][index] = value
  }

  // COPIE EXACTE des helpers pour le template
  const isProductLocked = (type: string, index: number) => {
    const productType = PRODUCT_TYPES[type as keyof typeof PRODUCT_TYPES]
    if (!productType) return true
    
    if (type === 'fond') {
      return productStates.value.locked.fonds[index]
    } else if (type === 'premiere') {
      return productStates.value.locked.premiereCoucheDouceur[index]
    } else if (type === 'seconde') {
      return productStates.value.locked.secondeCoucheDouceur[index]
    } else if (type === 'finition') {
      return productStates.value.locked.toucheFinale[index]
    }
    return true
  }

  const isDragState = (type: string, index: number) => {
    const productType = PRODUCT_TYPES[type as keyof typeof PRODUCT_TYPES]
    if (!productType) return false
    
    if (type === 'fond') {
      return productStates.value.drag.fonds[index]
    } else if (type === 'premiere') {
      return productStates.value.drag.premiereCoucheDouceur[index]
    } else if (type === 'seconde') {
      return productStates.value.drag.secondeCoucheDouceur[index]
    } else if (type === 'finition') {
      return productStates.value.drag.toucheFinale[index]
    }
    return false
  }

  // COPIE EXACTE des computed properties
  const getConfiguredCount = (type: keyof typeof PRODUCT_TYPES) => {
    const productArray = getProductArray(type)
    
    if (type === 'fond') {
      return (productArray as FondProduct[]).filter(f => f.nom && f.image).length
    } else {
      return (productArray as MultiImageProduct[]).filter(d => d.nom && d.images.every((img) => img)).length
    }
  }

  const fondsConfigured = computed(() => getConfiguredCount('fond'))
  const premiereCoucheConfigured = computed(() => getConfiguredCount('premiere'))
  const secondeCoucheConfigured = computed(() => getConfiguredCount('seconde'))
  const toucheFinaleConfigured = computed(() => getConfiguredCount('finition'))

  const totalProducts = computed(() => {
    return fondsConfigured.value + premiereCoucheConfigured.value + secondeCoucheConfigured.value + toucheFinaleConfigured.value
  })

  const totalPending = computed(() => {
    const totalPossible = 4 + 4 + 4 + 4
    return totalPossible - totalProducts.value
  })

  const getProgress = (type: keyof typeof PRODUCT_TYPES) => {
    const configured = getConfiguredCount(type)
    const total = type === 'fond' ? 3 : 4
    return (configured / total) * 100
  }

  const fondsProgress = computed(() => getProgress('fond'))
  const premiereCoucheProgress = computed(() => getProgress('premiere'))
  const secondeCoucheProgress = computed(() => getProgress('seconde'))
  const toucheFinaleProgress = computed(() => getProgress('finition'))

  const hasUnlockedProducts = computed(() => {
    return Object.values(productStates.value.locked).some(array => array.some(locked => !locked))
  })

  // COPIE EXACTE des fonctions génériques
  const updateDragState = (type: string, index: number, value: boolean) => {
    const productType = PRODUCT_TYPES[type as keyof typeof PRODUCT_TYPES]
    if (productType) {
      setProductState(type as keyof typeof PRODUCT_TYPES, 'drag', index, value)
    }
  }

  const toggleLock = async (type: string, index: number) => {
    const productType = PRODUCT_TYPES[type as keyof typeof PRODUCT_TYPES]
    if (!productType) return
    
    try {
      const currentState = getProductState(type as keyof typeof PRODUCT_TYPES, 'locked')[index]
      const newLockedState = !currentState
      setProductState(type as keyof typeof PRODUCT_TYPES, 'locked', index, newLockedState)
      
      await productConfigService.updateProductLock(productType.configType, index, newLockedState)
      console.log(`✅ État de verrouillage mis à jour pour ${productType.configType} index ${index}: ${newLockedState}`)
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du verrouillage:', error)
      const currentState = getProductState(type as keyof typeof PRODUCT_TYPES, 'locked')[index]
      setProductState(type as keyof typeof PRODUCT_TYPES, 'locked', index, !currentState)
    }
  }

  const saveProduct = async (type: keyof typeof PRODUCT_TYPES, index: number) => {
    try {
      const productType = PRODUCT_TYPES[type]
      const productArray = getProductArray(type)
      const product = productArray[index]
      
      let images: string[] = []
      if (type === 'fond') {
        images = (product as FondProduct).image ? [(product as FondProduct).image!] : []
      } else {
        images = (product as MultiImageProduct).images.filter((img): img is string => img !== null)
      }
      
      const config: ProductConfig = {
        config_type: productType.configType,
        product_index: index,
        nom: product.nom,
        images
      }
      
      await productConfigService.upsertProductConfig(config)
      
      if (type === 'fond') {
        console.log('✅ Fond sauvegardé dans Supabase')
      } else if (type === 'premiere' || type === 'seconde') {
        console.log(`✅ Douceur ${type} sauvegardée dans Supabase`)
      } else {
        console.log('✅ Finition sauvegardée dans Supabase')
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la sauvegarde du produit ${type}:`, error)
    }
  }

  const resetProduct = async (type: keyof typeof PRODUCT_TYPES, index: number) => {
    if (confirm('Remettre à zéro ce produit ?')) {
      const productType = PRODUCT_TYPES[type]
      const productArray = getProductArray(type)
      
      if (type === 'fond') {
        const currentImage = (productArray[index] as FondProduct).image
        if (currentImage) {
          await productConfigService.deleteImage(currentImage)
        }
        productArray[index] = { nom: '', image: null as string | null }
      } else {
        const currentImages = (productArray[index] as MultiImageProduct).images
        for (const image of currentImages) {
          if (image) {
            await productConfigService.deleteImage(image)
          }
        }
        productArray[index] = { nom: '', images: [null, null, null] }
      }
      
      await saveProduct(type, index)
    }
  }

  const removeImage = async (type: string, index: number, imageIndex?: number) => {
    const productType = PRODUCT_TYPES[type as keyof typeof PRODUCT_TYPES]
    if (!productType) return
    
    if (type === 'fond') {
      if (confirm('Supprimer cette image ?')) {
        const productArray = getProductArray('fond')
        const currentImage = (productArray[index] as FondProduct).image
        if (currentImage) {
          await productConfigService.deleteImage(currentImage)
        }
        (productArray[index] as FondProduct).image = null
        await saveProduct('fond', index)
      }
    } else {
      if (confirm(`Supprimer l'image ${imageIndex! + 1} ?`)) {
        const productArray = getProductArray(type as keyof typeof PRODUCT_TYPES)
        const currentImage = (productArray[index] as MultiImageProduct).images[imageIndex!]
        if (currentImage) {
          await productConfigService.deleteImage(currentImage)
        }
        (productArray[index] as MultiImageProduct).images[imageIndex!] = null
        
        await saveProduct(type as keyof typeof PRODUCT_TYPES, index)
      }
    }
  }

  const handleFiles = async (files: FileList, index: number, type: string) => {
    const fileArray = Array.from(files)
    const productType = PRODUCT_TYPES[type as keyof typeof PRODUCT_TYPES]
    if (!productType) return
    
    try {
      if (type === 'fond') {
        if (fileArray.length > 0) {
          const file = fileArray[0]
          const imageUrl = await productConfigService.uploadImage(file, 'fonds', index, 0)
          if (imageUrl) {
            const productArray = getProductArray('fond') as FondProduct[]
            productArray[index].image = imageUrl
            await saveProduct('fond', index)
          } else {
            alert('Erreur lors de l\'upload de l\'image')
          }
        }
      } else {
        const maxImages = Math.min(fileArray.length, 3)
        const productArray = getProductArray(type as keyof typeof PRODUCT_TYPES) as MultiImageProduct[]
        
        for (let i = 0; i < maxImages; i++) {
          const file = fileArray[i]
          const imageUrl = await productConfigService.uploadImage(file, productType.configType, index, i)
          if (imageUrl) {
            productArray[index].images[i] = imageUrl
          } else {
            alert(`Erreur lors de l'upload de l'image ${i + 1}`)
          }
        }
        
        await saveProduct(type as keyof typeof PRODUCT_TYPES, index)
      }
    } catch (error) {
      console.error('Erreur lors du traitement des fichiers:', error)
      alert('Erreur lors du traitement des fichiers')
    }
  }

  const saveProductConfig = async () => {
    // Cette fonction sera implémentée plus tard
    console.log('Sauvegarde de la configuration des produits')
  }

  const loadProductConfig = async () => {
    try {
      console.log('🔄 Chargement de la configuration depuis Supabase...')
      
      const configs = await productConfigService.getAllProducts()
      console.log('📦 Configuration chargée:', configs)
      
      // Réinitialiser les tableaux avec la bonne structure
      products.value.fonds = Array(3).fill(null).map(() => ({ nom: '', image: null }))
      products.value.premiereCoucheDouceur = Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] }))
      products.value.secondeCoucheDouceur = Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] }))
      products.value.toucheFinale = Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] }))
      
      // Réinitialiser les états
      productStates.value.locked.fonds = [true, true, true]
      productStates.value.locked.premiereCoucheDouceur = [true, true, true, true]
      productStates.value.locked.secondeCoucheDouceur = [true, true, true, true]
      productStates.value.locked.toucheFinale = [true, true, true, true]
      
      // Grouper les produits par étape
      const fonds = configs.filter(c => c.step === 'fonds')
      const premiere = configs.filter(c => c.step === 'premiereCoucheDouceur')
      const seconde = configs.filter(c => c.step === 'secondeCoucheDouceur')
      const finition = configs.filter(c => c.step === 'toucheFinale')
      
      console.log('📊 Produits groupés:', { 
        fonds: fonds.length, 
        premiere: premiere.length, 
        seconde: seconde.length, 
        finition: finition.length 
      })
      
      // Charger les fonds
      fonds.forEach((config, index) => {
        if (index < 3) {
          products.value.fonds[index] = {
            nom: config.nom || '',
            image: config.images && config.images.length > 0 ? config.images[0] : null
          }
          productStates.value.locked.fonds[index] = config.locked
        }
      })
      
      // Charger les garnitures
      premiere.forEach((config, index) => {
        if (index < 4) {
          products.value.premiereCoucheDouceur[index] = {
            nom: config.nom || '',
            images: config.images && config.images.length > 0 ? config.images : [null, null, null]
          }
          productStates.value.locked.premiereCoucheDouceur[index] = config.locked
        }
      })
      
      seconde.forEach((config, index) => {
        if (index < 4) {
          products.value.secondeCoucheDouceur[index] = {
            nom: config.nom || '',
            images: config.images && config.images.length > 0 ? config.images : [null, null, null]
          }
          productStates.value.locked.secondeCoucheDouceur[index] = config.locked
        }
      })
      
      finition.forEach((config, index) => {
        if (index < 4) {
          products.value.toucheFinale[index] = {
            nom: config.nom || '',
            images: config.images && config.images.length > 0 ? config.images : [null, null, null]
          }
          productStates.value.locked.toucheFinale[index] = config.locked
        }
      })
      
      console.log('✅ Configuration chargée avec succès:', {
        fonds: products.value.fonds.map(f => ({ nom: f.nom, image: f.image })),
        premiere: products.value.premiereCoucheDouceur.map(p => ({ nom: p.nom, images: p.images })),
        seconde: products.value.secondeCoucheDouceur.map(s => ({ nom: s.nom, images: s.images })),
        finition: products.value.toucheFinale.map(t => ({ nom: t.nom, images: t.images }))
      })
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la configuration:', error)
    }
  }

  const resetAllProducts = async () => {
    if (confirm('Remettre à zéro tous les produits ?')) {
      try {
        // Réinitialiser les produits
        products.value.fonds = Array(3).fill(null).map(() => ({ nom: '', image: null as string | null }))
        products.value.premiereCoucheDouceur = Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] }))
        products.value.secondeCoucheDouceur = Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] }))
        products.value.toucheFinale = Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] }))
        
        for (let i = 0; i < 3; i++) {
          if (products.value.fonds[i]?.image) {
            await productConfigService.deleteImage(products.value.fonds[i].image!)
          }
        }
        
        for (let i = 0; i < 4; i++) {
          if (products.value.premiereCoucheDouceur[i]?.images) {
            for (const image of products.value.premiereCoucheDouceur[i].images) {
              if (image) await productConfigService.deleteImage(image)
            }
          }
          if (products.value.secondeCoucheDouceur[i]?.images) {
            for (const image of products.value.secondeCoucheDouceur[i].images) {
              if (image) await productConfigService.deleteImage(image)
            }
          }
          if (products.value.toucheFinale[i]?.images) {
            for (const image of products.value.toucheFinale[i].images) {
              if (image) await productConfigService.deleteImage(image)
            }
          }
        }
        
        localStorage.removeItem('amande_product_config')
        console.log('✅ Tous les produits ont été remis à zéro')
      } catch (error) {
        console.error('❌ Erreur lors de la remise à zéro:', error)
      }
    }
  }

  // Fonctions de compatibilité (wrappers)
  const saveFond = async (index: number) => saveProduct('fond', index)
  const saveDouceur = async (index: number, type: 'premiere' | 'seconde') => saveProduct(type, index)
  const saveFinition = async (index: number) => saveProduct('finition', index)

  const resetFond = async (index: number) => resetProduct('fond', index)
  const resetDouceur = async (index: number, type: 'premiere' | 'seconde') => resetProduct(type, index)
  const resetFinition = async (index: number) => resetProduct('finition', index)

  return {
    // Configuration
    PRODUCT_TYPES,
    
    // État
    products,
    productStates,
    
    // Computed properties de compatibilité
    fonds,
    premiereCoucheDouceur,
    secondeCoucheDouceur,
    toucheFinale,
    lockedProducts,
    dragStates,
    
    // Computed properties
    fondsConfigured,
    premiereCoucheConfigured,
    secondeCoucheConfigured,
    toucheFinaleConfigured,
    totalProducts,
    totalPending,
    fondsProgress,
    premiereCoucheProgress,
    secondeCoucheProgress,
    toucheFinaleProgress,
    hasUnlockedProducts,
    
    // Helpers
    getProductArray,
    getProductState,
    setProductState,
    isProductLocked,
    isDragState,
    
    // Fonctions génériques
    updateDragState,
    toggleLock,
    saveProduct,
    resetProduct,
    removeImage,
    handleFiles,
    saveProductConfig,
    loadProductConfig,
    resetAllProducts,
    
    // Fonctions de compatibilité
    saveFond,
    saveDouceur,
    saveFinition,
    resetFond,
    resetDouceur,
    resetFinition
  }
})

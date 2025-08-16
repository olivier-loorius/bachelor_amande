<template>
  <div class="admin-dashboard">
    <Header 
      @logout="logout"
    />
    
    <main class="dashboard-content">
      <UsersSection />
      
      <ProductsSection 
        :fonds="fonds"
        :premiereCoucheDouceur="premiereCoucheDouceur"
        :secondeCoucheDouceur="secondeCoucheDouceur"
        :toucheFinale="toucheFinale"
        :lockedProducts="lockedProducts"
        :dragStates="dragStates"
        :productsViewMode="productsViewMode"
        :isLoadingProducts="isLoadingProducts"
        :isUploadingImages="isUploadingImages"
        :isProductsSectionOpen="isProductsSectionOpen"
        :fondsConfigured="fondsConfigured"
        :premiereCoucheConfigured="premiereCoucheConfigured"
        :secondeCoucheConfigured="secondeCoucheConfigured"
        :toucheFinaleConfigured="toucheFinaleConfigured"
        :totalProducts="totalProducts"
        :totalPending="totalPending"
        :fondsProgress="fondsProgress"
        :premiereCoucheProgress="premiereCoucheProgress"
        :secondeCoucheProgress="secondeCoucheProgress"
        :toucheFinaleProgress="toucheFinaleProgress"
        :hasUnlockedProducts="hasUnlockedProducts"
        @toggleProductsSection="toggleProductsSection"
        @loadProductConfig="loadProductConfig"
        @resetAllProducts="resetAllProducts"
        @initializeSupabaseConfig="initializeSupabaseConfig"
        @toggleLock="toggleLock"
        @resetFond="resetFond"
        @resetDouceur="(index: number, type: string) => resetDouceur(index, type as 'premiere' | 'seconde')"
        @resetFinition="resetFinition"
        @saveFond="saveFond"
        @saveDouceur="(index: number, type: string) => saveDouceur(index, type as 'premiere' | 'seconde')"
        @saveFinition="saveFinition"
        @removeImage="removeImage"
        @triggerFileUpload="triggerFileUpload"
        @handleFileDrop="handleFileDrop"
        @handleDragEnter="handleDragEnter"
        @handleDragLeave="handleDragLeave"
        @handleFileSelect="handleFileSelect"
        @validateProduct="validateProduct"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/services/supabaseService'
import { productConfigService } from '@/services/productConfigService'
import type { ProductConfig } from '@/services/productConfigService'
import Header from '@/components/admin/Header.vue'
import UsersSection from '@/components/admin/UsersSection.vue'
import ProductsSection from '@/components/admin/ProductsSection.vue'

interface User {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  updated_at?: string
  deleted?: boolean
  deleted_at?: string
}

// Interfaces génériques pour les produits
interface BaseProduct {
  nom: string
}

interface FondProduct extends BaseProduct {
  image: string | null
}

interface MultiImageProduct extends BaseProduct {
  images: (string | null)[]
}

const isProductsSectionOpen = ref(true)
const router = useRouter()
const authStore = useAuthStore()

const showProductModal = ref(false)
const editingProduct = ref<any>(null)
const editingType = ref<string | null>(null)
const isLoadingProducts = ref(false)
const isUploadingImages = ref(false)
const productsViewMode = ref<'grid' | 'list'>('grid')

// Helper pour la gestion des types de produits
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

// Structure générique pour les états
const productStates = ref({
  locked: {
    fonds: Array(3).fill(true),
    premiereDouceur: Array(4).fill(true),
    secondeDouceur: Array(4).fill(true),
    finitions: Array(4).fill(true)
  },
  drag: {
    fonds: Array(3).fill(false),
    premiereDouceur: Array(4).fill(false),
    secondeDouceur: Array(4).fill(false),
    finitions: Array(4).fill(false)
  }
})

// Structure générique pour tous les produits
const products = ref({
  fonds: Array(3).fill(null).map(() => ({ nom: '', image: null as string | null })) as FondProduct[],
  premiereCoucheDouceur: Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] })) as MultiImageProduct[],
  secondeCoucheDouceur: Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] })) as MultiImageProduct[],
  toucheFinale: Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] })) as MultiImageProduct[]
})

// Computed properties pour la compatibilité
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

// Helper pour calculer les produits configurés
const getConfiguredCount = (type: keyof typeof PRODUCT_TYPES) => {
  const productArray = products.value[PRODUCT_TYPES[type].array as keyof typeof products.value]
  
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

// Helper pour calculer la progression
const getProgress = (type: keyof typeof PRODUCT_TYPES) => {
  const configured = getConfiguredCount(type)
  const total = type === 'fond' ? 3 : 4
  return (configured / total) * 100
}

const fondsProgress = computed(() => getProgress('fond'))
const premiereCoucheProgress = computed(() => getProgress('premiere'))
const secondeCoucheProgress = computed(() => getProgress('seconde'))
const toucheFinaleProgress = computed(() => getProgress('finition'))

// Helper pour vérifier s'il y a des produits déverrouillés
const hasUnlockedProducts = computed(() => {
  return Object.values(productStates.value.locked).some(array => array.some(locked => !locked))
})

// Computed properties de compatibilité
const lockedProducts = computed({
  get: () => ({
    fonds: productStates.value.locked.fonds,
    premiereDouceur: productStates.value.locked.premiereDouceur,
    secondeDouceur: productStates.value.locked.secondeDouceur,
    finitions: productStates.value.locked.finitions
  }),
  set: (value) => {
    productStates.value.locked.fonds = value.fonds
    productStates.value.locked.premiereDouceur = value.premiereDouceur
    productStates.value.locked.secondeDouceur = value.secondeDouceur
    productStates.value.locked.finitions = value.finitions
  }
})

const dragStates = computed({
  get: () => ({
    fonds: productStates.value.drag.fonds,
    premiereDouceur: productStates.value.drag.premiereDouceur,
    secondeDouceur: productStates.value.drag.secondeDouceur,
    finitions: productStates.value.drag.finitions
  }),
  set: (value) => {
    productStates.value.drag.fonds = value.fonds
    productStates.value.drag.premiereDouceur = value.premiereDouceur
    productStates.value.drag.secondeDouceur = value.secondeDouceur
    productStates.value.drag.finitions = value.finitions
  }
})



const toggleProductsSection = () => {
  isProductsSectionOpen.value = !isProductsSectionOpen.value
}

// Fonction générique pour gérer les états de verrouillage
const toggleLock = async (type: string, index: number) => {
  const productType = PRODUCT_TYPES[type as keyof typeof PRODUCT_TYPES]
  if (!productType) return
  
  try {
    // Mettre à jour l'état local
    const currentState = productStates.value.locked[productType.array as keyof typeof productStates.value.locked][index]
    const newLockedState = !currentState
    productStates.value.locked[productType.array as keyof typeof productStates.value.locked][index] = newLockedState
    
    // Mettre à jour dans Supabase
    await productConfigService.updateProductLock(productType.configType, index, newLockedState)
    console.log(`✅ État de verrouillage mis à jour pour ${productType.configType} index ${index}: ${newLockedState}`)
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du verrouillage:', error)
    // Restaurer l'état en cas d'erreur
    const currentState = productStates.value.locked[productType.array as keyof typeof productStates.value.locked][index]
    productStates.value.locked[productType.array as keyof typeof productStates.value.locked][index] = !currentState
  }
}

// Fonction générique pour valider les produits
const validateProduct = async (type: string, index: number) => {
  try {
    await saveProduct(type as keyof typeof PRODUCT_TYPES, index)
    await toggleLock(type, index)
    
    console.log('✅ Produit validé et verrouillé')
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error)
  }
}

// Fonction générique pour supprimer des images
const removeImage = async (type: string, index: number, imageIndex?: number) => {
  const productType = PRODUCT_TYPES[type as keyof typeof PRODUCT_TYPES]
  if (!productType) return
  
  if (type === 'fond') {
    if (confirm('Supprimer cette image ?')) {
      const productArray = products.value.fonds
      const currentImage = productArray[index].image
      if (currentImage) {
        await productConfigService.deleteImage(currentImage)
      }
      productArray[index].image = null
      await saveProduct('fond', index)
    }
  } else {
    if (confirm(`Supprimer l'image ${imageIndex! + 1} ?`)) {
      const productArray = products.value[productType.array as keyof typeof products.value] as MultiImageProduct[]
      const currentImage = productArray[index].images[imageIndex!]
      if (currentImage) {
        await productConfigService.deleteImage(currentImage)
      }
      productArray[index].images[imageIndex!] = null
      
      await saveProduct(type as keyof typeof PRODUCT_TYPES, index)
    }
  }
}

// Fonction générique de sauvegarde pour tous les types de produits
const saveProduct = async (type: keyof typeof PRODUCT_TYPES, index: number) => {
  try {
    const productType = PRODUCT_TYPES[type]
    const productArray = products.value[productType.array as keyof typeof products.value]
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
    
    // Logs spécifiques pour maintenir la compatibilité
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

// Fonctions de compatibilité pour maintenir les appels existants
const saveFond = async (index: number) => saveProduct('fond', index)
const saveDouceur = async (index: number, type: 'premiere' | 'seconde') => saveProduct(type, index)
const saveFinition = async (index: number) => saveProduct('finition', index)

// Fonction générique pour remettre à zéro tous les produits
const resetAllProducts = async () => {
  if (confirm('Êtes-vous sûr de vouloir remettre à zéro tous les produits ? Cette action est irréversible.')) {
    try {
      // Supprimer toutes les images
      for (let i = 0; i < 3; i++) {
        if (products.value.fonds[i]?.image) {
          await productConfigService.deleteImage(products.value.fonds[i].image!)
        }
      }
      
      for (let i = 0; i < 4; i++) {
        // Supprimer les images des douceurs
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
      
      // Réinitialiser tous les arrays
      const resetArrays = () => {
        products.value.fonds = Array(3).fill(null).map(() => ({ nom: '', image: null as string | null }))
        products.value.premiereCoucheDouceur = Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] }))
        products.value.secondeCoucheDouceur = Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] }))
        products.value.toucheFinale = Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] }))
      }
      
      resetArrays()
      
      // Sauvegarder tous les produits
      for (let i = 0; i < 3; i++) {
        await saveProduct('fond', i)
      }
      for (let i = 0; i < 4; i++) {
        await saveProduct('premiere', i)
        await saveProduct('seconde', i)
        await saveProduct('finition', i)
      }
      
      console.log('✅ Tous les produits ont été remis à zéro')
    } catch (error) {
      console.error('❌ Erreur lors du reset complet:', error)
      alert('Erreur lors du reset complet')
    }
  }
}

const loadProductConfig = async () => {
  try {
    isLoadingProducts.value = true
    console.log('🔄 Chargement de la configuration depuis Supabase...')
    
    const configs = await productConfigService.getAllProductConfig()
    console.log('📦 Configuration chargée:', configs)
    
    products.value.fonds = []
    products.value.premiereCoucheDouceur = []
    products.value.secondeCoucheDouceur = []
    products.value.toucheFinale = []
    
    productStates.value.locked.fonds = [true, true, true]
    productStates.value.locked.premiereDouceur = [true, true, true, true]
    productStates.value.locked.secondeDouceur = [true, true, true, true]
    productStates.value.locked.finitions = [true, true, true, true]
    
    // Helper pour charger un produit
    const loadProduct = (config: any) => {
      switch (config.config_type) {
        case 'fonds':
          products.value.fonds[config.product_index] = {
            nom: config.nom || '',
            image: config.images && config.images.length > 0 ? config.images[0] : null
          }
          if (config.locked !== undefined) {
            productStates.value.locked.fonds[config.product_index] = config.locked
          } else {
            productStates.value.locked.fonds[config.product_index] = true
          }
          break
        case 'premiere_couche_douceur':
          products.value.premiereCoucheDouceur[config.product_index] = {
            nom: config.nom || '',
            images: config.images && config.images.length > 0 ? config.images : [null, null, null]
          }
          if (config.locked !== undefined) {
            productStates.value.locked.premiereDouceur[config.product_index] = config.locked
          } else {
            productStates.value.locked.premiereDouceur[config.product_index] = true
          }
          break
        case 'seconde_couche_douceur':
          products.value.secondeCoucheDouceur[config.product_index] = {
            nom: config.nom || '',
            images: config.images && config.images.length > 0 ? config.images : [null, null, null]
          }
          if (config.locked !== undefined) {
            productStates.value.locked.secondeDouceur[config.product_index] = config.locked
          } else {
            productStates.value.locked.secondeDouceur[config.product_index] = true
          }
          break
        case 'touche_finale':
          products.value.toucheFinale[config.product_index] = {
            nom: config.nom || '',
            images: config.images && config.images.length > 0 ? config.images : [null, null, null]
          }
          if (config.locked !== undefined) {
            productStates.value.locked.finitions[config.product_index] = config.locked
          } else {
            productStates.value.locked.finitions[config.product_index] = true
          }
          break
      }
    }
    
    // Charger chaque configuration
    configs.forEach(loadProduct)
    
    for (let i = 0; i < 3; i++) {
      if (!products.value.fonds[i]) products.value.fonds[i] = { nom: '', image: null }
    }
    for (let i = 0; i < 4; i++) {
      if (!products.value.premiereCoucheDouceur[i]) products.value.premiereCoucheDouceur[i] = { nom: '', images: [null, null, null] }
      if (!products.value.secondeCoucheDouceur[i]) products.value.secondeCoucheDouceur[i] = { nom: '', images: [null, null, null] }
      if (!products.value.toucheFinale[i]) products.value.toucheFinale[i] = { nom: '', images: [null, null, null] }
    }
    
    console.log('✅ Configuration chargée avec succès')
  } catch (error) {
    console.error('❌ Erreur lors du chargement de la configuration:', error)
  } finally {
    isLoadingProducts.value = false
  }
}

onMounted(async () => {
  if (!authStore.user || !authStore.isAdmin) {
    console.log('❌ Accès refusé: utilisateur non connecté ou non admin')
    router.push('/')
    return
  }
  
  console.log('✅ Accès admin autorisé')
  await loadProductConfig()
  
  const intervalId = setInterval(async () => {
    await loadProductConfig()
  }, 30000)
  
  const handleProfileUpdate = () => {
    // Les utilisateurs sont maintenant gérés par le store
  }
  
  window.addEventListener('profile-updated', handleProfileUpdate)
  
  onUnmounted(() => {
    window.removeEventListener('profile-updated', handleProfileUpdate)
    clearInterval(intervalId)
  })
})





const logout = async () => {
  try {
    await authStore.logout(router)
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}



const triggerFileUpload = (index: number, type: string) => {
  nextTick(() => {
    const inputId = `fileInput-${index}-${type}`
    const input = document.getElementById(inputId) as HTMLInputElement
    if (input) {
      input.click()
    } else {
      console.error(`Input file non trouvé: ${inputId}`)
    }
  })
}

// Fonction générique pour gérer les états de drag & drop
const updateDragState = (type: string, index: number, value: boolean) => {
  const productType = PRODUCT_TYPES[type as keyof typeof PRODUCT_TYPES]
  if (productType) {
    productStates.value.drag[productType.array as keyof typeof productStates.value.drag][index] = value
  }
}

const handleDragEnter = (event: DragEvent, index: number, type: string) => {
  event.preventDefault()
  updateDragState(type, index, true)
}

const handleDragLeave = (event: DragEvent, index: number, type: string) => {
  event.preventDefault()
  updateDragState(type, index, false)
}

const handleFileDrop = (event: DragEvent, index: number, type: string) => {
  event.preventDefault()
  updateDragState(type, index, false)
  
  const files = event.dataTransfer?.files
  if (files) {
    handleFiles(files, index, type)
  }
}

const handleFileSelect = (event: Event, index: number, type: string) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    handleFiles(target.files, index, type)
  }
}

// Fonction générique pour gérer l'upload des fichiers
const handleFiles = async (files: FileList, index: number, type: string) => {
  const fileArray = Array.from(files)
  const productType = PRODUCT_TYPES[type as keyof typeof PRODUCT_TYPES]
  if (!productType) return
  
  try {
    isUploadingImages.value = true
    
    if (type === 'fond') {
      if (fileArray.length > 0) {
        const file = fileArray[0]
        const imageUrl = await productConfigService.uploadImage(file, 'fonds', index)
        if (imageUrl) {
          const productArray = products.value.fonds
          productArray[index].image = imageUrl
          await saveProduct('fond', index)
        } else {
          alert('Erreur lors de l\'upload de l\'image')
        }
      }
    } else {
      const maxImages = Math.min(fileArray.length, 3)
      const productArray = products.value[productType.array as keyof typeof products.value] as MultiImageProduct[]
      
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
  } finally {
    isUploadingImages.value = false
  }
}

// Fonction générique de reset pour tous les types de produits
const resetProduct = async (type: keyof typeof PRODUCT_TYPES, index: number) => {
  if (confirm('Remettre à zéro ce produit ?')) {
    const productType = PRODUCT_TYPES[type]
    const productArray = products.value[productType.array as keyof typeof products.value]
    
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

// Fonctions de compatibilité pour maintenir les appels existants
const resetFond = async (index: number) => resetProduct('fond', index)
const resetDouceur = async (index: number, type: 'premiere' | 'seconde') => resetProduct(type, index)
const resetFinition = async (index: number) => resetProduct('finition', index)

const initializeSupabaseConfig = async () => {
  try {
    isLoadingProducts.value = true
    const success = await productConfigService.initializeDefaultConfig()
    
    if (success) {
      alert('Configuration Supabase initialisée avec succès !')
      await loadProductConfig()
    } else {
      alert('Erreur lors de l\'initialisation de la configuration Supabase')
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error)
    alert('Erreur lors de l\'initialisation de la configuration Supabase')
  } finally {
    isLoadingProducts.value = false
  }
}
</script>

<style lang="scss" scoped>
/* Variables admin */
$admin-primary: #383961;
$admin-bg-light: #f8f9fa;

/* Dashboard principal - utilise la typographie du site */
.admin-dashboard {
  font-family: 'Open Sans', sans-serif;
  background: $admin-bg-light;
  min-height: 100vh;
  padding: 2rem;
  
  * {
    font-family: 'Open Sans', sans-serif;
  }
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* Responsive - utilise vos styles existants */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }
}
</style>

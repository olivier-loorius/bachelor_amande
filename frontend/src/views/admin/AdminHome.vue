<template>
  <div class="admin-home">
    <!-- Header avec bienvenue -->
    <header class="admin-header">
      <div class="header-content">
        <div class="header-left">
                     <h1 class="header-title">
             <i class="fas fa-cogs"></i>
             Administration Amande
           </h1>
           <p class="header-subtitle">Bienvenue <strong>{{ authStore.user?.name || 'Administrateur' }}</strong> dans votre espace d'administration</p>
        </div>
        <div class="header-actions">
          <button class="admin-clear-btn" @click="clearAllData" title="Vider toutes les données">
            <i class="fas fa-trash-alt"></i>
            Vider tout
          </button>
                 <button class="admin-logout-btn" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          Déconnexion
        </button>
        </div>
      </div>
    </header>

    <!-- Section Utilisateurs -->
    <UsersSection />

    <!-- Section Produits -->
    <AccordionSection 
      :fonds="products.fonds"
      :premiereCoucheDouceur="products.premiereCoucheDouceur"
      :secondeCoucheDouceur="products.secondeCoucheDouceur"
      :toucheFinale="products.toucheFinale"
      :lockedProducts="{
        fonds: products.fonds.map(p => p.locked),
        premiereCoucheDouceur: products.premiereCoucheDouceur.map(p => p.locked),
        secondeCoucheDouceur: products.secondeCoucheDouceur.map(p => p.locked),
        toucheFinale: products.toucheFinale.map(p => p.locked)
      }"
      :totalProducts="totalProducts"
      :totalPending="totalPending"
      :isProductsSectionOpen="isProductsSectionOpen"
      :fondsProgress="fondsProgress"
      :premiereCoucheProgress="premiereCoucheProgress"
      :secondeCoucheProgress="secondeCoucheProgress"
      :toucheFinaleProgress="toucheFinaleProgress"
      :fondsConfigured="fondsConfigured"
      :premiereCoucheConfigured="premiereCoucheConfigured"
      :secondeCoucheConfigured="secondeCoucheConfigured"
      :toucheFinaleConfigured="toucheFinaleConfigured"
      @upload="handleUpload"
      @remove="handleRemove"
      @save="handleSave"
      @reset="handleReset"
      @toggleLock="handleToggleLock"
      @nomChange="handleNomChange"
      @toggle="toggleProductsSection"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import UsersSection from '@/components/admin/UsersSection.vue'
import AccordionSection from '@/components/admin/AccordionSection.vue'
import { productConfigService } from '@/services/productConfigService'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout(router)
}

// Types et interfaces
interface Product {
  id: string | number
  nom: string
  images: string[]  // toujours un tableau, même avec 1 seule image
  locked: boolean
  step: 'fonds' | 'premiereCoucheDouceur' | 'secondeCoucheDouceur' | 'toucheFinale'
}

interface ProductsByStep {
  fonds: Product[]
  premiereCoucheDouceur: Product[]
  secondeCoucheDouceur: Product[]
  toucheFinale: Product[]
}

// État des produits avec modèle unique
const products = ref<ProductsByStep>({
  fonds: Array(3).fill(null).map((_, i) => ({ 
    id: i, 
    nom: '', 
    images: [], 
    locked: false, // ✅ CORRECTION : vide = déverrouillé
    step: 'fonds'
  })),
  premiereCoucheDouceur: Array(4).fill(null).map((_, i) => ({ 
    id: i, 
    nom: '', 
    images: [], 
    locked: false, // ✅ CORRECTION : vide = déverrouillé
    step: 'premiereCoucheDouceur'
  })),
  secondeCoucheDouceur: Array(4).fill(null).map((_, i) => ({ 
    id: i, 
    nom: '', 
    images: [], 
    locked: false, // ✅ CORRECTION : vide = déverrouillé
    step: 'secondeCoucheDouceur'
  })),
  toucheFinale: Array(4).fill(null).map((_, i) => ({ 
    id: i, 
    nom: '', 
    images: [], 
    locked: false, // ✅ CORRECTION : vide = déverrouillé
    step: 'toucheFinale'
  }))
})

// État de l'accordéon
const isProductsSectionOpen = ref(true)

// Computed properties
const totalProducts = computed(() => 15) // 3 + 4 + 4 + 4
const totalPending = computed(() => 0) // À implémenter si nécessaire

const fondsProgress = computed(() => {
  const configured = products.value.fonds.filter(p => p.nom && p.images.length > 0).length
  return (configured / 3) * 100 // Pourcentage pour 3 produits max
})

const premiereCoucheProgress = computed(() => {
  const configured = products.value.premiereCoucheDouceur.filter(p => p.nom && p.images.length > 0).length
  return (configured / 4) * 100 // Pourcentage pour 4 produits max
})

const secondeCoucheProgress = computed(() => {
  const configured = products.value.secondeCoucheDouceur.filter(p => p.nom && p.images.length > 0).length
  return (configured / 4) * 100 // Pourcentage pour 4 produits max
})

const toucheFinaleProgress = computed(() => {
  const configured = products.value.toucheFinale.filter(p => p.nom && p.images.length > 0).length
  return (configured / 4) * 100 // Pourcentage pour 4 produits max
})

const fondsConfigured = computed(() => products.value.fonds.filter(p => p.nom && p.images.length > 0).length)
const premiereCoucheConfigured = computed(() => products.value.premiereCoucheDouceur.filter(p => p.nom && p.images.length > 0).length)
const secondeCoucheConfigured = computed(() => products.value.secondeCoucheDouceur.filter(p => p.nom && p.images.length > 0).length)
const toucheFinaleConfigured = computed(() => products.value.toucheFinale.filter(p => p.nom && p.images.length > 0).length)

// Fonction pour gérer automatiquement le verrouillage basé sur l'état du produit
const updateLockStatus = (productType: keyof ProductsByStep, actualIndex: number) => {
  const product = products.value[productType][actualIndex]
  const hasContent = product.nom && product.images.some(img => img && img.length > 0)
  
  // ✅ LOGIQUE CORRIGÉE : vide = déverrouillé, rempli = verrouillé
  product.locked = hasContent
  
  console.log(`🔓 Vignette ${productType}[${actualIndex}] ${hasContent ? 'verrouillée' : 'déverrouillée'} (${product.nom || 'vide'})`)
}

// Fonctions de gestion
const handleUpload = async ({ productIndex, imageIndex, file }: any) => {
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    const imageUrl = await productConfigService.uploadImage(file, productType, actualIndex, imageIndex)
    
    if (productType === 'fonds') {
      // S'assurer que l'array images existe et a la bonne taille
      if (!products.value.fonds[actualIndex].images) {
        products.value.fonds[actualIndex].images = []
      }
      products.value.fonds[actualIndex].images[imageIndex] = imageUrl || ''
    } else if (productType === 'premiereCoucheDouceur') {
      if (!products.value.premiereCoucheDouceur[actualIndex].images) {
        products.value.premiereCoucheDouceur[actualIndex].images = []
      }
      products.value.premiereCoucheDouceur[actualIndex].images[imageIndex] = imageUrl || ''
    } else if (productType === 'secondeCoucheDouceur') {
      if (!products.value.secondeCoucheDouceur[actualIndex].images) {
        products.value.secondeCoucheDouceur[actualIndex].images = []
      }
      products.value.secondeCoucheDouceur[actualIndex].images[imageIndex] = imageUrl || ''
    } else if (productType === 'toucheFinale') {
      if (!products.value.toucheFinale[actualIndex].images) {
        products.value.toucheFinale[actualIndex].images = []
      }
      products.value.toucheFinale[actualIndex].images[imageIndex] = imageUrl || ''
    }
    
    // ✅ Mettre à jour automatiquement le statut de verrouillage
    updateLockStatus(productType, actualIndex)
    
    console.log('✅ Image uploadée:', imageUrl)
  } catch (error) {
    console.error('❌ Erreur upload:', error)
  }
}

const handleRemove = async ({ productIndex, imageIndex }: any) => {
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    
    if (productType === 'fonds') {
      products.value.fonds[actualIndex].images[imageIndex] = ''
    } else if (productType === 'premiereCoucheDouceur') {
      products.value.premiereCoucheDouceur[actualIndex].images[imageIndex] = ''
    } else if (productType === 'secondeCoucheDouceur') {
      products.value.secondeCoucheDouceur[actualIndex].images[imageIndex] = ''
    } else if (productType === 'toucheFinale') {
      products.value.toucheFinale[actualIndex].images[imageIndex] = ''
    }
    
    // ✅ Mettre à jour automatiquement le statut de verrouillage
    updateLockStatus(productType, actualIndex)
    
    console.log('✅ Image supprimée')
  } catch (error) {
    console.error('❌ Erreur suppression:', error)
  }
}

const handleSave = async (productIndex: number) => {
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    await saveProduct(productType, actualIndex)
    
    // ✅ Le verrouillage est maintenant géré automatiquement par updateLockStatus
    // Pas besoin de forcer le verrouillage manuellement
    console.log('✅ Produit sauvegardé avec verrouillage automatique')
  } catch (error) {
    console.error('❌ Erreur sauvegarde:', error)
  }
}

const handleReset = async (productIndex: number) => {
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    
    // Récupérer le produit actuel pour avoir son ID
    const currentProduct = products.value[productType as keyof ProductsByStep][actualIndex]
    
    // Si le produit a un ID (existe en base), le supprimer
    if (currentProduct.id && typeof currentProduct.id === 'string') {
      console.log('🗑️ Suppression du produit de Supabase:', currentProduct.id)
      const success = await productConfigService.deleteProduct(currentProduct.id)
      
      if (success) {
        console.log('✅ Produit supprimé de Supabase')
      } else {
        console.error('❌ Échec de la suppression de Supabase')
      }
    }
    
    // Remettre à zéro dans la mémoire locale
    if (productType === 'fonds') {
      products.value.fonds[actualIndex] = { id: actualIndex, nom: '', images: [], locked: false, step: 'fonds' } // ✅ CORRECTION : reset = déverrouillé
    } else if (productType === 'premiereCoucheDouceur') {
      products.value.premiereCoucheDouceur[actualIndex] = { id: actualIndex, nom: '', images: [], locked: false, step: 'premiereCoucheDouceur' } // ✅ CORRECTION : reset = déverrouillé
    } else if (productType === 'secondeCoucheDouceur') {
      products.value.secondeCoucheDouceur[actualIndex] = { id: actualIndex, nom: '', images: [], locked: false, step: 'secondeCoucheDouceur' } // ✅ CORRECTION : reset = déverrouillé
    } else if (productType === 'toucheFinale') {
      products.value.toucheFinale[actualIndex] = { id: actualIndex, nom: '', images: [], locked: false, step: 'toucheFinale' } // ✅ CORRECTION : reset = déverrouillé
    }
    
    console.log('✅ Produit remis à zéro (local + Supabase)')
  } catch (error) {
    console.error('❌ Erreur reset:', error)
  }
}

const handleToggleLock = async (productIndex: number) => {
  console.log('🔓 handleToggleLock appelé avec productIndex:', productIndex)
  
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    console.log('🔍 Type et index:', { productType, actualIndex })
    
    // Vérifier que le produit existe
    if (!products.value[productType as keyof ProductsByStep] || !products.value[productType as keyof ProductsByStep][actualIndex]) {
      console.error('❌ Produit non trouvé:', { productType, actualIndex })
      return
    }
    
    const currentProduct = products.value[productType as keyof ProductsByStep][actualIndex]
    const currentLocked = currentProduct.locked
    
    console.log('🔍 AVANT toggle - Produit actuel:', {
      type: productType,
      index: actualIndex,
      nom: currentProduct.nom,
      locked: currentProduct.locked
    })
    
    // Toggle simple et indépendant - UNIQUEMENT cette vignette
    currentProduct.locked = !currentLocked
    
    console.log(`✅ Vignette ${productType}[${actualIndex}] ${currentLocked ? 'déverrouillée' : 'verrouillée'}`)
    
    // Debug pour vérifier qu'aucune autre vignette n'est affectée
    console.log('🔍 État APRÈS toggle:', {
      fonds: products.value.fonds.map((p, i) => ({ index: i, nom: p.nom, locked: p.locked })),
      premiereCouche: products.value.premiereCoucheDouceur.map((p, i) => ({ index: i, nom: p.nom, locked: p.locked })),
      secondeCouche: products.value.secondeCoucheDouceur.map((p, i) => ({ index: i, nom: p.nom, locked: p.locked })),
      toucheFinale: products.value.toucheFinale.map((p, i) => ({ index: i, nom: p.nom, locked: p.locked }))
    })
    
  } catch (error) {
    console.error('❌ Erreur toggle lock:', error)
  }
}

const toggleProductsSection = () => {
  isProductsSectionOpen.value = !isProductsSectionOpen.value
}

// Fonction pour gérer le changement de nom et mettre à jour le verrouillage
const handleNomChange = async (productIndex: number, newNom: string) => {
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    const product = products.value[productType as keyof ProductsByStep][actualIndex]
    
    // Mettre à jour le nom
    product.nom = newNom
    
    // ✅ Mettre à jour automatiquement le statut de verrouillage
    updateLockStatus(productType as keyof ProductsByStep, actualIndex)
    
    console.log(`✏️ Nom mis à jour pour ${productType}[${actualIndex}]: "${newNom}"`)
  } catch (error) {
    console.error('❌ Erreur changement nom:', error)
  }
}

// Helper pour déterminer le type de produit et l'index local
const getProductInfo = (productIndex: number) => {
  console.log('🔍 getProductInfo appelé avec productIndex:', productIndex)
  
  if (productIndex < 3) {
    // Étape 1: Fonds (indices 0, 1, 2)
    const actualIndex = productIndex
    console.log('📍 Fonds - Index global:', productIndex, 'Index local:', actualIndex)
    return { productType: 'fonds', actualIndex }
  } else if (productIndex < 7) {
    // Étape 2: Première Couche (indices 3, 4, 5, 6)
    const actualIndex = productIndex - 3
    console.log('📍 1ère Couche - Index global:', productIndex, 'Index local:', actualIndex)
    return { productType: 'premiereCoucheDouceur', actualIndex }
  } else if (productIndex < 11) {
    // Étape 3: Seconde Couche (indices 7, 8, 9, 10)
    const actualIndex = productIndex - 7
    console.log('📍 2ème Couche - Index global:', productIndex, 'Index local:', actualIndex)
    return { productType: 'secondeCoucheDouceur', actualIndex }
  } else {
    // Étape 4: Touche Finale (indices 11, 12, 13, 14)
    const actualIndex = productIndex - 11
    console.log('📍 Touche Finale - Index global:', productIndex, 'Index local:', actualIndex)
    return { productType: 'toucheFinale', actualIndex }
  }
}

// Sauvegarder un produit
const saveProduct = async (productType: string, actualIndex: number) => {
  try {
    let productData: Product | undefined
    
    switch (productType) {
      case 'fonds':
        productData = products.value.fonds[actualIndex]
        break
      case 'premiereCoucheDouceur':
        productData = products.value.premiereCoucheDouceur[actualIndex]
        break
      case 'secondeCoucheDouceur':
        productData = products.value.secondeCoucheDouceur[actualIndex]
        break
      case 'toucheFinale':
        productData = products.value.toucheFinale[actualIndex]
        break
    }
    
    if (!productData) {
      throw new Error('Produit non trouvé')
    }
    
    // Utiliser le nouveau service
    const result = await productConfigService.upsertProduct({
      nom: productData.nom,
      images: productData.images,
      locked: productData.locked,
      step: productType as Product['step']
    })
    
    if (!result) {
      throw new Error('Échec de la sauvegarde')
    }
    
    console.log('✅ Produit sauvegardé avec succès')
  } catch (error) {
    console.error('❌ Erreur sauvegarde produit:', error)
    throw error
  }
}

// Charger la configuration au montage
onMounted(async () => {
  try {
    // Charger tous les produits depuis la nouvelle structure
    const allProducts = await productConfigService.getAllProducts()
    console.log('🔍 Produits chargés:', allProducts)
    
    // Organiser les produits par étape
    allProducts.forEach(product => {
      const { step, nom, images, locked } = product
      
      switch (step) {
        case 'fonds':
          // Trouver le premier slot disponible
          const fondsIndex = products.value.fonds.findIndex(p => !p.nom && p.images.length === 0)
          if (fondsIndex !== -1) {
            products.value.fonds[fondsIndex] = { 
              id: product.id, 
              nom, 
              images: images || [], 
              locked,
              step: 'fonds'
            }
            // ✅ Mettre à jour le statut de verrouillage après chargement
            updateLockStatus('fonds', fondsIndex)
          }
          break
        case 'premiereCoucheDouceur':
          const premiereIndex = products.value.premiereCoucheDouceur.findIndex(p => !p.nom && p.images.length === 0)
          if (premiereIndex !== -1) {
            products.value.premiereCoucheDouceur[premiereIndex] = { 
              id: product.id, 
              nom, 
              images: images || [], 
              locked,
              step: 'premiereCoucheDouceur'
            }
            // ✅ Mettre à jour le statut de verrouillage après chargement
            updateLockStatus('premiereCoucheDouceur', premiereIndex)
          }
          break
        case 'secondeCoucheDouceur':
          const secondeIndex = products.value.secondeCoucheDouceur.findIndex(p => !p.nom && p.images.length === 0)
          if (secondeIndex !== -1) {
            products.value.secondeCoucheDouceur[secondeIndex] = { 
              id: product.id, 
              nom, 
              images: images || [], 
              locked,
              step: 'secondeCoucheDouceur'
            }
            // ✅ Mettre à jour le statut de verrouillage après chargement
            updateLockStatus('secondeCoucheDouceur', secondeIndex)
          }
          break
        case 'toucheFinale':
          const toucheIndex = products.value.toucheFinale.findIndex(p => !p.nom && p.images.length === 0)
          if (toucheIndex !== -1) {
            products.value.toucheFinale[toucheIndex] = { 
              id: product.id, 
              nom, 
              images: images || [], 
              locked,
              step: 'toucheFinale'
            }
            // ✅ Mettre à jour le statut de verrouillage après chargement
            updateLockStatus('toucheFinale', toucheIndex)
          }
          break
      }
    })
  } catch (error) {
    console.error('❌ Erreur chargement produits:', error)
  }
})

// Debug: vérifier l'indépendance des vignettes
const debugVignettes = () => {
  console.log('🔍 DEBUG - État actuel des vignettes:')
  console.log('📊 Fonds:', products.value.fonds.map((p, i) => ({ index: i, nom: p.nom, locked: p.locked, images: p.images.length })))
  console.log('📊 1ère Couche:', products.value.premiereCoucheDouceur.map((p, i) => ({ index: i, nom: p.nom, locked: p.locked, images: p.images.length })))
  console.log('📊 2ème Couche:', products.value.secondeCoucheDouceur.map((p, i) => ({ index: i, nom: p.nom, locked: p.locked, images: p.images.length })))
  console.log('📊 Touche Finale:', products.value.toucheFinale.map((p, i) => ({ index: i, nom: p.nom, locked: p.locked, images: p.images.length })))
}

// Debug: vérifier la nouvelle structure
onMounted(() => {
  console.log('🔍 Nouvelle structure des produits:', products.value)
  console.log('🔍 Fonds:', products.value.fonds)
  console.log('🔍 1ère Couche:', products.value.premiereCoucheDouceur)
  
  // Debug initial
  debugVignettes()
})

// Vider complètement toutes les données
const clearAllData = async () => {
  try {
    console.log('🗑️ Suppression de toutes les données...')
    
    // Récupérer tous les produits existants
    const allProducts = await productConfigService.getAllProducts()
    
    // Supprimer chaque produit
    for (const product of allProducts) {
      if (product.id && typeof product.id === 'string') {
        await productConfigService.deleteProduct(product.id)
      }
    }
    
    // Remettre à zéro la mémoire locale
    products.value = {
      fonds: Array(3).fill(null).map((_, i) => ({ 
        id: i, 
        nom: '', 
        images: [], 
        locked: false, // ✅ CORRECTION : vide = déverrouillé
        step: 'fonds'
      })),
      premiereCoucheDouceur: Array(4).fill(null).map((_, i) => ({ 
        id: i, 
        nom: '', 
        images: [], 
        locked: false, // ✅ CORRECTION : vide = déverrouillé
        step: 'premiereCoucheDouceur'
      })),
      secondeCoucheDouceur: Array(4).fill(null).map((_, i) => ({ 
        id: i, 
        nom: '', 
        images: [], 
        locked: false, // ✅ CORRECTION : vide = déverrouillé
        step: 'secondeCoucheDouceur'
      })),
      toucheFinale: Array(4).fill(null).map((_, i) => ({ 
        id: i, 
        nom: '', 
        images: [], 
        locked: false, // ✅ CORRECTION : vide = déverrouillé
        step: 'toucheFinale'
      }))
    }
    
    console.log('✅ Toutes les données ont été supprimées')
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error)
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_admin-variables.scss' as *;

.admin-home {
  padding: 2rem;
}

.admin-header {
  background: $admin-primary;
  color: white;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.header-title {
  font-family: var(--font-family-title);
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  i {
    color: white;
  }
}

.header-subtitle {
  font-family: var(--font-family-text);
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.admin-clear-btn {
  font-family: var(--font-family-text);
  background: $admin-danger;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    opacity: 0.9;
  }
}

.admin-logout-btn {
  font-family: var(--font-family-text);
  background: $admin-danger;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    opacity: 0.9;
  }
}

/* Responsive mobile */
@media (max-width: 768px) {
  .admin-home {
    padding: 1rem;
  }
  
  .admin-header {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-left {
    align-items: center;
    text-align: center;
  }
  
  .header-title {
    font-size: 1.5rem;
    justify-content: center;
  }
  
  .header-subtitle {
    font-size: 0.9rem;
    text-align: center;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .admin-clear-btn, .admin-logout-btn {
    width: 100%;
    justify-content: center;
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
}

</style>

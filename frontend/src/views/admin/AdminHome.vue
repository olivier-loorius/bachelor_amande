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
         fonds: products.fonds.map(p => p.saved), // ← saved = true = verrouillée
         premiereCoucheDouceur: products.premiereCoucheDouceur.map(p => p.saved),
         secondeCoucheDouceur: products.secondeCoucheDouceur.map(p => p.saved),
         toucheFinale: products.toucheFinale.map(p => p.saved)
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
       @nomChange="() => {}"
      @toggle="toggleProductsSection"
      @showDeleteConfirm="showDeleteConfirmModal"
    />
    
    <!-- Modal de confirmation pour suppression de tous les produits -->
    <div v-if="showDeleteConfirm" class="delete-confirm-overlay">
      <div class="delete-confirm-modal">
        <div class="modal-header">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Attention !</h3>
        </div>
        <div class="modal-content">
          <p class="modal-description">
            Vous êtes sur le point de supprimer <strong>tous les produits</strong> de votre dashboard.
          </p>
          <div class="warning-box">
            <i class="fas fa-info-circle"></i>
            <span>Cette action est irréversible</span>
          </div>
          <div class="safe-box">
            <i class="fas fa-shield-alt"></i>
            <span>Vos utilisateurs ne seront pas affectés</span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="cancel-btn" @click="cancelDelete">
            <i class="fas fa-times"></i>
            Annuler
          </button>
          <button class="confirm-btn" @click="confirmDeleteAllProducts">
            <i class="fas fa-trash-alt"></i>
            Supprimer tout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProductStore } from '@/stores/useProductStore'

import UsersSection from '@/components/admin/UsersSection.vue'
import AccordionSection from '@/components/admin/AccordionSection.vue'
import { productConfigService } from '@/services/productConfigService'

const authStore = useAuthStore()
const router = useRouter()

// Store des produits pour synchronisation avec ComposerView
const productStore = useProductStore()

const handleLogout = () => {
  authStore.logout(router)
}

// Types et interfaces - APPROCHE SIMPLE
interface Product {
  id: string | number
  nom: string
  images: string[]  // toujours un tableau, même avec 1 seule image
  saved: boolean    // ← SEUL indicateur d'état : sauvegardé = fermé/verrouillé
  step: 'fonds' | 'premiereCoucheDouceur' | 'secondeCoucheDouceur' | 'toucheFinale'
}

interface ProductsByStep {
  fonds: Product[]
  premiereCoucheDouceur: Product[]
  secondeCoucheDouceur: Product[]
  toucheFinale: Product[]
}

// État des produits - APPROCHE SIMPLE
const products = ref<ProductsByStep>({
  fonds: Array(3).fill(null).map((_, i) => ({ 
    id: i, 
    nom: '', 
    images: [], 
    saved: false, // ← Vignette vide = pas sauvegardée = ouverte
    step: 'fonds'
  })),
  premiereCoucheDouceur: Array(4).fill(null).map((_, i) => ({ 
    id: i, 
    nom: '', 
    images: [], 
    saved: false, // ← Vignette vide = pas sauvegardée = ouverte
    step: 'premiereCoucheDouceur'
  })),
  secondeCoucheDouceur: Array(4).fill(null).map((_, i) => ({ 
    id: i, 
    nom: '', 
    images: [], 
    saved: false, // ← Vignette vide = pas sauvegardée = ouverte
    step: 'secondeCoucheDouceur'
  })),
  toucheFinale: Array(4).fill(null).map((_, i) => ({ 
    id: i, 
    nom: '', 
    images: [], 
    saved: false, // ← Vignette vide = pas sauvegardée = ouverte
    step: 'toucheFinale'
  }))
})

// État de l'accordéon
const isProductsSectionOpen = ref(true)

// État de la modal de confirmation
const showDeleteConfirm = ref(false)

// Computed properties
const totalProducts = computed(() => {
  const fondsCount = products.value.fonds.filter(p => p.nom && p.images.some(img => img && img.length > 0)).length
  const premiereCount = products.value.premiereCoucheDouceur.filter(p => p.nom && p.images.some(img => img && img.length > 0)).length
  const secondeCount = products.value.secondeCoucheDouceur.filter(p => p.nom && p.images.some(img => img && img.length > 0)).length
  const toucheCount = products.value.toucheFinale.filter(p => p.nom && p.images.some(img => img && img.length > 0)).length
  
  return fondsCount + premiereCount + secondeCount + toucheCount
})

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

// ✅ APPROCHE SIMPLE : Plus besoin de logique complexe de verrouillage
// Chaque vignette gère son propre état avec la propriété 'saved'

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
      // Synchroniser avec le store des produits pour ComposerView
      productStore.fonds[actualIndex].image = imageUrl || null
    } else if (productType === 'premiereCoucheDouceur') {
      if (!products.value.premiereCoucheDouceur[actualIndex].images) {
        products.value.premiereCoucheDouceur[actualIndex].images = []
      }
      products.value.premiereCoucheDouceur[actualIndex].images[imageIndex] = imageUrl || ''
      // Synchroniser avec le store des produits pour ComposerView
      productStore.premiereCoucheDouceur[actualIndex].images[imageIndex] = imageUrl || null
    } else if (productType === 'secondeCoucheDouceur') {
      if (!products.value.secondeCoucheDouceur[actualIndex].images) {
        products.value.secondeCoucheDouceur[actualIndex].images = []
      }
      products.value.secondeCoucheDouceur[actualIndex].images[imageIndex] = imageUrl || ''
      // Synchroniser avec le store des produits pour ComposerView
      productStore.secondeCoucheDouceur[actualIndex].images[imageIndex] = imageUrl || null
    } else if (productType === 'toucheFinale') {
      if (!products.value.toucheFinale[actualIndex].images) {
        products.value.toucheFinale[actualIndex].images = []
      }
      products.value.toucheFinale[actualIndex].images[imageIndex] = imageUrl || ''
      // Synchroniser avec le store des produits pour ComposerView
      productStore.toucheFinale[actualIndex].images[imageIndex] = imageUrl || null
    }
    
    console.log('✅ Image uploadée et store synchronisé:', imageUrl)
  } catch (error) {
    console.error('❌ Erreur upload:', error)
  }
}

const handleRemove = async ({ productIndex, imageIndex }: any) => {
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    
    if (productType === 'fonds') {
      products.value.fonds[actualIndex].images[imageIndex] = ''
      // Synchroniser avec le store des produits pour ComposerView
      productStore.fonds[actualIndex].image = null
    } else if (productType === 'premiereCoucheDouceur') {
      products.value.premiereCoucheDouceur[actualIndex].images[imageIndex] = ''
      // Synchroniser avec le store des produits pour ComposerView
      productStore.premiereCoucheDouceur[actualIndex].images[imageIndex] = null
    } else if (productType === 'secondeCoucheDouceur') {
      products.value.secondeCoucheDouceur[actualIndex].images[imageIndex] = ''
      // Synchroniser avec le store des produits pour ComposerView
      productStore.secondeCoucheDouceur[actualIndex].images[imageIndex] = null
    } else if (productType === 'toucheFinale') {
      products.value.toucheFinale[actualIndex].images[imageIndex] = ''
      // Synchroniser avec le store des produits pour ComposerView
      productStore.toucheFinale[actualIndex].images[imageIndex] = null
    }
    
    console.log('✅ Image supprimée et store synchronisé')
  } catch (error) {
    console.error('❌ Erreur suppression:', error)
  }
}

const handleSave = async (productIndex: number) => {
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    await saveProduct(productType, actualIndex)
    
    // ✅ APPROCHE VIGNETTE INDIVIDUELLE : Marquer comme sauvegardé
    // La vignette reste accessible mais est marquée comme "complète"
    const product = getProductByType(productType, actualIndex)
    if (product) {
      product.saved = true
      
      // Synchroniser avec le store des produits pour ComposerView
      if (productType === 'fonds') {
        productStore.fonds[actualIndex] = { nom: product.nom, image: product.images[0] || null }
      } else if (productType === 'premiereCoucheDouceur') {
        productStore.premiereCoucheDouceur[actualIndex] = { nom: product.nom, images: product.images }
      } else if (productType === 'secondeCoucheDouceur') {
        productStore.secondeCoucheDouceur[actualIndex] = { nom: product.nom, images: product.images }
      } else if (productType === 'toucheFinale') {
        productStore.toucheFinale[actualIndex] = { nom: product.nom, images: product.images }
      }

      console.log('✅ Produit sauvegardé → vignette marquée comme complète + store synchronisé')
    }
  } catch (error) {
    console.error('❌ Erreur sauvegarde:', error)
  }
}

const handleReset = async (productIndex: number) => {
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    
    // Récupérer le produit actuel pour avoir son ID
    const currentProduct = getProductByType(productType, actualIndex)
    
    // Si le produit a un ID (existe en base), le supprimer
    if (currentProduct && currentProduct.id && typeof currentProduct.id === 'string') {
      console.log('🗑️ Suppression du produit de Supabase:', currentProduct.id)
      const success = await productConfigService.deleteProduct(currentProduct.id)
      
      if (success) {
        console.log('✅ Produit supprimé de Supabase')
      } else {
        console.error('❌ Échec de la suppression de Supabase')
      }
    }
    
    // Remettre à zéro dans la mémoire locale - APPROCHE SIMPLE
    if (productType === 'fonds') {
      products.value.fonds[actualIndex] = { id: actualIndex, nom: '', images: [], saved: false, step: 'fonds' } // ← Reset = pas sauvegardé = ouvert
      // Synchroniser avec le store des produits pour ComposerView
      productStore.fonds[actualIndex] = { nom: '', image: null }
    } else if (productType === 'premiereCoucheDouceur') {
      products.value.premiereCoucheDouceur[actualIndex] = { id: actualIndex, nom: '', images: [], saved: false, step: 'premiereCoucheDouceur' } // ← Reset = pas sauvegardé = ouvert
      // Synchroniser avec le store des produits pour ComposerView
      productStore.premiereCoucheDouceur[actualIndex] = { nom: '', images: [null, null, null] }
    } else if (productType === 'secondeCoucheDouceur') {
      products.value.secondeCoucheDouceur[actualIndex] = { id: actualIndex, nom: '', images: [], saved: false, step: 'secondeCoucheDouceur' } // ← Reset = pas sauvegardé = ouvert
      // Synchroniser avec le store des produits pour ComposerView
      productStore.secondeCoucheDouceur[actualIndex] = { nom: '', images: [null, null, null] }
    } else if (productType === 'toucheFinale') {
      products.value.toucheFinale[actualIndex] = { id: actualIndex, nom: '', images: [], saved: false, step: 'toucheFinale' } // ← Reset = pas sauvegardé = ouvert
      // Synchroniser avec le store des produits pour ComposerView
      productStore.toucheFinale[actualIndex] = { nom: '', images: [null, null, null] }
    }
    
    console.log('✅ Produit remis à zéro (local + Supabase + store synchronisé)')
  } catch (error) {
    console.error('❌ Erreur reset:', error)
  }
}

// ✅ APPROCHE VIGNETTE INDIVIDUELLE : Permettre de déverrouiller pour modification
const handleToggleLock = async (productIndex: number) => {
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    const product = getProductByType(productType, actualIndex)
    
    if (product) {
      // Basculer l'état : sauvegardé ↔ modifiable
      product.saved = !product.saved
      
      if (product.saved) {
        console.log('🔒 Vignette verrouillée (sauvegardée)')
      } else {
        console.log('🔓 Vignette déverrouillée (modifiable)')
      }
    }
  } catch (error) {
    console.error('❌ Erreur toggle lock:', error)
  }
}

const toggleProductsSection = () => {
  isProductsSectionOpen.value = !isProductsSectionOpen.value
  // ✅ APPROCHE SIMPLE : Plus besoin de logique complexe
  // Chaque vignette gère son propre état avec 'saved'
}

// ✅ APPROCHE SIMPLE : Plus besoin de gérer le nom séparément
// Le nom est géré directement dans les composants ProductStep

// Helper pour récupérer un produit par type et index de manière sûre
const getProductByType = (productType: string, index: number) => {
  if (productType === 'fonds') {
    return products.value.fonds[index]
  } else if (productType === 'premiereCoucheDouceur') {
    return products.value.premiereCoucheDouceur[index]
  } else if (productType === 'secondeCoucheDouceur') {
    return products.value.secondeCoucheDouceur[index]
  } else if (productType === 'toucheFinale') {
    return products.value.toucheFinale[index]
  }
  return null
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
      locked: false, // Default to unlocked for new products
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
              saved: true, // Produit chargé depuis Supabase = déjà sauvegardé
              step: 'fonds'
            }
            // Synchroniser avec le store des produits pour ComposerView
            productStore.fonds[fondsIndex] = { nom, image: images?.[0] || null }
            // Les vignettes chargées depuis Supabase gardent leur statut locked
          }
          break
        case 'premiereCoucheDouceur':
          const premiereIndex = products.value.premiereCoucheDouceur.findIndex(p => !p.nom && p.images.length === 0)
          if (premiereIndex !== -1) {
            products.value.premiereCoucheDouceur[premiereIndex] = { 
              id: product.id, 
              nom, 
              images: images || [], 
              saved: true, // Produit chargé depuis Supabase = déjà sauvegardé
              step: 'premiereCoucheDouceur'
            }
            // Synchroniser avec le store des produits pour ComposerView
            productStore.premiereCoucheDouceur[premiereIndex] = { nom, images: images || [] }
            // Les vignettes chargées depuis Supabase gardent leur statut locked
          }
          break
        case 'secondeCoucheDouceur':
          const secondeIndex = products.value.secondeCoucheDouceur.findIndex(p => !p.nom && p.images.length === 0)
          if (secondeIndex !== -1) {
            products.value.secondeCoucheDouceur[secondeIndex] = { 
              id: product.id, 
              nom, 
              images: images || [], 
              saved: true, // Produit chargé depuis Supabase = déjà sauvegardé
              step: 'secondeCoucheDouceur'
            }
            // Synchroniser avec le store des produits pour ComposerView
            productStore.secondeCoucheDouceur[secondeIndex] = { nom, images: images || [] }
            // Les vignettes chargées depuis Supabase gardent leur statut locked
          }
          break
        case 'toucheFinale':
          const toucheIndex = products.value.toucheFinale.findIndex(p => !p.nom && p.images.length === 0)
          if (toucheIndex !== -1) {
            products.value.toucheFinale[toucheIndex] = { 
              id: product.id, 
              nom, 
              images: images || [], 
              saved: true, // Produit chargé depuis Supabase = déjà sauvegardé
              step: 'toucheFinale'
            }
            // Synchroniser avec le store des produits pour ComposerView
            productStore.toucheFinale[toucheIndex] = { nom, images: images || [] }
            // Les vignettes chargées depuis Supabase gardent leur statut locked
          }
          break
      }
    })
  } catch (error) {
    console.error('❌ Erreur chargement produits:', error)
  }
})

// Debug: vérifier l'état des vignettes - APPROCHE SIMPLE
const debugVignettes = () => {
  console.log('🔍 DEBUG - État actuel des vignettes:')
  console.log('📊 Fonds:', products.value.fonds.map((p, i) => ({ index: i, nom: p.nom, saved: p.saved, images: p.images.length })))
  console.log('📊 1ère Couche:', products.value.premiereCoucheDouceur.map((p, i) => ({ index: i, nom: p.nom, saved: p.saved, images: p.images.length })))
  console.log('📊 2ème Couche:', products.value.secondeCoucheDouceur.map((p, i) => ({ index: i, nom: p.nom, saved: p.saved, images: p.images.length })))
  console.log('📊 Touche Finale:', products.value.toucheFinale.map((p, i) => ({ index: i, nom: p.nom, saved: p.saved, images: p.images.length })))
}

// Debug: vérifier la nouvelle structure
onMounted(() => {
  console.log('🔍 Nouvelle structure des produits:', products.value)
  console.log('🔍 Fonds:', products.value.fonds)
  console.log('🔍 1ère Couche:', products.value.premiereCoucheDouceur)
  
  // Debug initial
  debugVignettes()
})

// Vider complètement toutes les données des PRODUITS uniquement (sécurisé)
const clearAllProducts = async () => {
  try {
    console.log('🗑️ SÉCURISÉ - Suppression de TOUS les PRODUITS uniquement...')
    console.log('✅ Les utilisateurs ne seront PAS supprimés')
    
    // Récupérer tous les PRODUITS existants uniquement
    const allProducts = await productConfigService.getAllProducts()
    console.log(`📊 ${allProducts.length} produits à supprimer`)
    
    if (allProducts.length === 0) {
      console.log('ℹ️ Aucun produit à supprimer')
      return
    }
    
    // Supprimer chaque PRODUIT uniquement
    for (const product of allProducts) {
      if (product.id && typeof product.id === 'string') {
        console.log(`🗑️ Suppression du produit: ${product.nom || 'Sans nom'}`)
        await productConfigService.deleteProduct(product.id)
      }
    }
    
         // Remettre à zéro la mémoire locale des PRODUITS uniquement - APPROCHE SIMPLE
     products.value = {
       fonds: Array(3).fill(null).map((_, i) => ({ 
         id: i, 
         nom: '', 
         images: [], 
         saved: false, // ← Reset = pas sauvegardé = ouvert
         step: 'fonds'
       })),
       premiereCoucheDouceur: Array(4).fill(null).map((_, i) => ({ 
         id: i, 
         nom: '', 
         images: [], 
         saved: false, // ← Reset = pas sauvegardé = ouvert
         step: 'premiereCoucheDouceur'
       })),
       secondeCoucheDouceur: Array(4).fill(null).map((_, i) => ({ 
         id: i, 
         nom: '', 
         images: [], 
         saved: false, // ← Reset = pas sauvegardé = ouvert
         step: 'secondeCoucheDouceur'
       })),
       toucheFinale: Array(4).fill(null).map((_, i) => ({ 
         id: i, 
         nom: '', 
         images: [], 
         saved: false, // ← Reset = pas sauvegardé = ouvert
         step: 'toucheFinale'
       }))
     }
     
     // Synchroniser avec le store des produits pour ComposerView
     productStore.fonds = Array(3).fill(null).map(() => ({ nom: '', image: null }))
     productStore.premiereCoucheDouceur = Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] }))
     productStore.secondeCoucheDouceur = Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] }))
     productStore.toucheFinale = Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] }))
    
    console.log('✅ Tous les PRODUITS ont été supprimés (utilisateurs préservés)')
  } catch (error) {
    console.error('❌ Erreur lors de la suppression des produits:', error)
  }
}

// Fonctions pour la modal de confirmation
const showDeleteConfirmModal = () => {
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
}

const confirmDeleteAllProducts = async () => {
  showDeleteConfirm.value = false
  await clearAllProducts()
}

// Nettoyer les produits dupliqués
const cleanDuplicateProducts = async () => {
  try {
    console.log('🧹 Nettoyage des produits dupliqués...')
    const allProducts = await productConfigService.getAllProducts()
    const uniqueProducts: Product[] = []
    const seenIds = new Set<string>()

    for (const product of allProducts) {
      const { id, nom, images, step } = product
      if (id && !seenIds.has(id)) {
                 uniqueProducts.push({
           id: id,
           nom: nom,
           images: images || [],
           saved: true, // ← Produit chargé depuis Supabase = déjà sauvegardé
           step: step as Product['step']
         })
        seenIds.add(id)
      } else {
        console.log(`🗑️ Suppression du produit dupliqué avec ID: ${id || 'Sans ID'}`)
        if (id && typeof id === 'string') {
          await productConfigService.deleteProduct(id)
        }
      }
    }

    console.log(`✅ ${uniqueProducts.length} produits uniques conservés.`)
    console.log('ℹ️ Veuillez recharger la page pour voir les changements.')

    // Mettre à jour la vue locale avec les produits uniques
    products.value = {
      fonds: uniqueProducts.filter(p => p.step === 'fonds'),
      premiereCoucheDouceur: uniqueProducts.filter(p => p.step === 'premiereCoucheDouceur'),
      secondeCoucheDouceur: uniqueProducts.filter(p => p.step === 'secondeCoucheDouceur'),
      toucheFinale: uniqueProducts.filter(p => p.step === 'toucheFinale')
    }
    
    // Synchroniser avec le store des produits pour ComposerView
    productStore.fonds = products.value.fonds.map(p => ({ nom: p.nom, image: p.images[0] || null }))
    productStore.premiereCoucheDouceur = products.value.premiereCoucheDouceur.map(p => ({ nom: p.nom, images: p.images }))
    productStore.secondeCoucheDouceur = products.value.secondeCoucheDouceur.map(p => ({ nom: p.nom, images: p.images }))
    productStore.toucheFinale = products.value.toucheFinale.map(p => ({ nom: p.nom, images: p.images }))

    // Recharger les vignettes pour refléter les changements
    onMounted(() => {
      console.log('🔍 Nouvelle structure des produits après nettoyage:', products.value)
      console.log('🔍 Fonds:', products.value.fonds)
      console.log('🔍 1ère Couche:', products.value.premiereCoucheDouceur)
      debugVignettes()
    })

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage des produits dupliqués:', error)
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

  .admin-logout-btn {
    width: 100%;
    justify-content: center;
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
}

/* Styles pour la modal de confirmation */
.delete-confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-confirm-modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  color: #dc3545;
}

.modal-header i {
  font-size: 2rem;
  color: #dc3545;
}

.modal-header h3 {
  margin: 0;
  font-family: var(--font-family-title);
  font-size: 1.5rem;
  color: #dc3545;
}

.modal-content {
  margin-bottom: 1.5rem;
}

.modal-description {
  margin: 0 0 1.5rem 0;
  font-family: var(--font-family-text);
  line-height: 1.5;
  font-size: 1rem;
  color: #2c3e50;
}

.warning-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.75rem 0;
  padding: 0.75rem;
  background: #fff5f5;
  border-radius: 8px;
  border: 1px solid #fed7d7;
  color: #dc3545;
  font-family: var(--font-family-text);
  font-size: 0.95rem;
  line-height: 1.4;
}

.warning-box i {
  font-size: 1.2rem;
  color: #dc3545;
}

.safe-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.75rem 0;
  padding: 0.75rem;
  background: #e3f2fd;
  border-radius: 8px;
  border: 1px solid #17a2b8;
  color: #17a2b8;
  font-family: var(--font-family-text);
  font-size: 0.95rem;
  line-height: 1.4;
}

.safe-box i {
  font-size: 1.2rem;
  color: #17a2b8;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.modal-actions button {
  font-family: var(--font-family-text);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.confirm-btn {
  background: #dc3545;
  color: white;
}

.confirm-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.cancel-btn {
  background: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

/* Responsive pour la modal */
@media (max-width: 768px) {
  .delete-confirm-modal {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-actions button {
    width: 100%;
    justify-content: center;
  }
}
</style>

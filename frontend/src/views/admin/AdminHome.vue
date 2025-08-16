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
                 <button class="admin-logout-btn" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          Déconnexion
        </button>
      </div>
    </header>

    <!-- Section Utilisateurs -->
    <UsersSection />

    <!-- Section Produits -->
    <AccordionSection 
      :fonds="fonds"
      :premiereCoucheDouceur="premiereCoucheDouceur"
      :secondeCoucheDouceur="secondeCoucheDouceur"
      :toucheFinale="toucheFinale"
      :lockedProducts="lockedProducts"
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

// État des produits
const fonds = ref(Array(3).fill(null).map(() => ({ nom: '', image: null })))
const premiereCoucheDouceur = ref(Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] })))
const secondeCoucheDouceur = ref(Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] })))
const toucheFinale = ref(Array(4).fill(null).map(() => ({ nom: '', images: [null, null, null] })))

// État des verrous
const lockedProducts = ref({
  fonds: Array(3).fill(true),
  premiereCoucheDouceur: Array(4).fill(true),
  secondeCoucheDouceur: Array(4).fill(true),
  toucheFinale: Array(4).fill(true)
})

// État de l'accordéon
const isProductsSectionOpen = ref(true)

// Computed properties
const totalProducts = computed(() => 15) // 3 + 4 + 4 + 4
const totalPending = computed(() => 0) // À implémenter si nécessaire

const fondsProgress = computed(() => {
  const configured = fonds.value.filter(p => p.nom && p.image).length
  return { current: configured, total: 3 }
})

const premiereCoucheProgress = computed(() => {
  const configured = premiereCoucheDouceur.value.filter(p => p.nom && p.images.some(img => img)).length
  return { current: configured, total: 4 }
})

const secondeCoucheProgress = computed(() => {
  const configured = secondeCoucheDouceur.value.filter(p => p.nom && p.images.some(img => img)).length
  return { current: configured, total: 4 }
})

const toucheFinaleProgress = computed(() => {
  const configured = toucheFinale.value.filter(p => p.nom && p.images.some(img => img)).length
  return { current: configured, total: 4 }
})

const fondsConfigured = computed(() => fonds.value.filter(p => p.nom && p.image).length)
const premiereCoucheConfigured = computed(() => premiereCoucheDouceur.value.filter(p => p.nom && p.images.some(img => img)).length)
const secondeCoucheConfigured = computed(() => secondeCoucheDouceur.value.filter(p => p.nom && p.images.some(img => img)).length)
const toucheFinaleConfigured = computed(() => toucheFinale.value.filter(p => p.nom && p.images.some(img => img)).length)

// Fonctions de gestion
const handleUpload = async ({ productIndex, imageIndex, file }: any) => {
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    const imageUrl = await productConfigService.uploadImage(file)
    
    if (productType === 'fonds') {
      fonds.value[actualIndex].image = imageUrl
    } else {
      if (!premiereCoucheDouceur.value[actualIndex].images) {
        premiereCoucheDouceur.value[actualIndex].images = [null, null, null]
      }
      premiereCoucheDouceur.value[actualIndex].images[imageIndex] = imageUrl
    }
    
    console.log('✅ Image uploadée:', imageUrl)
  } catch (error) {
    console.error('❌ Erreur upload:', error)
  }
}

const handleRemove = async ({ productIndex, imageIndex }: any) => {
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    
    if (productType === 'fonds') {
      fonds.value[actualIndex].image = null
    } else {
      premiereCoucheDouceur.value[actualIndex].images[imageIndex] = null
    }
    
    console.log('✅ Image supprimée')
  } catch (error) {
    console.error('❌ Erreur suppression:', error)
  }
}

const handleSave = async (productIndex: number) => {
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    await saveProduct(productType, actualIndex)
    
    // Verrouiller automatiquement après sauvegarde
    await handleToggleLock(productIndex)
    console.log('✅ Produit sauvegardé et verrouillé')
  } catch (error) {
    console.error('❌ Erreur sauvegarde:', error)
  }
}

const handleReset = async (productIndex: number) => {
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    
    if (productType === 'fonds') {
      fonds.value[actualIndex] = { nom: '', image: null }
    } else {
      premiereCoucheDouceur.value[actualIndex] = { nom: '', images: [null, null, null] }
    }
    
    console.log('✅ Produit remis à zéro')
  } catch (error) {
    console.error('❌ Erreur reset:', error)
  }
}

const handleToggleLock = async (productIndex: number) => {
  try {
    const { productType, actualIndex } = getProductInfo(productIndex)
    const currentLocked = lockedProducts.value[productType][actualIndex]
    
    // Déverrouiller tous les autres produits du même type
    lockedProducts.value[productType].forEach((_, index) => {
      if (index !== actualIndex) {
        lockedProducts.value[productType][index] = true
      }
    })
    
    // Basculer le verrou du produit actuel
    lockedProducts.value[productType][actualIndex] = !currentLocked
    
    console.log('✅ Verrou basculé:', !currentLocked)
  } catch (error) {
    console.error('❌ Erreur toggle lock:', error)
  }
}

const toggleProductsSection = () => {
  isProductsSectionOpen.value = !isProductsSectionOpen.value
}

// Helper pour déterminer le type de produit et l'index local
const getProductInfo = (productIndex: number) => {
  if (productIndex < 3) {
    return { productType: 'fonds', actualIndex: productIndex }
  } else if (productIndex < 7) {
    return { productType: 'premiereCoucheDouceur', actualIndex: productIndex - 3 }
  } else if (productIndex < 11) {
    return { productType: 'secondeCoucheDouceur', actualIndex: productIndex - 7 }
  } else {
    return { productType: 'toucheFinale', actualIndex: productIndex - 11 }
  }
}

// Sauvegarder un produit
const saveProduct = async (productType: string, actualIndex: number) => {
  let productData
  let configType
  
  switch (productType) {
    case 'fonds':
      productData = fonds.value[actualIndex]
      configType = 'fonds'
      break
    case 'premiereCoucheDouceur':
      productData = premiereCoucheDouceur.value[actualIndex]
      configType = 'premiere_couche_douceur'
      break
    case 'secondeCoucheDouceur':
      productData = secondeCoucheDouceur.value[actualIndex]
      configType = 'seconde_couche_douceur'
      break
    case 'toucheFinale':
      productData = toucheFinale.value[actualIndex]
      configType = 'touche_finale'
      break
  }
  
  const config = {
    config_type: configType,
    product_index: actualIndex,
    nom: productData.nom,
    images: productType === 'fonds' ? productData.image : productData.images
  }
  
  const result = await productConfigService.upsertProductConfig(config)
  if (!result) {
    throw new Error('Échec de la sauvegarde')
  }
}

// Charger la configuration au montage
onMounted(async () => {
  try {
    const configs = await productConfigService.getAllProductConfig()
    console.log('🔍 Configurations chargées:', configs)
    
    configs.forEach(config => {
      const { config_type, product_index, nom, images } = config
      
      switch (config_type) {
        case 'fonds':
          fonds.value[product_index] = { nom, image: images }
          break
        case 'premiere_couche_douceur':
          premiereCoucheDouceur.value[product_index] = { nom, images }
          break
        case 'seconde_couche_douceur':
          secondeCoucheDouceur.value[product_index] = { nom, images }
          break
        case 'touche_finale':
          toucheFinale.value[product_index] = { nom, images }
          break
      }
    })
  } catch (error) {
    console.error('❌ Erreur chargement config:', error)
  }
})
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
  
  .admin-logout-btn {
    width: 100%;
    justify-content: center;
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
}

</style>

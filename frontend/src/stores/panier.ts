import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from './auth'

interface ProduitPanier {
  id: number
  nom: string
  image: string
  prix: number
  quantite: number
  base: string
  premiereDouceur: string
  secondeDouceur: string
  finition: string
}

export const usePanierStore = defineStore('panier', () => {
  const panier = ref<ProduitPanier[]>([])
  const isPanierOpen = ref(false)
  const authStore = useAuthStore()

  // Computed properties
  const total = computed(() => {
    return panier.value.reduce((sum, item) => sum + (item.prix * item.quantite), 0)
  })

  const nombreArticles = computed(() => {
    return panier.value.reduce((sum, item) => sum + item.quantite, 0)
  })

  // Charger le panier depuis le localStorage
  const chargerPanier = async () => {
    if (!authStore.isLoggedIn) {
      panier.value = []
      return
    }

    const userId = authStore.user?.id
    if (!userId) {
      panier.value = []
      return
    }

    const panierLocal = localStorage.getItem(`panier_${userId}`)
    if (panierLocal) {
      try {
        panier.value = JSON.parse(panierLocal)
      } catch (error) {
        console.error('Erreur lors du chargement du panier local:', error)
        panier.value = []
      }
    } else {
      panier.value = []
    }
  }

  // Sauvegarder le panier
  const sauvegarderPanier = async () => {
    if (!authStore.isLoggedIn || !authStore.user?.id) {
      return
    }

    const userId = authStore.user.id
    localStorage.setItem(`panier_${userId}`, JSON.stringify(panier.value))
  }

  // Ajouter au panier
  const ajouterAuPanier = async (produit: any) => {
    const quantiteMax = 10
    const quantiteDemandee = produit.quantite || 1

    if (quantiteDemandee > quantiteMax) {
      console.warn(`Quantité limitée à ${quantiteMax} par produit`)
      produit.quantite = quantiteMax
    }

    const produitExistant = panier.value.find(item => item.id === produit.id)

    if (produitExistant) {
      const nouvelleQuantite = produitExistant.quantite + produit.quantite
      if (nouvelleQuantite <= quantiteMax) {
        produitExistant.quantite = nouvelleQuantite
      } else {
        produitExistant.quantite = quantiteMax
      }
    } else {
      panier.value.push({
        id: produit.id,
        nom: produit.nom,
        image: produit.image,
        prix: produit.prix,
        quantite: produit.quantite,
        base: produit.base || '',
        premiereDouceur: produit.premiereDouceur || '',
        secondeDouceur: produit.secondeDouceur || '',
        finition: produit.finition || ''
      })
    }

    await sauvegarderPanier()
    return true
  }

  // Supprimer du panier
  const supprimerDuPanier = async (id: number) => {
    const index = panier.value.findIndex(item => item.id === id)
    if (index !== -1) {
      panier.value.splice(index, 1)
      await sauvegarderPanier()
    }
  }

  // Modifier la quantité
  const modifierQuantite = async (id: number, nouvelleQuantite: number) => {
    const item = panier.value.find(item => item.id === id)
    if (item) {
      if (nouvelleQuantite > 0 && nouvelleQuantite <= 10) {
        item.quantite = nouvelleQuantite
        await sauvegarderPanier()
      } else if (nouvelleQuantite <= 0) {
        await supprimerDuPanier(id)
      }
    }
  }

  // Vider le panier
  const viderPanier = async () => {
    panier.value = []
    if (authStore.user?.id) {
      localStorage.removeItem(`panier_${authStore.user.id}`)
    }
  }

  // Ouvrir/fermer le panier
  const ouvrirPanier = () => {
    isPanierOpen.value = true
  }

  const fermerPanier = () => {
    isPanierOpen.value = false
  }

  // Vérifier si un produit est dans le panier
  const estDansPanier = (id: number) => {
    return panier.value.some(item => item.id === id)
  }

  // Obtenir la quantité d'un produit dans le panier
  const getQuantitePanier = (id: number) => {
    const item = panier.value.find(item => item.id === id)
    return item ? item.quantite : 0
  }

  // Écouter les changements du panier pour sauvegarder
  watch(panier, async () => {
    await sauvegarderPanier()
  }, { deep: true })

  // Écouter les changements d'authentification
  watch(() => authStore.isLoggedIn, async (isAuthenticated) => {
    if (isAuthenticated) {
      await chargerPanier()
    } else {
      await viderPanier()
    }
  }, { immediate: true })

  // Écouter les changements d'utilisateur
  watch(() => authStore.user, async (newUser, oldUser) => {
    if (oldUser && newUser && oldUser.id !== newUser.id) {
      await viderPanier()
      if (newUser) {
        await chargerPanier()
      }
    }
  })

  // Charger le panier au démarrage
  chargerPanier()

  return {
    panier,
    isPanierOpen,
    total,
    nombreArticles,
    ajouterAuPanier,
    supprimerDuPanier,
    modifierQuantite,
    viderPanier,
    ouvrirPanier,
    fermerPanier,
    estDansPanier,
    getQuantitePanier,
    chargerPanier
  }
}) 
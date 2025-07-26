import { ref, computed, watch, readonly } from 'vue'

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

const panier = ref<ProduitPanier[]>([])
const isPanierOpen = ref(false)

// Charger le panier depuis localStorage au démarrage
const chargerPanier = () => {
  try {
    const panierSauvegarde = localStorage.getItem('panier')
    if (panierSauvegarde) {
      const panierParse = JSON.parse(panierSauvegarde)
      // Validation des données
      if (Array.isArray(panierParse)) {
        panier.value = panierParse
      } else {
        throw new Error('Format de panier invalide')
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement du panier:', error)
    // Nettoyer le localStorage corrompu
    try {
      localStorage.removeItem('panier')
    } catch (e) {
      console.error('Impossible de nettoyer le localStorage:', e)
    }
    panier.value = []
  }
}

// Sauvegarder le panier dans localStorage avec gestion d'erreurs
const sauvegarderPanier = () => {
  try {
    const panierString = JSON.stringify(panier.value)
    localStorage.setItem('panier', panierString)
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du panier:', error)
    // Essayer de nettoyer l'espace
    try {
      localStorage.clear()
      localStorage.setItem('panier', JSON.stringify(panier.value))
    } catch (e) {
      console.error('Impossible de sauvegarder le panier:', e)
    }
  }
}

// Sauvegarder automatiquement quand le panier change
watch(panier, sauvegarderPanier, { deep: true })

// Calculer le total du panier
const total = computed(() => {
  return panier.value.reduce((sum, item) => sum + (item.prix * item.quantite), 0)
})

// Calculer le nombre total d'articles
const nombreArticles = computed(() => {
  return panier.value.reduce((sum, item) => sum + item.quantite, 0)
})

// Ajouter un produit au panier avec validation
const ajouterAuPanier = (produit: any) => {
  // Validation des données du produit
  if (!produit || !produit.id || !produit.nom) {
    console.error('Données de produit invalides')
    return false
  }

  // Limite de quantité par produit (max 10)
  const quantiteMax = 10
  const quantiteDemandee = produit.quantite || 1
  
  if (quantiteDemandee > quantiteMax) {
    console.warn(`Quantité limitée à ${quantiteMax} par produit`)
    produit.quantite = quantiteMax
  }

  const produitExistant = panier.value.find(item => item.id === produit.id)
  
  if (produitExistant) {
    // Si le produit existe déjà, augmenter la quantité
    const nouvelleQuantite = produitExistant.quantite + produit.quantite
    if (nouvelleQuantite <= quantiteMax) {
      produitExistant.quantite = nouvelleQuantite
    } else {
      produitExistant.quantite = quantiteMax
      console.warn(`Quantité maximale atteinte pour ${produit.nom}`)
    }
  } else {
    // Sinon, ajouter le nouveau produit
    const nouveauProduit: ProduitPanier = {
      id: produit.id,
      nom: produit.nom,
      image: produit.image,
      prix: 6.00, // Prix unique de 6€
      quantite: produit.quantite,
      base: produit.base,
      premiereDouceur: produit.premiereDouceur,
      secondeDouceur: produit.secondeDouceur,
      finition: produit.finition
    }
    panier.value.push(nouveauProduit)
  }
  
  // Forcer la mise à jour de la réactivité
  panier.value = [...panier.value]
  return true
}

// Supprimer un produit du panier
const supprimerDuPanier = (id: number) => {
  const index = panier.value.findIndex(item => item.id === id)
  if (index !== -1) {
    panier.value.splice(index, 1)
  }
}

// Modifier la quantité d'un produit
const modifierQuantite = (id: number, nouvelleQuantite: number) => {
  const produit = panier.value.find(item => item.id === id)
  if (produit) {
    if (nouvelleQuantite <= 0) {
      supprimerDuPanier(id)
    } else {
      produit.quantite = nouvelleQuantite
    }
  }
}

// Vider le panier
const viderPanier = () => {
  panier.value = []
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
  const produit = panier.value.find(item => item.id === id)
  return produit ? produit.quantite : 0
}

// Initialiser le panier au chargement
chargerPanier()

export function usePanier() {
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
    getQuantitePanier
  }
} 
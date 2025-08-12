import { supabase } from './supabaseService'

export interface ProductConfig {
  id: string
  config_type: 'fonds' | 'premiere_couche_douceur' | 'seconde_couche_douceur' | 'touche_finale'
  product_index: number
  nom: string
  images: string[]
  created_at: string
  updated_at: string
}

export interface Fond {
  id: string
  nom: string
  image: string
}

export interface Garniture {
  id: string
  nom: string
  images: string[]
}

export interface Finition {
  id: string
  nom: string
  images: string[]
}

export interface ProductComposition {
  fonds: Fond[]
  premiereCoucheDouceur: Garniture[]
  secondeCoucheDouceur: Garniture[]
  toucheFinale: Finition[]
}

class ProductService {
  private cache: ProductComposition | null = null
  private lastFetch: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  /**
   * Récupère la configuration complète des produits depuis Supabase
   */
  async getProductConfiguration(): Promise<ProductComposition> {
    // Vérifier le cache
    if (this.cache && (Date.now() - this.lastFetch) < this.CACHE_DURATION) {
      return this.cache
    }

    try {
      const { data, error } = await supabase
        .from('product_config')
        .select('*')
        .order('config_type, product_index')

      if (error) {
        console.error('Erreur lors de la récupération de la configuration:', error)
        throw error
      }

      // Transformer les données en structure utilisable
      const config = this.transformConfigData(data || [])
      
      // Mettre en cache
      this.cache = config
      this.lastFetch = Date.now()
      
      return config
    } catch (error) {
      console.error('Erreur dans getProductConfiguration:', error)
      // Retourner une configuration par défaut en cas d'erreur
      return this.getDefaultConfiguration()
    }
  }

  /**
   * Transforme les données brutes de Supabase en structure utilisable
   */
  private transformConfigData(data: ProductConfig[]): ProductComposition {
    const fonds: Fond[] = []
    const premiereCoucheDouceur: Garniture[] = []
    const secondeCoucheDouceur: Garniture[] = []
    const toucheFinale: Finition[] = []

    data.forEach(item => {
      const product = {
        id: item.id,
        nom: item.nom,
        images: item.images || []
      }

      switch (item.config_type) {
        case 'fonds':
          fonds.push({
            ...product,
            image: item.images[0] || '' // Le premier élément est l'image principale
          })
          break
        case 'premiere_couche_douceur':
          premiereCoucheDouceur.push(product)
          break
        case 'seconde_couche_douceur':
          secondeCoucheDouceur.push(product)
          break
        case 'touche_finale':
          toucheFinale.push(product)
          break
      }
    })

    return {
      fonds,
      premiereCoucheDouceur,
      secondeCoucheDouceur,
      toucheFinale
    }
  }

  /**
   * Configuration par défaut en cas d'erreur
   */
  private getDefaultConfiguration(): ProductComposition {
    return {
      fonds: [
        { id: 'default-1', nom: 'Pâte sucrée vanille', image: '' },
        { id: 'default-2', nom: 'Pâte sucrée chocolat', image: '' },
        { id: 'default-3', nom: 'Pâte sucrée framboise', image: '' }
      ],
      premiereCoucheDouceur: [
        { id: 'default-1', nom: 'Crème pâtissière vanille', images: [] },
        { id: 'default-2', nom: 'Crème pâtissière chocolat', images: [] },
        { id: 'default-3', nom: 'Crème pâtissière framboise', images: [] },
        { id: 'default-4', nom: 'Crème pâtissière fraise', images: [] }
      ],
      secondeCoucheDouceur: [
        { id: 'default-1', nom: 'Ganache chocolat noir', images: [] },
        { id: 'default-2', nom: 'Mousse chocolat au lait', images: [] },
        { id: 'default-3', nom: 'Crème d\'amandes', images: [] },
        { id: 'default-4', nom: 'Fruit frais de saison', images: [] }
      ],
      toucheFinale: [
        { id: 'default-1', nom: 'Meringue italienne', images: [] },
        { id: 'default-2', nom: 'Meringue chantilly', images: [] },
        { id: 'default-3', nom: 'Glaçage miroir', images: [] },
        { id: 'default-4', nom: 'Décors chocolat', images: [] }
      ]
    }
  }

  /**
   * Met à jour la configuration d'un produit
   */
  async updateProductConfig(
    configType: ProductConfig['config_type'],
    productIndex: number,
    nom: string,
    images: string[]
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('product_config')
        .upsert({
          config_type: configType,
          product_index: productIndex,
          nom,
          images
        })

      if (error) {
        console.error('Erreur lors de la mise à jour:', error)
        return false
      }

      // Invalider le cache
      this.cache = null
      
      return true
    } catch (error) {
      console.error('Erreur dans updateProductConfig:', error)
      return false
    }
  }

  /**
   * Vide le cache pour forcer un rechargement
   */
  clearCache(): void {
    this.cache = null
    this.lastFetch = 0
  }

  /**
   * Récupère une image spécifique pour une combinaison fond + garniture
   */
  getGarnitureImage(fond: Fond | null, garniture: Garniture | null): string {
    if (!fond || !garniture) return ''
    
    // Chercher l'image correspondante dans les images de la garniture
    // Pour l'instant, on retourne la première image disponible
    return garniture.images[0] || ''
  }
}

export const productService = new ProductService()

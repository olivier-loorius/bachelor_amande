import { supabase } from './supabaseService'

// Interface pour la configuration des produits
export interface ProductConfig {
  id?: string
  config_type: 'fonds' | 'premiere_couche_douceur' | 'seconde_couche_douceur' | 'touche_finale'
  product_index: number
  nom: string
  images: string[]
  created_by?: string
  created_at?: string
  updated_at?: string
}

// Service pour la configuration des produits
export const productConfigService = {
  // Récupérer toute la configuration des produits
  async getAllProductConfig(): Promise<ProductConfig[]> {
    try {
      const { data, error } = await supabase
        .from('product_config')
        .select('*')
        .order('config_type, product_index')

      if (error) {
        console.error('Erreur lors de la récupération de la configuration:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération de la configuration:', error)
      return []
    }
  },

  // Récupérer la configuration par type
  async getProductConfigByType(configType: ProductConfig['config_type']): Promise<ProductConfig[]> {
    try {
      const { data, error } = await supabase
        .from('product_config')
        .select('*')
        .eq('config_type', configType)
        .order('product_index')

      if (error) {
        console.error(`Erreur lors de la récupération de la configuration ${configType}:`, error)
        return []
      }

      return data || []
    } catch (error) {
      console.error(`Erreur lors de la récupération de la configuration ${configType}:`, error)
      return []
    }
  },

  // Créer ou mettre à jour une configuration de produit
  async upsertProductConfig(config: ProductConfig): Promise<ProductConfig | null> {
    try {
      const { data, error } = await supabase
        .from('product_config')
        .upsert(config, {
          onConflict: 'config_type,product_index'
        })
        .select()
        .single()

      if (error) {
        console.error('Erreur lors de la sauvegarde de la configuration:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la configuration:', error)
      return null
    }
  },

  // Supprimer une configuration de produit
  async deleteProductConfig(configType: string, productIndex: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('product_config')
        .delete()
        .eq('config_type', configType)
        .eq('product_index', productIndex)

      if (error) {
        console.error('Erreur lors de la suppression de la configuration:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de la configuration:', error)
      return false
    }
  },

  // Initialiser la configuration par défaut (vide)
  async initializeDefaultConfig(): Promise<boolean> {
    try {
      const defaultConfigs: Omit<ProductConfig, 'id' | 'created_at' | 'updated_at'>[] = [
        // Étape 1: Fonds de base (3 produits)
        { config_type: 'fonds', product_index: 0, nom: '', images: [] },
        { config_type: 'fonds', product_index: 1, nom: '', images: [] },
        { config_type: 'fonds', product_index: 2, nom: '', images: [] },
        
        // Étape 2: Première couche de douceur (4 produits)
        { config_type: 'premiere_couche_douceur', product_index: 0, nom: '', images: [] },
        { config_type: 'premiere_couche_douceur', product_index: 1, nom: '', images: [] },
        { config_type: 'premiere_couche_douceur', product_index: 2, nom: '', images: [] },
        { config_type: 'premiere_couche_douceur', product_index: 3, nom: '', images: [] },
        
        // Étape 3: Seconde couche de douceur (4 produits)
        { config_type: 'seconde_couche_douceur', product_index: 0, nom: '', images: [] },
        { config_type: 'seconde_couche_douceur', product_index: 1, nom: '', images: [] },
        { config_type: 'seconde_couche_douceur', product_index: 2, nom: '', images: [] },
        { config_type: 'seconde_couche_douceur', product_index: 3, nom: '', images: [] },
        
        // Étape 4: La touche finale (4 produits)
        { config_type: 'touche_finale', product_index: 0, nom: '', images: [] },
        { config_type: 'touche_finale', product_index: 1, nom: '', images: [] },
        { config_type: 'touche_finale', product_index: 2, nom: '', images: [] },
        { config_type: 'touche_finale', product_index: 3, nom: '', images: [] }
      ]

      const { error } = await supabase
        .from('product_config')
        .insert(defaultConfigs)

      if (error) {
        console.error('Erreur lors de l\'initialisation de la configuration:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la configuration:', error)
      return false
    }
  }
}

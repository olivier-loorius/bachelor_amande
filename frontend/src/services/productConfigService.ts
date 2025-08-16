import { supabase } from './supabaseService'

// Interface pour la configuration des produits
export interface ProductConfig {
  id?: string
  config_type: 'fonds' | 'premiere_couche_douceur' | 'seconde_couche_douceur' | 'touche_finale'
  product_index: number
  nom: string
  images: string[]
  locked?: boolean
  created_by?: string
  created_at?: string
  updated_at?: string
}

// Service pour la configuration des produits
export const productConfigService = {
  // Upload d'une image vers Supabase Storage
  async uploadImage(file: File, configType: string, productIndex: number, imageIndex?: number): Promise<string | null> {
    try {
      // Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop()
      const fileName = `${configType}_${productIndex}_${imageIndex || 0}_${Date.now()}.${fileExt}`
      
      // Upload vers le bucket 'product-images'
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Erreur lors de l\'upload de l\'image:', error)
        return null
      }

      // Récupérer l'URL publique de l'image
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error)
      return null
    }
  },

  // Supprimer une image de Supabase Storage
  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Extraire le nom du fichier de l'URL
      const fileName = imageUrl.split('/').pop()?.split('?')[0]
      if (!fileName) return false

      const { error } = await supabase.storage
        .from('product-images')
        .remove([fileName])

      if (error) {
        console.error('Erreur lors de la suppression de l\'image:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error)
      return false
    }
  },

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
      console.log('🚀 upsertProductConfig appelé avec:', config)
      console.log('📊 Type de config.images:', typeof config.images, Array.isArray(config.images))
      console.log('📊 Contenu de config.images:', config.images)
      
      const { data, error } = await supabase
        .from('product_config')
        .upsert(config, {
          onConflict: 'config_type,product_index'
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Erreur lors de la sauvegarde de la configuration:', error)
        console.error('❌ Détails de l\'erreur:', error.details, error.hint)
        return null
      }

      console.log('✅ Configuration sauvegardée avec succès:', data)
      return data
    } catch (error) {
      console.error('❌ Exception lors de la sauvegarde de la configuration:', error)
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

  // Mettre à jour l'état de verrouillage d'un produit
  async updateProductLock(configType: string, productIndex: number, locked: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('product_config')
        .update({ locked })
        .eq('config_type', configType)
        .eq('product_index', productIndex)

      if (error) {
        console.error('Erreur lors de la mise à jour du verrouillage:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Erreur lors de la mise à jour du verrouillage:', error)
      return false
    }
  },

  // Initialiser la configuration par défaut (vide)
  async initializeDefaultConfig(): Promise<boolean> {
    try {
      console.log('🔄 Initialisation de la configuration par défaut...')
      
      const defaultConfigs: Omit<ProductConfig, 'id' | 'created_at' | 'updated_at'>[] = [
        { config_type: 'fonds', product_index: 0, nom: '', images: [], locked: true },
        { config_type: 'fonds', product_index: 1, nom: '', images: [], locked: true },
        { config_type: 'fonds', product_index: 2, nom: '', images: [], locked: true },
        
        { config_type: 'premiere_couche_douceur', product_index: 0, nom: '', images: [], locked: true },
        { config_type: 'premiere_couche_douceur', product_index: 1, nom: '', images: [], locked: true },
        { config_type: 'premiere_couche_douceur', product_index: 2, nom: '', images: [], locked: true },
        { config_type: 'premiere_couche_douceur', product_index: 3, nom: '', images: [], locked: true },
        
        { config_type: 'seconde_couche_douceur', product_index: 0, nom: '', images: [], locked: true },
        { config_type: 'seconde_couche_douceur', product_index: 1, nom: '', images: [], locked: true },
        { config_type: 'seconde_couche_douceur', product_index: 2, nom: '', images: [], locked: true },
        { config_type: 'seconde_couche_douceur', product_index: 3, nom: '', images: [], locked: true },
        
        { config_type: 'touche_finale', product_index: 0, nom: '', images: [], locked: true },
        { config_type: 'touche_finale', product_index: 1, nom: '', images: [], locked: true },
        { config_type: 'touche_finale', product_index: 2, nom: '', images: [], locked: true },
        { config_type: 'touche_finale', product_index: 3, nom: '', images: [], locked: true }
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
  },

  // Fonction de test pour le système de verrouillage
  async testLocking(): Promise<boolean> {
    try {
      // Tester la mise à jour du verrouillage d'un produit
      const success = await this.updateProductLock('fonds', 0, true)
      if (success) {
        // Remettre à l'état initial
        await this.updateProductLock('fonds', 0, false)
        return true
      }
      return false
    } catch (error) {
      console.error('Erreur lors du test du verrouillage:', error)
      return false
    }
  }
}

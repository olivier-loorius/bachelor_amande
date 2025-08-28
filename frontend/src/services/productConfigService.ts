import { supabase } from './supabaseService'

// Types pour la nouvelle structure robuste
export interface Product {
  id: string
  nom: string
  locked: boolean
  step: 'fonds' | 'premiereCoucheDouceur' | 'secondeCoucheDouceur' | 'toucheFinale'
  images: string[]
  created_at?: string
}

export interface ProductWithImages {
  id: string
  nom: string
  locked: boolean
  step: string
  created_at: string
  images: string[]
}

// Service refactorisé pour la nouvelle structure
export const productConfigService = {
  // Récupérer tous les produits avec leurs images
  async getAllProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products_with_images')
        .select('*')
        .order('created_at', { ascending: true }) // Correction ici

      if (error) throw error

      // Transformer les données pour correspondre à l'interface Product
      return (data || []).map(item => ({
        id: item.id,
        nom: item.nom,
        locked: item.locked,
        step: item.step as Product['step'],
        images: item.images || []
      }))
    } catch (error) {
      console.error('❌ Erreur récupération produits:', error)
      return []
    }
  },

  // Récupérer les produits par étape
  async getProductsByStep(step: Product['step']): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products_with_images')
        .select('*')
        .eq('step', step)
        .order('created_at', { ascending: true }) // Correction ici

      if (error) throw error

      return (data || []).map(item => ({
        id: item.id,
        nom: item.nom,
        locked: item.locked,
        step: item.step as Product['step'],
        images: item.images || []
      }))
    } catch (error) {
      console.error(`❌ Erreur récupération produits ${step}:`, error)
      return []
    }
  },

  // Créer ou mettre à jour un produit avec ses images
  async upsertProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<string | null> {
    try {
      const { nom, locked, step, images } = product

      // ✅ CORRECTION : Vérifier si le produit existe déjà
      const existingProducts = await this.getProductsByStep(step as Product['step'])
      const existingProduct = existingProducts.find(p => p.nom === nom)

      if (existingProduct) {
        // ✅ Mettre à jour le produit existant
        console.log('🔄 Produit existant trouvé, mise à jour...')
        const success = await this.updateProduct(existingProduct.id, {
          nom,
          locked,
          step: step as Product['step'],
          images
        })
        
        if (success) {
          console.log('✅ Produit mis à jour avec succès')
          return existingProduct.id
        } else {
          throw new Error('Échec de la mise à jour')
        }
      } else {
        // ✅ Créer un nouveau produit
        console.log('🆕 Nouveau produit, création...')
        const { data, error } = await supabase
          .rpc('insert_product_with_images', {
            p_nom: nom,
            p_step: step,
            p_images: images,
            p_locked: locked
          })

        if (error) throw error

        console.log('✅ Nouveau produit créé avec succès')
        return data
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde produit:', error)
      return null
    }
  },

  // Mettre à jour un produit existant
  async updateProduct(productId: string, updates: Partial<Product>): Promise<boolean> {
    try {
      const { nom, locked, step, images } = updates

      if (nom !== undefined || locked !== undefined || step !== undefined) {
        // Mettre à jour les propriétés du produit
        const { error: productError } = await supabase
          .from('products')
          .update({ 
            nom: nom || undefined, 
            locked: locked !== undefined ? locked : undefined,
            step: step || undefined 
          })
          .eq('id', productId)

        if (productError) throw productError
      }

      // Mettre à jour les images si fournies
      if (images !== undefined) {
        // Supprimer les anciennes images
        const { error: deleteError } = await supabase
          .from('product_images')
          .delete()
          .eq('product_id', productId)

        if (deleteError) throw deleteError

        // Insérer les nouvelles images
        if (images.length > 0) {
          const imageRecords = images
            .filter(url => url && url !== '')
            .map((url, index) => ({
              product_id: productId,
              url,
              image_index: index
            }))

          if (imageRecords.length > 0) {
            const { error: insertError } = await supabase
              .from('product_images')
              .insert(imageRecords)

            if (insertError) throw insertError
          }
        }
      }

      console.log('✅ Produit mis à jour avec succès')
      return true
    } catch (error) {
      console.error('❌ Erreur mise à jour produit:', error)
      return false
    }
  },

  // Supprimer un produit et ses images
  async deleteProduct(productId: string): Promise<boolean> {
    try {
      console.log('🗑️ Suppression du produit:', productId)
      
      // Récupérer d'abord le produit pour avoir ses images
      const product = await this.getProductById(productId)
      
      if (product && product.images.length > 0) {
        console.log('🗑️ Suppression des images du storage:', product.images)
        
        // Supprimer les images du storage
        for (const imageUrl of product.images) {
          try {
            // Extraire le chemin du fichier de l'URL
            const urlParts = imageUrl.split('/')
            const fileName = urlParts[urlParts.length - 1]
            const filePath = `products/${fileName}`
            
            console.log('🗑️ Suppression du fichier:', filePath)
            
            const { error: storageError } = await supabase.storage
              .from('product-images')
              .remove([filePath])
            
            if (storageError) {
              console.warn('⚠️ Erreur suppression fichier storage:', storageError)
            } else {
              console.log('✅ Fichier supprimé du storage:', filePath)
            }
          } catch (storageError) {
            console.warn('⚠️ Erreur lors de la suppression du fichier:', storageError)
          }
        }
      }
      
      // La suppression en cascade supprimera automatiquement les images de la table product_images
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      console.log('✅ Produit supprimé avec succès de Supabase')
      return true
    } catch (error) {
      console.error('❌ Erreur suppression produit:', error)
      return false
    }
  },

  // Upload d'image (fonction existante conservée)
  async uploadImage(file: File, productType: string, productIndex: number, imageIndex: number): Promise<string | null> {
    try {
      const fileName = `${productType}_${productIndex}_${imageIndex}_${Date.now()}.jpg`
      const filePath = `products/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      console.log('✅ Image uploadée:', publicUrl)
      return publicUrl
    } catch (error) {
      console.error('❌ Erreur upload image:', error)
      return null
    }
  },

  // Récupérer un produit par ID
  async getProductById(productId: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products_with_images')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) throw error

      return {
        id: data.id,
        nom: data.nom,
        locked: data.locked,
        step: data.step as Product['step'],
        images: data.images || []
      }
    } catch (error) {
      console.error('❌ Erreur récupération produit:', error)
      return null
    }
  },

  // Mettre à jour le verrouillage d'un produit
  async updateProductLock(step: string, productIndex: number, locked: boolean): Promise<boolean> {
    try {
      const products = await this.getProductsByStep(step as Product['step'])
      if (products[productIndex]) {
        return await this.updateProduct(products[productIndex].id, { locked })
      }
      return false
    } catch (error) {
      console.error('❌ Erreur mise à jour verrouillage:', error)
      return false
    }
  },

  // Créer ou mettre à jour une configuration de produit
  async upsertProductConfig(config: any): Promise<boolean> {
    try {
      const { config_type, product_index, nom, images } = config
      
      // Vérifier si le produit existe déjà
      const existingProducts = await this.getProductsByStep(config_type)
      const existingProduct = existingProducts[product_index]
      
      if (existingProduct) {
        // Mettre à jour le produit existant
        return await this.updateProduct(existingProduct.id, { nom, images })
      } else {
        // Créer un nouveau produit
        const productId = await this.upsertProduct({
          nom,
          locked: false,
          step: config_type,
          images
        })
        return productId !== null
      }
    } catch (error) {
      console.error('❌ Erreur upsert config:', error)
      return false
    }
  },

  // Supprimer une image
  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Extraire le chemin du fichier de l'URL
      const urlParts = imageUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const filePath = `products/${fileName}`
      
      console.log('🗑️ Suppression du fichier:', filePath)
      
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove([filePath])
      
      if (storageError) {
        console.warn('⚠️ Erreur suppression fichier storage:', storageError)
        return false
      } else {
        console.log('✅ Fichier supprimé du storage:', filePath)
        return true
      }
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du fichier:', error)
      return false
    }
  },

  // Nettoyer les produits dupliqués (garder seulement le plus récent de chaque nom)
  async cleanDuplicateProducts(): Promise<boolean> {
    try {
      console.log('🧹 Nettoyage des produits dupliqués...')
      
      // Récupérer tous les produits
      const allProducts = await this.getAllProducts()
      
      // Grouper par nom et étape
      const groupedProducts = new Map<string, Product[]>()
      
      allProducts.forEach(product => {
        const key = `${product.step}_${product.nom}`
        if (!groupedProducts.has(key)) {
          groupedProducts.set(key, [])
        }
        groupedProducts.get(key)!.push(product)
      })
      
      // Supprimer les doublons (garder seulement le plus récent)
      let deletedCount = 0
      
      for (const [key, products] of groupedProducts) {
        if (products.length > 1) {
          // Trier par created_at (le plus récent en premier)
          products.sort((a, b) => {
            const dateA = new Date(a.created_at || '1970-01-01')
            const dateB = new Date(b.created_at || '1970-01-01')
            return dateB.getTime() - dateA.getTime()
          })
          
          // Supprimer tous sauf le premier (le plus récent)
          const productsToDelete = products.slice(1)
          
          for (const productToDelete of productsToDelete) {
            console.log(`🗑️ Suppression du doublon: ${productToDelete.nom} (${productToDelete.step})`)
            await this.deleteProduct(productToDelete.id)
            deletedCount++
          }
        }
      }
      
      console.log(`✅ Nettoyage terminé: ${deletedCount} doublons supprimés`)
      return true
    } catch (error) {
      console.error('❌ Erreur nettoyage doublons:', error)
      return false
    }
  }
}

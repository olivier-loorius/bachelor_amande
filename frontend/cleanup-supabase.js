// Script de nettoyage des données Supabase
// À exécuter pour avoir un dashboard vide comme pour une première utilisation

import { createClient } from '@supabase/supabase-js'

// Remplacer par vos vraies clés Supabase
const supabaseUrl = 'VOTRE_URL_SUPABASE'
const supabaseKey = 'VOTRE_CLE_SUPABASE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function cleanupSupabase() {
  try {
    console.log('🧹 Début du nettoyage des données Supabase...')
    
    // Supprimer toutes les données de la table products (si elle existe)
    const { error: productsError } = await supabase
      .from('products')
      .delete()
      .neq('id', 0) // Supprimer tous les enregistrements
    
    if (productsError) {
      console.log('ℹ️ Table products non trouvée ou déjà vide')
    } else {
      console.log('✅ Table products nettoyée')
    }
    
    // Supprimer toutes les données de la table product_configs (si elle existe)
    const { error: configsError } = await supabase
      .from('product_configs')
      .delete()
      .neq('id', 0)
    
    if (configsError) {
      console.log('ℹ️ Table product_configs non trouvée ou déjà vide')
    } else {
      console.log('✅ Table product_configs nettoyée')
    }
    
    // Supprimer toutes les données de la table fonds (si elle existe)
    const { error: fondsError } = await supabase
      .from('fonds')
      .delete()
      .neq('id', 0)
    
    if (fondsError) {
      console.log('ℹ️ Table fonds non trouvée ou déjà vide')
    } else {
      console.log('✅ Table fonds nettoyée')
    }
    
    // Nettoyer le localStorage du navigateur
    console.log('🧹 Nettoyage du localStorage...')
    localStorage.removeItem('amande_product_config')
    console.log('✅ localStorage nettoyé')
    
    console.log('🎉 Nettoyage terminé ! Dashboard prêt pour une première utilisation.')
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
  }
}

// Exécuter le nettoyage
cleanupSupabase()



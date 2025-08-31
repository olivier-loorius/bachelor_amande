// Script pour vérifier la structure de la table products
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'VITE_SUPABASE_URL'
const supabaseKey = 'VITE_SUPABASE_ANON_KEY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTableStructure() {
  console.log('🔍 Vérification de la structure de la table products...')
  
  // Vérifier les colonnes
  const { data: columns, error: columnsError } = await supabase
    .from('products')
    .select('*')
    .limit(1)
  
  if (columnsError) {
    console.error('❌ Erreur colonnes:', columnsError)
    return
  }
  
  console.log('📋 Colonnes disponibles:', Object.keys(columns[0] || {}))
  
  // Vérifier les données existantes
  const { data: allData, error: dataError } = await supabase
    .from('products')
    .select('*')
  
  if (dataError) {
    console.error('❌ Erreur données:', dataError)
    return
  }
  
  console.log('📊 Données existantes:', allData)
  console.log('🔢 Nombre total de produits:', allData.length)
  
  // Vérifier product_index
  const withIndex = allData.filter(p => p.product_index !== null && p.product_index !== undefined)
  console.log('✅ Produits avec product_index:', withIndex.length)
  console.log('❌ Produits SANS product_index:', allData.length - withIndex.length)
}

checkTableStructure()

#!/usr/bin/env node

/**
 * Script de test pour vérifier la synchronisation des produits
 * Usage: node scripts/test-product-sync.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testProductSync() {
  console.log('🧪 Test de synchronisation des produits...\n')

  try {
    // 1. Vérifier la structure de la table
    console.log('1️⃣ Vérification de la structure de la table...')
    const { data: tableInfo, error: tableError } = await supabase
      .from('product_config')
      .select('*')
      .limit(1)

    if (tableError) {
      console.error('❌ Erreur lors de la vérification de la table:', tableError)
      return
    }

    console.log('✅ Table product_config accessible\n')

    // 2. Compter les produits par type
    console.log('2️⃣ Comptage des produits par type...')
    const { data: countData, error: countError } = await supabase
      .from('product_config')
      .select('config_type')
      .order('config_type')

    if (countError) {
      console.error('❌ Erreur lors du comptage:', countError)
      return
    }

    const counts = countData.reduce((acc, item) => {
      acc[item.config_type] = (acc[item.config_type] || 0) + 1
      return acc
    }, {})

    console.log('📊 Répartition des produits:')
    Object.entries(counts).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} produits`)
    })
    console.log()

    // 3. Vérifier la configuration des fonds
    console.log('3️⃣ Vérification de la configuration des fonds...')
    const { data: fonds, error: fondsError } = await supabase
      .from('product_config')
      .select('*')
      .eq('config_type', 'fonds')
      .order('product_index')

    if (fondsError) {
      console.error('❌ Erreur lors de la récupération des fonds:', fondsError)
      return
    }

    console.log('🏗️ Fonds configurés:')
    fonds.forEach(fond => {
      const status = fond.images && fond.images.length > 0 ? '🖼️' : '❌'
      console.log(`   ${status} ${fond.nom} (index: ${fond.product_index})`)
    })
    console.log()

    // 4. Vérifier la configuration des douceurs
    console.log('4️⃣ Vérification de la configuration des douceurs...')
    const { data: douceurs, error: douceursError } = await supabase
      .from('product_config')
      .select('*')
      .in('config_type', ['premiere_couche_douceur', 'seconde_couche_douceur'])
      .order('config_type, product_index')

    if (douceursError) {
      console.error('❌ Erreur lors de la récupération des douceurs:', douceursError)
      return
    }

    console.log('🍰 Douceurs configurées:')
    douceurs.forEach(douceur => {
      const imageCount = douceur.images ? douceur.images.length : 0
      const status = imageCount >= 3 ? '✅' : '⚠️'
      console.log(`   ${status} ${douceur.nom} (${imageCount}/3 images)`)
    })
    console.log()

    // 5. Vérifier la configuration des finitions
    console.log('5️⃣ Vérification de la configuration des finitions...')
    const { data: finitions, error: finitionsError } = await supabase
      .from('product_config')
      .select('*')
      .eq('config_type', 'touche_finale')
      .order('product_index')

    if (finitionsError) {
      console.error('❌ Erreur lors de la récupération des finitions:', finitionsError)
      return
    }

    console.log('🎨 Finitions configurées:')
    finitions.forEach(finition => {
      const imageCount = finition.images ? finition.images.length : 0
      const status = imageCount >= 3 ? '✅' : '⚠️'
      console.log(`   ${status} ${finition.nom} (${imageCount}/3 images)`)
    })
    console.log()

    // 6. Résumé global
    console.log('📋 Résumé global:')
    const totalProducts = Object.values(counts).reduce((a, b) => a + b, 0)
    console.log(`   Total des produits: ${totalProducts}`)
    
    const configuredProducts = countData.filter(item => 
      item.images && item.images.length > 0
    ).length
    
    console.log(`   Produits configurés: ${configuredProducts}/${totalProducts}`)
    console.log(`   Taux de configuration: ${Math.round((configuredProducts / totalProducts) * 100)}%`)

    if (configuredProducts === totalProducts) {
      console.log('\n🎉 Tous les produits sont configurés !')
    } else {
      console.log('\n⚠️ Certains produits nécessitent encore une configuration')
      console.log('   Utilisez le dashboard admin pour compléter la configuration')
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

// Exécuter le test
testProductSync()
  .then(() => {
    console.log('\n✨ Test terminé')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  })

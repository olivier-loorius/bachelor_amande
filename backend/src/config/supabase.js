
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

// Configuration des variables d'environnement
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validation des variables d'environnement requises
const validateEnvironment = () => {
  const errors = [];
  
  if (!supabaseUrl) {
    errors.push('SUPABASE_URL manquante');
  } else if (!supabaseUrl.startsWith('https://')) {
    errors.push('SUPABASE_URL doit commencer par https://');
  }
  
  if (!supabaseAnonKey) {
    errors.push('SUPABASE_ANON_KEY manquante');
  } else if (supabaseAnonKey.length < 50) {
    errors.push('SUPABASE_ANON_KEY semble trop courte');
  }
  
  if (errors.length > 0) {
    console.error('❌ Configuration Supabase invalide:');
    errors.forEach(error => console.error(`   - ${error}`));
    console.error('\n📝 Créez un fichier .env à la racine avec:');
    console.error('SUPABASE_URL=https://votre-projet.supabase.co');
    console.error('SUPABASE_ANON_KEY=votre_cle_anonyme');
    console.error('SUPABASE_SERVICE_ROLE_KEY=votre_cle_service (optionnel)');
    process.exit(1);
  }
};

// Validation au démarrage
validateEnvironment();

// Création des clients Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  }
});

const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
        detectSessionInUrl: false
      }
    })
  : supabase;

// Test de connexion simple (sans accès aux tables)
const testConnection = async () => {
  try {
    // Test simple de la connexion sans accès aux données
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erreur de connexion Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Connexion Supabase établie');
    return true;
  } catch (error) {
    console.error('❌ Erreur de test de connexion:', error.message);
    return false;
  }
};

// Test de connexion au démarrage
testConnection();

console.log('✅ Configuration Supabase chargée');
console.log('🔑 Service Role Key:', supabaseServiceKey ? 'Présent' : 'Manquant');
console.log('🌐 URL:', supabaseUrl);

module.exports = {
  supabase,
  supabaseAdmin,
  testConnection
}; 
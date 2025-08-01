const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Vérification des variables d'environnement
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes!');
  console.error('📝 Créez un fichier .env à la racine du projet avec:');
  console.error('SUPABASE_URL=votre_url_supabase');
  console.error('SUPABASE_ANON_KEY=votre_clé_anon');
  console.error('SUPABASE_SERVICE_ROLE_KEY=votre_clé_service (optionnel)');
  process.exit(1);
}

// Client Supabase pour les opérations publiques
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client Supabase pour les opérations admin (service role)
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase; // Fallback sur le client public si pas de service key

console.log('✅ Configuration Supabase chargée');

module.exports = {
  supabase,
  supabaseAdmin
}; 
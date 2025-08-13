
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes!');
  console.error('📝 Créez un fichier .env à la racine du projet avec:');
  console.error('SUPABASE_URL=votre_url_supabase');
  console.error('SUPABASE_ANON_KEY=votre_clé_anon');
  console.error('SUPABASE_SERVICE_ROLE_KEY=votre_clé_service (optionnel)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

console.log('✅ Configuration Supabase chargée');
console.log('🔑 Service Role Key:', supabaseServiceKey ? 'Présent' : 'Manquant');

module.exports = {
  supabase,
  supabaseAdmin
}; 
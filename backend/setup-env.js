const fs = require('fs');
const path = require('path');

console.log('🔧 Configuration des variables d\'environnement Supabase');
console.log('');

// Vérifier si le fichier .env existe déjà
const envPath = path.join(__dirname, '..', '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ Fichier .env trouvé à la racine du projet');
  console.log('📝 Vérifiez que les variables Supabase sont configurées:');
  console.log('   - SUPABASE_URL');
  console.log('   - SUPABASE_ANON_KEY');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY (optionnel)');
} else {
  console.log('❌ Fichier .env non trouvé');
  console.log('');
  console.log('📝 Créez un fichier .env à la racine du projet avec:');
  console.log('');
  console.log('# Configuration Supabase');
  console.log('SUPABASE_URL=https://your-project-id.supabase.co');
  console.log('SUPABASE_ANON_KEY=your-anon-key-here');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here');
  console.log('');
  console.log('# Configuration du serveur');
  console.log('PORT=3000');
  console.log('NODE_ENV=development');
  console.log('');
  console.log('🔗 Obtenez ces valeurs depuis votre dashboard Supabase');
}

console.log('');
console.log('🚀 Une fois configuré, lancez: npm run dev'); 
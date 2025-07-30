#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Démarrage du projet Amande...\n');

// Fonction pour démarrer un processus
function startProcess(name, command, args, cwd) {
  console.log(`📦 Démarrage de ${name}...`);
  
  const process = spawn(command, args, {
    cwd: path.resolve(__dirname, '..', cwd),
    stdio: 'pipe',
    shell: true
  });

  process.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });

  process.stderr.on('data', (data) => {
    console.error(`[${name}] ERREUR: ${data.toString().trim()}`);
  });

  process.on('close', (code) => {
    console.log(`[${name}] Processus terminé avec le code ${code}`);
  });

  return process;
}

// Démarrer le backend
const backend = startProcess('Backend', 'npm', ['run', 'dev'], 'backend');

// Attendre un peu puis démarrer le frontend
setTimeout(() => {
  const frontend = startProcess('Frontend', 'npm', ['run', 'dev'], 'frontend');
  
  console.log('\n✅ Projet démarré !');
  console.log('🌐 Frontend: http://localhost:5174');
  console.log('🔧 Backend: http://localhost:3000');
  console.log('\n💡 Appuyez sur Ctrl+C pour arrêter tous les processus\n');
  
  // Gestion de l'arrêt propre
  process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt des processus...');
    backend.kill('SIGINT');
    frontend.kill('SIGINT');
    process.exit(0);
  });
  
}, 2000); 
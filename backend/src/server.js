const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Configuration des variables d'environnement
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de base
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route de santé de l'API
app.get('/health', (req, res) => {
  res.json({ 
    message: 'API Amande Backend', 
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes API
app.use('/api/cart', require('./routes/cart'));
app.use('/api/users', require('./routes/users'));

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.stack);
  
  // Ne pas exposer les détails d'erreur en production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: isDevelopment ? err.message : 'Une erreur est survenue',
    ...(isDevelopment && { stack: err.stack })
  });
});

// Route 404 pour les chemins non trouvés
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method
  });
});

// Démarrage du serveur avec gestion d'erreurs
const server = app.listen(PORT, () => {
  console.log('🚀 Serveur Amande démarré');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
  console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5174'}`);
  console.log(`⏰ Démarrage: ${new Date().toLocaleString('fr-FR')}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} déjà utilisé`);
    console.log(`💡 Utilisez: PORT=${PORT + 1} npm start`);
    process.exit(1);
  } else {
    console.error('❌ Erreur de démarrage:', err.message);
    process.exit(1);
  }
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('🛑 Arrêt gracieux du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Arrêt par Ctrl+C...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

module.exports = app; 
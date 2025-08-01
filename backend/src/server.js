const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement depuis la racine du projet
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes de base
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Amande Backend', 
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Route pour forcer le rafraîchissement
app.get('/refresh', (req, res) => {
  res.json({ 
    message: 'Page rafraîchie',
    timestamp: new Date().toISOString(),
    refresh: true
  });
});

// Test route simple
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

// Routes API
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/users', require('./routes/users'));

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur Amande démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
  console.log(`🔗 Frontend: http://localhost:5174`);
});

module.exports = app; 
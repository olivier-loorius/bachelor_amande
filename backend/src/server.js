const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

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
    status: 'running'
  });
});

// Test route simple
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

// Routes API - temporairement commentées pour debug
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/products', require('./routes/products'));
// app.use('/api/cart', require('./routes/cart'));

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
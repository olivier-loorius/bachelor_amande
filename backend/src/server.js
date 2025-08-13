const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'API Amande Backend', 
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/refresh', (req, res) => {
  res.json({ 
    message: 'Page rafraîchie',
    timestamp: new Date().toISOString(),
    refresh: true
  });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});


app.use('/api/cart', require('./routes/cart'));
app.use('/api/users', require('./routes/users'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur Amande démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
  console.log(`🔗 Frontend: http://localhost:5174`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} déjà utilisé. Essayez un autre port.`);
    console.log(`💡 Vous pouvez définir un port différent avec: PORT=3002 npm start`);
    process.exit(1);
  } else {
    console.error('❌ Erreur lors du démarrage du serveur:', err);
    process.exit(1);
  }
});

module.exports = app; 
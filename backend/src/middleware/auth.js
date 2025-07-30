const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');

// Middleware pour vérifier l'authentification
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token d\'accès requis' });
  }

  try {
    // Vérifier le token avec Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(403).json({ error: 'Token invalide' });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(403).json({ error: 'Token invalide' });
  }
};

// Middleware pour vérifier les rôles (optionnel)
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    // Vérifier le rôle de l'utilisateur
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Permissions insuffisantes' });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole
}; 
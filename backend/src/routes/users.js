const express = require('express');
const { supabase, supabaseAdmin } = require('../config/supabase');

const router = express.Router();

// Validation des données utilisateur
const validateUserData = (data) => {
  const errors = [];
  
  if (!data.email || !data.email.includes('@')) {
    errors.push('Email invalide');
  }
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Nom doit contenir au moins 2 caractères');
  }
  
  if (data.role && !['user', 'admin'].includes(data.role)) {
    errors.push('Rôle invalide');
  }
  
  return errors;
};

// GET /api/users - Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return res.status(400).json({ 
        error: 'Erreur de récupération des utilisateurs',
        details: error.message 
      });
    }

    console.log(`✅ ${data?.length || 0} utilisateurs récupérés`);
    res.json({ 
      users: data || [],
      count: data?.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({ 
      error: 'Erreur interne lors de la récupération des utilisateurs' 
    });
  }
});

// POST /api/users - Créer un nouvel utilisateur
router.post('/', async (req, res) => {
  try {
    const { email, name, role = 'user' } = req.body;
    
    // Validation des données
    const validationErrors = validateUserData({ email, name, role });
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: 'Données invalides',
        details: validationErrors 
      });
    }
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, name, role }])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur création utilisateur:', error);
      return res.status(400).json({ 
        error: 'Erreur lors de la création',
        details: error.message 
      });
    }

    console.log(`✅ Utilisateur créé: ${data.email}`);
    res.status(201).json({ 
      user: data,
      message: 'Utilisateur créé avec succès'
    });
    
  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({ 
      error: 'Erreur interne lors de la création de l\'utilisateur' 
    });
  }
});

// POST /api/users/delete-account - Supprimer un compte (soft delete)
router.post('/delete-account', async (req, res) => {
  try {
    console.log('🔍 Début de la suppression de compte...');
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token d\'authentification manquant',
        message: 'Ajoutez le header Authorization: Bearer <token>' 
      });
    }

    const token = authHeader.substring(7);
    console.log('🔑 Token extrait:', token.substring(0, 20) + '...');

    // Vérification de l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('❌ Erreur d\'authentification:', authError);
      return res.status(401).json({ 
        error: 'Token d\'authentification invalide',
        message: 'Veuillez vous reconnecter' 
      });
    }

    console.log(`✅ Utilisateur authentifié: ${user.email} (${user.id})`);

    // Mise à jour du statut (soft delete)
    const { error } = await supabaseAdmin
      .from('users')
      .update({ 
        deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error('❌ Erreur mise à jour:', error);
      return res.status(500).json({ 
        error: 'Erreur lors de la suppression',
        details: error.message 
      });
    }

    console.log('✅ Compte supprimé pour:', user.email);

    res.json({ 
      success: true, 
      message: 'Compte supprimé avec succès',
      userId: user.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({ 
      error: 'Erreur interne lors de la suppression du compte',
      message: 'Veuillez réessayer plus tard'
    });
  }
});

module.exports = router; 
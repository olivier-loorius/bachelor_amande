const express = require('express');
const { supabase } = require('../config/supabase');

const router = express.Router();

// GET /api/cart - Récupérer tous les paniers
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur Supabase cart:', error);
      return res.status(400).json({ 
        error: 'Erreur de récupération des paniers',
        details: error.message 
      });
    }

    console.log(`✅ ${data?.length || 0} éléments de panier récupérés`);
    res.json({ 
      items: data || [],
      count: data?.length || 0,
      message: 'Paniers récupérés avec succès',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur serveur cart:', error);
    res.status(500).json({ 
      error: 'Erreur interne lors de la récupération des paniers',
      message: 'Veuillez réessayer plus tard'
    });
  }
});

// GET /api/cart/:userId - Récupérer le panier d'un utilisateur spécifique
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        error: 'ID utilisateur manquant',
        message: 'Spécifiez un ID utilisateur valide' 
      });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur Supabase cart utilisateur:', error);
      return res.status(400).json({ 
        error: 'Erreur de récupération du panier',
        details: error.message 
      });
    }

    console.log(`✅ Panier récupéré pour l'utilisateur ${userId}: ${data?.length || 0} éléments`);
    res.json({ 
      items: data || [],
      count: data?.length || 0,
      userId,
      message: 'Panier utilisateur récupéré avec succès',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur serveur cart utilisateur:', error);
    res.status(500).json({ 
      error: 'Erreur interne lors de la récupération du panier',
      message: 'Veuillez réessayer plus tard'
    });
  }
});

module.exports = router; 
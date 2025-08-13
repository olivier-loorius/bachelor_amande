const express = require('express');
const { supabase } = require('../config/supabase');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (*)
      `);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      items: data,
      message: 'Tous les paniers récupérés'
    });

  } catch (error) {
    console.error('Erreur de récupération des paniers:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des paniers' });
  }
});

module.exports = router; 
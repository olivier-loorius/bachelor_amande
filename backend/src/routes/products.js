const express = require('express');
const { supabase } = require('../config/supabase');

const router = express.Router();

// Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log(`📦 ${data?.length || 0} produits récupérés`);
    res.json({ products: data || [] });

  } catch (error) {
    console.error('Erreur de récupération des produits:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

// Ajouter un produit (pour test)
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price, category }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ product: data });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});

// Rechercher des produits
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ products: data });

  } catch (error) {
    console.error('Erreur de recherche:', error);
    res.status(500).json({ error: 'Erreur lors de la recherche' });
  }
});

// Récupérer un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.json({ product: data });

  } catch (error) {
    console.error('Erreur de récupération du produit:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
});

module.exports = router; 
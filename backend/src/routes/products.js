const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Récupérer tous les produits
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ products: data });

  } catch (error) {
    console.error('Erreur de récupération des produits:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
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

// Créer un nouveau produit (admin seulement)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, category, image_url, ingredients } = req.body;

    // Validation des données
    if (!name || !description || !price || !category) {
      return res.status(400).json({ 
        error: 'Nom, description, prix et catégorie sont requis' 
      });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          description,
          price,
          category,
          image_url,
          ingredients,
          created_by: req.user.id
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ 
      message: 'Produit créé avec succès',
      product: data 
    });

  } catch (error) {
    console.error('Erreur de création du produit:', error);
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});

// Mettre à jour un produit (admin seulement)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url, ingredients } = req.body;

    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        description,
        price,
        category,
        image_url,
        ingredients,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: 'Produit mis à jour avec succès',
      product: data 
    });

  } catch (error) {
    console.error('Erreur de mise à jour du produit:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
  }
});

// Supprimer un produit (admin seulement)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Produit supprimé avec succès' });

  } catch (error) {
    console.error('Erreur de suppression du produit:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
  }
});

module.exports = router; 
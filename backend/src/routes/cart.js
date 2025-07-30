const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Récupérer le panier de l'utilisateur
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Calculer le total
    const total = data.reduce((sum, item) => {
      return sum + (item.quantity * item.products.price);
    }, 0);

    res.json({ 
      items: data,
      total: total
    });

  } catch (error) {
    console.error('Erreur de récupération du panier:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du panier' });
  }
});

// Ajouter un produit au panier
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'ID du produit requis' });
    }

    // Vérifier si le produit existe déjà dans le panier
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .single();

    if (existingItem) {
      // Mettre à jour la quantité
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.json({ 
        message: 'Quantité mise à jour dans le panier',
        item: data 
      });
    }

    // Ajouter un nouvel item
    const { data, error } = await supabase
      .from('cart_items')
      .insert([
        {
          user_id: req.user.id,
          product_id,
          quantity
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ 
      message: 'Produit ajouté au panier',
      item: data 
    });

  } catch (error) {
    console.error('Erreur d\'ajout au panier:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout au panier' });
  }
});

// Mettre à jour la quantité d'un produit
router.put('/update/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      // Supprimer l'item si la quantité est 0 ou négative
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user.id);

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.json({ message: 'Produit supprimé du panier' });
    }

    // Mettre à jour la quantité
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: 'Quantité mise à jour',
      item: data 
    });

  } catch (error) {
    console.error('Erreur de mise à jour du panier:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du panier' });
  }
});

// Supprimer un produit du panier
router.delete('/remove/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Produit supprimé du panier' });

  } catch (error) {
    console.error('Erreur de suppression du panier:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du panier' });
  }
});

// Vider le panier
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', req.user.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Panier vidé' });

  } catch (error) {
    console.error('Erreur de vidage du panier:', error);
    res.status(500).json({ error: 'Erreur lors du vidage du panier' });
  }
});

module.exports = router; 
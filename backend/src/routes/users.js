const express = require('express');
const { supabase } = require('../config/supabase');

const router = express.Router();

// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log(`👥 ${data?.length || 0} utilisateurs récupérés`);
    res.json({ users: data || [] });

  } catch (error) {
    console.error('Erreur de récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Ajouter un utilisateur (pour test)
router.post('/', async (req, res) => {
  try {
    const { email, name, role = 'user' } = req.body;
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, name, role }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ user: data });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
});

module.exports = router; 
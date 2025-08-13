const express = require('express');
const { supabase, supabaseAdmin } = require('../config/supabase');

const router = express.Router();

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

router.post('/delete-account', async (req, res) => {
  try {
    console.log('🔍 Début du soft delete...');
    
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    const token = authHeader.substring(7);
    console.log('🔑 Token extrait:', token.substring(0, 20) + '...');

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Token d\'authentification invalide' });
    }

    console.log(`✅ Utilisateur authentifié: ${user.email} (${user.id})`);

    console.log('🗑️ Update simple...');
    
    const { error } = await supabaseAdmin
      .from('users')
      .update({ 
        deleted: true,
        deleted_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error('❌ Erreur update:', error);
      return res.status(500).json({ error: 'Erreur lors du marquage: ' + error.message });
    }

    console.log('✅ Update réussi pour:', user.email);

    res.json({ 
      success: true, 
      message: 'Compte marqué comme supprimé',
      userId: user.id 
    });

  } catch (error) {
    console.error('❌ Exception:', error);
    res.status(500).json({ error: 'Erreur serveur: ' + error.message });
  }
});

module.exports = router; 
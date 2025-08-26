// Import
const express = require("express");
const { supabase, supabaseAdmin } = require("../config/supabase");

const router = express.Router();

// Vérifie données utilisateur
const validateUserData = (data) => {
  const errors = [];
  if (!data.email || !data.email.includes("@")) {
    errors.push("Email invalide");
  }
  if (!data.name || !data.name.trim().length < 2) {
    errors.push("Nom doit contenir au moins 2 caractères");
  }
  if (data.role && !["user", "admin"].includes(data.role)) {
    errors.push("Rôle invalide");
  }
  return errors;
};

// Route pour récupérer tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("❌ Erreur Supabase:", error);
      return res.status(400).json({
        error: "Erreur de récupération des utilisateurs",
        details: error.message,
      });
    }
    console.log(`✅ ${data?.length || 0} utilisateurs récupérés`);
    res.json({
      users: data || [],
      count: data?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Erreur serveur:", error);
    res.status(500).json({
      error: "Erreur interne lors de la récupération des utilisateurs",
    });
  }
});

// Route pour créer un nouvel utilisateur
router.post("/", async (req, res) => {
  try {
    const { email, name, role = "user" } = req.body;
    const validationErrors = validateUserData({ email, name, role });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Données invalides",
        details: validationErrors,
      });
    }
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, name, role }])
      .select()
      .single();
    if (error) {
      console.error("❌ Erreur création utilisateur:", error);
      return res.status(400).json({
        error: "Erreur lors de la création",
        details: error.message,
      });
    }
    console.log(`✅ Utilisateur créé: ${data.email}`);
    res.status(201).json({
      user: data,
      message: "Utilisateur créé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur serveur:", error);
    res.status(500).json({
      error: "Erreur interne lors de la création de l'utilisateur",
    });
  }
});

// Route pour supprimer le compte d'un utilisateur
router.post("/delete-account", async (req, res) => {
  try {
    console.log("🔍 Début de la suppression de compte...");
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Token d'authentification manquant",
        message: "Ajoutez le header Authorization: Bearer <token>",
      });
    }
    const token = authHeader.substring(7);
    console.log("🔑 Token extrait:", token.substring(0, 20) + "...");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error("❌ Erreur d'authentification:", authError);
      return res.status(401).json({
        error: "Token d'authentification invalide",
        message: "Veuillez vous reconnecter",
      });
    }
    console.log(`✅ Utilisateur authentifié: ${user.email} (${user.id})`);
    const { error } = await supabaseAdmin
      .from("users")
      .update({
        deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    if (error) {
      console.error("❌ Erreur mise à jour:", error);
      return res.status(500).json({
        error: "Erreur lors de la suppression",
        details: error.message,
      });
    }
    console.log("✅ Compte supprimé pour:", user.email);
    res.json({
      success: true,
      message: "Compte supprimé avec succès",
      userId: user.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Erreur serveur:", error);
    res.status(500).json({
      error: "Erreur interne lors de la suppression du compte",
      message: "Veuillez réessayer plus tard",
    });
  }
});

module.exports = router;

// Ce fichier gère les routes Express pour les utilisateurs :

// Il crée un routeur Express dédié aux opérations sur les utilisateurs.
// Il contient une fonction pour valider les données utilisateur.
// Trois routes principales sont définies :
// GET / : récupère tous les utilisateurs depuis Supabase.
// POST / : crée un nouvel utilisateur après validation des données.
// POST /delete-account : supprime (désactive) le compte d’un utilisateur authentifié via un token.
// Chaque route interroge Supabase, gère les erreurs et renvoie une réponse structurée.
// Le routeur est exporté pour être utilisé dans l’application principale.
// Import
const express = require("express");
const { supabase } = require("../config/supabase");

// Routeur Express pour les routes panier
const router = express.Router();

// Fonction pour formater la réponse du panier
function sendCartResponse(res, data, message, userId) {
  res.json({
    items: data || [],
    count: data?.length || 0,
    ...(userId && { userId }),
    message,
    timestamp: new Date().toISOString(),
  });
}

// Route pour récupérer tous les paniers
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        products (*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur Supabase cart:", error);
      return res.status(400).json({
        error: "Erreur de récupération des paniers",
        details: error.message,
      });
    }

    console.log(`Panier global récupéré (${data?.length || 0} éléments)`);
    sendCartResponse(res, data, "Paniers récupérés avec succès");
  } catch (error) {
    console.error("Erreur serveur cart:", error);
    res.status(500).json({
      error: "Erreur interne lors de la récupération des paniers",
      message: "Veuillez réessayer plus tard",
    });
  }
});

// Route pour récupérer le panier d'un utilisateur spécifique
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        error: "ID utilisateur manquant",
        message: "Spécifiez un ID utilisateur valide",
      });
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        products (*)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur Supabase cart utilisateur:", error);
      return res.status(400).json({
        error: "Erreur de récupération du panier",
        details: error.message,
      });
    }

    console.log(
      `Panier récupéré pour l'utilisateur ${userId} (${data?.length || 0} éléments)`
    );
    sendCartResponse(
      res,
      data,
      "Panier utilisateur récupéré avec succès",
      userId
    );
  } catch (error) {
    console.error("Erreur serveur cart utilisateur:", error);
    res.status(500).json({
      error: "Erreur interne lors de la récupération du panier",
      message: "Veuillez réessayer plus tard",
    });
  }
});

module.exports = router;


// Il importe les modules nécessaires et crée un routeur Express.
// Il contient une fonction utilitaire pour formater la réponse du panier.
// Deux routes principales sont présentes :
// GET / : récupère tous les paniers (tous les items).
// GET /:userId : récupère le panier d’un utilisateur spécifique.
// Chaque route interroge Supabase, gère les erreurs et renvoie une réponse structurée.
// Le routeur est exporté pour être utilisé dans l’application principale

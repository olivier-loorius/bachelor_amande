// Import
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Chargement des variables d'env
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Création de l'application Express et définition du port
const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Route pour vérifier l'état de l'API
app.get("/health", (req, res) => {
  res.json({
    message: "API Amande Backend",
    version: "1.0.0",
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Déclaration routes principales de l'API
app.use("/api/cart", require("./routes/cart"));
app.use("/api/users", require("./routes/users"));

// Gestionnaire d'erreurs 
app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur:", err.stack);
  const isDevelopment = process.env.NODE_ENV === "development";
  res.status(500).json({
    error: "Erreur interne du serveur",
    message: isDevelopment ? err.message : "Une erreur est survenue",
    ...(isDevelopment && { stack: err.stack }),
  });
});

// Route 404 
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    path: req.originalUrl,
    method: req.method,
  });
});

// Démarrage serveur et gestion  erreurs
const server = app
  .listen(PORT, () => {
    console.log("🚀 Serveur Amande démarré");
    console.log(`📡 Port: ${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}`);
    console.log(
      `🌐 Frontend: ${process.env.FRONTEND_URL || "http://localhost:5174"}`
    );
    console.log(`⏰ Démarrage: ${new Date().toLocaleString("fr-FR")}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} déjà utilisé`);
      console.log(`💡 Utilisez: PORT=${PORT + 1} npm start`);
      process.exit(1);
    } else {
      console.error("❌ Erreur de démarrage:", err.message);
      process.exit(1);
    }
  });

// Gestion de l'arrêt du serveur (SIGTERM et SIGINT)
process.on("SIGTERM", () => {
  console.log("🛑 Arrêt gracieux du serveur...");
  server.close(() => {
    console.log("✅ Serveur arrêté proprement");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🛑 Arrêt par Ctrl+C...");
  server.close(() => {
    console.log("✅ Serveur arrêté proprement");
    process.exit(0);
  });
});

module.exports = app;

// Ce fichier est le point d’entrée principal du backend Express :

// Il initialise l’application Express et configure les middlewares (CORS, parsers JSON/URL).
// Il charge les variables d’environnement pour la configuration.
// Il expose une route /health pour vérifier l’état de l’API.
// Il déclare les routes principales /api/cart et /api/users pour gérer le panier et les utilisateurs.
// Il gère les erreurs globales et les routes non trouvées (404).
// Il démarre le serveur sur le port défini et affiche des informations de démarrage.
// Il gère l’arrêt propre du serveur lors des signaux SIGTERM et SIGINT.
// Il exporte l’application Express pour utilisation ailleurs.
// Utilité :
// Ce fichier structure et lance le serveur backend, centralise la configuration des routes et la gestion des erreurs, et assure la robustesse du démarrage/arrêt du service.

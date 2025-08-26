# Backend Amande – Fonctionnement & Utilité

## À quoi sert ce backend ?

Ce backend gère toute la logique serveur pour l’application Amande :

- Il reçoit les requêtes du frontend (site web).
- Il communique avec Supabase pour stocker et récupérer les données (utilisateurs, paniers).
- Il sécurise les échanges et gère les erreurs.

## Comment ça marche avec le frontend ?

- Le frontend (Vue.js) envoie des requêtes HTTP à ce backend (ex : création d’utilisateur, ajout au panier).
- Le backend traite la demande, interroge Supabase si besoin, puis renvoie la réponse au frontend.
- Les routes principales sont :
  - `/api/users` pour les utilisateurs
  - `/api/cart` pour les paniers

## Comment ça marche avec Supabase ?

- Supabase sert de base de données et d’authentification.
- Le backend utilise les clés Supabase pour accéder aux données.
- Toutes les opérations (CRUD) passent par Supabase.

## Technologies utilisées et pourquoi :

- **Node.js** : rapide, moderne, idéal pour les API.
- **Express.js** : simplifie la création de routes et la gestion des requêtes.
- **Supabase** : facilite la gestion des données et l’authentification sans serveur complexe.
- **CORS** : autorise le frontend à communiquer avec le backend.
- **dotenv** : permet de garder les clés et infos sensibles dans un fichier `.env`.

## Fonctionnement général :

1. Le serveur démarre et charge la configuration.
2. Il expose des routes pour le frontend.
3. Il vérifie la santé de l’API via `/health`.
4. Il gère les erreurs et les routes inconnues.
5. Il s’arrête proprement en cas de signal système.

## Pourquoi cette architecture ?

- Séparation claire entre le frontend (Vue) et le backend (Express).
- Sécurité : validation des données, gestion des tokens, CORS.
- Facilité de maintenance et d’évolution.
- Utilisation de Supabase pour éviter de gérer une base de données complexe soi-même.

## Exemple de flux :

1. Un utilisateur s’inscrit sur le site → le frontend envoie la requête à `/api/users`.
2. Le backend valide les données, crée l’utilisateur dans Supabase, et renvoie la réponse.
3. L’utilisateur ajoute un produit au panier → le frontend envoie la requête à `/api/cart`.
4. Le backend enregistre le panier dans Supabase et confirme au frontend.

## Structure des fichiers :

```
backend/
├── src/
│   ├── server.js        # Point d’entrée du serveur
│   ├── routes/
│   │   ├── users.js     # Routes utilisateurs
│   │   └── cart.js      # Routes paniers
│   └── config/
│       └── supabase.js  # Connexion Supabase
├── package.json         # Dépendances et scripts
└── README.md            # Documentation
```

## Pour démarrer :

1. Installer Node.js et npm.
2. Créer un fichier `.env` avec les clés Supabase et la config serveur.
3. Installer les dépendances : `npm install`
4. Lancer le serveur : `npm run dev` (développement) ou `npm start` (production).

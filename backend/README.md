# 🚀 Backend Amande - API

Backend API pour **Amande - L'art de la tartelette** - Gestion des utilisateurs et paniers.

## 📋 Fonctionnalités

- **Gestion des utilisateurs** : CRUD complet avec Supabase
- **Gestion des paniers** : Récupération des paniers utilisateur
- **Authentification** : Intégration avec Supabase Auth
- **API RESTful** : Endpoints standards et documentés

## 🛠️ Technologies

- **Node.js** (>=18.0.0)
- **Express.js** - Framework web
- **Supabase** - Backend-as-a-Service
- **CORS** - Gestion des origines
- **dotenv** - Variables d'environnement

## 🚀 Installation

### Prérequis
- Node.js >= 18.0.0
- npm ou yarn
- Compte Supabase

### 1. Installation des dépendances
```bash
cd backend
npm install
```

### 2. Configuration des variables d'environnement
Créez un fichier `.env` à la racine du projet :

```env
# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_anonyme
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service

# Serveur
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5174
```

### 3. Démarrage
```bash
# Développement (avec nodemon)
npm run dev

# Production
npm start

# Nettoyage complet
npm run clean
```

## 📡 API Endpoints

### 🔐 Utilisateurs

#### `GET /api/users`
Récupère tous les utilisateurs.

**Réponse :**
```json
{
  "users": [...],
  "count": 5,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### `POST /api/users`
Crée un nouvel utilisateur.

**Body :**
```json
{
  "email": "user@example.com",
  "name": "Nom Utilisateur",
  "role": "user"
}
```

#### `POST /api/users/delete-account`
Supprime un compte utilisateur (soft delete).

**Headers :**
```
Authorization: Bearer <token>
```

### 🛒 Paniers

#### `GET /api/cart`
Récupère tous les paniers.

#### `GET /api/cart/:userId`
Récupère le panier d'un utilisateur spécifique.

## 🔧 Scripts NPM

- `npm start` - Démarre le serveur en production
- `npm run dev` - Démarre le serveur en développement avec nodemon
- `npm run clean` - Nettoie et réinstalle les dépendances
- `npm run setup` - Configure l'environnement

## 🚨 Gestion des Erreurs

Le backend inclut une gestion d'erreurs robuste :

- **Validation des données** : Vérification des entrées utilisateur
- **Gestion des erreurs Supabase** : Traitement des erreurs de base de données
- **Logs structurés** : Console avec emojis et informations détaillées
- **Réponses d'erreur** : Messages d'erreur clairs et informatifs

## 🔒 Sécurité

- **CORS configuré** : Origines autorisées uniquement
- **Validation des tokens** : Authentification requise pour les actions sensibles
- **Limites de taille** : Limitation des requêtes à 10MB
- **Gestion gracieuse** : Arrêt propre du serveur

## 📊 Monitoring

- **Route de santé** : `/health` pour vérifier l'état de l'API
- **Logs détaillés** : Console avec informations de démarrage et d'erreur
- **Gestion des signaux** : Arrêt gracieux sur SIGTERM/SIGINT

## 🐛 Résolution des Problèmes

### Erreur "Port déjà utilisé"
```bash
PORT=3002 npm start
```

### Erreur de connexion Supabase
- Vérifiez vos variables d'environnement
- Assurez-vous que votre projet Supabase est actif
- Vérifiez vos clés d'API

### Nettoyage complet
```bash
npm run clean
```

## 📝 Structure des Fichiers

```
backend/
├── src/
│   ├── server.js          # Serveur principal
│   ├── routes/            # Routes API
│   │   ├── users.js       # Gestion des utilisateurs
│   │   └── cart.js        # Gestion des paniers
│   └── config/            # Configuration
│       └── supabase.js    # Configuration Supabase
├── package.json           # Dépendances et scripts
├── nodemon.json          # Configuration nodemon
└── README.md             # Documentation
```

## 🤝 Contribution

1. Respectez la structure existante
2. Ajoutez des logs avec emojis
3. Gérez les erreurs proprement
4. Documentez les nouvelles fonctionnalités

## 📄 Licence

ISC - Voir `package.json` pour plus de détails.

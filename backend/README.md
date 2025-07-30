# Backend API - Amande

Backend Express.js avec Supabase pour l'application Amande - L'art de la tartelette.

## 🚀 Installation

```bash
npm install
```

## 📝 Configuration

Créez un fichier `.env` à la racine du projet :

```env
# Configuration Supabase
SUPABASE_URL=https://dofpvppwvaladogvgozi.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://postgres:password@db.url:5432/postgres
PORT=3000
JWT_SECRET=your_jwt_secret
```

## 🏃‍♂️ Démarrage

### Développement
```bash
npm run dev
```

### Production
```bash
npm start
```

## 📡 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/profile` - Profil utilisateur

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)
- `GET /api/products/search/:query` - Rechercher des produits

### Panier
- `GET /api/cart` - Récupérer le panier
- `POST /api/cart/add` - Ajouter au panier
- `PUT /api/cart/update/:id` - Modifier quantité
- `DELETE /api/cart/remove/:id` - Supprimer du panier
- `DELETE /api/cart/clear` - Vider le panier

## 🗄️ Structure de la base de données

### Tables Supabase

#### `products`
- `id` (uuid, primary key)
- `name` (text)
- `description` (text)
- `price` (decimal)
- `category` (text)
- `image_url` (text)
- `ingredients` (jsonb)
- `created_by` (uuid, foreign key)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `cart_items`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `product_id` (uuid, foreign key)
- `quantity` (integer)
- `created_at` (timestamp)

## 🔐 Authentification

L'API utilise Supabase Auth avec JWT. Les tokens sont vérifiés via le middleware `authenticateToken`.

### Headers requis pour les routes protégées :
```
Authorization: Bearer <token>
```

## 🛠️ Technologies utilisées

- **Express.js** - Framework web
- **Supabase** - Base de données et authentification
- **bcryptjs** - Hashage des mots de passe
- **jsonwebtoken** - Gestion des tokens JWT
- **cors** - Gestion des CORS
- **dotenv** - Variables d'environnement

## 📁 Structure du projet

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── cart.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

## 🔗 Frontend

Le frontend Vue.js est configuré pour communiquer avec cette API sur `http://localhost:3000`. 
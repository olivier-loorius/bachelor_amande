# 🔧 Backend - Express.js + Supabase

## 🏗️ Architecture

### Structure des dossiers

```
backend/
├── 📂 src/
│   ├── 📂 routes/              # Routes API
│   │   ├── 📂 auth/           # Routes d'authentification
│   │   ├── 📂 products/       # Routes des produits
│   │   ├── 📂 cart/           # Routes du panier
│   │   └── 📂 orders/         # Routes des commandes
│   ├── 📂 controllers/         # Contrôleurs métier
│   │   ├── 📂 auth/           # Contrôleurs d'auth
│   │   ├── 📂 products/       # Contrôleurs produits
│   │   ├── 📂 cart/           # Contrôleurs panier
│   │   └── 📂 orders/         # Contrôleurs commandes
│   ├── 📂 middleware/          # Middlewares
│   │   ├── 📂 auth/           # Middlewares d'authentification
│   │   ├── 📂 validation/     # Middlewares de validation
│   │   └── 📂 error/          # Middlewares d'erreur
│   ├── 📂 config/             # Configuration
│   │   ├── 📂 database/       # Configuration DB
│   │   ├── 📂 auth/           # Configuration auth
│   │   └── 📂 cors/           # Configuration CORS
│   ├── 📂 utils/              # Utilitaires
│   │   ├── 📂 helpers/        # Fonctions utilitaires
│   │   ├── 📂 validators/     # Validateurs
│   │   └── 📂 constants/      # Constantes
│   └── 📂 types/              # Types TypeScript
├── 📂 docs/                   # Documentation API
├── 📂 tests/                  # Tests unitaires
└── 📂 scripts/                # Scripts utilitaires
```

## 🔐 Authentification

### Routes d'authentification (`routes/auth/`)
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Mise à jour profil
- `POST /api/auth/refresh` - Rafraîchir token

### Middlewares d'authentification (`middleware/auth/`)
- `authenticateToken.js` - Vérification JWT
- `requireRole.js` - Vérification des rôles
- `rateLimit.js` - Limitation de débit

## 🍰 Produits

### Routes des produits (`routes/products/`)
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `GET /api/products/search` - Recherche de produits
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

### Contrôleurs produits (`controllers/products/`)
- `getProducts.js` - Récupération des produits
- `getProductById.js` - Récupération par ID
- `searchProducts.js` - Recherche de produits
- `createProduct.js` - Création de produit
- `updateProduct.js` - Mise à jour de produit
- `deleteProduct.js` - Suppression de produit

## 🛒 Panier

### Routes du panier (`routes/cart/`)
- `GET /api/cart` - Récupérer le panier
- `POST /api/cart/add` - Ajouter au panier
- `PUT /api/cart/update/:id` - Modifier quantité
- `DELETE /api/cart/remove/:id` - Supprimer du panier
- `DELETE /api/cart/clear` - Vider le panier

### Contrôleurs panier (`controllers/cart/`)
- `getCart.js` - Récupération du panier
- `addToCart.js` - Ajout au panier
- `updateCartItem.js` - Mise à jour d'un item
- `removeFromCart.js` - Suppression d'un item
- `clearCart.js` - Vidage du panier

## 📦 Commandes

### Routes des commandes (`routes/orders/`)
- `GET /api/orders` - Liste des commandes
- `GET /api/orders/:id` - Détails d'une commande
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id/status` - Mettre à jour le statut

## 🗄️ Base de données

### Tables Supabase

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  role VARCHAR DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `products`
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR,
  image_url VARCHAR,
  ingredients JSONB,
  is_available BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `cart_items`
```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `orders`
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR DEFAULT 'pending',
  items JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 Configuration

### Variables d'environnement (`.env`)
```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5174
```

## 🧪 Tests

### Structure des tests
```
tests/
├── 📂 unit/                   # Tests unitaires
│   ├── 📂 controllers/        # Tests des contrôleurs
│   ├── 📂 middleware/         # Tests des middlewares
│   └── 📂 utils/              # Tests des utilitaires
├── 📂 integration/            # Tests d'intégration
│   ├── 📂 routes/             # Tests des routes
│   └── 📂 database/           # Tests de base de données
└── 📂 fixtures/               # Données de test
```

### Scripts de test
```bash
# Tests unitaires
npm run test:unit

# Tests d'intégration
npm run test:integration

# Tests complets
npm run test

# Couverture de code
npm run test:coverage
```

## 📚 Documentation API

### Swagger/OpenAPI
- Documentation automatique des routes
- Exemples de requêtes/réponses
- Schémas de validation
- Tests interactifs

### Postman Collection
- Collection complète des endpoints
- Variables d'environnement
- Tests automatisés
- Documentation détaillée

## 🚀 Scripts disponibles

```bash
# Développement
npm run dev

# Production
npm start

# Tests
npm run test

# Linting
npm run lint

# Build
npm run build
```

## 🔒 Sécurité

### Middlewares de sécurité
- Validation des données
- Sanitisation des inputs
- Protection CSRF
- Rate limiting
- Headers de sécurité

### Authentification
- JWT tokens
- Refresh tokens
- Rôles et permissions
- Session management 
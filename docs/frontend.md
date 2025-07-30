# 📱 Frontend - Vue.js

## 🏗️ Architecture

### Structure des dossiers

```
frontend/
├── 📂 src/
│   ├── 📂 components/          # Composants réutilisables
│   │   ├── 📂 auth/           # Composants d'authentification
│   │   ├── 📂 cart/           # Composants du panier
│   │   ├── 📂 layout/         # Composants de mise en page
│   │   └── 📂 ui/             # Composants UI génériques
│   ├── 📂 views/              # Pages de l'application
│   ├── 📂 stores/             # Gestion d'état (Pinia)
│   ├── 📂 services/           # Services API
│   ├── 📂 assets/             # Ressources statiques
│   │   ├── 📂 images/         # Images
│   │   └── 📂 styles/         # Styles SCSS
│   └── 📂 router/             # Configuration des routes
├── 📂 public/                 # Fichiers publics
└── 📂 docs/                   # Documentation spécifique
```

## 🎨 Composants

### Composants d'authentification (`components/auth/`)
- `LoginPanel.vue` - Panneau de connexion
- `RegisterPanel.vue` - Panneau d'inscription
- `LoginPromptModal.vue` - Modal de demande de connexion
- `LogoutModal.vue` - Modal de déconnexion

### Composants du panier (`components/cart/`)
- `CartPanel.vue` - Panneau du panier
- `CartIndicator.vue` - Indicateur du panier
- `CartAnimation.vue` - Animations du panier
- `AddToCartModal.vue` - Modal d'ajout au panier

### Composants de mise en page (`components/layout/`)
- `Navbar.vue` - Barre de navigation
- `Footer.vue` - Pied de page
- `ScrollToTop.vue` - Bouton retour en haut

### Composants UI (`components/ui/`)
- `Button.vue` - Boutons réutilisables
- `Modal.vue` - Modales génériques
- `Card.vue` - Cartes de produits
- `Loading.vue` - Indicateurs de chargement

## 📄 Pages (Views)

### Pages principales
- `HomeView.vue` - Page d'accueil
- `CatalogueView.vue` - Catalogue des produits
- `ComposerView.vue` - Composition de tartelette
- `Panier.vue` - Page du panier

### Pages d'authentification
- `LoginView.vue` - Page de connexion
- `RegisterView.vue` - Page d'inscription

### Pages d'information
- `ActualiteView.vue` - Actualités
- `ContactView.vue` - Contact
- `CGVView.vue` - Conditions générales
- `MentionsLegales.vue` - Mentions légales

### Pages utilitaires
- `ErrorView.vue` - Page d'erreur
- `ConstructionView.vue` - Page en construction

## 🗂️ Stores (Pinia)

### Store d'authentification (`stores/auth.ts`)
```typescript
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}
```

### Store du panier (`stores/panier.ts`)
```typescript
interface CartState {
  items: CartItem[]
  total: number
  isOpen: boolean
}
```

## 🔧 Services

### Service API (`services/dataService.ts`)
- Gestion des appels API
- Configuration des headers
- Gestion des erreurs

### Service JWT (`services/jwtService.ts`)
- Gestion des tokens
- Stockage local
- Vérification d'authentification

## 🎨 Styles

### Organisation SCSS
- `main.scss` - Fichier principal (variables + styles globaux)
- Variables CSS personnalisées
- Utilitaires et animations
- Responsive design

### Conventions de style
- Utilisation de CSS Variables
- Classes utilitaires
- Animations fluides
- Design mobile-first

## 🚀 Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Tests
npm run test

# Linting
npm run lint
```

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Composants adaptatifs
- Navigation mobile/desktop
- Grilles flexibles
- Images responsives
- Modales adaptatives

## 🔗 Intégration Backend

### Configuration API
- URL de base configurable
- Headers d'authentification
- Gestion des erreurs réseau
- Retry automatique

### État de chargement
- Indicateurs de chargement
- États de succès/erreur
- Messages utilisateur
- Animations de transition 
# PRÉSENTATION PROJET AMANDE 

## INFORMATIONS PROJET

- **Nom** : Amande - L'Art de la Tartelette
- **Type** : Application Web Full-Stack
- **Technologies** : Vue 3, TypeScript, Node.js, Supabase
- **Architecture** : Monorepo avec séparation Frontend/Backend
- **Objectif** : Plateforme de personnalisation de tartelettes avec gestion administrative

---

## ARCHITECTURE TECHNIQUE

### **Stack Technologique Moderne**

```
Frontend (Vue 3 + TypeScript)
├── Vue 3 Composition API
├── TypeScript pour la sécurité des types
├── Pinia pour la gestion d'état
├── Vue Router pour la navigation
└── Tailwind CSS + SCSS pour le styling

Backend (Node.js + Express)
├── API RESTful
├── Middleware d'authentification
└── Intégration Supabase

Base de Données (Supabase)
├── PostgreSQL avec RLS (Row Level Security)
├── Authentification JWT
└── Storage pour les images
```

### **Choix Architecturaux Justifiés**

1. **Vue 3** : Framework moderne, performant, écosystème riche
2. **TypeScript** : Sécurité des types, maintenance facilitée, détection d'erreurs
3. **Pinia** : Gestion d'état simple et performante, remplace Vuex
4. **Supabase** : Alternative open-source à Firebase, PostgreSQL natif
5. **Monorepo** : Gestion centralisée, partage de code, déploiement simplifié

---

## 🎨 FONCTIONNALITÉS PRINCIPALES

### **1. Interface Client - Composeur de Tartelette**

#### **Processus en 5 Étapes**
1. **Sélection du Fond** (3 options disponibles)
2. **Première Couche de Douceur** (4 options)
3. **Seconde Couche de Douceur** (4 options)
4. **Touche Finale** (4 options)
5. **Récapitulatif et Ajout au Panier**

#### **Caractéristiques Techniques**
- **Navigation intuitive** avec validation des étapes
- **Prévisualisation en temps réel** de la composition
- **Gestion des images multiples** par variante de fond
- **Calcul automatique des prix** et quantités
- **Interface responsive** adaptée mobile/desktop

### **2. Interface Administrative - Gestion des Produits**

#### **Dashboard Complet**
- **Gestion des 4 types de produits** avec quotas définis
- **Upload d'images** par glisser-déposer
- **Édition en ligne** des noms et descriptions
- **Système de verrouillage** pour éviter les modifications accidentelles
- **Statistiques de progression** en temps réel

#### **Fonctionnalités CRUD**
- ✅ **Créer** : Ajout de nouveaux produits avec images
- 📖 **Lire** : Affichage organisé par catégories
- ✏️ **Modifier** : Édition des propriétés et remplacement d'images
- 🗑️ **Supprimer** : Suppression individuelle ou en masse

---

## 🗄️ STRUCTURE DE LA BASE DE DONNÉES

### **Schéma Relationnel**

```sql
-- Table des produits
products (
  id: UUID (clé primaire)
  nom: TEXT (nom du produit)
  locked: BOOLEAN (verrouillé ou non)
  step: TEXT (type: fonds, premiereCoucheDouceur, etc.)
  created_at: TIMESTAMP
)

-- Table des images
product_images (
  id: UUID (clé primaire)
  product_id: UUID (référence vers products)
  url: TEXT (URL de l'image)
  image_index: INTEGER (position de l'image)
)
```

### **Contraintes et Sécurité**
- **RLS (Row Level Security)** : Accès contrôlé par rôle utilisateur
- **Contraintes de validation** : Types de produits limités
- **Index optimisés** : Requêtes performantes
- **Cascade delete** : Nettoyage automatique des images

---

## 🔐 SYSTÈME D'AUTHENTIFICATION

### **Gestion des Rôles**
- **Utilisateur standard** : Accès au composeur et panier
- **Administrateur** : Accès complet à la gestion des produits

### **Sécurité Implémentée**
- **JWT tokens** pour l'authentification
- **Hashage des mots de passe** (bcrypt)
- **Middleware de protection** des routes admin
- **Validation des permissions** côté client et serveur

---

## 📱 INTERFACE UTILISATEUR

### **Design System**
- **Palette de couleurs** cohérente (#01192b, #fab92e)
- **Typographie** : Poppins pour les titres, Inter pour le texte
- **Composants réutilisables** : Boutons, modales, formulaires
- **Responsive design** : Adaptation mobile/tablette/desktop

### **Expérience Utilisateur**
- **Navigation intuitive** avec breadcrumbs
- **Feedback visuel** immédiat (loading, succès, erreurs)
- **Accessibilité** : ARIA labels, navigation clavier
- **Performance** : Lazy loading, mise en cache

---

## 🚀 DÉPLOIEMENT ET MAINTENANCE

### **Environnement de Développement**
```bash
# Installation des dépendances
npm run install:all

# Lancement en mode développement
npm run dev

# Build de production
npm run build
```

### **Scripts Disponibles**
- `npm run dev` : Lance frontend + backend
- `npm run lint` : Vérification de la qualité du code
- `npm run test` : Exécution des tests
- `npm run clean` : Nettoyage des builds

---

## 📊 MÉTRIQUES ET PERFORMANCE

### **Optimisations Implémentées**
- **Lazy loading** des composants
- **Mise en cache** des données produits
- **Compression des images** automatique
- **Code splitting** pour réduire la taille des bundles

### **Monitoring**
- **Logs structurés** pour le debugging
- **Gestion d'erreurs** robuste
- **Métriques de performance** (temps de chargement, etc.)

---

## 🔮 ÉVOLUTIONS FUTURES

### **Fonctionnalités Prévues**
- **Système de commandes** en ligne
- **Gestion des stocks** en temps réel
- **Analytics** des préférences clients
- **API publique** pour intégrations tierces

### **Améliorations Techniques**
- **Tests automatisés** (unitaires, intégration)
- **CI/CD pipeline** pour le déploiement
- **Monitoring avancé** (APM, alertes)
- **Optimisation SEO** et PWA

---

## 💡 POINTS FORTS DU PROJET

### **Innovation Technique**
- **Architecture moderne** avec Vue 3 Composition API
- **TypeScript** pour la robustesse du code
- **Gestion d'état avancée** avec Pinia
- **Base de données relationnelle** optimisée

### **Qualité du Code**
- **Structure modulaire** et maintenable
- **Séparation des responsabilités** claire
- **Documentation** complète et à jour
- **Standards de codage** respectés

### **Expérience Utilisateur**
- **Interface intuitive** et responsive
- **Performance optimisée** pour tous les appareils
- **Accessibilité** respectée
- **Design cohérent** et professionnel

---

## 🎯 CONCLUSION

Ce projet démontre une **maîtrise technique complète** des technologies web modernes, avec une **architecture solide** et une **approche professionnelle** du développement.

**Points clés :**
- ✅ **Architecture robuste** et scalable
- ✅ **Code de qualité** et maintenable  
- ✅ **Interface utilisateur** intuitive et responsive
- ✅ **Sécurité** implémentée à tous les niveaux
- ✅ **Performance** optimisée et monitoring

**Compétences démontrées :**
- Maîtrise des frameworks modernes (Vue 3, TypeScript)
- Conception de bases de données relationnelles
- Gestion de l'authentification et des permissions
- Développement d'interfaces utilisateur professionnelles
- Architecture de systèmes complexes

---

*Documentation créée pour la présentation devant le jury - Projet Amande 2025*

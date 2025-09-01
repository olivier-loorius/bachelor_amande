# 🎬 GUIDE DE DÉMONSTRATION - PROJET AMANDE

## 🚀 PRÉPARATION DE LA DÉMONSTRATION

### **1. Lancement de l'Application**
```bash
# Dans le terminal, à la racine du projet
npm run dev
```
- **Frontend** : http://localhost:5173
- **Backend** : http://localhost:3000

### **2. Connexion Administrateur**
- Aller sur `/admin`
- Se connecter avec un compte admin existant
- Vérifier l'accès au dashboard

---

## 🎯 DÉMONSTRATION EN 5 ÉTAPES

### **ÉTAPE 1 : Présentation de l'Architecture (2-3 min)**

#### **Montrer la Structure du Projet**
```bash
# Dans le terminal, montrer l'organisation
tree -L 3 -I node_modules
```

**Points à souligner :**
- **Monorepo** bien organisé
- **Séparation claire** frontend/backend
- **Configuration** TypeScript et ESLint
- **Structure modulaire** des composants

#### **Expliquer les Technologies**
- **Vue 3** : Framework moderne et performant
- **TypeScript** : Sécurité des types et maintenance
- **Pinia** : Gestion d'état moderne
- **Supabase** : Base de données PostgreSQL avec authentification

---

### **ÉTAPE 2 : Interface Administrative (3-4 min)**

#### **Dashboard Principal**
1. **Accéder à `/admin`**
2. **Montrer les sections** :
   - Gestion des Utilisateurs
   - Gestion des Produits (Accordion)

#### **Gestion des Produits**
1. **Ouvrir la section Produits**
2. **Expliquer la structure** :
   - 3 Fonds (base de la tartelette)
   - 4 Premières Couches de Douceur
   - 4 Secondes Couches de Douceur
   - 4 Touches Finales

#### **Démonstration CRUD**
1. **Créer un produit** :
   - Cliquer sur "Ajouter un produit"
   - Remplir le nom
   - Upload d'image par glisser-déposer
   - Sauvegarder

2. **Modifier un produit** :
   - Déverrouiller un produit
   - Changer le nom
   - Remplacer l'image
   - Sauvegarder

3. **Supprimer un produit** :
   - Sélectionner un produit
   - Cliquer sur supprimer
   - Confirmer l'action

#### **Fonctionnalités Avancées**
- **Système de verrouillage** : Empêche les modifications accidentelles
- **Upload d'images** : Interface intuitive par glisser-déposer
- **Statistiques** : Progression en temps réel
- **Validation** : Contrôles côté client et serveur

---

### **ÉTAPE 3 : Interface Client - Composeur (3-4 min)**

#### **Navigation vers le Composeur**
1. **Aller sur `/composer`**
2. **Expliquer le processus en 5 étapes**

#### **Démonstration des Étapes**
1. **Étape 1 - Sélection du Fond** :
   - Montrer les 3 options disponibles
   - Expliquer la logique de sélection
   - Montrer la prévisualisation

2. **Étape 2 - Première Couche** :
   - Montrer les 4 options
   - Expliquer la logique des images multiples
   - Montrer la prévisualisation mise à jour

3. **Étape 3 - Seconde Couche** :
   - Même processus
   - Montrer la cohérence de l'interface

4. **Étape 4 - Touche Finale** :
   - Dernière sélection
   - Prévisualisation complète

5. **Étape 5 - Récapitulatif** :
   - Résumé de la composition
   - Calcul automatique du prix
   - Gestion des quantités
   - Ajout au panier

#### **Fonctionnalités Techniques**
- **Prévisualisation en temps réel** : Images qui se mettent à jour
- **Navigation intuitive** : Boutons précédent/suivant
- **Validation des étapes** : Impossible de continuer sans sélection
- **Responsive design** : Adaptation mobile/desktop

---

### **ÉTAPE 4 : Base de Données et Sécurité (2-3 min)**

#### **Structure de la Base**
1. **Ouvrir Supabase Dashboard**
2. **Montrer les tables** :
   - `products` : Informations des produits
   - `product_images` : Images liées aux produits
   - `users` : Gestion des utilisateurs

#### **Sécurité Implémentée**
1. **Row Level Security (RLS)** :
   - Montrer les politiques de sécurité
   - Expliquer l'accès contrôlé par rôle

2. **Authentification** :
   - JWT tokens
   - Hashage des mots de passe
   - Gestion des sessions

3. **Validation des Données** :
   - Contraintes côté base
   - Validation côté serveur
   - Sanitisation des entrées

---

### **ÉTAPE 5 : Code et Qualité (2-3 min)**

#### **Architecture du Code**
1. **Ouvrir quelques fichiers clés** :
   - `useComposer.ts` : Logique métier
   - `useProductStore.ts` : Gestion d'état
   - `productConfigService.ts` : Communication API

#### **Qualité du Code**
1. **TypeScript** :
   - Types bien définis
   - Interfaces claires
   - Détection d'erreurs

2. **Structure Modulaire** :
   - Composants réutilisables
   - Séparation des responsabilités
   - Services bien organisés

3. **Standards de Codage** :
   - ESLint configuré
   - Prettier pour le formatage
   - Commentaires pertinents

---

## 🎭 SCRIPT DE PRÉSENTATION

### **Introduction (30 secondes)**
> "Bonjour, je vais vous présenter mon projet Amande, une plateforme de personnalisation de tartelettes développée avec les technologies web modernes."

### **Architecture (1 minute)**
> "J'ai choisi une architecture monorepo avec Vue 3, TypeScript et Supabase pour sa robustesse et sa maintenabilité."

### **Démonstration Admin (2 minutes)**
> "Laissez-moi vous montrer l'interface administrative où je peux gérer tous les produits de manière intuitive."

### **Démonstration Client (2 minutes)**
> "Maintenant, voici l'expérience utilisateur : un composeur en 5 étapes qui guide le client dans sa personnalisation."

### **Aspects Techniques (1 minute)**
> "Techniquement, j'ai implémenté une base de données relationnelle sécurisée avec RLS et une architecture modulaire."

### **Conclusion (30 secondes)**
> "Ce projet démontre ma maîtrise des technologies modernes et ma capacité à concevoir des systèmes complexes et maintenables."

---

## 🚨 POINTS D'ATTENTION

### **Avant la Démo**
- ✅ **Tester l'application** complètement
- ✅ **Préparer des données** de test
- ✅ **Vérifier la connexion** internet
- ✅ **Avoir un plan B** en cas de problème

### **Pendant la Démo**
- 🎯 **Rester focalisé** sur les fonctionnalités clés
- 🗣️ **Expliquer chaque action** avant de la faire
- ⚡ **Être rapide** mais pas précipité
- 🔍 **Montrer les détails** techniques importants

### **En Cas de Problème**
- 😌 **Rester calme** et professionnel
- 🔧 **Expliquer le problème** et la solution
- 📱 **Avoir des captures d'écran** de secours
- 💻 **Montrer le code** si nécessaire

---

## 📋 CHECKLIST DE PRÉPARATION

- [ ] Application lancée et testée
- [ ] Compte admin connecté
- [ ] Données de test prêtes
- [ ] Terminal ouvert avec la structure du projet
- [ ] Supabase dashboard accessible
- [ ] Fichiers de code clés identifiés
- [ ] Script de présentation mémorisé
- [ ] Plan B préparé

---

*Guide créé pour une démonstration réussie devant le jury - Projet Amande 2025*

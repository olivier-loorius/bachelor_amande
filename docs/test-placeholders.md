# Test des Placeholders du ComposerView

## Modifications apportées

### 1. Images Placeholder créées
- **`/placeholder-fond.svg`** : Placeholder pour les fonds de tartelettes (220x150px)
- **`/placeholder-garniture.svg`** : Placeholder pour les garnitures (400x312px)

### 2. Fonction getGarnitureImage simplifiée
- Suppression de la logique complexe de combinaisons d'images
- Retour de l'image du fond ou du placeholder par défaut
- Gestion des cas où aucune image n'est disponible

### 3. Gestionnaires d'erreur ajoutés
- **Images des fonds** : `@error="$event.target.src = '/placeholder-fond.svg'"`
- **Images des garnitures** : `@error="$event.target.src = '/placeholder-garniture.svg'"`

### 4. Fallbacks dans les attributs src
- **Fonds** : `:src="fond.image || '/placeholder-fond.svg'"`
- **Garnitures** : Utilisent `getGarnitureImage` qui retourne déjà des placeholders

## Test à effectuer

1. **Accéder au ComposerView** sans configuration de produits
2. **Vérifier que les placeholders s'affichent** pour tous les fonds
3. **Sélectionner un fond** et vérifier que les placeholders des garnitures s'affichent
4. **Naviguer entre les étapes** et vérifier la cohérence des placeholders

## Résultat attendu
- Plus d'erreurs 404 sur les images
- Structure visuelle complète maintenue
- Emplacements vides visibles avec des placeholders appropriés
- Expérience utilisateur préservée

## Fichiers modifiés
- `frontend/src/views/composer/ComposerView.vue`
- `frontend/public/placeholder-fond.svg` (nouveau)
- `frontend/public/placeholder-garniture.svg` (nouveau)

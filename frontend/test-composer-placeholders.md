# Test des Placeholders du ComposerView

## Problème résolu
L'utilisateur signalait que "il n'y a pas d'emplacement vide pour les les images de l'etape 1" après la suppression des données hardcodées.

## Solution implémentée

### 1. Images Placeholder créées
- **`/placeholder-fond.svg`** : Placeholder pour les fonds de tartelettes (220x150px)
- **`/placeholder-garniture.svg`** : Placeholder pour les garnitures (400x312px)

### 2. Modifications du ComposerView.vue

#### Fonction getGarnitureImage simplifiée
```typescript
function getGarnitureImage(fond: { id: number, nom: string, image?: string } | null, garniture: { id: number, nom: string } | null) {
  if (!fond) return '';
  
  // Si pas de garniture sélectionnée, retourner l'image du fond ou un placeholder
  if (!garniture) {
    return fond.image || '/placeholder-fond.svg';
  }
  
  // Pour l'instant, retourner l'image du fond avec la garniture
  // Cette logique peut être étendue plus tard pour des combinaisons spécifiques
  return fond.image || '/placeholder-fond.svg';
}
```

#### Placeholders ajoutés partout
- **Étape 1 (Fonds)** : `:src="fond.image || '/placeholder-fond.svg'"`
- **Étape 2-4 (Garnitures)** : `@error="$event.target.src = '/placeholder-garniture.svg'"`
- **Étape 5 (Finale)** : `@error="$event.target.src = '/placeholder-garniture.svg'"`

### 3. Structure initiale maintenue
✅ Tous les emplacements visuels sont préservés
✅ Les images placeholder s'affichent quand les vraies images sont manquantes
✅ La navigation et l'UX restent identiques
✅ Support mobile et desktop maintenu

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

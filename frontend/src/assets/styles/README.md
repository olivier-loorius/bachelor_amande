# Organisation des Styles SCSS - Version Ultra-Simplifiée

## Structure des fichiers (1 fichier seulement)

### 📁 `main.scss`
Fichier unique contenant tout :
- **Variables CSS** : couleurs, espacements, typographie, boutons, bordures
- **Reset et styles de base** : box-sizing, focus, html/body
- **Layout de base** : `.page-container`, `.content-container`, `.composer-content`
- **Composants de base** : `.card`, boutons, typographie
- **Styles spécifiques** : fonds, garnitures, composer
- **Utilitaires essentiels** : classes pour espacements, texte, affichage
- **Animations** : fade-in
- **Responsive** : adaptations mobile et tablette

## Utilisation

### Import global
Un seul fichier importé dans `main.ts` :
```typescript
import './assets/styles/main.scss'
```

### Dans les composants Vue
Plus besoin d'importer ! Les styles sont disponibles globalement :
```vue
<style scoped>
/* Vos styles spécifiques au composant */
</style>
```

## Variables disponibles

### Couleurs
- `--primary-color` : #4A4A4A
- `--secondary-color` : #F9F9F9
- `--accent-color` : #FF6F61
- `--teal-color` : #90aeb0
- `--text-color` : #333333

### Espacements
- `--spacing-xs` : 0.5rem
- `--spacing-sm` : 0.7rem
- `--spacing-md` : 1rem
- `--spacing-lg` : 1.2rem
- `--spacing-xl` : 1.5rem
- `--spacing-xxl` : 2rem

### Typographie
- `--font-family-title` : 'Bebas Neue', sans-serif
- `--font-family-text` : 'Roboto', sans-serif

## Classes utilitaires

### Espacements
```css
.mt-1, .mt-2, .mt-3, .mt-4, .mt-5
.mb-1, .mb-2, .mb-3, .mb-4, .mb-5
.p-1, .p-2, .p-3, .p-4, .p-5
```

### Texte
```css
.text-center, .text-left, .text-right
.text-primary, .text-secondary, .text-accent, .text-teal
```

### Affichage
```css
.d-none, .d-block, .d-flex, .d-grid
.justify-center, .justify-between
.align-center, .align-start, .align-end
```

### Animations
```css
.fade-in
```

## Avantages de cette organisation

✅ **Ultra-simplicité** : Seulement 1 fichier au lieu de 2 ou 3
✅ **Performance maximale** : Un seul import, code optimisé
✅ **Maintenance facile** : Tout au même endroit
✅ **Cohérence parfaite** : Tous les styles utilisent les mêmes variables
✅ **Global** : Plus besoin d'importer dans chaque composant
✅ **Pas d'erreurs d'import** : Plus de problèmes de dépendances

## Bonnes pratiques

1. **Utilisez les variables** : Préférez `var(--spacing-lg)` à `1.2rem`
2. **Styles globaux** : Les styles de base sont automatiquement disponibles
3. **Évitez les doublons** : Vérifiez si un style existe déjà
4. **Utilisez les classes utilitaires** : Pour les modifications rapides
5. **Organisation claire** : Sections commentées dans le fichier

## Maintenance

- **Tout dans `main.scss`** : Variables, styles réutilisables, styles spécifiques
- **Sections organisées** : Variables → Reset → Layout → Composants → Utilitaires → Responsive
- **Commentaires clairs** : Chaque section est bien délimitée
- **Styles de composant** : Dans le fichier Vue directement si très spécifique

## Organisation du fichier main.scss

```
1. Variables CSS (:root)
2. Reset et styles de base
3. Layout de base
4. Composants de base
5. Typographie
6. Boutons
7. Layout des fonds
8. Garnitures
9. Composant Composer
10. Utilitaires essentiels
11. Animations
12. Responsive
```

Cette organisation est parfaite pour votre projet ! 🎯 
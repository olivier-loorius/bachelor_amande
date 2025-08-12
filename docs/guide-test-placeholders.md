# Guide de Test des Placeholders - ComposerView

## Problème Résolu ✅

Les anciennes images codées en dur ont été complètement supprimées de `ComposerView.vue` :
- ✅ Tous les imports d'images statiques supprimés
- ✅ Tous les tableaux de données utilisent maintenant `image: null`
- ✅ Les placeholders SVG sont en place
- ✅ Les gestionnaires d'erreur `@error` sont configurés

## Test Immédiat

### 1. Vider le Cache du Navigateur (OBLIGATOIRE)
**Important** : Les anciennes images peuvent encore être en cache dans votre navigateur !

**Chrome/Edge :**
- Appuyez sur `Ctrl + Shift + R` (Windows) ou `Cmd + Shift + R` (Mac)
- Ou : `F12` → onglet "Application" → "Storage" → "Clear storage" → "Clear site data"

**Firefox :**
- Appuyez sur `Ctrl + F5` (Windows) ou `Cmd + Shift + R` (Mac)
- Ou : `F12` → onglet "Storage" → "Clear Storage"

### 2. Vérifier l'Affichage
Après avoir vidé le cache, vous devriez voir :
- **Étape 1 (Fonds)** : Des placeholders SVG gris au lieu des anciennes images
- **Étape 2-4** : Des placeholders SVG pour les garnitures
- **Structure** : Tous les éléments visuels sont présents, seules les images sont des placeholders

### 3. Vérifier la Console
Ouvrez la console du navigateur (`F12`) et vérifiez qu'il n'y a pas d'erreurs 404 pour les anciennes images.

## Structure Maintenue ✅

La structure visuelle de la page composer est **intacte** :
- ✅ Tous les conteneurs d'images sont présents
- ✅ Les dimensions et styles sont conservés
- ✅ Les interactions (clics, sélections) fonctionnent
- ✅ La navigation entre étapes est opérationnelle

## Prochaines Étapes

1. **Configurer les images depuis l'Admin** : Utilisez le dashboard admin pour ajouter des images aux produits
2. **Synchroniser avec Supabase** : Les images configurées apparaîtront automatiquement
3. **Tester la persistance** : Les images configurées resteront même après rechargement

## Dépannage

**Si vous voyez encore des anciennes images :**
1. Videz complètement le cache du navigateur
2. Redémarrez le serveur de développement
3. Vérifiez que le fichier `ComposerView.vue` a bien été sauvegardé

**Si les placeholders ne s'affichent pas :**
1. Vérifiez que les fichiers SVG sont bien dans le dossier `public/`
2. Vérifiez la console pour d'éventuelles erreurs 404
3. Testez avec un autre navigateur

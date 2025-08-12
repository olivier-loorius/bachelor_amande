# Test du Dashboard Admin - Fonctionnalités

## ✅ Ce qui devrait maintenant fonctionner

### 1. Affichage des sections d'édition
- **Titre visible** : Le nom du produit (FOND1, FOND2, FOND3) doit apparaître dans l'en-tête orange
- **Croix de fermeture** : Bouton rond blanc avec croix dans le coin supérieur droit
- **Proportions correctes** : Section texte (3/5) et section image (2/5)

### 2. Fonctionnalités d'édition
- **Modification du nom** : Champ de saisie pour changer le nom du produit
- **Ajout d'image** : Zone de drag & drop + champ URL
- **Sauvegarde** : Boutons "Annuler" et "Sauvegarder" fonctionnels

### 3. Gestion des images
- **Drag & Drop** : Glisser-déposer d'images depuis l'explorateur
- **Sélection de fichier** : Clic sur la zone pour ouvrir le sélecteur de fichiers
- **Prévisualisation** : Affichage de l'image ajoutée
- **Suppression** : Bouton poubelle pour supprimer l'image

## 🧪 Comment tester

### Test 1: Ouverture de la section d'édition
1. Allez sur http://localhost:5174/admin
2. Cliquez sur l'icône de modification (crayon) d'un FOND
3. Vérifiez que la section s'ouvre avec le titre et la croix visibles

### Test 2: Ajout d'image
1. Dans la section d'édition ouverte
2. Glissez une image depuis votre explorateur vers la zone "Glissez-déposez"
3. Vérifiez que l'image s'affiche dans la prévisualisation

### Test 3: Sauvegarde
1. Modifiez le nom du produit si nécessaire
2. Cliquez sur "Sauvegarder"
3. Vérifiez que la section se ferme et que les données sont sauvegardées

## 🔧 En cas de problème

### Problème: Titre et croix invisibles
**Solution** : Vérifiez que les styles CSS sont bien chargés. La section `.edit-section-header` doit avoir un fond orange (`var(--accent-color)`).

### Problème: Images ne se sauvegardent pas
**Solution** : Vérifiez la console du navigateur pour les erreurs JavaScript. Les images sont sauvegardées en base64 dans le localStorage.

### Problème: Drag & Drop ne fonctionne pas
**Solution** : Vérifiez que les événements `@dragover.prevent` et `@drop.prevent="handleImageDrop"` sont bien présents dans le template.

## 📱 Responsive
- Sur mobile, les sections passent en colonne unique
- Les boutons d'action s'adaptent à la largeur de l'écran
- Les images se redimensionnent automatiquement


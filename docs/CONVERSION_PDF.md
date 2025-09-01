# 📄 GUIDE DE CONVERSION EN PDF

## 🚀 MÉTHODES DE CONVERSION

### **Option 1: VS Code + Extension**
1. Installer l'extension "Markdown PDF"
2. Ouvrir `DOCUMENTATION_TECHNIQUE.md`
3. Clic droit → "Export (pdf)"
4. PDF généré automatiquement

### **Option 2: Pandoc (Terminal)**
```bash
# Installation Pandoc
npm install -g pandoc

# Conversion
pandoc docs/DOCUMENTATION_TECHNIQUE.md -o docs/AMANDE_TECHNIQUE.pdf
```

### **Option 3: En Ligne**
- **MD2PDF.com** : Copier-coller le contenu
- **CloudConvert** : Upload du fichier .md
- **GitHub** : Aperçu → Imprimer en PDF

---

## 🎯 POINTS CLÉS À RETENIR

### **Architecture**
- Vue 3 + TypeScript + Pinia + Supabase
- Monorepo structuré
- Séparation frontend/backend claire

### **CRUD Produits**
- 4 types : Fonds(3), G1(4), G2(4), G3(4)
- Images multiples par produit
- Système de verrouillage

### **CRUD Users**
- Rôles Admin/User
- Soft delete (désactivation)
- Authentification JWT + RLS

### **Panier**
- Lié à l'utilisateur connecté
- Persistance locale + sync
- Produits personnalisés

### **Sécurité**
- RLS (Row Level Security)
- Middleware d'authentification
- Validation côté client + serveur

---

## ❓ RÉPONSES RAPIDES JURY

### **Q: Pourquoi ces technologies ?**
**R:** Modernes + performantes + maintenables + écosystème riche

### **Q: Sécurité ?**
**R:** RLS + JWT + validation + middleware + contraintes base

### **Q: Performance ?**
**R:** Lazy loading + cache + code splitting + images optimisées

### **Q: Tests ?**
**R:** ESLint + TypeScript + tests unitaires + validation

### **Q: Évolutivité ?**
**R:** Architecture modulaire + API RESTful + composants réutilisables

---

## 📋 CHECKLIST PRÉSENTATION

- [ ] Documentation PDF prête
- [ ] Application testée
- [ ] Données de démo prêtes
- [ ] Terminal ouvert
- [ ] Script mémorisé
- [ ] Plan B préparé

---

*Guide de conversion et résumé - Projet Amande 2025*

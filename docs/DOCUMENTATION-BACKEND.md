# 📚 Documentation Backend - Amande Pâtisserie

## 🎯 **Qu'est-ce que le Backend ?**

Le **backend** est comme le "cerveau" de votre application web. C'est la partie invisible qui :
- 🗄️ Stocke et gère les données
- 🔐 Sécurise les accès
- 📡 Communique avec le frontend
- ⚡ Traite les demandes des utilisateurs

## 🏗️ **Architecture Simple**

```
┌─────────────┐    HTTP    ┌─────────────┐    SQL    ┌─────────────┐
│  Frontend   │ ────────── │   Backend   │ ───────── │  Supabase   │
│  (Vue.js)   │   (API)    │  (Express)  │ (Base de │  (Base de   │
│             │             │             │  données) │  données)   │
└─────────────┘             └─────────────┘           └─────────────┘
```

## 🛠️ **Technologies Choisies**

### **1. Node.js + Express** 🟢
- **Pourquoi ?** Simple, rapide, énorme communauté
- **Rôle** : Créer un serveur web qui écoute les demandes
- **Avantage** : JavaScript partout (frontend + backend)

### **2. Supabase** 🔵
- **Pourquoi ?** Alternative moderne à Firebase, open-source
- **Rôle** : Base de données + authentification + stockage
- **Avantage** : Tout en un, pas besoin de configurer une DB séparée

### **3. JWT (JSON Web Tokens)** 🔑
- **Pourquoi ?** Standard de l'industrie pour l'authentification
- **Rôle** : Vérifier que l'utilisateur est bien connecté
- **Avantage** : Sécurisé et stateless

## 🔄 **Comment ça fonctionne ?**

### **1. Démarrage du Serveur** 🚀
```javascript
// Le serveur démarre et écoute sur le port 3001
app.listen(3001, () => {
  console.log("🚀 Serveur démarré sur le port 3001");
});
```

### **2. Réception d'une Demande** 📨
```
Utilisateur clique → Frontend envoie requête → Backend reçoit
```

### **3. Traitement** ⚙️
```javascript
// Le backend vérifie l'authentification
const token = req.headers.authorization;
const user = await supabase.auth.getUser(token);

// Puis traite la demande
const result = await supabase.from('products').select('*');
```

### **4. Réponse** 📤
```javascript
// Le backend renvoie le résultat au frontend
res.json({ success: true, data: result.data });
```

## 🗂️ **Structure des Dossiers**

```
backend/
├── src/
│   ├── server.js          # 🚀 Point d'entrée principal
│   ├── routes/            # 🛣️ Définition des chemins API
│   │   ├── users.js       # 👥 Gestion des utilisateurs
│   │   ├── products.js    # 🍰 Gestion des produits
│   │   └── cart.js        # 🛒 Gestion du panier
│   └── config/
│       └── supabase.js    # 🔧 Configuration Supabase
├── package.json           # 📦 Dépendances et scripts
└── setup-env.js          # ⚙️ Configuration environnement
```

## 🔐 **Sécurité Implémentée**

### **1. Authentification** ✅
- Vérification des tokens JWT
- Protection des routes sensibles
- Gestion des sessions utilisateur

### **2. Autorisation** ⚠️
- Vérification des rôles (admin/user)
- Accès contrôlé aux ressources
- Protection contre les accès non autorisés

### **3. Validation des Données** ✅
- Vérification des types
- Nettoyage des entrées
- Protection contre les injections

## 📡 **API REST - Explication Simple**

### **Qu'est-ce que REST ?**
REST est un style d'architecture pour créer des APIs web. C'est comme un "langage standard" entre le frontend et le backend.

### **Méthodes HTTP** 📝
- **GET** : "Donne-moi des informations" (lecture)
- **POST** : "Crée quelque chose de nouveau" (création)
- **PUT** : "Modifie quelque chose qui existe" (modification)
- **DELETE** : "Supprime quelque chose" (suppression)

### **Exemple Concret** 🍰
```
GET /api/products
→ "Donne-moi la liste de tous les produits"

POST /api/products
→ "Crée un nouveau produit avec ces données"

PUT /api/products/123
→ "Modifie le produit numéro 123"

DELETE /api/products/123
→ "Supprime le produit numéro 123"
```

## 🔄 **Communication Frontend ↔ Backend**

### **1. Frontend → Backend** 📤
```javascript
// Le frontend envoie une requête
const response = await fetch('/api/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Tartelette aux Fraises',
    price: 3.50
  })
});
```

### **2. Backend → Frontend** 📥
```javascript
// Le backend répond avec des données
res.json({
  success: true,
  message: 'Produit créé avec succès',
  data: { id: 456, name: 'Tartelette aux Fraises' }
});
```

## 🚀 **Flux Complet d'une Action**

### **Exemple : Ajouter un produit au panier**

```
1. 👤 Utilisateur clique sur "Ajouter au panier"
2. 🎨 Frontend envoie requête POST /api/cart/add
3. 🔐 Backend vérifie le token d'authentification
4. ✅ Backend vérifie que l'utilisateur existe
5. 🛒 Backend ajoute le produit au panier dans Supabase
6. 📤 Backend renvoie confirmation au frontend
7. 🎉 Frontend affiche "Produit ajouté !"
```

## 🎯 **Points Clés à Retenir**

### **✅ Ce que fait le Backend :**
- 🗄️ Gère la base de données
- 🔐 Sécurise l'accès aux données
- 📡 Fournit une API REST
- ⚡ Traite les demandes rapidement
- 🔄 Synchronise les données

### **❌ Ce que le Backend NE fait PAS :**
- 🎨 N'affiche pas d'interface utilisateur
- 🌐 Ne gère pas le design
- 📱 Ne s'occupe pas de la responsivité
- 🎭 Ne gère pas les animations

## 🧪 **Test et Débogage**

### **1. Vérifier que le serveur fonctionne** ✅
```bash
npm start
# Doit afficher : "🚀 Serveur démarré sur le port 3001"
```

### **2. Tester une route API** 🔍
```bash
curl http://localhost:3001/api/products
# Doit renvoyer la liste des produits
```

### **3. Vérifier les logs** 📝
Le serveur affiche des messages clairs pour :
- ✅ Démarrage réussi
- ❌ Erreurs de configuration
- 🔑 Authentification
- 📡 Requêtes reçues

## 🎓 **Pour l'Examen - Ce que vous démontrez :**

1. **Architecture** : Compréhension client-serveur
2. **API REST** : Connaissance des standards web
3. **Sécurité** : Gestion de l'authentification
4. **Base de données** : Intégration avec Supabase
5. **Code propre** : Structure claire et organisée

## 🚀 **Prochaines Étapes Possibles**

- 🔒 Middleware de sécurité avancé
- 📊 Logs et monitoring
- 🧪 Tests automatisés
- 📈 Performance et optimisation
- 🔄 Cache et mise en cache

---

**💡 Le backend est le "moteur" de votre application. Il transforme les clics en actions, sécurise les données, et permet à tout de fonctionner ensemble !** 🎉

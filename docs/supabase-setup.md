# 🔧 Configuration Supabase

## Prérequis

1. Créer un compte sur [Supabase](https://supabase.com)
2. Créer un nouveau projet

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env` dans le dossier `frontend/` avec vos clés Supabase :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase
```

### 2. Structure de la base de données

Exécutez ce SQL dans l'éditeur SQL de Supabase :

```sql
-- Table des compositions
CREATE TABLE compositions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  is_validated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des profils utilisateurs étendus
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nom VARCHAR(255),
  role VARCHAR(50) DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security)
ALTER TABLE compositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Politiques pour compositions
CREATE POLICY "Users can view their own compositions" ON compositions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own compositions" ON compositions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own compositions" ON compositions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own compositions" ON compositions
  FOR DELETE USING (auth.uid() = user_id);

-- Politique admin pour voir toutes les compositions
CREATE POLICY "Admins can view all compositions" ON compositions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Politique admin pour supprimer toutes les compositions
CREATE POLICY "Admins can delete all compositions" ON compositions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Politiques pour user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Politique admin pour voir tous les profils
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_compositions_updated_at 
  BEFORE UPDATE ON compositions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Configuration de l'authentification

Dans Supabase Dashboard > Authentication > Settings :

1. Activez l'authentification par email
2. Configurez les redirections (URLs de votre app)
3. Personnalisez les templates d'email si nécessaire

### 4. Création d'un utilisateur admin

1. Créez un compte utilisateur normal via l'interface
2. Dans l'éditeur SQL de Supabase, exécutez :

```sql
-- Remplacer 'email@example.com' par l'email de l'utilisateur admin
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'email@example.com'
);
```

## Utilisation

### Fonctionnalités disponibles

✅ **CRUD Compositions** : Sauvegarder, charger, supprimer ses créations
✅ **Dashboard Admin** : Gestion de toutes les compositions
✅ **Authentification** : Connexion/inscription avec Supabase
✅ **Sécurité** : RLS (Row Level Security) configuré

### Points d'accès

- **Composer** : `/composer` - Interface de création avec CRUD
- **Admin** : `/admin` - Dashboard administrateur (accès restreint)
- **Connexion** : Bouton dans la navbar

## Développement

### Variables d'environnement pour le développement

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Test des fonctionnalités

1. **Créer une composition** : Allez sur `/composer`, composez et sauvegardez
2. **Charger une composition** : Dans la liste "Mes créations"
3. **Dashboard admin** : Connectez-vous avec un compte admin et allez sur `/admin`

## Sécurité

- ✅ RLS (Row Level Security) activé
- ✅ Politiques de sécurité configurées
- ✅ Accès admin restreint
- ✅ Validation côté serveur 
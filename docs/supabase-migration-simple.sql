-- 🔄 Migration vers Supabase - Version Simplifiée
-- Amande Pâtisserie

-- =====================================================
-- 1. SAUVEGARDE DES DONNÉES EXISTANTES
-- =====================================================

CREATE TEMP TABLE temp_users AS SELECT * FROM users;
CREATE TEMP TABLE temp_compositions AS SELECT * FROM compositions;
CREATE TEMP TABLE temp_categories AS SELECT * FROM categories;
CREATE TEMP TABLE temp_ingredients AS SELECT * FROM ingredients;

-- =====================================================
-- 2. SUPPRESSION DES TABLES EXISTANTES
-- =====================================================

DROP TABLE IF EXISTS compositions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- =====================================================
-- 3. CRÉATION DE LA NOUVELLE STRUCTURE SUPABASE
-- =====================================================

-- Table des catégories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  ordre INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des ingrédients
CREATE TABLE ingredients (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL UNIQUE,
  categorie_id INTEGER REFERENCES categories(id),
  image_url TEXT,
  prix DECIMAL(10,2) DEFAULT 0,
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des profils utilisateurs
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nom VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'suspended')),
  deleted_at TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  email_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des compositions
CREATE TABLE compositions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL,
  prix_total DECIMAL(10,2) DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  is_validated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table d'historique admin
CREATE TABLE admin_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type VARCHAR(50) NOT NULL,
  target_type VARCHAR(50) NOT NULL,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour hacher les emails
CREATE OR REPLACE FUNCTION hash_email(email TEXT)
RETURNS TEXT AS $$
BEGIN
  IF email IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN split_part(email, '@', 1) || '***@' || split_part(email, '@', 2);
END;
$$ LANGUAGE plpgsql;

-- Fonction pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. TRIGGERS
-- =====================================================

CREATE TRIGGER update_compositions_updated_at 
  BEFORE UPDATE ON compositions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ingredients_updated_at 
  BEFORE UPDATE ON ingredients 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE compositions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Politiques pour compositions
CREATE POLICY "Users can view their own compositions" ON compositions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own compositions" ON compositions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own compositions" ON compositions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own compositions" ON compositions
  FOR DELETE USING (auth.uid() = user_id);

-- Politiques admin pour compositions
CREATE POLICY "Admins can view all compositions" ON compositions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
      AND user_profiles.status = 'active'
    )
  );

CREATE POLICY "Admins can delete all compositions" ON compositions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
      AND user_profiles.status = 'active'
    )
  );

-- Politiques pour user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Politiques admin pour user_profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
      AND user_profiles.status = 'active'
    )
  );

CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
      AND user_profiles.status = 'active'
    )
  );

-- Politiques pour admin_actions
CREATE POLICY "Admins can view admin actions" ON admin_actions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
      AND user_profiles.status = 'active'
    )
  );

CREATE POLICY "Admins can insert admin actions" ON admin_actions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
      AND user_profiles.status = 'active'
    )
  );

-- =====================================================
-- 7. RESTAURATION DES DONNÉES
-- =====================================================

INSERT INTO categories (nom, ordre) 
SELECT nom, ordre FROM temp_categories;

INSERT INTO ingredients (nom, categorie_id, prix, disponible) 
SELECT nom, categorie_id, prix, disponible FROM temp_ingredients;

-- =====================================================
-- 8. VUES UTILES
-- =====================================================

CREATE OR REPLACE VIEW active_users AS
SELECT 
  up.id,
  up.email_hash,
  up.nom,
  up.role,
  up.status,
  up.created_at,
  up.last_login,
  COUNT(c.id) as compositions_count
FROM user_profiles up
LEFT JOIN compositions c ON up.id = c.user_id
WHERE up.status = 'active'
GROUP BY up.id, up.email_hash, up.nom, up.role, up.status, up.created_at, up.last_login;

CREATE OR REPLACE VIEW admin_stats AS
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
  COUNT(CASE WHEN status = 'deleted' THEN 1 END) as deleted_users,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
  COUNT(CASE WHEN last_login > NOW() - INTERVAL '7 days' THEN 1 END) as recent_logins
FROM user_profiles;

-- =====================================================
-- 9. INDEX POUR LES PERFORMANCES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_login ON user_profiles(last_login);
CREATE INDEX IF NOT EXISTS idx_compositions_user_id ON compositions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON admin_actions(created_at);

-- =====================================================
-- 10. NETTOYAGE
-- =====================================================

DROP TABLE temp_users;
DROP TABLE temp_compositions;
DROP TABLE temp_categories;
DROP TABLE temp_ingredients;

-- =====================================================
-- 11. MESSAGE DE CONFIRMATION
-- =====================================================

SELECT 
  'Migration vers Supabase terminée avec succès!' as message,
  COUNT(*) as total_categories,
  (SELECT COUNT(*) FROM ingredients) as total_ingredients
FROM categories; 
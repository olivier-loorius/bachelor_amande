-- Alternative : Créer une politique d'insertion pour les utilisateurs authentifiés
-- Exécute ceci dans l'éditeur SQL de Supabase

-- 1. Créer une politique d'insertion pour les utilisateurs authentifiés
CREATE POLICY "Enable insert for authenticated users" ON products
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 2. Créer une politique de lecture pour tous
CREATE POLICY "Enable read access for all users" ON products
FOR SELECT USING (true);

-- 3. Créer une politique de mise à jour pour les utilisateurs authentifiés
CREATE POLICY "Enable update for authenticated users" ON products
FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. Vérifier les politiques existantes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'products';

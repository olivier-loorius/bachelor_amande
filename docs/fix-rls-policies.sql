-- Script pour corriger les permissions RLS
-- À exécuter dans l'éditeur SQL de Supabase

-- Étape 1 : Vérifier les policies actuelles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';

-- Étape 2 : Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Allow admins to select all users" ON public.users;
DROP POLICY IF EXISTS "Allow admins to modify users" ON public.users;

-- Étape 3 : Créer les nouvelles policies
-- Policy pour permettre aux utilisateurs de voir leurs propres données
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Policy pour permettre aux admins de voir toutes les données
CREATE POLICY "Admins can view all data" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy pour permettre aux utilisateurs de modifier leurs propres données
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Policy pour permettre aux admins de modifier toutes les données
CREATE POLICY "Admins can update all data" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy pour permettre l'insertion
CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Étape 4 : Vérifier que les policies ont été créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public'; 
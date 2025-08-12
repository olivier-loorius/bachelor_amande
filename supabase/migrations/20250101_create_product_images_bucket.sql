-- Créer le bucket pour stocker les images des produits
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Créer une politique RLS pour permettre l'accès public en lecture
CREATE POLICY "Images publiques en lecture" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Créer une politique RLS pour permettre l'upload aux utilisateurs authentifiés
CREATE POLICY "Upload d'images pour utilisateurs authentifiés" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Créer une politique RLS pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Suppression d'images pour utilisateurs authentifiés" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Créer une politique RLS pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Mise à jour d'images pour utilisateurs authentifiés" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

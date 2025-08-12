-- Migration pour créer le bucket de stockage des images
-- Ce bucket stockera les images des produits (fonds, douceurs, finitions)

-- Créer le bucket pour les images des produits
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB en bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Politique : Tout le monde peut voir les images
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Politique : Seuls les admins peuvent uploader des images
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
    AND users.deleted IS NOT TRUE
  )
);

-- Politique : Seuls les admins peuvent modifier/supprimer des images
CREATE POLICY "Admins can manage product images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
    AND users.deleted IS NOT TRUE
  )
);

-- Commentaires pour la documentation
COMMENT ON TABLE storage.buckets IS 'Bucket pour le stockage des images des produits';
COMMENT ON COLUMN storage.buckets.id IS 'ID du bucket (product-images)';
COMMENT ON COLUMN storage.buckets.public IS 'Bucket public pour accès aux images';
COMMENT ON COLUMN storage.buckets.file_size_limit IS 'Limite de taille par fichier (5MB)';
COMMENT ON COLUMN storage.buckets.allowed_mime_types IS 'Types MIME autorisés (images uniquement)';



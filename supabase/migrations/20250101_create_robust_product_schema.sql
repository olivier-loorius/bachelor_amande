-- Migration : Création d'une structure robuste pour les produits
-- Date : 2025-01-01
-- Description : Remplace l'ancienne structure par une architecture relationnelle propre

-- 1. Suppression des anciennes tables si elles existent
drop table if exists product_config cascade;

-- 2. Création de la table des produits
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  locked boolean default false,
  step text check (step in ('fonds', 'premiereCoucheDouceur', 'secondeCoucheDouceur', 'toucheFinale')) not null,
  created_at timestamp with time zone default now()
);

-- 3. Création de la table des images liées
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  image_index integer not null check (image_index >= 0),
  created_at timestamp with time zone default now()
);

-- 4. Index pour optimiser les requêtes
create index if not exists idx_products_step on products(step);
create index if not exists idx_product_images_product_id on product_images(product_id);
create index if not exists idx_product_images_index on product_images(product_id, image_index);

-- 5. Contrainte unique pour éviter les doublons d'images
create unique index if not exists idx_unique_product_image on product_images(product_id, image_index);

-- 6. Fonction helper pour insérer un produit avec ses images
create or replace function insert_product_with_images(
  p_nom text,
  p_step text,
  p_images text[],
  p_locked boolean default false
) returns uuid as $$
declare
  v_product_id uuid;
  v_image text;
  v_index integer;
begin
  -- Insérer le produit
  insert into products (nom, step, locked)
  values (p_nom, p_step, p_locked)
  returning id into v_product_id;
  
  -- Insérer les images
  v_index := 0;
  foreach v_image in array p_images
  loop
    if v_image is not null and v_image != '' then
      insert into product_images (product_id, url, image_index)
      values (v_product_id, v_image, v_index);
    end if;
    v_index := v_index + 1;
  end loop;
  
  return v_product_id;
end;
$$ language plpgsql;

-- 7. Fonction helper pour mettre à jour un produit avec ses images
create or replace function update_product_with_images(
  p_product_id uuid,
  p_nom text,
  p_images text[],
  p_locked boolean
) returns void as $$
declare
  v_image text;
  v_index integer;
begin
  -- Mettre à jour le produit
  update products 
  set nom = p_nom, locked = p_locked
  where id = p_product_id;
  
  -- Supprimer les anciennes images
  delete from product_images where product_id = p_product_id;
  
  -- Insérer les nouvelles images
  v_index := 0;
  foreach v_image in array p_images
  loop
    if v_image is not null and v_image != '' then
      insert into product_images (product_id, url, image_index)
      values (p_product_id, v_image, v_index);
    end if;
    v_index := v_index + 1;
  end loop;
end;
$$ language plpgsql;

-- 8. Vue pour faciliter la récupération des produits avec leurs images
create or replace view products_with_images as
select 
  p.id,
  p.nom,
  p.locked,
  p.step,
  p.created_at,
  coalesce(json_agg(pi.url order by pi.image_index) filter (where pi.id is not null), '[]'::json) as images
from products p
left join product_images pi on pi.product_id = p.id
group by p.id, p.nom, p.locked, p.step, p.created_at;

-- 9. Données d'exemple pour tester
insert into products (nom, step, locked) values
  ('Fond Vanille', 'fonds', true),
  ('Fond Chocolat', 'fonds', true),
  ('Fond Amande', 'fonds', false);

insert into products (nom, step, locked) values
  ('Douceur Vanille', 'premiereCoucheDouceur', false),
  ('Douceur Chocolat', 'premiereCoucheDouceur', false),
  ('Douceur Amande', 'premiereCoucheDouceur', false),
  ('Douceur Pistache', 'premiereCoucheDouceur', false);

-- Insérer quelques images d'exemple
insert into product_images (product_id, url, image_index)
select p.id, 'https://example.com/vanille.jpg', 0
from products p where p.nom = 'Douceur Vanille' and p.step = 'premiereCoucheDouceur';

-- 10. Commentaires pour la documentation
comment on table products is 'Table principale des produits par étape';
comment on table product_images is 'Images associées aux produits avec index de position';
comment on function insert_product_with_images is 'Insère un produit avec ses images en une seule transaction';
comment on function update_product_with_images is 'Met à jour un produit et ses images en une seule transaction';
comment on view products_with_images is 'Vue pour récupérer facilement les produits avec leurs images';

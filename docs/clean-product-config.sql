-- Script de nettoyage complet de la table product_config
-- Date: 2025-01-01

-- Supprimer toutes les données existantes
DELETE FROM public.product_config;

-- Réinitialiser la séquence d'auto-increment si elle existe
-- (Pas nécessaire avec UUID, mais pour être sûr)

-- Vérifier que la table est vide
SELECT COUNT(*) as total_records FROM public.product_config;

-- Commentaire : La table est maintenant vide et prête à recevoir 
-- la nouvelle configuration depuis le dashboard admin

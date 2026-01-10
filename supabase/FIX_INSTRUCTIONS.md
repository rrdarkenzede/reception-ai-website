# Instructions pour Corriger les Erreurs de Migration

## Problème Identifié

Les erreurs indiquent que les tables existent mais qu'il manque des colonnes:
- ❌ `profiles.name` n'existe pas
- ❌ `profiles.settings` n'existe pas  
- ❌ `bookings.date` n'existe pas

Cela se produit parce que les tables ont été créées avec un schéma incomplet, et `CREATE TABLE IF NOT EXISTS` ne modifie pas les tables existantes.

## Solution

Un script de correction complet a été créé qui ajoute toutes les colonnes manquantes.

## Étapes à Suivre

### Option 1: Utiliser le Script de Correction (Recommandé)

1. **Exécutez d'abord le script de correction**:
   ```sql
   -- Copiez et exécutez tout le contenu de: 000_fix_existing_schema.sql
   ```
   Ce script vérifie et ajoute toutes les colonnes manquantes aux tables existantes.

2. **Ensuite, exécutez les migrations dans l'ordre**:
   - `001_initial_schema.sql` (utilisera `IF NOT EXISTS`, donc sûr à ré-exécuter)
   - `002_rls_policies.sql` (utilise `DROP POLICY IF EXISTS`, donc sûr)
   - `003_seed_data.sql` (utilise `ON CONFLICT`, donc sûr)

### Option 2: Réinitialiser Complètement (Si vous n'avez pas de données importantes)

Si vous pouvez perdre toutes les données existantes, réinitialisez tout:

```sql
-- 1. Supprimez toutes les tables
DROP TABLE IF EXISTS triggers CASCADE;
DROP TABLE IF EXISTS booking_notes CASCADE;
DROP TABLE IF EXISTS knowledge_base CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS call_logs CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. Exécutez ensuite les migrations dans l'ordre:
--    001_initial_schema.sql
--    002_rls_policies.sql  
--    003_seed_data.sql
```

## Vérification

Après avoir exécuté les migrations, vérifiez que tout fonctionne:

```sql
-- Vérifiez que toutes les colonnes existent
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;

-- Vérifiez que les données de seed ont été insérées
SELECT id, email, name, business_type, tier FROM profiles ORDER BY created_at;
```

## Fichiers Modifiés

✅ **000_fix_existing_schema.sql** - Script complet qui ajoute toutes les colonnes manquantes
✅ **001_initial_schema.sql** - Utilise `IF NOT EXISTS` pour être sûr
✅ **002_rls_policies.sql** - Utilise `DROP POLICY IF EXISTS` pour être sûr  
✅ **003_seed_data.sql** - Utilise `ON CONFLICT DO UPDATE` pour toutes les insertions
✅ **MIGRATION_GUIDE.md** - Guide général des migrations

## Notes Importantes

- Le script `000_fix_existing_schema.sql` est **idempotent** - vous pouvez l'exécuter plusieurs fois sans problème
- Tous les scripts utilisent maintenant `IF NOT EXISTS`, `DROP IF EXISTS`, ou `ON CONFLICT` pour être sûrs à ré-exécuter
- Les contraintes (CHECK, UNIQUE) sont vérifiées avant d'être ajoutées pour éviter les erreurs

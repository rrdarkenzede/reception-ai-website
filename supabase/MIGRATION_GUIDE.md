# Supabase Migration Guide

## Migration Order

Run these migrations in the following order in the Supabase SQL Editor:

### Option 1: Fresh Database (Recommended)

If starting from scratch or you're okay with losing existing data:

1. **001_initial_schema.sql** - Creates all tables, indexes, triggers, and enables RLS
2. **002_rls_policies.sql** - Creates all Row Level Security policies
3. **003_seed_data.sql** - Inserts seed data

### Option 2: Existing Database (If you have existing tables)

If you have existing tables that might be missing columns or have schema issues:

1. **000_fix_existing_schema.sql** - Fixes existing schema issues (adds missing email column, etc.)
2. **001_initial_schema.sql** - Uses `IF NOT EXISTS` so it won't error on existing tables
3. **002_rls_policies.sql** - Uses `DROP POLICY IF EXISTS` so it's safe to re-run
4. **003_seed_data.sql** - Uses `ON CONFLICT` so it won't duplicate seed data

## Common Issues and Solutions

### Issue: "policy already exists"
**Solution**: The `002_rls_policies.sql` now includes `DROP POLICY IF EXISTS` before creating each policy. This makes it safe to re-run.

### Issue: "column email does not exist"
**Solution**: Run `000_fix_existing_schema.sql` first. It will add the email column if it's missing.

### Issue: "relation already exists"
**Solution**: The `001_initial_schema.sql` now uses `CREATE TABLE IF NOT EXISTS` so it's safe to re-run.

### Issue: Duplicate key violations in seed data
**Solution**: The `003_seed_data.sql` now uses `ON CONFLICT DO UPDATE` so it updates existing records instead of failing.

## Manual Reset (If needed)

If you need to completely reset the database:

```sql
-- WARNING: This will delete all data!
DROP TABLE IF EXISTS triggers CASCADE;
DROP TABLE IF EXISTS booking_notes CASCADE;
DROP TABLE IF EXISTS knowledge_base CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS call_logs CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Then run the migrations in order: 001, 002, 003
```

## Verification

After running migrations, verify everything is set up correctly:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'locations', 'call_logs', 'bookings', 'knowledge_base', 'booking_notes', 'triggers');

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'locations', 'call_logs', 'bookings', 'knowledge_base', 'booking_notes', 'triggers');

-- Check seed data
SELECT id, email, name, business_type, tier FROM profiles ORDER BY created_at;
```

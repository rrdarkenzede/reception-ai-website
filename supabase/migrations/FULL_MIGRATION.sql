-- ============================================
-- FULL MIGRATION SCRIPT FOR SUPABASE SQL EDITOR
-- Execute this entire script in one go
-- ============================================

-- ============================================
-- STEP 1: Enable required extensions
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 2: Fix existing constraints (Drop bad ones)
-- ============================================
DO $$
BEGIN
    -- 2.1 profiles table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        -- Remove NOT NULL on business_type
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            AND column_name = 'business_type' 
            AND is_nullable = 'NO'
        ) THEN
            ALTER TABLE profiles ALTER COLUMN business_type DROP NOT NULL;
        END IF;

        -- Drop FK to auth.users
        IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'profiles_id_fkey' 
            AND table_name = 'profiles'
        ) THEN
            ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;
        END IF;

        -- Drop CHECK constraints (to be re-added likely with new values)
        IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'profiles_business_type_check' 
            AND table_name = 'profiles'
        ) THEN
            ALTER TABLE profiles DROP CONSTRAINT profiles_business_type_check;
        END IF;

        IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'profiles_tier_check' 
            AND table_name = 'profiles'
        ) THEN
            ALTER TABLE profiles DROP CONSTRAINT profiles_tier_check;
        END IF;
    END IF;
    
    -- 2.2 bookings table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings') THEN
        -- Drop NOT NULLs
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'start_time' AND is_nullable = 'NO') THEN
            ALTER TABLE bookings ALTER COLUMN start_time DROP NOT NULL;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'end_time' AND is_nullable = 'NO') THEN
            ALTER TABLE bookings ALTER COLUMN end_time DROP NOT NULL;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'service' AND is_nullable = 'NO') THEN
            ALTER TABLE bookings ALTER COLUMN service DROP NOT NULL;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'notes' AND is_nullable = 'NO') THEN
            ALTER TABLE bookings ALTER COLUMN notes DROP NOT NULL;
        END IF;

        -- Drop CHECK constraints
        IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'bookings_status_check' 
            AND table_name = 'bookings'
        ) THEN
            ALTER TABLE bookings DROP CONSTRAINT bookings_status_check;
        END IF;
    END IF;

    -- 2.3 call_logs table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'call_logs') THEN
        -- Drop CHECK constraints
        IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'call_logs_type_check' AND table_name = 'call_logs') THEN
            ALTER TABLE call_logs DROP CONSTRAINT call_logs_type_check;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'call_logs_status_check' AND table_name = 'call_logs') THEN
            ALTER TABLE call_logs DROP CONSTRAINT call_logs_status_check;
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'call_logs_sentiment_score_check' AND table_name = 'call_logs') THEN
            ALTER TABLE call_logs DROP CONSTRAINT call_logs_sentiment_score_check;
        END IF;
    END IF;

    -- 2.4 triggers table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'triggers') THEN
        IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'triggers_trigger_type_check' AND table_name = 'triggers') THEN
            ALTER TABLE triggers DROP CONSTRAINT triggers_trigger_type_check;
        END IF;
    END IF;
END $$;

-- ============================================
-- STEP 3: Drop existing triggers (to avoid conflicts)
-- ============================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;

-- ============================================
-- STEP 4: Create tables (IF NOT EXISTS)
-- ============================================

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  company_name TEXT,
  -- Note: constraints are added in Step 5.5 to ensure they are up to date
  business_type TEXT, 
  tier TEXT DEFAULT 'starter',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call Logs
CREATE TABLE IF NOT EXISTS call_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  caller_name TEXT,
  caller_phone TEXT,
  type TEXT,
  status TEXT,
  duration INTEGER,
  recording_url TEXT,
  transcript TEXT,
  sentiment_score INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT DEFAULT 'pending',
  internal_notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge Base
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking Notes
CREATE TABLE IF NOT EXISTS booking_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mentions TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers
CREATE TABLE IF NOT EXISTS triggers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT,
  condition JSONB NOT NULL,
  action JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 5: Add ALL missing columns
-- ============================================
DO $$
BEGIN
    -- [Profiles]
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
            ALTER TABLE profiles ADD COLUMN email TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'name') THEN
            ALTER TABLE profiles ADD COLUMN name TEXT DEFAULT 'Unknown';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'company_name') THEN
            ALTER TABLE profiles ADD COLUMN company_name TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_type') THEN
            ALTER TABLE profiles ADD COLUMN business_type TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'tier') THEN
            ALTER TABLE profiles ADD COLUMN tier TEXT DEFAULT 'starter';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'settings') THEN
            ALTER TABLE profiles ADD COLUMN settings JSONB DEFAULT '{}';
        END IF;
    END IF;

    -- [Bookings]
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'location_id') THEN
            ALTER TABLE bookings ADD COLUMN location_id UUID REFERENCES locations(id) ON DELETE SET NULL;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'client_name') THEN
            ALTER TABLE bookings ADD COLUMN client_name TEXT DEFAULT 'Unknown';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'phone') THEN
            ALTER TABLE bookings ADD COLUMN phone TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'email') THEN
            ALTER TABLE bookings ADD COLUMN email TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'date') THEN
            ALTER TABLE bookings ADD COLUMN date DATE;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'time') THEN
            ALTER TABLE bookings ADD COLUMN time TIME;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'status') THEN
            ALTER TABLE bookings ADD COLUMN status TEXT DEFAULT 'pending';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'metadata') THEN
            ALTER TABLE bookings ADD COLUMN metadata JSONB DEFAULT '{}';
        END IF;
         IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'internal_notes') THEN
            ALTER TABLE bookings ADD COLUMN internal_notes TEXT;
        END IF;
    END IF;

    -- [Call Logs]
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'call_logs') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'call_logs' AND column_name = 'location_id') THEN
            ALTER TABLE call_logs ADD COLUMN location_id UUID REFERENCES locations(id) ON DELETE SET NULL;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'call_logs' AND column_name = 'caller_name') THEN
            ALTER TABLE call_logs ADD COLUMN caller_name TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'call_logs' AND column_name = 'caller_phone') THEN
            ALTER TABLE call_logs ADD COLUMN caller_phone TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'call_logs' AND column_name = 'type') THEN
            ALTER TABLE call_logs ADD COLUMN type TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'call_logs' AND column_name = 'status') THEN
            ALTER TABLE call_logs ADD COLUMN status TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'call_logs' AND column_name = 'duration') THEN
            ALTER TABLE call_logs ADD COLUMN duration INTEGER;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'call_logs' AND column_name = 'sentiment_score') THEN
            ALTER TABLE call_logs ADD COLUMN sentiment_score INTEGER;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'call_logs' AND column_name = 'metadata') THEN
            ALTER TABLE call_logs ADD COLUMN metadata JSONB DEFAULT '{}';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'call_logs' AND column_name = 'transcript') THEN
            ALTER TABLE call_logs ADD COLUMN transcript TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'call_logs' AND column_name = 'recording_url') THEN
            ALTER TABLE call_logs ADD COLUMN recording_url TEXT;
        END IF;
    END IF;
END $$;

-- ============================================
-- STEP 5.5: Apply Check Constraints (Re-create)
-- ============================================

-- Profiles Constraints
ALTER TABLE profiles ADD CONSTRAINT profiles_business_type_check 
    CHECK (business_type IS NULL OR business_type IN ('restaurant', 'beauty', 'fitness', 'medical', 'legal', 'real_estate', 'automotive', 'trades'));

ALTER TABLE profiles ADD CONSTRAINT profiles_tier_check 
    CHECK (tier IN ('starter', 'pro', 'elite'));

-- Call Logs Constraints
ALTER TABLE call_logs ADD CONSTRAINT call_logs_type_check 
    CHECK (type IN ('incoming', 'outgoing'));

ALTER TABLE call_logs ADD CONSTRAINT call_logs_status_check 
    CHECK (status IN ('completed', 'missed', 'in_progress', 'cancelled'));

ALTER TABLE call_logs ADD CONSTRAINT call_logs_sentiment_score_check 
    CHECK (sentiment_score >= 1 AND sentiment_score <= 10);

-- Bookings Constraints
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'noshow', 'waitlist', 'completed'));

-- Triggers Constraints
ALTER TABLE triggers ADD CONSTRAINT triggers_trigger_type_check 
    CHECK (trigger_type IN ('on_my_way', 'no_show', 'waitlist_auto_fill', 'custom'));


-- ============================================
-- STEP 6: Create indexes (IF NOT EXISTS)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_call_logs_profile_id ON call_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_profile_id ON bookings(profile_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_profile_id ON knowledge_base(profile_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_triggers_profile_id ON triggers(profile_id);
CREATE INDEX IF NOT EXISTS idx_triggers_active ON triggers(is_active) WHERE is_active = true;

-- ============================================
-- STEP 7: Create updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- STEP 8: Apply updated_at triggers
-- ============================================
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 9: Enable Row Level Security
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE triggers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 10: RLS Policies (with DROP IF EXISTS first)
-- ============================================

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id::text = auth.uid()::text
      AND settings->>'role' = 'admin'
    )
  );

-- LOCATIONS POLICIES
DROP POLICY IF EXISTS "Users can read own locations" ON locations;
DROP POLICY IF EXISTS "Users can insert own locations" ON locations;
DROP POLICY IF EXISTS "Users can update own locations" ON locations;
DROP POLICY IF EXISTS "Users can delete own locations" ON locations;

CREATE POLICY "Users can read own locations"
  ON locations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = locations.profile_id
      AND profiles.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own locations"
  ON locations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = locations.profile_id
      AND profiles.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can update own locations"
  ON locations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = locations.profile_id
      AND profiles.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete own locations"
  ON locations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = locations.profile_id
      AND profiles.id::text = auth.uid()::text
    )
  );

-- CALL_LOGS POLICIES
DROP POLICY IF EXISTS "Users can read own call logs" ON call_logs;
DROP POLICY IF EXISTS "Service role can insert call logs" ON call_logs;

CREATE POLICY "Users can read own call logs"
  ON call_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = call_logs.profile_id
      AND profiles.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Service role can insert call logs"
  ON call_logs FOR INSERT
  WITH CHECK (true);

-- BOOKINGS POLICIES
DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can insert own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can delete own bookings" ON bookings;

CREATE POLICY "Users can read own bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = bookings.profile_id
      AND profiles.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own bookings"
  ON bookings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = bookings.profile_id
      AND profiles.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = bookings.profile_id
      AND profiles.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete own bookings"
  ON bookings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = bookings.profile_id
      AND profiles.id::text = auth.uid()::text
    )
  );

-- KNOWLEDGE_BASE POLICIES
DROP POLICY IF EXISTS "Users can read own knowledge base" ON knowledge_base;
DROP POLICY IF EXISTS "Users can insert own knowledge base" ON knowledge_base;
DROP POLICY IF EXISTS "Users can update own knowledge base" ON knowledge_base;
DROP POLICY IF EXISTS "Users can delete own knowledge base" ON knowledge_base;

CREATE POLICY "Users can read own knowledge base"
  ON knowledge_base FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = knowledge_base.profile_id
      AND profiles.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own knowledge base"
  ON knowledge_base FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = knowledge_base.profile_id
      AND profiles.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can update own knowledge base"
  ON knowledge_base FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = knowledge_base.profile_id
      AND profiles.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete own knowledge base"
  ON knowledge_base FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = knowledge_base.profile_id
      AND profiles.id::text = auth.uid()::text
    )
  );

-- BOOKING_NOTES POLICIES
DROP POLICY IF EXISTS "Users can read notes for own bookings" ON booking_notes;
DROP POLICY IF EXISTS "Users can insert notes for own bookings" ON booking_notes;

CREATE POLICY "Users can read notes for own bookings"
  ON booking_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      JOIN profiles ON profiles.id = bookings.profile_id
      WHERE bookings.id = booking_notes.booking_id
      AND profiles.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert notes for own bookings"
  ON booking_notes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      JOIN profiles ON profiles.id = bookings.profile_id
      WHERE bookings.id = booking_notes.booking_id
      AND profiles.id::text = auth.uid()::text
    )
  );

-- TRIGGERS POLICIES
DROP POLICY IF EXISTS "Users can read own triggers" ON triggers;
DROP POLICY IF EXISTS "Users can insert own triggers" ON triggers;
DROP POLICY IF EXISTS "Users can update own triggers" ON triggers;
DROP POLICY IF EXISTS "Users can delete own triggers" ON triggers;

CREATE POLICY "Users can read own triggers"
  ON triggers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = triggers.profile_id
      AND profiles.id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own triggers"
  ON triggers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = triggers.profile_id
      AND profiles.id::text = auth.uid()::text
      AND profiles.tier = 'elite'
    )
  );

CREATE POLICY "Users can update own triggers"
  ON triggers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = triggers.profile_id
      AND profiles.id::text = auth.uid()::text
      AND profiles.tier = 'elite'
    )
  );

CREATE POLICY "Users can delete own triggers"
  ON triggers FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = triggers.profile_id
      AND profiles.id::text = auth.uid()::text
      AND profiles.tier = 'elite'
    )
  );

-- ============================================
-- STEP 11: Clean up existing demo data first
-- ============================================
DELETE FROM knowledge_base WHERE id IN (
    '00000000-0000-0000-0000-000000000090',
    '00000000-0000-0000-0000-000000000091',
    '00000000-0000-0000-0000-000000000092'
);
DELETE FROM call_logs WHERE id IN (
    '00000000-0000-0000-0000-000000000030',
    '00000000-0000-0000-0000-000000000031',
    '00000000-0000-0000-0000-000000000032',
    '00000000-0000-0000-0000-000000000060'
);
DELETE FROM bookings WHERE id IN (
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000021',
    '00000000-0000-0000-0000-000000000022',
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000041',
    '00000000-0000-0000-0000-000000000042',
    '00000000-0000-0000-0000-000000000050',
    '00000000-0000-0000-0000-000000000070',
    '00000000-0000-0000-0000-000000000080'
);
DELETE FROM locations WHERE id = '00000000-0000-0000-0000-000000000010';
DELETE FROM profiles WHERE id IN (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000006'
);

-- ============================================
-- STEP 12: Seed Data (fresh inserts)
-- ============================================

-- SUPER ADMIN
INSERT INTO profiles (id, email, name, company_name, business_type, tier, settings) 
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@saas.com', 'Super Admin', 'Omni-AI Manager', NULL, 'elite', '{"role": "admin"}'::jsonb);

-- LUIGI PIZZA (Restaurant) - Tier 3
INSERT INTO profiles (id, email, name, company_name, business_type, tier, settings) 
VALUES ('00000000-0000-0000-0000-000000000002', 'luigi@luigipizza.it', 'Luigi Rossi', 'Luigi Pizza', 'restaurant', 'elite', '{}'::jsonb);

-- Location for Luigi Pizza
INSERT INTO locations (id, profile_id, name, address, settings) 
VALUES ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', 'Paris Branch', '123 Rue de la Pizza, 75001 Paris', '{}'::jsonb);

-- Bookings for Luigi Pizza
INSERT INTO bookings (id, profile_id, location_id, client_name, phone, date, time, status, metadata) 
VALUES 
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'Marie Martin', '+33612345678', CURRENT_DATE + INTERVAL '1 day', '19:00', 'confirmed', '{"guests": 4, "table_pref": "window", "dietary": ["gluten_free"]}'::jsonb),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'Paul Bernard', '+33623456789', CURRENT_DATE + INTERVAL '1 day', '20:00', 'confirmed', '{"guests": 2, "table_pref": "quiet"}'::jsonb),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'Sophie Leroy', '+33634567890', CURRENT_DATE + INTERVAL '2 days', '20:30', 'pending', '{"guests": 6, "dietary": ["vegetarian"]}'::jsonb);

-- Call logs for Luigi Pizza
INSERT INTO call_logs (id, profile_id, location_id, caller_name, caller_phone, type, status, duration, sentiment_score, metadata, created_at) 
VALUES 
  ('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'Marie Martin', '+33612345678', 'incoming', 'completed', 180, 8, '{"topic": "gluten_free_options"}'::jsonb, NOW() - INTERVAL '2 hours'),
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'Jean Dupont', '+33645678901', 'incoming', 'completed', 240, 7, '{"topic": "gluten_free_menu"}'::jsonb, NOW() - INTERVAL '1 hour'),
  ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'Claire Moreau', '+33656789012', 'incoming', 'completed', 120, 9, '{"topic": "celiac_options"}'::jsonb, NOW() - INTERVAL '30 minutes');

-- SPEEDY GARAGE (Automotive) - Tier 2
INSERT INTO profiles (id, email, name, company_name, business_type, tier, settings) 
VALUES ('00000000-0000-0000-0000-000000000003', 'contact@speedygarage.fr', 'Pierre Speed', 'Speedy Garage', 'automotive', 'pro', '{}'::jsonb);

-- Bookings for Speedy Garage
INSERT INTO bookings (id, profile_id, client_name, phone, date, time, status, metadata) 
VALUES 
  ('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000003', 'Marc Durand', '+33612345678', CURRENT_DATE, '10:00', 'confirmed', '{"vehicle_brand": "Peugeot", "vehicle_model": "308", "license_plate": "AB-123-CD", "repair_type": "Révision", "status": "workshop", "estimated_cost": 350}'::jsonb),
  ('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000003', 'Julie Martin', '+33623456789', CURRENT_DATE, '14:00', 'confirmed', '{"vehicle_brand": "Renault", "vehicle_model": "Clio", "license_plate": "EF-456-GH", "repair_type": "Pneumatiques", "status": "waiting", "estimated_cost": 280}'::jsonb),
  ('00000000-0000-0000-0000-000000000042', '00000000-0000-0000-0000-000000000003', 'Thomas Bernard', '+33634567890', CURRENT_DATE - INTERVAL '1 day', '09:00', 'completed', '{"vehicle_brand": "Citroën", "vehicle_model": "C3", "license_plate": "IJ-789-KL", "repair_type": "Vidange", "status": "ready", "estimated_cost": 120}'::jsonb);

-- DR HOUSE (Medical) - Tier 3
INSERT INTO profiles (id, email, name, company_name, business_type, tier, settings) 
VALUES ('00000000-0000-0000-0000-000000000004', 'dr.house@medical.fr', 'Dr. House', 'Dr House Medical', 'medical', 'elite', '{}'::jsonb);

-- Bookings for Dr House
INSERT INTO bookings (id, profile_id, client_name, phone, date, time, status, metadata) 
VALUES ('00000000-0000-0000-0000-000000000050', '00000000-0000-0000-0000-000000000004', 'Patient Urgent', '+33612345678', CURRENT_DATE, '16:00', 'confirmed', '{"urgency": "urgent", "symptoms": ["fièvre", "toux"], "previous_visit": false}'::jsonb);

-- Call logs for Dr House
INSERT INTO call_logs (id, profile_id, caller_name, caller_phone, type, status, duration, sentiment_score, metadata, created_at) 
VALUES ('00000000-0000-0000-0000-000000000060', '00000000-0000-0000-0000-000000000004', 'Patient Urgent', '+33612345678', 'incoming', 'completed', 300, 6, '{"topic": "urgent_consultation", "symptoms": ["fièvre", "toux"]}'::jsonb, NOW() - INTERVAL '1 hour');

-- GLAM SALON (Beauty) - Tier 1
INSERT INTO profiles (id, email, name, company_name, business_type, tier, settings) 
VALUES ('00000000-0000-0000-0000-000000000005', 'contact@glamsalon.fr', 'Sophie Glam', 'Glam Salon', 'beauty', 'starter', '{}'::jsonb);

-- Booking for Glam Salon
INSERT INTO bookings (id, profile_id, client_name, phone, date, time, status, metadata) 
VALUES ('00000000-0000-0000-0000-000000000070', '00000000-0000-0000-0000-000000000005', 'Marie Wedding', '+33612345678', CURRENT_DATE + INTERVAL '7 days', '10:00', 'confirmed', '{"service_type": "Other", "duration": 180, "cabin": "VIP-1", "stylist": "Sophie", "notes": "Bridal Makeup"}'::jsonb);

-- JOE PLUMBER (Trades) - Tier 2
INSERT INTO profiles (id, email, name, company_name, business_type, tier, settings) 
VALUES ('00000000-0000-0000-0000-000000000006', 'joe@joeplumber.fr', 'Joe Plumber', 'Joe Plumber Services', 'trades', 'pro', '{}'::jsonb);

-- Intervention for Joe Plumber
INSERT INTO bookings (id, profile_id, client_name, phone, date, time, status, metadata) 
VALUES ('00000000-0000-0000-0000-000000000080', '00000000-0000-0000-0000-000000000006', 'Client Urgence', '+33612345678', CURRENT_DATE, '11:00', 'confirmed', '{"address": "12 Rue de la Paix, 75002 Paris", "access_code": "A1234", "problem_desc": "Fuite d''eau urgente", "tradesman_type": "Plumber", "status": "scheduled"}'::jsonb);

-- Knowledge base entries for Luigi Pizza
INSERT INTO knowledge_base (id, profile_id, question, answer, category, is_active) 
VALUES 
  ('00000000-0000-0000-0000-000000000090', '00000000-0000-0000-0000-000000000002', 'Do we have parking?', 'Yes, we have a parking lot available behind the restaurant with 20 spaces.', 'qa', true),
  ('00000000-0000-0000-0000-000000000091', '00000000-0000-0000-0000-000000000002', 'What are your business hours?', 'We are open Monday to Sunday from 12:00 to 14:30 for lunch and 19:00 to 23:00 for dinner.', 'business_hours', true),
  ('00000000-0000-0000-0000-000000000092', '00000000-0000-0000-0000-000000000002', 'Do you have gluten-free options?', 'Yes, we offer a complete gluten-free menu with pizza, pasta, and dessert options.', 'qa', true);

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================

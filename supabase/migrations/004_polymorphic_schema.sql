-- ============================================================================
-- OMNI-AI MANAGER: POLYMORPHIC SCHEMA MIGRATION
-- Creates enums, updates tables, and establishes RLS for multi-sector support
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: CREATE ENUMS
-- ============================================================================

-- Business Type Enum (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_type_enum') THEN
        CREATE TYPE business_type_enum AS ENUM (
            'restaurant',
            'automotive', 
            'medical',
            'beauty',
            'trades',
            'real_estate'
        );
    END IF;
END $$;

-- Tier Enum (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tier_enum') THEN
        CREATE TYPE tier_enum AS ENUM (
            'starter',
            'pro',
            'elite'
        );
    END IF;
END $$;

-- ============================================================================
-- STEP 2: UPDATE PROFILES TABLE
-- ============================================================================

-- Add webhook_url column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'webhook_url'
    ) THEN
        ALTER TABLE profiles ADD COLUMN webhook_url TEXT;
    END IF;
END $$;

-- Add summary column to call_logs if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'call_logs' AND column_name = 'summary'
    ) THEN
        ALTER TABLE call_logs ADD COLUMN summary TEXT;
    END IF;
END $$;

-- Add sentiment column to call_logs if it doesn't exist (as text for flexibility)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'call_logs' AND column_name = 'sentiment'
    ) THEN
        ALTER TABLE call_logs ADD COLUMN sentiment TEXT;
    END IF;
END $$;

-- ============================================================================
-- STEP 3: ENSURE REQUIRED TABLES EXIST
-- ============================================================================

-- Profiles table (recreate if needed with all required columns)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    name TEXT NOT NULL,
    company_name TEXT,
    business_type TEXT CHECK (business_type IN (
        'restaurant', 'automotive', 'medical', 'beauty', 
        'trades', 'real_estate', 'fitness', 'legal',
        'dentiste', 'garage', 'immobilier', 'juridique',
        'beaute', 'sport', 'autoecole', 'veterinaire', 'clinique'
    )),
    tier TEXT CHECK (tier IN ('starter', 'pro', 'elite')) DEFAULT 'starter',
    webhook_url TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations table for multi-site support (Elite tier)
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call logs with polymorphic metadata (CRITICAL TABLE)
CREATE TABLE IF NOT EXISTS call_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    caller_name TEXT,
    caller_phone TEXT,
    type TEXT CHECK (type IN ('incoming', 'outgoing')),
    status TEXT CHECK (status IN ('completed', 'missed', 'in_progress', 'cancelled')),
    duration INTEGER, -- in seconds
    recording_url TEXT,
    transcript TEXT,
    summary TEXT, -- AI-generated summary
    sentiment TEXT, -- positive, negative, neutral
    sentiment_score INTEGER CHECK (sentiment_score >= 1 AND sentiment_score <= 10),
    -- CRITICAL: Polymorphic metadata column
    -- Stores unstructured sector-specific data like:
    -- Restaurant: { "guests": 4, "occasion": "birthday", "dietary": "gluten-free" }
    -- Automotive: { "car": "Audi A3", "plate": "AB-123-CD", "issue": "Brake Noise" }
    -- Medical: { "symptom": "Acute Toothache", "pain_level": 9, "urgent": true }
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 4: CREATE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_call_logs_profile_id ON call_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_location_id ON call_logs(location_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_logs_sentiment ON call_logs(sentiment);
CREATE INDEX IF NOT EXISTS idx_call_logs_metadata ON call_logs USING GIN (metadata);

CREATE INDEX IF NOT EXISTS idx_locations_profile_id ON locations(profile_id);
CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_profiles_business_type ON profiles(business_type);
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON profiles(tier);

-- ============================================================================
-- STEP 5: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own locations" ON locations;
DROP POLICY IF EXISTS "Users can manage own locations" ON locations;
DROP POLICY IF EXISTS "Users can read own call logs" ON call_logs;
DROP POLICY IF EXISTS "Users can insert own call logs" ON call_logs;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Locations policies
CREATE POLICY "Users can read own locations" ON locations
    FOR SELECT
    USING (profile_id = auth.uid());

CREATE POLICY "Users can manage own locations" ON locations
    FOR ALL
    USING (profile_id = auth.uid())
    WITH CHECK (profile_id = auth.uid());

-- Call Logs policies
CREATE POLICY "Users can read own call logs" ON call_logs
    FOR SELECT
    USING (profile_id = auth.uid());

CREATE POLICY "Users can insert own call logs" ON call_logs
    FOR INSERT
    WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- STEP 6: UPDATE TIMESTAMP TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to locations table
DROP TRIGGER IF EXISTS update_locations_updated_at ON locations;
CREATE TRIGGER update_locations_updated_at 
    BEFORE UPDATE ON locations
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

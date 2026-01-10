-- Fix migration for existing schemas
-- This handles cases where tables exist but are missing columns or have incorrect structure
-- Run this FIRST if you have existing tables with schema issues

-- Fix profiles table: Add missing columns
DO $$
BEGIN
    -- Add email column if missing
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
            ALTER TABLE profiles ADD COLUMN email TEXT;
            UPDATE profiles SET email = 'migrated_' || id::text || '@example.com' WHERE email IS NULL;
            ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;
            ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
        END IF;
        
        -- Add name column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'name') THEN
            ALTER TABLE profiles ADD COLUMN name TEXT NOT NULL DEFAULT 'Unknown';
            ALTER TABLE profiles ALTER COLUMN name DROP DEFAULT;
        END IF;
        
        -- Add company_name column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'company_name') THEN
            ALTER TABLE profiles ADD COLUMN company_name TEXT;
        END IF;
        
        -- Add business_type column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_type') THEN
            ALTER TABLE profiles ADD COLUMN business_type TEXT;
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_business_type_check') THEN
                ALTER TABLE profiles ADD CONSTRAINT profiles_business_type_check 
                    CHECK (business_type IS NULL OR business_type IN ('restaurant', 'beauty', 'fitness', 'medical', 'legal', 'real_estate', 'automotive', 'trades'));
            END IF;
        END IF;
        
        -- Add tier column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'tier') THEN
            ALTER TABLE profiles ADD COLUMN tier TEXT DEFAULT 'starter';
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_tier_check') THEN
                ALTER TABLE profiles ADD CONSTRAINT profiles_tier_check 
                    CHECK (tier IN ('starter', 'pro', 'elite'));
            END IF;
        END IF;
        
        -- Add settings column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'settings') THEN
            ALTER TABLE profiles ADD COLUMN settings JSONB DEFAULT '{}';
        END IF;
        
        -- Add created_at column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'created_at') THEN
            ALTER TABLE profiles ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
        END IF;
        
        -- Add updated_at column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
            ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
        END IF;
    END IF;
END $$;

-- Fix bookings table: Add missing columns
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings') THEN
        -- Add profile_id column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'profile_id') THEN
            ALTER TABLE bookings ADD COLUMN profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
        END IF;
        
        -- Add location_id column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'location_id') THEN
            ALTER TABLE bookings ADD COLUMN location_id UUID;
        END IF;
        
        -- Add client_name column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'client_name') THEN
            ALTER TABLE bookings ADD COLUMN client_name TEXT NOT NULL DEFAULT 'Unknown';
            ALTER TABLE bookings ALTER COLUMN client_name DROP DEFAULT;
        END IF;
        
        -- Add email column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'email') THEN
            ALTER TABLE bookings ADD COLUMN email TEXT;
        END IF;
        
        -- Add phone column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'phone') THEN
            ALTER TABLE bookings ADD COLUMN phone TEXT;
        END IF;
        
        -- Add date column if missing (THIS IS THE CRITICAL ONE)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'date') THEN
            ALTER TABLE bookings ADD COLUMN date DATE NOT NULL DEFAULT CURRENT_DATE;
            ALTER TABLE bookings ALTER COLUMN date DROP DEFAULT;
        END IF;
        
        -- Add time column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'time') THEN
            ALTER TABLE bookings ADD COLUMN time TIME NOT NULL DEFAULT '12:00:00';
            ALTER TABLE bookings ALTER COLUMN time DROP DEFAULT;
        END IF;
        
        -- Add status column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'status') THEN
            ALTER TABLE bookings ADD COLUMN status TEXT DEFAULT 'pending';
            IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_status_check') THEN
                ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
                    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'noshow', 'waitlist', 'completed'));
            END IF;
        END IF;
        
        -- Add internal_notes column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'internal_notes') THEN
            ALTER TABLE bookings ADD COLUMN internal_notes TEXT;
        END IF;
        
        -- Add metadata column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'metadata') THEN
            ALTER TABLE bookings ADD COLUMN metadata JSONB DEFAULT '{}';
        END IF;
        
        -- Add created_at column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'created_at') THEN
            ALTER TABLE bookings ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
        END IF;
        
        -- Add updated_at column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'updated_at') THEN
            ALTER TABLE bookings ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
        END IF;
    END IF;
END $$;

-- Fix locations table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'locations') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'locations' AND column_name = 'settings') THEN
            ALTER TABLE locations ADD COLUMN settings JSONB DEFAULT '{}';
        END IF;
    END IF;
END $$;

-- Ensure all constraints are in place for profiles
DO $$
BEGIN
    -- Add unique constraint on email if it doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_key') THEN
            ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
        END IF;
    END IF;
END $$;

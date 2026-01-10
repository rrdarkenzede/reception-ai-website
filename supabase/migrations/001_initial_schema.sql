-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for fresh start)
-- Uncomment the following lines if you need to reset everything:
-- DROP TABLE IF EXISTS triggers CASCADE;
-- DROP TABLE IF EXISTS booking_notes CASCADE;
-- DROP TABLE IF EXISTS knowledge_base CASCADE;
-- DROP TABLE IF EXISTS bookings CASCADE;
-- DROP TABLE IF EXISTS call_logs CASCADE;
-- DROP TABLE IF EXISTS locations CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- Profiles with polymorphic business_type
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  company_name TEXT,
  business_type TEXT CHECK (business_type IN ('restaurant', 'beauty', 'fitness', 'medical', 'legal', 'real_estate', 'automotive', 'trades')),
  tier TEXT CHECK (tier IN ('starter', 'pro', 'elite')) DEFAULT 'starter',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Multi-location support (Elite tier)
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced call logs with sentiment
CREATE TABLE IF NOT EXISTS call_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  caller_name TEXT,
  caller_phone TEXT,
  type TEXT CHECK (type IN ('incoming', 'outgoing')),
  status TEXT CHECK (status IN ('completed', 'missed', 'in_progress', 'cancelled')),
  duration INTEGER, -- seconds
  recording_url TEXT,
  transcript TEXT,
  sentiment_score INTEGER CHECK (sentiment_score >= 1 AND sentiment_score <= 10),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings with polymorphic metadata
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'noshow', 'waitlist', 'completed')) DEFAULT 'pending',
  internal_notes TEXT,
  metadata JSONB DEFAULT '{}', -- Sector-specific data (guests, vehicle, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base (AI Brain)
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT, -- 'business_hours', 'qa', 'policies', etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team collaboration (Internal notes with @mentions)
CREATE TABLE IF NOT EXISTS booking_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mentions TEXT[], -- Array of mentioned user IDs
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Smart triggers configuration (Elite tier)
CREATE TABLE IF NOT EXISTS triggers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT CHECK (trigger_type IN ('on_my_way', 'no_show', 'waitlist_auto_fill', 'custom')),
  condition JSONB NOT NULL,
  action JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_call_logs_profile_id ON call_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_created_at ON call_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_profile_id ON bookings(profile_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_profile_id ON knowledge_base(profile_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_triggers_profile_id ON triggers(profile_id);
CREATE INDEX IF NOT EXISTS idx_triggers_active ON triggers(is_active) WHERE is_active = true;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE triggers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Super admin can read all profiles (assuming admin profile has id matching auth.uid)
-- This would need to be adjusted based on your auth setup
CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id::text = auth.uid()::text
      AND settings->>'role' = 'admin'
    )
  );

-- RLS Policies for locations
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

-- RLS Policies for call_logs
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
  WITH CHECK (true); -- Webhook service role will insert

-- RLS Policies for bookings
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

-- RLS Policies for knowledge_base
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

-- RLS Policies for booking_notes
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

-- RLS Policies for triggers
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
      AND profiles.tier = 'elite' -- Only Elite tier
    )
  );

CREATE POLICY "Users can update own triggers"
  ON triggers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = triggers.profile_id
      AND profiles.id::text = auth.uid()::text
      AND profiles.tier = 'elite' -- Only Elite tier
    )
  );

CREATE POLICY "Users can delete own triggers"
  ON triggers FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = triggers.profile_id
      AND profiles.id::text = auth.uid()::text
      AND profiles.tier = 'elite' -- Only Elite tier
    )
  );

-- Seed Data for Omni-AI Manager
-- This script uses ON CONFLICT DO NOTHING to allow safe re-runs

-- Ensure email column exists (fix for existing tables)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'email'
    ) THEN
        ALTER TABLE profiles ADD COLUMN email TEXT UNIQUE;
    END IF;
END $$;

-- SUPER ADMIN
INSERT INTO profiles (id, email, name, company_name, business_type, tier, settings) 
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@saas.com', 'Super Admin', 'Omni-AI Manager', NULL, 'elite', '{"role": "admin"}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email, 
    name = EXCLUDED.name, 
    company_name = EXCLUDED.company_name, 
    business_type = EXCLUDED.business_type, 
    tier = EXCLUDED.tier, 
    settings = EXCLUDED.settings;

-- LUIGI PIZZA (Restaurant) - Tier 3
INSERT INTO profiles (id, email, name, company_name, business_type, tier, settings) 
VALUES ('00000000-0000-0000-0000-000000000002', 'luigi@luigipizza.it', 'Luigi Rossi', 'Luigi Pizza', 'restaurant', 'elite', '{}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email, 
    name = EXCLUDED.name, 
    company_name = EXCLUDED.company_name, 
    business_type = EXCLUDED.business_type, 
    tier = EXCLUDED.tier, 
    settings = EXCLUDED.settings;

-- Location for Luigi Pizza
INSERT INTO locations (id, profile_id, name, address, settings) 
VALUES ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', 'Paris Branch', '123 Rue de la Pizza, 75001 Paris', '{}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET profile_id = EXCLUDED.profile_id, 
    name = EXCLUDED.name, 
    address = EXCLUDED.address, 
    settings = EXCLUDED.settings;

-- Bookings for Luigi Pizza
INSERT INTO bookings (id, profile_id, location_id, client_name, phone, date, time, status, metadata) 
VALUES 
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'Marie Martin', '+33612345678', CURRENT_DATE + INTERVAL '1 day', '19:00', 'confirmed', '{"guests": 4, "table_pref": "window", "dietary": ["gluten_free"]}'::jsonb),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'Paul Bernard', '+33623456789', CURRENT_DATE + INTERVAL '1 day', '20:00', 'confirmed', '{"guests": 2, "table_pref": "quiet"}'::jsonb),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'Sophie Leroy', '+33634567890', CURRENT_DATE + INTERVAL '2 days', '20:30', 'pending', '{"guests": 6, "dietary": ["vegetarian"]}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET profile_id = EXCLUDED.profile_id, 
    location_id = EXCLUDED.location_id, 
    client_name = EXCLUDED.client_name, 
    phone = EXCLUDED.phone, 
    date = EXCLUDED.date, 
    time = EXCLUDED.time, 
    status = EXCLUDED.status, 
    metadata = EXCLUDED.metadata;

-- Call logs for Luigi Pizza (about Gluten)
INSERT INTO call_logs (id, profile_id, location_id, caller_name, caller_phone, type, status, duration, sentiment_score, metadata, created_at) 
VALUES 
  ('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'Marie Martin', '+33612345678', 'incoming', 'completed', 180, 8, '{"topic": "gluten_free_options"}'::jsonb, NOW() - INTERVAL '2 hours'),
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'Jean Dupont', '+33645678901', 'incoming', 'completed', 240, 7, '{"topic": "gluten_free_menu"}'::jsonb, NOW() - INTERVAL '1 hour'),
  ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000010', 'Claire Moreau', '+33656789012', 'incoming', 'completed', 120, 9, '{"topic": "celiac_options"}'::jsonb, NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO UPDATE 
SET profile_id = EXCLUDED.profile_id, 
    location_id = EXCLUDED.location_id, 
    caller_name = EXCLUDED.caller_name, 
    caller_phone = EXCLUDED.caller_phone, 
    type = EXCLUDED.type, 
    status = EXCLUDED.status, 
    duration = EXCLUDED.duration, 
    sentiment_score = EXCLUDED.sentiment_score, 
    metadata = EXCLUDED.metadata, 
    created_at = EXCLUDED.created_at;

-- SPEEDY GARAGE (Automotive) - Tier 2
INSERT INTO profiles (id, email, name, company_name, business_type, tier, settings) 
VALUES ('00000000-0000-0000-0000-000000000003', 'contact@speedygarage.fr', 'Pierre Speed', 'Speedy Garage', 'automotive', 'pro', '{}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email, 
    name = EXCLUDED.name, 
    company_name = EXCLUDED.company_name, 
    business_type = EXCLUDED.business_type, 
    tier = EXCLUDED.tier, 
    settings = EXCLUDED.settings;

-- Bookings for Speedy Garage
INSERT INTO bookings (id, profile_id, client_name, phone, date, time, status, metadata) 
VALUES 
  ('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000003', 'Marc Durand', '+33612345678', CURRENT_DATE, '10:00', 'confirmed', '{"vehicle_brand": "Peugeot", "vehicle_model": "308", "license_plate": "AB-123-CD", "repair_type": "Révision", "status": "workshop", "estimated_cost": 350}'::jsonb),
  ('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000003', 'Julie Martin', '+33623456789', CURRENT_DATE, '14:00', 'confirmed', '{"vehicle_brand": "Renault", "vehicle_model": "Clio", "license_plate": "EF-456-GH", "repair_type": "Pneumatiques", "status": "waiting", "estimated_cost": 280}'::jsonb),
  ('00000000-0000-0000-0000-000000000042', '00000000-0000-0000-0000-000000000003', 'Thomas Bernard', '+33634567890', CURRENT_DATE - INTERVAL '1 day', '09:00', 'completed', '{"vehicle_brand": "Citroën", "vehicle_model": "C3", "license_plate": "IJ-789-KL", "repair_type": "Vidange", "status": "ready", "estimated_cost": 120}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET profile_id = EXCLUDED.profile_id, 
    client_name = EXCLUDED.client_name, 
    phone = EXCLUDED.phone, 
    date = EXCLUDED.date, 
    time = EXCLUDED.time, 
    status = EXCLUDED.status, 
    metadata = EXCLUDED.metadata;

-- DR HOUSE (Medical) - Tier 3
INSERT INTO profiles (id, email, name, company_name, business_type, tier, settings) 
VALUES ('00000000-0000-0000-0000-000000000004', 'dr.house@medical.fr', 'Dr. House', 'Dr House Medical', 'medical', 'elite', '{}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email, 
    name = EXCLUDED.name, 
    company_name = EXCLUDED.company_name, 
    business_type = EXCLUDED.business_type, 
    tier = EXCLUDED.tier, 
    settings = EXCLUDED.settings;

-- Bookings for Dr House (Urgent patient)
INSERT INTO bookings (id, profile_id, client_name, phone, date, time, status, metadata) 
VALUES ('00000000-0000-0000-0000-000000000050', '00000000-0000-0000-0000-000000000004', 'Patient Urgent', '+33612345678', CURRENT_DATE, '16:00', 'confirmed', '{"urgency": "urgent", "symptoms": ["fièvre", "toux"], "previous_visit": false}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET profile_id = EXCLUDED.profile_id, 
    client_name = EXCLUDED.client_name, 
    phone = EXCLUDED.phone, 
    date = EXCLUDED.date, 
    time = EXCLUDED.time, 
    status = EXCLUDED.status, 
    metadata = EXCLUDED.metadata;

-- Call logs for Dr House
INSERT INTO call_logs (id, profile_id, caller_name, caller_phone, type, status, duration, sentiment_score, metadata, created_at) 
VALUES ('00000000-0000-0000-0000-000000000060', '00000000-0000-0000-0000-000000000004', 'Patient Urgent', '+33612345678', 'incoming', 'completed', 300, 6, '{"topic": "urgent_consultation", "symptoms": ["fièvre", "toux"]}'::jsonb, NOW() - INTERVAL '1 hour')
ON CONFLICT (id) DO UPDATE 
SET profile_id = EXCLUDED.profile_id, 
    caller_name = EXCLUDED.caller_name, 
    caller_phone = EXCLUDED.caller_phone, 
    type = EXCLUDED.type, 
    status = EXCLUDED.status, 
    duration = EXCLUDED.duration, 
    sentiment_score = EXCLUDED.sentiment_score, 
    metadata = EXCLUDED.metadata, 
    created_at = EXCLUDED.created_at;

-- GLAM SALON (Beauty) - Tier 1
INSERT INTO profiles (id, email, name, company_name, business_type, tier, settings) 
VALUES ('00000000-0000-0000-0000-000000000005', 'contact@glamsalon.fr', 'Sophie Glam', 'Glam Salon', 'beauty', 'starter', '{}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email, 
    name = EXCLUDED.name, 
    company_name = EXCLUDED.company_name, 
    business_type = EXCLUDED.business_type, 
    tier = EXCLUDED.tier, 
    settings = EXCLUDED.settings;

-- Booking for Glam Salon (Bridal Makeup)
INSERT INTO bookings (id, profile_id, client_name, phone, date, time, status, metadata) 
VALUES ('00000000-0000-0000-0000-000000000070', '00000000-0000-0000-0000-000000000005', 'Marie Wedding', '+33612345678', CURRENT_DATE + INTERVAL '7 days', '10:00', 'confirmed', '{"service_type": "Other", "duration": 180, "cabin": "VIP-1", "stylist": "Sophie", "notes": "Bridal Makeup"}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET profile_id = EXCLUDED.profile_id, 
    client_name = EXCLUDED.client_name, 
    phone = EXCLUDED.phone, 
    date = EXCLUDED.date, 
    time = EXCLUDED.time, 
    status = EXCLUDED.status, 
    metadata = EXCLUDED.metadata;

-- JOE PLUMBER (Trades) - Tier 2
INSERT INTO profiles (id, email, name, company_name, business_type, tier, settings) 
VALUES ('00000000-0000-0000-0000-000000000006', 'joe@joeplumber.fr', 'Joe Plumber', 'Joe Plumber Services', 'trades', 'pro', '{}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email, 
    name = EXCLUDED.name, 
    company_name = EXCLUDED.company_name, 
    business_type = EXCLUDED.business_type, 
    tier = EXCLUDED.tier, 
    settings = EXCLUDED.settings;

-- Intervention for Joe Plumber
INSERT INTO bookings (id, profile_id, client_name, phone, date, time, status, metadata) 
VALUES ('00000000-0000-0000-0000-000000000080', '00000000-0000-0000-0000-000000000006', 'Client Urgence', '+33612345678', CURRENT_DATE, '11:00', 'confirmed', '{"address": "12 Rue de la Paix, 75002 Paris", "access_code": "A1234", "problem_desc": "Fuite d''eau urgente", "tradesman_type": "Plumber", "status": "scheduled"}'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET profile_id = EXCLUDED.profile_id, 
    client_name = EXCLUDED.client_name, 
    phone = EXCLUDED.phone, 
    date = EXCLUDED.date, 
    time = EXCLUDED.time, 
    status = EXCLUDED.status, 
    metadata = EXCLUDED.metadata;

-- Knowledge base entries for Luigi Pizza
INSERT INTO knowledge_base (id, profile_id, question, answer, category, is_active) 
VALUES 
  ('00000000-0000-0000-0000-000000000090', '00000000-0000-0000-0000-000000000002', 'Do we have parking?', 'Yes, we have a parking lot available behind the restaurant with 20 spaces.', 'qa', true),
  ('00000000-0000-0000-0000-000000000091', '00000000-0000-0000-0000-000000000002', 'What are your business hours?', 'We are open Monday to Sunday from 12:00 to 14:30 for lunch and 19:00 to 23:00 for dinner.', 'business_hours', true),
  ('00000000-0000-0000-0000-000000000092', '00000000-0000-0000-0000-000000000002', 'Do you have gluten-free options?', 'Yes, we offer a complete gluten-free menu with pizza, pasta, and dessert options.', 'qa', true)
ON CONFLICT (id) DO UPDATE 
SET profile_id = EXCLUDED.profile_id, 
    question = EXCLUDED.question, 
    answer = EXCLUDED.answer, 
    category = EXCLUDED.category, 
    is_active = EXCLUDED.is_active;

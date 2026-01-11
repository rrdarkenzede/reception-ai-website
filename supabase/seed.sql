-- ============================================================================
-- OMNI-AI MANAGER: RICH SEED DATA
-- Demonstrates polymorphic metadata for different business sectors
-- ============================================================================

-- ============================================================================
-- PROJECT 1: LUIGI PIZZA (Restaurant) - Elite Tier
-- ============================================================================

-- Profile for Luigi Pizza
INSERT INTO profiles (
    id, 
    email, 
    name, 
    company_name, 
    business_type, 
    tier, 
    webhook_url,
    settings
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'luigi@luigipizza.it',
    'Luigi Rossi',
    'Luigi Pizza',
    'restaurant',
    'elite',
    'https://hook.eu1.make.com/luigipizza-webhook',
    '{"theme": "warm", "currency": "EUR", "language": "fr"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    company_name = EXCLUDED.company_name,
    business_type = EXCLUDED.business_type,
    tier = EXCLUDED.tier,
    webhook_url = EXCLUDED.webhook_url,
    settings = EXCLUDED.settings;

-- Location for Luigi Pizza
INSERT INTO locations (
    id,
    profile_id,
    name,
    address,
    phone,
    email,
    settings
) VALUES (
    '11111111-1111-1111-1111-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Luigi Pizza - Paris Centre',
    '42 Rue de la Pizza, 75001 Paris, France',
    '+33 1 42 42 42 42',
    'paris@luigipizza.it',
    '{"tables": 20, "capacity": 80}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    profile_id = EXCLUDED.profile_id,
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    settings = EXCLUDED.settings;

-- CRITICAL: Call log with RESTAURANT-SPECIFIC METADATA
INSERT INTO call_logs (
    id,
    profile_id,
    location_id,
    caller_name,
    caller_phone,
    type,
    status,
    duration,
    summary,
    sentiment,
    sentiment_score,
    metadata,
    created_at
) VALUES (
    '11111111-1111-1111-1111-333333333333',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-222222222222',
    'Marie Dupont',
    '+33 6 12 34 56 78',
    'incoming',
    'completed',
    245, -- 4 minutes 5 seconds
    'Client souhaite réserver pour un anniversaire. Demande une table calme près de la fenêtre. Régime sans gluten.',
    'positive',
    8,
    -- POLYMORPHIC RESTAURANT METADATA
    '{
        "guests": 4,
        "occasion": "birthday",
        "dietary": "gluten-free",
        "table_preference": "window",
        "special_requests": ["birthday cake", "quiet area"],
        "reservation_date": "2026-01-15",
        "reservation_time": "20:00"
    }'::jsonb,
    NOW() - INTERVAL '2 hours'
) ON CONFLICT (id) DO UPDATE SET
    profile_id = EXCLUDED.profile_id,
    location_id = EXCLUDED.location_id,
    caller_name = EXCLUDED.caller_name,
    caller_phone = EXCLUDED.caller_phone,
    type = EXCLUDED.type,
    status = EXCLUDED.status,
    duration = EXCLUDED.duration,
    summary = EXCLUDED.summary,
    sentiment = EXCLUDED.sentiment,
    sentiment_score = EXCLUDED.sentiment_score,
    metadata = EXCLUDED.metadata,
    created_at = EXCLUDED.created_at;

-- ============================================================================
-- PROJECT 2: SPEEDY GARAGE (Automotive) - Pro Tier
-- ============================================================================

-- Profile for Speedy Garage
INSERT INTO profiles (
    id,
    email,
    name,
    company_name,
    business_type,
    tier,
    webhook_url,
    settings
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'contact@speedygarage.fr',
    'Pierre Mécano',
    'Speedy Garage',
    'automotive',
    'pro',
    'https://hook.eu1.make.com/speedygarage-webhook',
    '{"specialty": "german_cars", "currency": "EUR"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    company_name = EXCLUDED.company_name,
    business_type = EXCLUDED.business_type,
    tier = EXCLUDED.tier,
    webhook_url = EXCLUDED.webhook_url,
    settings = EXCLUDED.settings;

-- Location for Speedy Garage
INSERT INTO locations (
    id,
    profile_id,
    name,
    address,
    phone,
    email,
    settings
) VALUES (
    '22222222-2222-2222-2222-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'Speedy Garage - Atelier Principal',
    '15 Avenue des Mécaniciens, 92100 Boulogne-Billancourt',
    '+33 1 55 55 55 55',
    'atelier@speedygarage.fr',
    '{"bays": 6, "specialties": ["german", "french"]}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    profile_id = EXCLUDED.profile_id,
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    settings = EXCLUDED.settings;

-- CRITICAL: Call log with AUTOMOTIVE-SPECIFIC METADATA
INSERT INTO call_logs (
    id,
    profile_id,
    location_id,
    caller_name,
    caller_phone,
    type,
    status,
    duration,
    summary,
    sentiment,
    sentiment_score,
    metadata,
    created_at
) VALUES (
    '22222222-2222-2222-2222-444444444444',
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-333333333333',
    'Jean-Marc Conducteur',
    '+33 6 98 76 54 32',
    'incoming',
    'completed',
    180, -- 3 minutes
    'Client signale un bruit de freinage sur son Audi A3. Souhaite un diagnostic rapide. Véhicule immatriculé AB-123-CD.',
    'neutral',
    6,
    -- POLYMORPHIC AUTOMOTIVE METADATA
    '{
        "car": "Audi A3",
        "plate": "AB-123-CD",
        "issue": "Brake Noise",
        "year": 2021,
        "mileage": 45000,
        "urgency": "medium",
        "preferred_date": "2026-01-12",
        "estimated_repair": "Disques + plaquettes",
        "estimated_cost": 450
    }'::jsonb,
    NOW() - INTERVAL '1 hour'
) ON CONFLICT (id) DO UPDATE SET
    profile_id = EXCLUDED.profile_id,
    location_id = EXCLUDED.location_id,
    caller_name = EXCLUDED.caller_name,
    caller_phone = EXCLUDED.caller_phone,
    type = EXCLUDED.type,
    status = EXCLUDED.status,
    duration = EXCLUDED.duration,
    summary = EXCLUDED.summary,
    sentiment = EXCLUDED.sentiment,
    sentiment_score = EXCLUDED.sentiment_score,
    metadata = EXCLUDED.metadata,
    created_at = EXCLUDED.created_at;

-- ============================================================================
-- PROJECT 3: DR HOUSE (Medical) - Elite Tier
-- ============================================================================

-- Profile for Dr House
INSERT INTO profiles (
    id,
    email,
    name,
    company_name,
    business_type,
    tier,
    webhook_url,
    settings
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    'dr.house@cabinet-medical.fr',
    'Dr. Gregory House',
    'Dr House',
    'medical',
    'elite',
    'https://hook.eu1.make.com/drhouse-webhook',
    '{"specialty": "dentistry", "emergency_enabled": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    company_name = EXCLUDED.company_name,
    business_type = EXCLUDED.business_type,
    tier = EXCLUDED.tier,
    webhook_url = EXCLUDED.webhook_url,
    settings = EXCLUDED.settings;

-- Location for Dr House
INSERT INTO locations (
    id,
    profile_id,
    name,
    address,
    phone,
    email,
    settings
) VALUES (
    '33333333-3333-3333-3333-444444444444',
    '33333333-3333-3333-3333-333333333333',
    'Cabinet Dentaire Dr House',
    '8 Rue de la Santé, 75014 Paris',
    '+33 1 44 44 44 44',
    'rdv@dr-house.fr',
    '{"rooms": 3, "emergency_slot": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    profile_id = EXCLUDED.profile_id,
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    settings = EXCLUDED.settings;

-- CRITICAL: Call log with MEDICAL-SPECIFIC METADATA
INSERT INTO call_logs (
    id,
    profile_id,
    location_id,
    caller_name,
    caller_phone,
    type,
    status,
    duration,
    summary,
    sentiment,
    sentiment_score,
    metadata,
    created_at
) VALUES (
    '33333333-3333-3333-3333-555555555555',
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-444444444444',
    'Sophie Souffrance',
    '+33 6 11 22 33 44',
    'incoming',
    'completed',
    120, -- 2 minutes
    'Patiente en urgence avec une douleur dentaire aiguë. Niveau de douleur 9/10. Demande un RDV en urgence.',
    'negative',
    3,
    -- POLYMORPHIC MEDICAL METADATA
    '{
        "symptom": "Acute Toothache",
        "pain_level": 9,
        "urgent": true,
        "location": "lower right molar",
        "duration": "since yesterday",
        "medication_taken": ["ibuprofen"],
        "allergies": ["penicillin"],
        "last_visit": "2025-06-15",
        "insurance": "CPAM + Mutuelle"
    }'::jsonb,
    NOW() - INTERVAL '30 minutes'
) ON CONFLICT (id) DO UPDATE SET
    profile_id = EXCLUDED.profile_id,
    location_id = EXCLUDED.location_id,
    caller_name = EXCLUDED.caller_name,
    caller_phone = EXCLUDED.caller_phone,
    type = EXCLUDED.type,
    status = EXCLUDED.status,
    duration = EXCLUDED.duration,
    summary = EXCLUDED.summary,
    sentiment = EXCLUDED.sentiment,
    sentiment_score = EXCLUDED.sentiment_score,
    metadata = EXCLUDED.metadata,
    created_at = EXCLUDED.created_at;

-- ============================================================================
-- ADDITIONAL CALL LOGS FOR DEMO VARIETY
-- ============================================================================

-- Additional Restaurant call (reservation cancel)
INSERT INTO call_logs (
    id,
    profile_id,
    location_id,
    caller_name,
    caller_phone,
    type,
    status,
    duration,
    summary,
    sentiment,
    sentiment_score,
    metadata,
    created_at
) VALUES (
    '11111111-1111-1111-1111-444444444444',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-222222222222',
    'Pierre Annulation',
    '+33 6 55 66 77 88',
    'incoming',
    'completed',
    90,
    'Client annule sa réservation pour ce soir. Raison: empêchement professionnel.',
    'neutral',
    5,
    '{
        "action": "cancellation",
        "original_guests": 6,
        "original_date": "2026-01-11",
        "reason": "work emergency"
    }'::jsonb,
    NOW() - INTERVAL '4 hours'
) ON CONFLICT (id) DO UPDATE SET
    metadata = EXCLUDED.metadata;

-- Additional Automotive call (quote request)
INSERT INTO call_logs (
    id,
    profile_id,
    location_id,
    caller_name,
    caller_phone,
    type,
    status,
    duration,
    summary,
    sentiment,
    sentiment_score,
    metadata,
    created_at
) VALUES (
    '22222222-2222-2222-2222-555555555555',
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-333333333333',
    'Marie Voiture',
    '+33 6 44 33 22 11',
    'incoming',
    'completed',
    210,
    'Demande de devis pour vidange + révision complète BMW Série 3.',
    'positive',
    7,
    '{
        "car": "BMW 320d",
        "plate": "CD-456-EF",
        "issue": "Full Service",
        "year": 2019,
        "mileage": 78000,
        "services_requested": ["oil change", "filters", "brake check", "tire rotation"]
    }'::jsonb,
    NOW() - INTERVAL '3 hours'
) ON CONFLICT (id) DO UPDATE SET
    metadata = EXCLUDED.metadata;

-- ============================================================================
-- REQUIRED EXACT POLYMORPHIC METADATA (SPEC)
-- ============================================================================

-- Garage: { "car": "Audi RS6", "plate": "WIND-SURF", "status": "In Progress" }
INSERT INTO call_logs (
    id,
    profile_id,
    location_id,
    caller_name,
    caller_phone,
    type,
    status,
    duration,
    summary,
    sentiment,
    sentiment_score,
    metadata,
    created_at
) VALUES (
    '22222222-2222-2222-2222-666666666666',
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-333333333333',
    'Client Garage Demo',
    '+33 6 00 00 00 01',
    'incoming',
    'completed',
    95,
    'Seed: Garage metadata exact.',
    'neutral',
    5,
    '{
        "car": "Audi RS6",
        "plate": "WIND-SURF",
        "status": "In Progress"
    }'::jsonb,
    NOW() - INTERVAL '10 minutes'
) ON CONFLICT (id) DO UPDATE SET
    metadata = EXCLUDED.metadata,
    sentiment = EXCLUDED.sentiment,
    sentiment_score = EXCLUDED.sentiment_score;

-- Resto: { "guests": 2, "dietary": "Vegan", "occasion": "Date Night" }
INSERT INTO call_logs (
    id,
    profile_id,
    location_id,
    caller_name,
    caller_phone,
    type,
    status,
    duration,
    summary,
    sentiment,
    sentiment_score,
    metadata,
    created_at
) VALUES (
    '11111111-1111-1111-1111-555555555555',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-222222222222',
    'Client Resto Demo',
    '+33 6 00 00 00 02',
    'incoming',
    'completed',
    80,
    'Seed: Restaurant metadata exact.',
    'positive',
    8,
    '{
        "guests": 2,
        "dietary": "Vegan",
        "occasion": "Date Night"
    }'::jsonb,
    NOW() - INTERVAL '12 minutes'
) ON CONFLICT (id) DO UPDATE SET
    metadata = EXCLUDED.metadata,
    sentiment = EXCLUDED.sentiment,
    sentiment_score = EXCLUDED.sentiment_score;

-- Medical: { "symptom": "Chest Pain", "urgent": true, "history": "Cardiac" }
INSERT INTO call_logs (
    id,
    profile_id,
    location_id,
    caller_name,
    caller_phone,
    type,
    status,
    duration,
    summary,
    sentiment,
    sentiment_score,
    metadata,
    created_at
) VALUES (
    '33333333-3333-3333-3333-666666666666',
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-444444444444',
    'Patient Demo',
    '+33 6 00 00 00 03',
    'incoming',
    'completed',
    110,
    'Seed: Medical metadata exact.',
    'urgent',
    2,
    '{
        "symptom": "Chest Pain",
        "urgent": true,
        "history": "Cardiac"
    }'::jsonb,
    NOW() - INTERVAL '8 minutes'
) ON CONFLICT (id) DO UPDATE SET
    metadata = EXCLUDED.metadata,
    sentiment = EXCLUDED.sentiment,
    sentiment_score = EXCLUDED.sentiment_score;

-- ============================================================================
-- SEED DATA COMPLETE
-- ============================================================================

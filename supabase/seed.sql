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
-- PROJECT 4: MARIO RESTAURANT (Restaurant) - Elite Tier - FRENCH EDITION
-- ============================================================================

-- Profile for Mario Restaurant
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
    '44444444-4444-4444-4444-444444444444',
    'mario@restopro.com',
    'Mario Chef',
    'Mario Restaurant',
    'restaurant',
    'elite',
    'https://hook.eu1.make.com/mario-webhook',
    '{
        "theme": "warm", 
        "currency": "EUR", 
        "language": "fr",
        "restaurant_config": {
            "menu_items": [
                {
                    "id": "pizza_margherita",
                    "name": "Pizza Margherita",
                    "category": "Pizza",
                    "price": 12,
                    "available": true
                },
                {
                    "id": "pizza_reine",
                    "name": "Pizza Reine",
                    "category": "Pizza", 
                    "price": 14,
                    "available": true
                },
                {
                    "id": "pizza_truffe",
                    "name": "Truffe Deluxe",
                    "category": "Pizza",
                    "price": 22,
                    "available": true
                },
                {
                    "id": "tiramisu",
                    "name": "Tiramisu Maison",
                    "category": "Dessert",
                    "price": 8,
                    "available": true
                },
                {
                    "id": "cafe_gourmand",
                    "name": "Café Gourmand",
                    "category": "Dessert",
                    "price": 9,
                    "available": true
                }
            ],
            "promo": {
                "natural_text": "Menu enfant offert",
                "active": false
            }
        }
    }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    company_name = EXCLUDED.company_name,
    business_type = EXCLUDED.business_type,
    tier = EXCLUDED.tier,
    webhook_url = EXCLUDED.webhook_url,
    settings = EXCLUDED.settings;

-- Location for Mario Restaurant
INSERT INTO locations (
    id,
    profile_id,
    name,
    address,
    phone,
    email,
    settings
) VALUES (
    '44444444-4444-4444-4444-555555555555',
    '44444444-4444-4444-4444-444444444444',
    'Mario Restaurant - Paris Centre',
    '123 Rue de la Gastronomie, 75008 Paris, France',
    '+33 1 88 88 88 88',
    'contact@mario-restaurant.fr',
    '{"tables": 25, "capacity": 100}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    profile_id = EXCLUDED.profile_id,
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    settings = EXCLUDED.settings;

-- Mock Reservations for Mario Restaurant
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
) VALUES 
(
    '44444444-4444-4444-4444-666666666666',
    '44444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-555555555555',
    'Mme. Dupont',
    '+33 6 11 22 33 44',
    'incoming',
    'completed',
    180,
    'Réservation VIP pour 2 personnes. Demande table près de la fenêtre. Allergie noix.',
    'positive',
    9,
    '{
        "guests": 2,
        "occasion": "VIP",
        "dietary": "nuts allergy",
        "table_preference": "window",
        "reservation_date": "2026-01-11",
        "reservation_time": "19:30",
        "status": "confirmed"
    }'::jsonb,
    NOW() - INTERVAL '1 hour'
),
(
    '44444444-4444-4444-4444-777777777777',
    '44444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-555555555555',
    'M. Martin',
    '+33 6 55 44 33 22',
    'incoming',
    'completed',
    240,
    'Réservation anniversaire pour 6 personnes. Souhaite gâteau personnalisé.',
    'positive',
    8,
    '{
        "guests": 6,
        "occasion": "birthday",
        "special_requests": ["birthday cake", "large table"],
        "reservation_date": "2026-01-11",
        "reservation_time": "20:00",
        "status": "confirmed"
    }'::jsonb,
    NOW() - INTERVAL '2 hours'
),
(
    '44444444-4444-4444-4444-888888888888',
    '44444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-555555555555',
    'Sophie Client',
    '+33 6 99 88 77 66',
    'incoming',
    'completed',
    120,
    'Demande de renseignement pour menu végétarien.',
    'neutral',
    6,
    '{
        "guests": 4,
        "dietary": "vegetarian",
        "inquiry": "vegetarian options",
        "reservation_date": "2026-01-12",
        "reservation_time": "19:00",
        "status": "pending"
    }'::jsonb,
    NOW() - INTERVAL '3 hours'
);

-- ============================================================================
-- PROJECT 5: KEBAB PALACE (Restaurant) - Elite Tier - FRENCH KEBAB EDITION
-- ============================================================================

-- Profile for Kebab Palace
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
    '55555555-5555-5555-5555-555555555555',
    'contact@kebab-palace.fr',
    'Ahmet Chef',
    'Kebab Palace',
    'restaurant',
    'elite',
    'https://hook.eu1.make.com/kebab-webhook',
    '{
        "theme": "warm", 
        "currency": "EUR", 
        "language": "fr",
        "restaurant_config": {
            "menu_items": [
                {
                    "id": "kebab_classique",
                    "name": "Kebab Classique",
                    "category": "Kebab",
                    "price": 8.50,
                    "available": true
                },
                {
                    "id": "kebab_veau",
                    "name": "Kebab Veau",
                    "category": "Kebab", 
                    "price": 10.00,
                    "available": true
                },
                {
                    "id": "kebab_chicken",
                    "name": "Kebab Chicken",
                    "category": "Kebab",
                    "price": 9.00,
                    "available": true
                },
                {
                    "id": "assiette_kebab",
                    "name": "Assiette Kebab",
                    "category": "Plat",
                    "price": 12.00,
                    "available": true
                },
                {
                    "id": "frites",
                    "name": "Frites Maison",
                    "category": "Accompagnement",
                    "price": 3.00,
                    "available": true
                },
                {
                    "id": "soda",
                    "name": "Soda 33cl",
                    "category": "Boisson",
                    "price": 2.00,
                    "available": true
                }
            ],
            "promo": {
                "natural_text": "Menu kebab + frites + boisson à 10€",
                "active": true,
                "push_mode": true
            }
        }
    }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    company_name = EXCLUDED.company_name,
    business_type = EXCLUDED.business_type,
    tier = EXCLUDED.tier,
    webhook_url = EXCLUDED.webhook_url,
    settings = EXCLUDED.settings;

-- Location for Kebab Palace
INSERT INTO locations (
    id,
    profile_id,
    name,
    address,
    phone,
    email,
    settings
) VALUES (
    '55555555-5555-5555-5555-666666666666',
    '55555555-5555-5555-5555-555555555555',
    'Kebab Palace - Centre Ville',
    '45 Rue du Kebab, 75010 Paris, France',
    '+33 1 99 99 99 99',
    'contact@kebab-palace.fr',
    '{"tables": 15, "capacity": 60}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    profile_id = EXCLUDED.profile_id,
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    settings = EXCLUDED.settings;

-- Mock Reservations for Kebab Palace
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
) VALUES 
(
    '55555555-5555-5555-5555-777777777777',
    '55555555-5555-5555-5555-555555555555',
    '55555555-5555-5555-5555-666666666666',
    'Karim Client',
    '+33 6 77 88 99 00',
    'incoming',
    'completed',
    120,
    'Client veut réserver pour 8 personnes, fête d\'anniversaire. Demande table séparée.',
    'positive',
    8,
    '{
        "guests": 8,
        "occasion": "birthday",
        "special_requests": ["table séparée", "gâteau anniversaire"],
        "reservation_date": "2026-01-11",
        "reservation_time": "20:00",
        "status": "confirmed"
    }'::jsonb,
    NOW() - INTERVAL '30 minutes'
),
(
    '55555555-5555-5555-5555-888888888888',
    '55555555-5555-5555-5555-555555555555',
    '55555555-5555-5555-5555-666666666666',
    'Sophie Livraison',
    '+33 6 55 44 33 22',
    'incoming',
    'completed',
    90,
    'Demande livraison kebab veau pour 4 personnes. Adresse confirmée.',
    'positive',
    7,
    '{
        "guests": 4,
        "order_type": "delivery",
        "special_requests": ["sauce blanche en plus", "livraison rapide"],
        "reservation_date": "2026-01-11",
        "reservation_time": "19:30",
        "status": "confirmed"
    }'::jsonb,
    NOW() - INTERVAL '1 hour'
),
(
    '55555555-5555-5555-5555-999999999999',
    '55555555-5555-5555-5555-555555555555',
    '55555555-5555-5555-5555-666666666666',
    'Marc Emporter',
    '+33 6 33 22 11 00',
    'incoming',
    'completed',
    60,
    'Commande à emporter 2 kebabs classiques. Viendra chercher dans 15 minutes.',
    'neutral',
    6,
    '{
        "guests": 2,
        "order_type": "takeaway",
        "special_requests": ["sans oignon"],
        "reservation_date": "2026-01-11",
        "reservation_time": "19:15",
        "status": "pending"
    }'::jsonb,
    NOW() - INTERVAL '45 minutes'
);

-- ============================================================================
-- PRO BRAIN KNOWLEDGE INJECTION - 20+ Professional Restaurant Q&A Nodes
-- ============================================================================

-- Update Luigi Pizza with Pro Brain Knowledge (Elite Tier)
UPDATE profiles 
SET settings = settings || jsonb_build_object(
    'ai_knowledge', '[
        {"id": "1", "trigger": "Parking", "response": "Oui, nous avons un parking privé surveillé à l''arrière."},
        {"id": "2", "trigger": "Halal", "response": "Toutes nos viandes sont certifiées Halal. Options végétariennes disponibles."},
        {"id": "3", "trigger": "Végétarien", "response": "Oui, nous proposons 4 plats végétariens et une option Vegan."},
        {"id": "4", "trigger": "Allergies", "response": "Merci de le préciser au serveur. Carte des allergènes disponible sur demande."},
        {"id": "5", "trigger": "Sans Gluten", "response": "Nos risottos sont sans gluten (traces possibles en cuisine)."},
        {"id": "6", "trigger": "Tickets Resto", "response": "Oui, carte Swile, Edenred et tickets papier (max 2)."},
        {"id": "7", "trigger": "Horaires Fériés", "response": "Ouvert tous les jours fériés sauf 25 déc. et 1er janv."},
        {"id": "8", "trigger": "Menu Enfant", "response": "Menu Bambino à 12€ avec plat, boisson et glace."},
        {"id": "9", "trigger": "Chaises Hautes", "response": "Oui, nous en avons 4 à disposition."},
        {"id": "10", "trigger": "Chiens", "response": "Les petits chiens tenus en laisse sont acceptés en terrasse."},
        {"id": "11", "trigger": "Groupes", "response": "Au-delà de 10 personnes, menu groupe obligatoire. Envoyez un email."},
        {"id": "12", "trigger": "Anniversaire", "response": "Gâteau sur commande (48h avant) ou droit d''assiette de 2€/pers."},
        {"id": "13", "trigger": "Wifi", "response": "Réseau: ''RestoGuest'', MDP: ''BonAppetit''."},
        {"id": "14", "trigger": "Terrasse", "response": "Oui, terrasse chauffée ouverte toute l''année."},
        {"id": "15", "trigger": "Livraison", "response": "Uniquement via UberEats et Deliveroo."},
        {"id": "16", "trigger": "Emporter", "response": "-10% sur toute la carte à emporter."},
        {"id": "17", "trigger": "Tenue", "response": "Décontractée chic."},
        {"id": "18", "trigger": "Amex", "response": "Non, Visa et Mastercard uniquement."},
        {"id": "19", "trigger": "PMR", "response": "Oui, accès plain-pied et toilettes adaptées."},
        {"id": "20", "trigger": "Retard", "response": "Nous gardons la table 15 minutes max."},
        {"id": "21", "trigger": "Réservation", "response": "Réservation recommandée le week-end. Appelez le 01 42 42 42 42."},
        {"id": "22", "trigger": "Vins", "response": "Carte de vins italiens avec 20 références. Verre 6€, bouteille 25€."}
    ]'::jsonb
)
WHERE email = 'luigi@luigipizza.it';

-- Update Mario Restaurant with Pro Brain Knowledge
UPDATE profiles 
SET settings = settings || jsonb_build_object(
    'ai_knowledge', '[
        {"id": "1", "trigger": "Parking", "response": "Oui, nous avons un parking privé surveillé à l''arrière."},
        {"id": "2", "trigger": "Halal", "response": "Toutes nos viandes sont certifiées Halal. Options végétariennes disponibles."},
        {"id": "3", "trigger": "Végétarien", "response": "Oui, nous proposons 4 plats végétariens et une option Vegan."},
        {"id": "4", "trigger": "Allergies", "response": "Merci de le préciser au serveur. Carte des allergènes disponible sur demande."},
        {"id": "5", "trigger": "Sans Gluten", "response": "Nos risottos sont sans gluten (traces possibles en cuisine)."},
        {"id": "6", "trigger": "Tickets Resto", "response": "Oui, carte Swile, Edenred et tickets papier (max 2)."},
        {"id": "7", "trigger": "Horaires Fériés", "response": "Ouvert tous les jours fériés sauf 25 déc. et 1er janv."},
        {"id": "8", "trigger": "Menu Enfant", "response": "Menu Bambino à 12€ avec plat, boisson et glace."},
        {"id": "9", "trigger": "Chaises Hautes", "response": "Oui, nous en avons 4 à disposition."},
        {"id": "10", "trigger": "Chiens", "response": "Les petits chiens tenus en laisse sont acceptés en terrasse."},
        {"id": "11", "trigger": "Groupes", "response": "Au-delà de 10 personnes, menu groupe obligatoire. Envoyez un email."},
        {"id": "12", "trigger": "Anniversaire", "response": "Gâteau sur commande (48h avant) ou droit d''assiette de 2€/pers."},
        {"id": "13", "trigger": "Wifi", "response": "Réseau: ''RestoGuest'', MDP: ''BonAppetit''."},
        {"id": "14", "trigger": "Terrasse", "response": "Oui, terrasse chauffée ouverte toute l''année."},
        {"id": "15", "trigger": "Livraison", "response": "Uniquement via UberEats et Deliveroo."},
        {"id": "16", "trigger": "Emporter", "response": "-10% sur toute la carte à emporter."},
        {"id": "17", "trigger": "Tenue", "response": "Décontractée chic."},
        {"id": "18", "trigger": "Amex", "response": "Non, Visa et Mastercard uniquement."},
        {"id": "19", "trigger": "PMR", "response": "Oui, accès plain-pied et toilettes adaptées."},
        {"id": "20", "trigger": "Retard", "response": "Nous gardons la table 15 minutes max."},
        {"id": "21", "trigger": "Réservation", "response": "Réservation recommandée le week-end. Appelez le 06 12 34 56 78."},
        {"id": "22", "trigger": "Vins", "response": "Carte de vins française avec 15 références. Verre 5€, bouteille 22€."}
    ]'::jsonb
)
WHERE email = 'mario@restopro.com';

-- Update Kebab Palace with Pro Brain Knowledge
UPDATE profiles 
SET settings = settings || jsonb_build_object(
    'ai_knowledge', '[
        {"id": "1", "trigger": "Parking", "response": "Oui, nous avons un parking privé gratuit pour nos clients avec 15 places."},
        {"id": "2", "trigger": "Halal", "response": "Tous nos plats sont certifiés Halal. Viande de fournisseur agréé."},
        {"id": "3", "trigger": "Végétarien", "response": "Falafel, salade composée et assiette végétarienne disponibles."},
        {"id": "4", "trigger": "Allergies", "response": "Nous pouvons adapter les plats. Merci de préciser allergies."},
        {"id": "5", "trigger": "Sans Gluten", "response": "Nos salades sont sans gluten. Pain sans gluten disponible."},
        {"id": "6", "trigger": "Tickets Resto", "response": "Oui, nous acceptons tous les tickets restaurant jusqu''à 20€."},
        {"id": "7", "trigger": "Horaires Fériés", "response": "Ouvert tous les jours fériés de 11h à 23h."},
        {"id": "8", "trigger": "Menu Enfant", "response": "Menu enfant 8€ avec mini-kebab, frites et boisson."},
        {"id": "9", "trigger": "Chaises Hautes", "response": "Non, nous n''avons pas de chaises hautes."},
        {"id": "10", "trigger": "Chiens", "response": "Animaux non autorisés à l''intérieur, terrasse uniquement."},
        {"id": "11", "trigger": "Groupes", "response": "Groupes bienvenus! Menu spécial à 15€/pers pour 10+ personnes."},
        {"id": "12", "trigger": "Anniversaire", "response": "Offert pour le birthday boy/girl! Menu gratuit pour la personne."},
        {"id": "13", "trigger": "Wifi", "response": "Wifi gratuit: ''KebabPalace'', MDP: ''Bienvenue''."},
        {"id": "14", "trigger": "Terrasse", "response": "Terrasse de 20 places, ouverte d''avril à octobre."},
        {"id": "15", "trigger": "Livraison", "response": "Livraison gratuite à partir de 15€ dans un rayon de 3km."},
        {"id": "16", "trigger": "Emporter", "response": "-10% sur commande à emporter, prête en 15 minutes."},
        {"id": "17", "trigger": "Tenue", "response": "Décontractée, venez comme vous êtes!"},
        {"id": "18", "trigger": "Amex", "response": "Oui, nous acceptons American Express et toutes les cartes."},
        {"id": "19", "trigger": "PMR", "response": "Accès facile, pas de marches. Toilettes adaptées disponibles."},
        {"id": "20", "trigger": "Retard", "response": "Pas de problème, votre commande sera conservée 20 minutes."},
        {"id": "21", "trigger": "Sandwich", "response": "10 sandwichs différents: kebab, merguez, poulet, végétarien..."},
        {"id": "22", "trigger": "Boissons", "response": "Sodas, jus frais, bières artisanales et thé glacé maison."}
    ]'::jsonb
)
WHERE email = 'contact@kebab-palace.fr';

-- ============================================================================
-- SEED DATA COMPLETE
-- ============================================================================

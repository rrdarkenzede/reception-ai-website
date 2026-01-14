-- ===========================================
-- GOLDEN ADMIN SEED SCRIPT
-- Production-ready seed for Chez Mario demo
-- ===========================================
-- Run this after a fresh wipe to restore demo state
-- Execute via Supabase SQL Editor or psql

-- 1. Create Restaurant
INSERT INTO restaurants (
  id,
  name,
  subscription_tier,
  retell_agent_id,
  is_active,
  settings
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Chez Mario - Trattoria',
  'enterprise',
  NULL,
  true,
  '{
    "restaurant_config": {
      "quota_ia": 20,
      "welcome_message": "Bienvenue chez Mario !"
    }
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Super Admin Profile
-- NOTE: You must also create auth.users entry via Supabase Dashboard or Auth API
INSERT INTO profiles (
  id,
  email,
  name,
  company_name,
  restaurant_id,
  role,
  tier,
  is_super_admin,
  settings
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'rayanebendaho0@gmail.com',
  'Rayane Bendaho',
  'Chez Mario - Trattoria',
  '11111111-1111-1111-1111-111111111111',
  'owner',
  'enterprise',
  true,
  '{
    "restaurant_config": {
      "quota_ia": 20,
      "welcome_message": "Bienvenue chez Mario !",
      "tables": [
        {"id": "T1", "name": "Table 1", "seats": 2, "is_online_reservable": true},
        {"id": "T2", "name": "Table 2", "seats": 2, "is_online_reservable": true},
        {"id": "T3", "name": "Table 3", "seats": 4, "is_online_reservable": true},
        {"id": "T4", "name": "Table 4", "seats": 4, "is_online_reservable": true},
        {"id": "T5", "name": "Table 5", "seats": 4, "is_online_reservable": true},
        {"id": "T6", "name": "Table 6", "seats": 6, "is_online_reservable": true},
        {"id": "T7", "name": "Table 7", "seats": 6, "is_online_reservable": true},
        {"id": "T8", "name": "Table 8", "seats": 8, "is_online_reservable": true},
        {"id": "T9", "name": "Terrasse 1", "seats": 4, "is_online_reservable": true},
        {"id": "T10", "name": "Terrasse 2", "seats": 4, "is_online_reservable": false}
      ]
    },
    "business_hours": {
      "mon": {"open": "11:30", "close": "23:00", "active": true},
      "tue": {"open": "11:30", "close": "23:00", "active": true},
      "wed": {"open": "11:30", "close": "23:00", "active": true},
      "thu": {"open": "11:30", "close": "23:00", "active": true},
      "fri": {"open": "11:30", "close": "00:00", "active": true},
      "sat": {"open": "11:30", "close": "00:00", "active": true},
      "sun": {"open": "12:00", "close": "22:00", "active": true}
    },
    "ai_knowledge": [
      {"id": "k1", "trigger": "parking", "response": "Nous disposons d un parking gratuit derrière le restaurant."},
      {"id": "k2", "trigger": "allergies", "response": "Notre chef peut adapter la plupart des plats."},
      {"id": "k3", "trigger": "chien", "response": "Les chiens sont acceptés en terrasse uniquement."}
    ],
    "marketing": {
      "active_promos": [
        {
          "id": "promo_seed_1",
          "natural_text": "Menu du Midi à 15.90€ - Entrée + Plat ou Plat + Dessert",
          "active": false,
          "push_mode": false
        }
      ]
    }
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Italian Menu
INSERT INTO stock_items (profile_id, name, description, price, category, is_active) VALUES
-- PIZZAS
('22222222-2222-2222-2222-222222222222', 'Margherita', 'Tomate, mozzarella di bufala, basilic frais', 12.00, 'Pizzas', true),
('22222222-2222-2222-2222-222222222222', 'Regina', 'Tomate, mozzarella, jambon, champignons', 14.50, 'Pizzas', true),
('22222222-2222-2222-2222-222222222222', 'Quattro Formaggi', 'Mozzarella, gorgonzola, parmesan, chèvre', 15.50, 'Pizzas', true),
('22222222-2222-2222-2222-222222222222', 'Calzone Mario', 'Chausson fourré jambon, oeuf, mozzarella', 16.00, 'Pizzas', true),
('22222222-2222-2222-2222-222222222222', 'Diavola', 'Tomate, mozzarella, salami piquant, piments', 14.00, 'Pizzas', true),
-- PASTA
('22222222-2222-2222-2222-222222222222', 'Carbonara', 'Spaghetti, guanciale, oeuf, pecorino, poivre noir', 14.00, 'Pâtes', true),
('22222222-2222-2222-2222-222222222222', 'Bolognese', 'Tagliatelles fraîches, sauce viande mijotée 4h', 15.00, 'Pâtes', true),
('22222222-2222-2222-2222-222222222222', 'Lasagne della Nonna', 'Béchamel, bolognaise, parmesan gratinée', 16.00, 'Pâtes', true),
('22222222-2222-2222-2222-222222222222', 'Risotto ai Funghi', 'Riz arborio, cèpes, truffe noire, parmesan', 18.00, 'Pâtes', true),
('22222222-2222-2222-2222-222222222222', 'Penne Arrabiata', 'Sauce tomate épicée, ail, persil frais', 12.00, 'Pâtes', true),
-- DESSERTS
('22222222-2222-2222-2222-222222222222', 'Tiramisu Maison', 'Mascarpone, café expresso, cacao amer', 8.00, 'Desserts', true),
('22222222-2222-2222-2222-222222222222', 'Panna Cotta', 'Crème vanillée, coulis fruits rouges', 7.50, 'Desserts', true),
('22222222-2222-2222-2222-222222222222', 'Gelato Artisanal', 'Glace maison 3 boules au choix', 6.50, 'Desserts', true),
('22222222-2222-2222-2222-222222222222', 'Cannoli Siciliani', 'Ricotta sucrée, pistaches, chocolat', 7.00, 'Desserts', true),
-- DRINKS
('22222222-2222-2222-2222-222222222222', 'Coca-Cola', 'Bouteille 33cl', 3.50, 'Boissons', true),
('22222222-2222-2222-2222-222222222222', 'Coca Zéro', 'Bouteille 33cl sans sucres', 3.50, 'Boissons', false), -- OUT OF STOCK
('22222222-2222-2222-2222-222222222222', 'Eau San Pellegrino', 'Eau pétillante italienne 50cl', 4.00, 'Boissons', true),
('22222222-2222-2222-2222-222222222222', 'Limonata', 'Citronnade maison', 4.50, 'Boissons', true),
('22222222-2222-2222-2222-222222222222', 'Espresso', 'Café italien serré', 2.50, 'Boissons', true),
('22222222-2222-2222-2222-222222222222', 'Chianti Classico', 'Vin rouge toscan (verre)', 6.50, 'Boissons', true)
ON CONFLICT DO NOTHING;

-- Verify seed
SELECT 'Restaurants:' as type, COUNT(*) as count FROM restaurants
UNION ALL
SELECT 'Profiles:', COUNT(*) FROM profiles
UNION ALL
SELECT 'Menu Items:', COUNT(*) FROM stock_items
UNION ALL
SELECT 'Bookings:', COUNT(*) FROM bookings;

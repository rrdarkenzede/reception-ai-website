# MISSION SPECIFICATION: OMNI-AI MANAGER (V5)

**CONTEXT**: We are building a "Polymorphic SaaS" where the UI mutates based on `profiles.business_type`.
**TECH STACK**: React 18, Vite, Shadcn/ui, Supabase, Make.com, Framer Motion.
**THEME**: Void Dark (`#020617`).

## 1. THE POLYMORPHIC LOGIC (CRITICAL)
The app must parse the `metadata` JSONB column from Supabase and render diverse UIs using a `useBusinessConfig` hook.

### SECTOR A: AUTOMOTIVE (`automotive`)
- **Visuals**: Yellow/Slate.
- **Input Data**: `{ "car": "Audi A3", "plate": "AB-123-CD", "issue": "Brakes" }`
- **Render**: Large Title "Audi A3" + Yellow Badge `[ AB-123-CD ]`.
- **Module**: Kanban Board (Waiting -> Lift -> Done).

### SECTOR B: RESTAURANT (`restaurant`)
- **Visuals**: Orange/Red.
- **Input Data**: `{ "guests": 4, "dietary": "gluten-free" }`
- **Render**: Icon 👤4 + Red Alert Badge "🚫 Gluten".
- **Module**: Stock 86 Grid (Toggle ingredients).

### SECTOR C: MEDICAL (`medical`)
- **Visuals**: Cyan/Teal.
- **Input Data**: `{ "symptom": "Toothache", "pain": 9, "urgent": true }`
- **Render**: Card Border PULSES RED. Badge "Urgent".
- **Module**: Patient History Timeline.

## 2. DATABASE SCHEMA (SUPABASE)
The Agent must generate SQL for:
- `profiles`: `id`, `business_type` (enum), `tier`, `settings` (JSONB).
- `call_logs`: `metadata` (JSONB) <- THIS IS CRITICAL.
- `locations` & `resources`.

## 3. REQUIRED ARTIFACTS TO GENERATE
1. `supabase/migrations/001_init.sql`: The complete schema.
2. `supabase/seed.sql`: Rich seed data (Luigi Pizza, Speedy Garage, Dr House).
3. `src/hooks/useBusinessConfig.tsx`: The polymorphic logic engine.
4. `src/components/layout/PolymorphicLayout.tsx`: The main shell.
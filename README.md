# Omni-AI Manager

A massive SaaS Dashboard to control AI Voice Receptionists (Vapi.ai). The most versatile, feature-rich "Polymorphic" dashboard ever built. One codebase, infinite business types.

## Architecture

```
Vapi.ai (Voice) → Webhooks → API Routes → Supabase (DB + Realtime)
                                              ↑
                        Omni-AI Manager (Vite + React 18 Frontend)
```

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Framer Motion
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL + Realtime)
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Styling**: Ultra-Premium Glassmorphism (Dark mode, heavy blur, neon accents)

## Features

### Polymorphic Engine (8 Business Sectors)

The app automatically adapts vocabulary, icons, and logic based on `business_type`:

- **Restaurant** 🍕 - Service, Couverts, Menu 86, KDS View
- **Beauty & Wellness** 💇‍♀️ - Cabins, Treatments, Stylists, Style Picker
- **Fitness & Coaching** 🏋️ - Classes, Sessions, Courts, Capacity Slider
- **Medical** 🦷 - Patient, Urgent, Symptom, Patient History
- **Legal** ⚖️ - Case #, Confidential, Client, Document Vault
- **Real Estate** 🏠 - Viewing, Property Ref, Buyer, Map View
- **Automotive** 🚗 - Vehicle, Plate, Lift, Kanban Status
- **Trades/Home Services** 🛠️ - Intervention, Address, Dispatch Map

### Subscription Tiers

**TIER 1 (STARTER)**: Live Feed (read-only) + Read-Only Calendar

**TIER 2 (PRO)**: Edit Calendar + Resource Management + Team Chat + Basic Analytics

**TIER 3 (ELITE)**:
- Panic Button: Global stop
- Smart Triggers: Auto-callbacks
- Reputation AI: Sentiment analysis dashboard
- Multi-Location: Manage multiple locations from one login

### Core Modules

#### Live Call Feed 2.0
- Audio Player for call recordings
- Sentiment Ring visualization (1-10 scale)
- Live transcription with expand/collapse
- Real-time updates via Supabase Realtime

#### The "Brain" Configurator
- Q&A Bank management
- Business Hours Editor
- Context Preview for AI training

#### Analytics Suite
- Peak Hours Heatmap (hourly call distribution)
- Conversion Rate Funnel (Calls → Bookings)
- Lost Revenue Calculator (sector-specific)

#### Team Collaboration
- Internal Notes on bookings
- @Mentions system
- Real-time notifications

#### Smart Triggers (Elite)
- "On My Way" (Trades): Status update → AI calls client
- "No Show" Recovery: Auto reschedule call/SMS
- "Waitlist" Auto-Fill: Slot opens → Auto-call next

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_VAPI_API_KEY=your_vapi_api_key
VITE_VAPI_WEBHOOK_SECRET=your_webhook_secret
```

4. Set up Supabase database:
   - Create a new Supabase project
   - Run migrations in order:
     ```bash
     # In Supabase SQL Editor, run:
     # 1. supabase/migrations/001_initial_schema.sql
     # 2. supabase/migrations/002_rls_policies.sql
     # 3. supabase/migrations/003_seed_data.sql
     ```

5. Start development server:
```bash
pnpm dev
```

### Database Schema

The database includes:
- `profiles` - User profiles with polymorphic business_type
- `locations` - Multi-location support (Elite tier)
- `call_logs` - Enhanced call logs with sentiment scores
- `bookings` - Bookings with polymorphic metadata
- `knowledge_base` - AI Brain Q&A and business hours
- `booking_notes` - Team collaboration notes
- `triggers` - Smart triggers configuration (Elite tier)

All tables have Row Level Security (RLS) enabled for data isolation.

## Project Structure

```
src/
├── components/
│   ├── polymorphic/      # Business-type adaptive components
│   ├── calls/            # Live Call Feed, Audio Player, Sentiment Ring
│   ├── brain/            # Knowledge Base Editor, Business Hours
│   ├── analytics/        # Analytics Dashboard, Heatmaps, Funnels
│   ├── elite/            # Elite tier features (Panic Button, etc.)
│   ├── collaboration/    # Team notes, @mentions
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── config/           # Business configuration system
│   ├── hooks/            # Custom hooks (useTierAccess, etc.)
│   ├── supabase/         # Supabase client
│   └── types.ts          # TypeScript types
├── modules/              # Sector-specific modules
│   ├── restaurant/
│   ├── beauty/
│   ├── fitness/
│   ├── medical/
│   ├── legal/
│   ├── real_estate/
│   ├── automotive/
│   └── trades/
└── routes/               # React Router pages
```

## Webhook Integration

To receive call data from Vapi.ai, deploy the webhook handler (`api/vapi-webhook.ts`) as a serverless function and configure the URL in your Vapi.ai dashboard.

The webhook handles:
- Call start/end events
- Transcription data
- Recording URLs
- Sentiment scores
- Custom metadata

## Seed Data

The seed data includes test accounts:
- **Super Admin**: admin@saas.com
- **Luigi Pizza** (Restaurant, Elite): luigi@luigipizza.it
- **Speedy Garage** (Automotive, Pro): contact@speedygarage.fr
- **Dr House** (Medical, Elite): dr.house@medical.fr
- **Glam Salon** (Beauty, Starter): contact@glamsalon.fr
- **Joe Plumber** (Trades, Pro): joe@joeplumber.fr

## Development

```bash
# Development
pnpm dev

# Build
pnpm build

# Preview production build
pnpm preview
```

## Contributing

This is a private project. For questions or issues, contact the development team.

## License

Proprietary - All rights reserved

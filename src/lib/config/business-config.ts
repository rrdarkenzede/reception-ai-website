import { z } from 'zod'
import type { BusinessType } from '@/lib/types'

export type BusinessConfig = {
  vocabulary: {
    service: string
    booking: string
    client: string
    appointment: string
    resource: string
    staff: string
    location: string
  }
  icons: {
    primary: string
    secondary: string
  }
  metadataSchema: z.ZodSchema
  availableModules: string[]
  colorScheme: {
    primary: string
    accent: string
  }
  neonGlow: string
}

// Restaurant metadata schema
const restaurantMetadataSchema = z.object({
  guests: z.number().optional(),
  dietary: z.array(z.string()).optional(),
  table_pref: z.string().optional(),
  menu_86: z.array(z.string()).optional(),
})

// Beauty metadata schema
const beautyMetadataSchema = z.object({
  service_type: z.enum(['Cut', 'Color', 'Massage', 'Facial', 'Other']).optional(),
  duration: z.number().optional(), // minutes
  cabin: z.string().optional(),
  stylist: z.string().optional(),
})

// Fitness metadata schema
const fitnessMetadataSchema = z.object({
  class_type: z.enum(['Yoga', 'Crossfit', 'Pilates', 'Zumba', 'Other']).optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Pro']).optional(),
  capacity: z.number().optional(),
  coach: z.string().optional(),
})

// Medical metadata schema
const medicalMetadataSchema = z.object({
  patient_id: z.string().optional(),
  urgency: z.enum(['routine', 'urgent', 'emergency']).optional(),
  symptoms: z.array(z.string()).optional(),
  previous_visit: z.boolean().optional(),
})

// Legal metadata schema
const legalMetadataSchema = z.object({
  case_number: z.string().optional(),
  confidential: z.boolean().optional(),
  matter_type: z.string().optional(),
  documents: z.array(z.string()).optional(), // URLs
})

// Real Estate metadata schema
const realEstateMetadataSchema = z.object({
  property_ref: z.string().optional(),
  property_address: z.string().optional(),
  buyer_name: z.string().optional(),
  viewing_type: z.enum(['first', 'follow_up', 'final']).optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
})

// Automotive metadata schema
const automotiveMetadataSchema = z.object({
  vehicle_brand: z.string().optional(),
  vehicle_model: z.string().optional(),
  license_plate: z.string().optional(),
  repair_type: z.string().optional(),
  status: z.enum(['waiting', 'workshop', 'ready']).optional(),
  estimated_cost: z.number().optional(),
})

// Trades metadata schema
const tradesMetadataSchema = z.object({
  address: z.string().optional(),
  access_code: z.string().optional(),
  problem_desc: z.string().optional(),
  tradesman_type: z.enum(['Plumber', 'Electrician', 'Carpenter', 'Other']).optional(),
  status: z.enum(['scheduled', 'on_way', 'arrived', 'in_progress', 'completed']).optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
})

export const BUSINESS_CONFIGS: Record<BusinessType, BusinessConfig> = {
  restaurant: {
    vocabulary: {
      service: 'Service',
      booking: 'Réservation',
      client: 'Client',
      appointment: 'Réservation',
      resource: 'Table',
      staff: 'Serveur',
      location: 'Salle',
    },
    icons: {
      primary: '🍕',
      secondary: '🍽️',
    },
    metadataSchema: restaurantMetadataSchema,
    availableModules: ['kds', 'table_manager', 'menu_86'],
    colorScheme: {
      primary: '#fb923c', // orange
      accent: '#f97316',
    },
    neonGlow: 'glow-restaurant',
  },
  beauty: {
    vocabulary: {
      service: 'Traitement',
      booking: 'Rendez-vous',
      client: 'Client',
      appointment: 'Rendez-vous',
      resource: 'Cabine',
      staff: 'Styliste',
      location: 'Salon',
    },
    icons: {
      primary: '💇‍♀️',
      secondary: '✨',
    },
    metadataSchema: beautyMetadataSchema,
    availableModules: ['style_picker', 'cabin_manager', 'treatment_tracker'],
    colorScheme: {
      primary: '#ec4899', // pink
      accent: '#f472b6',
    },
    neonGlow: 'glow-beauty',
  },
  fitness: {
    vocabulary: {
      service: 'Classe',
      booking: 'Réservation',
      client: 'Membre',
      appointment: 'Session',
      resource: 'Court',
      staff: 'Coach',
      location: 'Salle',
    },
    icons: {
      primary: '🏋️',
      secondary: '💪',
    },
    metadataSchema: fitnessMetadataSchema,
    availableModules: ['class_capacity', 'court_booking', 'coach_assignment'],
    colorScheme: {
      primary: '#22c55e', // green
      accent: '#4ade80',
    },
    neonGlow: 'glow-fitness',
  },
  medical: {
    vocabulary: {
      service: 'Consultation',
      booking: 'Rendez-vous',
      client: 'Patient',
      appointment: 'Consultation',
      resource: 'Cabinet',
      staff: 'Médecin',
      location: 'Clinique',
    },
    icons: {
      primary: '🦷',
      secondary: '🏥',
    },
    metadataSchema: medicalMetadataSchema,
    availableModules: ['patient_timeline', 'urgency_tracker', 'symptom_tracker'],
    colorScheme: {
      primary: '#3b82f6', // blue
      accent: '#60a5fa',
    },
    neonGlow: 'glow-medical',
  },
  legal: {
    vocabulary: {
      service: 'Consultation',
      booking: 'Rendez-vous',
      client: 'Client',
      appointment: 'Consultation',
      resource: 'Bureau',
      staff: 'Avocat',
      location: 'Cabinet',
    },
    icons: {
      primary: '⚖️',
      secondary: '📋',
    },
    metadataSchema: legalMetadataSchema,
    availableModules: ['document_vault', 'case_manager', 'confidential_tracker'],
    colorScheme: {
      primary: '#a855f7', // purple
      accent: '#c084fc',
    },
    neonGlow: 'glow-legal',
  },
  real_estate: {
    vocabulary: {
      service: 'Visite',
      booking: 'Rendez-vous',
      client: 'Acheteur',
      appointment: 'Visite',
      resource: 'Propriété',
      staff: 'Agent',
      location: 'Bien',
    },
    icons: {
      primary: '🏠',
      secondary: '📍',
    },
    metadataSchema: realEstateMetadataSchema,
    availableModules: ['property_map', 'property_manager', 'buyer_profiles'],
    colorScheme: {
      primary: '#f97316', // orange
      accent: '#fb923c',
    },
    neonGlow: 'glow-real-estate',
  },
  automotive: {
    vocabulary: {
      service: 'Réparation',
      booking: 'Rendez-vous',
      client: 'Client',
      appointment: 'RDV',
      resource: 'Pont',
      staff: 'Mécanicien',
      location: 'Atelier',
    },
    icons: {
      primary: '🚗',
      secondary: '🔧',
    },
    metadataSchema: automotiveMetadataSchema,
    availableModules: ['kanban_board', 'vehicle_tracker', 'parts_inventory'],
    colorScheme: {
      primary: '#ef4444', // red
      accent: '#f87171',
    },
    neonGlow: 'glow-automotive',
  },
  trades: {
    vocabulary: {
      service: 'Intervention',
      booking: 'Intervention',
      client: 'Client',
      appointment: 'Intervention',
      resource: 'Équipe',
      staff: 'Artisan',
      location: 'Chantier',
    },
    icons: {
      primary: '🛠️',
      secondary: '🚚',
    },
    metadataSchema: tradesMetadataSchema,
    availableModules: ['dispatch_map', 'intervention_tracker', 'access_manager'],
    colorScheme: {
      primary: '#eab308', // yellow
      accent: '#facc15',
    },
    neonGlow: 'glow-trades',
  },
}

export function getBusinessConfig(businessType: BusinessType): BusinessConfig {
  return BUSINESS_CONFIGS[businessType] || BUSINESS_CONFIGS.restaurant
}

export function getVocabulary(businessType: BusinessType, key: keyof BusinessConfig['vocabulary']): string {
  const config = getBusinessConfig(businessType)
  return config.vocabulary[key]
}

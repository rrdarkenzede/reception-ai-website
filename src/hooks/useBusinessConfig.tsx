import { useMemo } from 'react';
import {
  CarFront,
  Utensils,
  Activity,
  Scissors,
  Hammer,
  Home,
  Wrench,
  AlertTriangle,
  Users,
  Calendar,
  type LucideIcon,
} from 'lucide-react';
import type { BusinessType } from '@/lib/types';

// ============================================================================
// TYPES
// ============================================================================

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  background: string;
  text: string;
  glow: string;
}

export interface FormattedMetadata {
  title: string;
  badge?: string;
  icon?: string;
  alert?: string;
  style?: string;
  details?: Array<{ label: string; value: string }>;
}

export interface BusinessConfigResult {
  // Theme
  theme: ThemeColors;
  themeClass: string;
  
  // Icons
  Icon: LucideIcon;
  SecondaryIcon: LucideIcon;
  
  // Labels
  label: string;
  vocabulary: {
    client: string;
    booking: string;
    service: string;
  };
  
  // Metadata Parser
  formatMetadata: (json: Record<string, unknown>) => FormattedMetadata;
}

// ============================================================================
// THEME CONFIGURATIONS
// ============================================================================

const THEME_CONFIGS: Record<string, ThemeColors> = {
  automotive: {
    primary: '#FACC15',
    secondary: '#64748b',
    accent: '#EAB308',
    border: '#FDE047',
    background: '#0b0f1a',
    text: '#fef9c3',
    glow: '0 0 20px rgba(250, 204, 21, 0.5)',
  },
  restaurant: {
    primary: '#FB923C',
    secondary: '#ea580c',
    accent: '#FDBA74',
    border: '#FED7AA',
    background: '#0b0f1a',
    text: '#ffedd5',
    glow: '0 0 20px rgba(251, 146, 60, 0.5)',
  },
  medical: {
    primary: '#2DD4BF',
    secondary: '#0f766e',
    accent: '#5eead4',
    border: '#99f6e4',
    background: '#0b0f1a',
    text: '#ccfbf1',
    glow: '0 0 20px rgba(45, 212, 191, 0.5)',
  },
  beauty: {
    primary: '#ec4899',      // Pink-500
    secondary: '#f472b6',    // Pink-400
    accent: '#f9a8d4',       // Pink-300
    border: '#fbcfe8',       // Pink-200
    background: '#500724',   // Pink-950
    text: '#fce7f3',         // Pink-100
    glow: '0 0 20px rgba(236, 72, 153, 0.5)',
  },
  trades: {
    primary: '#eab308',      // Yellow-500
    secondary: '#84cc16',    // Lime-500
    accent: '#facc15',       // Yellow-400
    border: '#fde047',       // Yellow-300
    background: '#1a2e05',   // Lime-950
    text: '#fef9c3',         // Yellow-100
    glow: '0 0 20px rgba(234, 179, 8, 0.5)',
  },
  real_estate: {
    primary: '#8b5cf6',      // Violet-500
    secondary: '#a78bfa',    // Violet-400
    accent: '#c4b5fd',       // Violet-300
    border: '#ddd6fe',       // Violet-200
    background: '#2e1065',   // Violet-950
    text: '#ede9fe',         // Violet-100
    glow: '0 0 20px rgba(139, 92, 246, 0.5)',
  },
};

// ============================================================================
// ICON MAPPINGS
// ============================================================================

const ICON_MAP: Record<string, { primary: LucideIcon; secondary: LucideIcon }> = {
  automotive: { primary: CarFront, secondary: Wrench },
  restaurant: { primary: Utensils, secondary: Calendar },
  medical: { primary: Activity, secondary: AlertTriangle },
  beauty: { primary: Scissors, secondary: Calendar },
  trades: { primary: Hammer, secondary: Wrench },
  real_estate: { primary: Home, secondary: Users },
};

// ============================================================================
// VOCABULARY MAPPINGS
// ============================================================================

const VOCABULARY_MAP: Record<string, { label: string; client: string; booking: string; service: string }> = {
  automotive: {
    label: 'Garage',
    client: 'Client',
    booking: 'Rendez-vous',
    service: 'Réparation',
  },
  restaurant: {
    label: 'Restaurant',
    client: 'Client',
    booking: 'Réservation',
    service: 'Service',
  },
  medical: {
    label: 'Cabinet Médical',
    client: 'Patient',
    booking: 'Consultation',
    service: 'Soin',
  },
  beauty: {
    label: 'Salon de Beauté',
    client: 'Client',
    booking: 'Rendez-vous',
    service: 'Prestation',
  },
  trades: {
    label: 'Artisan',
    client: 'Client',
    booking: 'Intervention',
    service: 'Travaux',
  },
  real_estate: {
    label: 'Immobilier',
    client: 'Acquéreur',
    booking: 'Visite',
    service: 'Bien',
  },
};

// ============================================================================
// METADATA FORMATTERS
// ============================================================================

function formatAutomotiveMetadata(json: Record<string, unknown>): FormattedMetadata {
  const carModel = (json.car_model as string | undefined) || (json.vehicle_model as string | undefined) || (json.car as string | undefined);
  const licensePlate = (json.license_plate as string | undefined) || (json.plate as string | undefined);
  const issue = json.issue as string | undefined;
  const mileage = json.mileage as number | undefined;
  const estimatedCost = json.estimated_cost as number | undefined;

  const details: Array<{ label: string; value: string }> = [];
  if (issue) details.push({ label: 'Problème', value: issue });
  if (mileage) details.push({ label: 'Kilométrage', value: `${mileage.toLocaleString()} km` });
  if (estimatedCost) details.push({ label: 'Estimation', value: `${estimatedCost}€` });

  return {
    title: carModel || 'Véhicule inconnu',
    badge: licensePlate,
    icon: 'Wrench',
    details,
  };
}

function formatMedicalMetadata(json: Record<string, unknown>): FormattedMetadata {
  const symptom = json.symptom as string | undefined;
  const painLevel = json.pain_level as number | undefined;
  const urgent = json.urgent as boolean | undefined;
  const location = json.location as string | undefined;
  const allergies = json.allergies as string[] | undefined;

  const details: Array<{ label: string; value: string }> = [];
  if (symptom) details.push({ label: 'Symptôme', value: symptom });
  if (location) details.push({ label: 'Localisation', value: location });
  if (allergies && allergies.length > 0) {
    details.push({ label: 'Allergies', value: allergies.join(', ') });
  }

  // CRITICAL: Urgent case handling with special styling
  if (urgent) {
    return {
      title: symptom || 'Urgence médicale',
      badge: painLevel ? `Douleur: ${painLevel}/10` : undefined,
      alert: 'URGENT',
      style: 'pulse-red',
      icon: 'AlertTriangle',
      details,
    };
  }

  return {
    title: symptom || 'Consultation',
    badge: painLevel ? `Niveau: ${painLevel}/10` : undefined,
    icon: 'Activity',
    details,
  };
}

function formatRestaurantMetadata(json: Record<string, unknown>): FormattedMetadata {
  const guests = json.guests as number | undefined;
  const dietary = json.dietary as string | undefined;
  const occasion = json.occasion as string | undefined;
  const tablePreference = json.table_preference as string | undefined;
  const specialRequests = json.special_requests as string[] | undefined;

  const details: Array<{ label: string; value: string }> = [];
  if (occasion) details.push({ label: 'Occasion', value: occasion });
  if (tablePreference) details.push({ label: 'Préférence', value: tablePreference });
  if (specialRequests && specialRequests.length > 0) {
    details.push({ label: 'Demandes', value: specialRequests.join(', ') });
  }

  return {
    title: typeof guests === 'number' ? `Table for ${guests}` : 'Table for -',
    badge: dietary || undefined,
    icon: 'Utensils',
    details,
  };
}

function formatBeautyMetadata(json: Record<string, unknown>): FormattedMetadata {
  const serviceType = json.service_type as string | undefined;
  const duration = json.duration as number | undefined;
  const stylist = json.stylist as string | undefined;
  const cabin = json.cabin as string | undefined;

  const details: Array<{ label: string; value: string }> = [];
  if (duration) details.push({ label: 'Durée', value: `${duration} min` });
  if (stylist) details.push({ label: 'Styliste', value: stylist });
  if (cabin) details.push({ label: 'Cabine', value: cabin });

  return {
    title: serviceType || 'Prestation',
    badge: duration ? `${duration} min` : undefined,
    icon: 'Scissors',
    details,
  };
}

function formatTradesMetadata(json: Record<string, unknown>): FormattedMetadata {
  const problemDesc = json.problem_desc as string | undefined;
  const address = json.address as string | undefined;
  const tradesmanType = json.tradesman_type as string | undefined;
  const status = json.status as string | undefined;

  const details: Array<{ label: string; value: string }> = [];
  if (address) details.push({ label: 'Adresse', value: address });
  if (tradesmanType) details.push({ label: 'Type', value: tradesmanType });
  if (status) details.push({ label: 'Statut', value: status });

  return {
    title: problemDesc || 'Intervention',
    badge: tradesmanType,
    icon: 'Hammer',
    details,
  };
}

function formatRealEstateMetadata(json: Record<string, unknown>): FormattedMetadata {
  const propertyRef = json.property_ref as string | undefined;
  const propertyAddress = json.property_address as string | undefined;
  const buyerName = json.buyer_name as string | undefined;
  const viewingType = json.viewing_type as string | undefined;

  const details: Array<{ label: string; value: string }> = [];
  if (propertyAddress) details.push({ label: 'Adresse', value: propertyAddress });
  if (buyerName) details.push({ label: 'Acquéreur', value: buyerName });
  if (viewingType) details.push({ label: 'Type de visite', value: viewingType });

  return {
    title: propertyRef || 'Visite immobilière',
    badge: viewingType,
    icon: 'Home',
    details,
  };
}

function formatGenericMetadata(json: Record<string, unknown>): FormattedMetadata {
  const entries = Object.entries(json).slice(0, 5);
  const details = entries.map(([key, value]) => ({
    label: key.replace(/_/g, ' '),
    value: String(value),
  }));

  return {
    title: 'Appel',
    details,
  };
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useBusinessConfig(businessType: BusinessType | string | undefined): BusinessConfigResult {
  return useMemo(() => {
    // Normalize business type to one of our supported types
    const normalizedType = normalizeBusinessType(businessType);
    
    // Get theme
    const theme = THEME_CONFIGS[normalizedType] || THEME_CONFIGS.restaurant;
    
    // Get icons
    const icons = ICON_MAP[normalizedType] || ICON_MAP.restaurant;
    
    // Get vocabulary
    const vocab = VOCABULARY_MAP[normalizedType] || VOCABULARY_MAP.restaurant;
    
    // Create format function
    const formatMetadata = (json: Record<string, unknown>): FormattedMetadata => {
      if (!json || Object.keys(json).length === 0) {
        return { title: 'Aucune donnée' };
      }

      switch (normalizedType) {
        case 'automotive':
          return formatAutomotiveMetadata(json);
        case 'medical':
          return formatMedicalMetadata(json);
        case 'restaurant':
          return formatRestaurantMetadata(json);
        case 'beauty':
          return formatBeautyMetadata(json);
        case 'trades':
          return formatTradesMetadata(json);
        case 'real_estate':
          return formatRealEstateMetadata(json);
        default:
          return formatGenericMetadata(json);
      }
    };

    return {
      theme,
      themeClass: `theme-${normalizedType}`,
      Icon: icons.primary,
      SecondaryIcon: icons.secondary,
      label: vocab.label,
      vocabulary: {
        client: vocab.client,
        booking: vocab.booking,
        service: vocab.service,
      },
      formatMetadata,
    };
  }, [businessType]);
}

// ============================================================================
// HELPER: Normalize business type aliases
// ============================================================================

function normalizeBusinessType(type: string | undefined): string {
  if (!type) return 'restaurant';
  
  const normalized = type.toLowerCase();
  
  // Map aliases to canonical types
  const aliasMap: Record<string, string> = {
    'garage': 'automotive',
    'dentiste': 'medical',
    'clinique': 'medical',
    'veterinaire': 'medical',
    'beaute': 'beauty',
    'immobilier': 'real_estate',
    'juridique': 'trades', // or could be its own category
    'sport': 'beauty', // fitness centers
    'fitness': 'beauty',
    'autoecole': 'automotive',
  };

  return aliasMap[normalized] || normalized;
}

export default useBusinessConfig;

import { useMemo } from 'react';
import {
  Utensils,
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
// THEME CONFIGURATIONS (Restaurant Focused)
// ============================================================================

const THEME_CONFIGS: Record<string, ThemeColors> = {
  restaurant: {
    primary: '#00f2ff', // Cyan - NeuralVoice brand
    secondary: '#0ea5e9',
    accent: '#67e8f9',
    border: '#22d3ee',
    background: '#050505',
    text: '#ecfeff',
    glow: '0 0 20px rgba(0, 242, 255, 0.5)',
  },
};

// ============================================================================
// ICON MAPPINGS
// ============================================================================

const ICON_MAP: Record<string, { primary: LucideIcon; secondary: LucideIcon }> = {
  restaurant: { primary: Utensils, secondary: Calendar },
};

// ============================================================================
// VOCABULARY MAPPINGS
// ============================================================================

const VOCABULARY_MAP: Record<string, { label: string; client: string; booking: string; service: string }> = {
  restaurant: {
    label: 'Restaurant',
    client: 'Client',
    booking: 'Réservation',
    service: 'Service',
  },
};

// ============================================================================
// METADATA FORMATTERS
// ============================================================================

function formatRestaurantMetadata(json: Record<string, unknown>): FormattedMetadata {
  const guests = json.guests as number | undefined;
  const dietary = json.dietary as string | undefined;
  const occasion = json.occasion as string | undefined;
  const tablePreference = json.table_preference as string | undefined;
  const specialRequests = json.special_requests as string[] | undefined;
  const orderType = json.order_type as string | undefined;
  const orderDetails = json.order_details as Array<{ name: string; qty: number }> | undefined;

  const details: Array<{ label: string; value: string }> = [];
  if (occasion) details.push({ label: 'Occasion', value: occasion });
  if (tablePreference) details.push({ label: 'Préférence', value: tablePreference });
  if (specialRequests && specialRequests.length > 0) {
    details.push({ label: 'Demandes', value: specialRequests.join(', ') });
  }
  if (orderType) details.push({ label: 'Type', value: orderType });
  if (orderDetails && orderDetails.length > 0) {
    details.push({ label: 'Commande', value: orderDetails.map(o => `${o.qty}x ${o.name}`).join(', ') });
  }

  let title = 'Réservation';
  if (orderType === 'takeaway') title = 'Commande à emporter';
  else if (orderType === 'delivery') title = 'Livraison';
  else if (guests) title = `Table de ${guests} personnes`;

  return {
    title,
    badge: dietary || orderType?.toUpperCase(),
    icon: 'Utensils',
    details,
  };
}



// ============================================================================
// MAIN HOOK
// ============================================================================

export function useBusinessConfig(businessType: BusinessType | string | undefined): BusinessConfigResult {
  return useMemo(() => {
    // Always use restaurant config
    const normalizedType = 'restaurant';
    
    // Get theme
    const theme = THEME_CONFIGS[normalizedType];
    
    // Get icons
    const icons = ICON_MAP[normalizedType];
    
    // Get vocabulary
    const vocab = VOCABULARY_MAP[normalizedType];
    
    /**
     * Formats metadata based on business type with null safety and fallbacks
     * @param json - Raw metadata object from database
     * @returns Formatted metadata with safe defaults
     */
    const formatMetadata = (json: Record<string, unknown> | null | undefined): FormattedMetadata => {
      // Handle null/undefined input safely
      if (!json || typeof json !== 'object' || Object.keys(json).length === 0) {
        return { title: 'Aucune donnée' };
      }

      // Ensure json is a proper Record object
      const safeJson = json as Record<string, unknown>;

      return formatRestaurantMetadata(safeJson);
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

export default useBusinessConfig;

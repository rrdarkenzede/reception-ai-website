// Tier Access Configuration
// Defines what features are available at each subscription tier

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise';

export interface TierFeatures {
  // Dashboard
  dashboardReadOnly: boolean;
  
  // Menu
  viewMenu: boolean;
  editMenu: boolean;
  
  // Settings
  basicSettings: boolean;
  aiSettings: boolean;
  
  // Marketing
  promos: boolean;
  
  // Views
  kitchenView: boolean;
  
  // Admin
  ghostMode: boolean;
  apiAccess: boolean;
}

export const TIER_FEATURES: Record<SubscriptionTier, TierFeatures> = {
  free: {
    dashboardReadOnly: true,
    viewMenu: true,
    editMenu: false,
    basicSettings: false,
    aiSettings: false,
    promos: false,
    kitchenView: false,
    ghostMode: false,
    apiAccess: false,
  },
  starter: {
    dashboardReadOnly: false,
    viewMenu: true,
    editMenu: true,
    basicSettings: true,
    aiSettings: false,
    promos: false,
    kitchenView: false,
    ghostMode: false,
    apiAccess: false,
  },
  pro: {
    dashboardReadOnly: false,
    viewMenu: true,
    editMenu: true,
    basicSettings: true,
    aiSettings: true,
    promos: true,
    kitchenView: false,
    ghostMode: false,
    apiAccess: false,
  },
  enterprise: {
    dashboardReadOnly: false,
    viewMenu: true,
    editMenu: true,
    basicSettings: true,
    aiSettings: true,
    promos: true,
    kitchenView: true,
    ghostMode: true,
    apiAccess: true,
  },
};

/**
 * Check if a tier has access to a specific feature
 */
export function hasFeatureAccess(tier: SubscriptionTier, feature: keyof TierFeatures): boolean {
  return TIER_FEATURES[tier]?.[feature] ?? false;
}

/**
 * Get all features for a tier
 */
export function getTierFeatures(tier: SubscriptionTier): TierFeatures {
  return TIER_FEATURES[tier] ?? TIER_FEATURES.free;
}

/**
 * Check if user can access a route based on tier
 */
export function canAccessRoute(tier: SubscriptionTier, route: string): boolean {
  const features = getTierFeatures(tier);
  
  switch (route) {
    case '/dashboard/kitchen':
      return features.kitchenView;
    case '/dashboard/promos':
      return features.promos;
    case '/dashboard/settings':
      return features.basicSettings;
    case '/dashboard/stock':
      return features.editMenu;
    default:
      return true;
  }
}

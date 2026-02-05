import { SubscriptionTier } from './types';

export interface TierFeatures {
  dashboardReadOnly: boolean;
  viewMenu: boolean;
  editMenu: boolean;
  basicSettings: boolean;
  aiSettings: boolean;
  promos: boolean;
  mode86: boolean;
  kitchenView: boolean;
  ghostMode: boolean;
  apiAccess: boolean;
  omnichannel: boolean;
  richKnowledgeBase: boolean;
}

export const TIER_FEATURES: Record<SubscriptionTier, TierFeatures> = {
  free: {
    dashboardReadOnly: false,
    viewMenu: true,
    editMenu: true,
    basicSettings: true,
    aiSettings: false,
    promos: false,
    mode86: false,
    kitchenView: false,
    ghostMode: false,
    apiAccess: false,
    omnichannel: false,
    richKnowledgeBase: false,
  },
  pro: {
    dashboardReadOnly: false,
    viewMenu: true,
    editMenu: true,
    basicSettings: true,
    aiSettings: true,
    promos: true,
    mode86: true,
    kitchenView: false,
    ghostMode: false,
    apiAccess: false,
    omnichannel: false,
    richKnowledgeBase: false,
  },
  enterprise: {
    dashboardReadOnly: false,
    viewMenu: true,
    editMenu: true,
    basicSettings: true,
    aiSettings: true,
    promos: true,
    mode86: true,
    kitchenView: true,
    ghostMode: true,
    apiAccess: true,
    omnichannel: true,
    richKnowledgeBase: true,
  },
};

const TIER_ORDER: SubscriptionTier[] = ['free', 'pro', 'enterprise'];

export function canAccessFeature(tier: SubscriptionTier, feature: keyof TierFeatures): boolean {
  return TIER_FEATURES[tier][feature];
}

export function canAccessTier(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  return TIER_ORDER.indexOf(userTier) >= TIER_ORDER.indexOf(requiredTier);
}

export function canAccessRoute(tier: SubscriptionTier, route: string): boolean {
  switch (route) {
    case '/dashboard/kitchen':
      return tier === 'enterprise';
    case '/dashboard/promos':
      return tier === 'pro' || tier === 'enterprise';
    default:
      return true;
  }
}

export function getTierBadgeColor(tier: SubscriptionTier): string {
  switch (tier) {
    case 'free':
      return 'badge-yellow';
    case 'pro':
      return 'badge-cyan';
    case 'enterprise':
      return 'badge-orange';
    default:
      return 'badge-cyan';
  }
}

export function getTierLabel(tier: SubscriptionTier): string {
  switch (tier) {
    case 'free':
      return 'Gratuit';
    case 'pro':
      return 'Pro';
    case 'enterprise':
      return 'Enterprise';
    default:
      return tier;
  }
}

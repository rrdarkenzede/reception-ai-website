import { useMemo } from 'react'
import type { Plan } from '@/lib/types'

interface FeatureFlags {
  liveFeed: boolean
  liveFeedReadOnly: boolean
  calendar: boolean
  calendarReadOnly: boolean
  editCalendar: boolean
  resourceManagement: boolean
  teamChat: boolean
  basicAnalytics: boolean
  advancedAnalytics: boolean
  panicButton: boolean
  smartTriggers: boolean
  reputationAI: boolean
  multiLocation: boolean
}

export function useTierAccess(plan: Plan | undefined): FeatureFlags {
  return useMemo(() => {
    const tier = plan || 'starter'
    
    // Enterprise is the top tier (same as elite)
    const isTopTier = tier === 'elite' || tier === 'enterprise'
    const isProOrAbove = tier === 'pro' || isTopTier

    return {
      // Tier 1 (Starter/Free)
      liveFeed: true,
      liveFeedReadOnly: tier === 'starter' || tier === 'free',
      calendar: true,
      calendarReadOnly: tier === 'starter' || tier === 'free',
      editCalendar: isProOrAbove,
      resourceManagement: isProOrAbove,
      teamChat: isProOrAbove,
      basicAnalytics: isProOrAbove,
      
      // Tier 3 (Elite/Enterprise)
      advancedAnalytics: isTopTier,
      panicButton: isTopTier,
      smartTriggers: isTopTier,
      reputationAI: isTopTier,
      multiLocation: isTopTier,
    }
  }, [plan])
}

export function hasTierAccess(plan: Plan | undefined, feature: keyof FeatureFlags): boolean {
  const access = useTierAccess(plan)
  return access[feature]
}

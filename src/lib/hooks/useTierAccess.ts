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

    return {
      // Tier 1 (Starter)
      liveFeed: true,
      liveFeedReadOnly: tier === 'starter',
      calendar: true,
      calendarReadOnly: tier === 'starter',
      editCalendar: tier !== 'starter',
      resourceManagement: tier !== 'starter',
      teamChat: tier !== 'starter',
      basicAnalytics: tier !== 'starter',
      
      // Tier 2 (Pro) and above
      advancedAnalytics: tier === 'elite',
      panicButton: tier === 'elite',
      smartTriggers: tier === 'elite',
      reputationAI: tier === 'elite',
      multiLocation: tier === 'elite',
    }
  }, [plan])
}

export function hasTierAccess(plan: Plan | undefined, feature: keyof FeatureFlags): boolean {
  const access = useTierAccess(plan)
  return access[feature]
}

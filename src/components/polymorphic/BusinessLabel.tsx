import { getVocabulary } from '@/lib/config/business-config'
import type { BusinessType } from '@/lib/types'

interface BusinessLabelProps {
  businessType: BusinessType
  labelKey: 'service' | 'booking' | 'client' | 'appointment' | 'resource' | 'staff' | 'location'
  className?: string
}

export function BusinessLabel({ businessType, labelKey, className = '' }: BusinessLabelProps) {
  const label = getVocabulary(businessType, labelKey)
  return <span className={className}>{label}</span>
}

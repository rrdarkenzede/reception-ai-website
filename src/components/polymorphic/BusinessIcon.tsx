import { getBusinessConfig } from '@/lib/config/business-config'
import type { BusinessType } from '@/lib/types'

interface BusinessIconProps {
  businessType: BusinessType
  variant?: 'primary' | 'secondary'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl',
}

export function BusinessIcon({ businessType, variant = 'primary', className = '', size = 'md' }: BusinessIconProps) {
  const config = getBusinessConfig(businessType)
  const icon = variant === 'primary' ? config.icons.primary : config.icons.secondary

  return <span className={`${sizeMap[size]} ${className}`}>{icon}</span>
}

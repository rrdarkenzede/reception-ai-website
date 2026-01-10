import { getBusinessConfig } from '@/lib/config/business-config'
import { cn } from '@/lib/utils'
import type { BusinessType } from '@/lib/types'
import type { ReactNode } from 'react'

interface BusinessCardProps {
  businessType: BusinessType
  children: ReactNode
  className?: string
}

export function BusinessCard({ businessType, children, className }: BusinessCardProps) {
  const config = getBusinessConfig(businessType)

  return (
    <div
      className={cn(
        'glass-card rounded-lg border p-6',
        config.neonGlow,
        className
      )}
      style={{
        borderColor: `${config.colorScheme.primary}40`,
      }}
    >
      {children}
    </div>
  )
}

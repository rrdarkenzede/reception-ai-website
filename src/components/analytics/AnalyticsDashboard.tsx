import { PeakHoursHeatmap } from './PeakHoursHeatmap'
import { ConversionFunnel } from './ConversionFunnel'
import { LostRevenueCalculator } from './LostRevenueCalculator'
import type { BusinessType } from '@/lib/types'

interface AnalyticsDashboardProps {
  businessType: BusinessType
  calls: Array<{ created_at: string; status: string }>
  bookings: Array<{ status: string; metadata?: { estimated_cost?: number; guests?: number } }>
}

export function AnalyticsDashboard({ businessType, calls, bookings }: AnalyticsDashboardProps) {
  const missedCalls = calls.filter((c) => c.status === 'missed').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PeakHoursHeatmap calls={calls} />
        <ConversionFunnel calls={calls} bookings={bookings} />
      </div>
      <LostRevenueCalculator
        missedCalls={missedCalls}
        businessType={businessType}
        bookings={bookings}
      />
    </div>
  )
}

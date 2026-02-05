import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingDown, DollarSign } from 'lucide-react'
import type { BusinessType } from '@/lib/types'

interface LostRevenueCalculatorProps {
  missedCalls: number
  businessType: BusinessType
  bookings: Array<{ status: string; metadata?: { estimated_cost?: number; guests?: number } }>
}

const AVG_BOOKING_VALUES: Record<BusinessType, number> = {
  restaurant: 50, // Average per person
}

const CONVERSION_RATE = 0.15 // 15% of calls convert to bookings

export function LostRevenueCalculator({ missedCalls, businessType, bookings }: LostRevenueCalculatorProps) {
  const calculations = useMemo(() => {
    const avgBookingValue = AVG_BOOKING_VALUES.restaurant;
    const avgGuests = bookings.reduce((acc, b) => acc + (b.metadata?.guests || 1), 0) / bookings.length || 2
    
    const estimatedBookingsLost = Math.floor(missedCalls * CONVERSION_RATE)
    const estimatedRevenueLost = estimatedBookingsLost * avgBookingValue * avgGuests
    const potentialBookingsValue = bookings
      .filter((b) => b.status === 'completed')
      .reduce((acc, b) => {
        return acc + avgBookingValue * (b.metadata?.guests || 1)
      }, 0)

    return {
      estimatedBookingsLost,
      estimatedRevenueLost,
      potentialBookingsValue,
      conversionRate: CONVERSION_RATE,
    }
  }, [missedCalls, businessType, bookings])

  return (
    <Card className="glass-card border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-destructive" />
          Revenus perdus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
          <div className="text-2xl font-bold text-destructive mb-1">
            {calculations.estimatedRevenueLost.toLocaleString('fr-FR')} €
          </div>
          <p className="text-sm text-muted-foreground">
            Estimé sur {missedCalls} appels manqués
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Réservations perdues</p>
            <p className="text-lg font-semibold">{calculations.estimatedBookingsLost}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Taux de conversion</p>
            <p className="text-lg font-semibold">{(calculations.conversionRate * 100).toFixed(0)}%</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Revenus potentiels réalisés</span>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-success" />
              <span className="font-semibold text-success">
                {calculations.potentialBookingsValue.toLocaleString('fr-FR')} €
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ConversionFunnelProps {
  calls: Array<{ status: string }>
  bookings: Array<{ status: string }>
}

interface FunnelStage {
  total: number
  label: string
  percentage?: number
}

export function ConversionFunnel({ calls, bookings }: ConversionFunnelProps) {
  const funnelData = useMemo(() => {
    const totalCalls = calls.length
    const completedCalls = calls.filter((c) => c.status === 'completed').length
    const totalBookings = bookings.length
    const completedBookings = bookings.filter((b) => b.status === 'completed').length

    return {
      calls: { total: totalCalls, label: 'Appels totaux' },
      qualified: { total: completedCalls, label: 'Appels qualifiés', percentage: (completedCalls / totalCalls) * 100 },
      bookings: { total: totalBookings, label: 'Réservations', percentage: (totalBookings / completedCalls) * 100 },
      completed: { total: completedBookings, label: 'Complétées', percentage: (completedBookings / totalBookings) * 100 },
    } as Record<string, FunnelStage>
  }, [calls, bookings])

  const stages = [
    funnelData.calls,
    funnelData.qualified,
    funnelData.bookings,
    funnelData.completed,
  ]

  return (
    <Card className="glass-card border-border/30">
      <CardHeader>
        <CardTitle>Entonnoir de conversion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const width = index === 0 ? 100 : stage.percentage || 0
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{stage.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{stage.total}</span>
                    {stage.percentage !== undefined && (
                      <span className="text-xs text-muted-foreground">({stage.percentage.toFixed(1)}%)</span>
                    )}
                  </div>
                </div>
                <div className="w-full h-8 bg-secondary/30 rounded-lg overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-500 flex items-center justify-center text-xs font-medium',
                      index === 0
                        ? 'bg-primary'
                        : index === 1
                        ? 'bg-primary/80'
                        : index === 2
                        ? 'bg-primary/60'
                        : 'bg-success'
                    )}
                    style={{ width: `${width}%` }}
                  >
                    {width > 20 && <span className="text-foreground">{stage.total}</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface HourlyData {
  hour: number
  count: number
}

interface PeakHoursHeatmapProps {
  calls: Array<{ created_at: string }>
}

export function PeakHoursHeatmap({ calls }: PeakHoursHeatmapProps) {
  const hourlyData = useMemo(() => {
    const hours: Record<number, number> = {}
    
    // Initialize all hours to 0
    for (let i = 0; i < 24; i++) {
      hours[i] = 0
    }

    // Count calls per hour
    calls.forEach((call) => {
      const hour = new Date(call.created_at).getHours()
      hours[hour] = (hours[hour] || 0) + 1
    })

    return Object.entries(hours).map(([hour, count]) => ({
      hour: parseInt(hour),
      count,
    })) as HourlyData[]
  }, [calls])

  const maxCount = Math.max(...hourlyData.map((d) => d.count), 1)

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-secondary/20'
    const intensity = count / maxCount
    if (intensity < 0.3) return 'bg-primary/30'
    if (intensity < 0.6) return 'bg-primary/50'
    if (intensity < 0.8) return 'bg-primary/70'
    return 'bg-primary'
  }

  return (
    <Card className="glass-card border-border/30">
      <CardHeader>
        <CardTitle>Heures de pointe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-2">
          {hourlyData.map((data) => (
            <div key={data.hour} className="flex flex-col items-center">
              <div
                className={cn(
                  'w-full h-12 rounded-lg flex items-center justify-center text-xs font-medium transition-all cursor-pointer hover:scale-105',
                  getIntensity(data.count),
                  data.count > 0 ? 'text-foreground' : 'text-muted-foreground'
                )}
                title={`${data.hour}h: ${data.count} appels`}
              >
                {data.count > 0 && data.count}
              </div>
              <span className="text-xs text-muted-foreground mt-1">{data.hour}h</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Moins</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-secondary/20" />
            <div className="w-4 h-4 rounded bg-primary/30" />
            <div className="w-4 h-4 rounded bg-primary/50" />
            <div className="w-4 h-4 rounded bg-primary/70" />
            <div className="w-4 h-4 rounded bg-primary" />
          </div>
          <span>Plus</span>
        </div>
      </CardContent>
    </Card>
  )
}

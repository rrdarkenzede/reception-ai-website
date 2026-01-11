import { useEffect, useMemo, useState } from 'react'
import { getCurrentUser, getRDVs } from '@/lib/store'
import type { RDV, User } from '@/lib/types'
import { useBusinessConfig } from '@/hooks/useBusinessConfig'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type SectorKind = 'restaurant' | 'automotive' | 'medical'

export default function BookingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [rdvs, setRdvs] = useState<RDV[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date())

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser()
      setUser(u)
      if (!u) return
      setRdvs(await getRDVs(u.id))
    }

    load()
  }, [])

  const sectorKind: SectorKind = useMemo(() => {
    const s = String(user?.sector || 'restaurant').toLowerCase()
    if (["automotive", "garage", "autoecole"].includes(s)) return 'automotive'
    if (["medical", "dentiste", "clinique", "veterinaire"].includes(s)) return 'medical'
    return 'restaurant'
  }, [user?.sector])

  const { theme, vocabulary } = useBusinessConfig(user?.sector || 'restaurant')

  const upcoming = useMemo(() => {
    const now = new Date()

    return rdvs
      .filter((r) => {
        const dt = new Date(`${r.date}T${r.time}`)
        return dt.getTime() >= now.getTime() - 60_000
      })
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
  }, [rdvs])

  const selectedKey = selectedDay ? format(selectedDay, 'yyyy-MM-dd') : undefined

  const dayItems = useMemo(() => {
    if (!selectedKey) return []
    return upcoming.filter((r) => r.date === selectedKey)
  }, [upcoming, selectedKey])

  const title = useMemo(() => {
    if (sectorKind === 'restaurant') return 'Reservations'
    if (sectorKind === 'automotive') return 'Bay Schedule'
    return 'Doctor Agenda'
  }, [sectorKind])

  const renderLine = (r: RDV) => {
    if (sectorKind === 'restaurant') {
      const covers = typeof r.guests === 'number' ? r.guests : undefined
      return (
        <div className="text-xs text-muted-foreground">
          {covers ? `${covers} covers` : '—'}
        </div>
      )
    }

    if (sectorKind === 'automotive') {
      const model = [r.vehicleBrand, r.vehicleModel].filter(Boolean).join(' ')
      return (
        <div className="text-xs text-muted-foreground">
          {model || 'Vehicle'}{r.licensePlate ? ` • ${r.licensePlate}` : ''}
        </div>
      )
    }

    return (
      <div className="text-xs text-muted-foreground">
        {r.patientName || 'Patient'}{r.serviceType ? ` • ${r.serviceType}` : ''}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <section className="glass-card rounded-2xl border-border/30 p-4 lg:col-span-2">
        <div className="mb-4">
          <div className="text-xs text-muted-foreground">{vocabulary.booking}</div>
          <div className="mt-1 text-lg font-medium tracking-tight text-foreground">{title}</div>
        </div>

        <div className="space-y-2">
          {upcoming.slice(0, 12).map((r) => {
            const dt = new Date(`${r.date}T${r.time}`)
            const isActive = selectedKey === r.date

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedDay(new Date(r.date))}
                className={cn(
                  'w-full text-left rounded-xl border px-3 py-2 transition-colors',
                  'bg-white/3 border-white/8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]',
                  isActive ? 'border-white/20' : 'hover:border-(--theme-primary)/60'
                )}
                style={isActive ? { borderColor: `${theme.primary}55` } : undefined}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium tracking-tight text-foreground">
                        {format(dt, 'dd MMM • HH:mm', { locale: fr })}
                      </div>
                      <span
                        className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                          color: theme.primary,
                          borderColor: 'rgba(255,255,255,0.08)',
                          backgroundColor: 'rgba(255,255,255,0.03)',
                        }}
                      >
                        {r.status}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-foreground truncate">{r.clientName}</div>
                    {renderLine(r)}
                  </div>
                </div>
              </button>
            )
          })}

          {upcoming.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No upcoming items</div>
          ) : null}
        </div>
      </section>

      <section className="glass-strong rounded-2xl border-border/30 p-4 lg:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Calendar</div>
            <div className="mt-1 text-lg font-medium tracking-tight text-foreground">
              {selectedDay ? format(selectedDay, 'dd MMMM yyyy', { locale: fr }) : 'Select a date'}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {selectedKey ? `${dayItems.length} items` : ''}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="glass-card rounded-xl border-border/30">
              <Calendar
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl border-border/30 p-3">
              <div className="text-xs text-muted-foreground">Selected day</div>
              <div className="mt-2 space-y-2">
                {dayItems.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-lg border border-white/8 bg-white/3 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-foreground">{r.time}</div>
                      <div className="text-[10px] font-semibold" style={{ color: theme.primary }}>
                        {r.status}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-foreground truncate">{r.clientName}</div>
                    {renderLine(r)}
                  </div>
                ))}

                {selectedKey && dayItems.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">No items for this day</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

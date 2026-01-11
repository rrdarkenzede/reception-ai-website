import { useEffect, useMemo, useState } from "react"
import { getCurrentUser, getRDVs, getCallLogs } from "@/lib/store"
import type { User, RDV, CallLog } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, TrendingUp, DollarSign, Plus, BarChart3, Lock } from "lucide-react"
import { Link } from "react-router-dom"
import { useBusinessConfig } from "@/hooks/useBusinessConfig"
import { WorkshopKanban } from "@/modules/automotive/WorkshopKanban"
import { ServiceGrid } from "@/modules/restaurant/ServiceGrid"
import { TriageList } from "@/modules/medical/TriageList"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [rdvs, setRdvs] = useState<RDV[]>([])
  const [calls, setCalls] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const currentUser = await getCurrentUser()
        if (!mounted) return
        if (currentUser) {
          setUser(currentUser)
          const [r, c] = await Promise.all([
            getRDVs(currentUser.id),
            getCallLogs(currentUser.id),
          ])
          if (!mounted) return
          setRdvs(r)
          setCalls(c)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass-strong rounded-2xl p-6">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-3 h-8 w-2/3" />
          <Skeleton className="mt-2 h-4 w-56" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="glass-card border-border/30">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-3 h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="glass-card rounded-xl border-border/30 p-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!user) return null

  const isStarter = user.plan === "starter"
  const isPro = user.plan === "pro" || user.plan === "elite"

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    const todayRdvs = rdvs.filter((r) => r.date === today)
    const weekRdvs = rdvs.filter((r) => {
      const rdvDate = new Date(r.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return rdvDate >= weekAgo
    })
    const completedRdvs = rdvs.filter((r) => r.status === "completed")
    const fillRate = rdvs.length > 0 ? Math.round((completedRdvs.length / rdvs.length) * 100) : 0
    const revenue = rdvs
      .filter((r) => r.status === "completed")
      .reduce((acc, r) => acc + (r.guests || 1) * 25, 0)

    return {
      todayRdvsCount: todayRdvs.length,
      weekRdvsCount: weekRdvs.length,
      fillRate,
      revenue,
    }
  }, [rdvs])

  const { formatMetadata, theme } = useBusinessConfig(user.sector || "restaurant")

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 18) return 'Good Afternoon'
    return 'Good Evening'
  })()

  const normalizedSector = String(user.sector || "restaurant").toLowerCase()
  const sectorKind = (() => {
    if (["automotive", "garage", "autoecole"].includes(normalizedSector)) return "automotive"
    if (["medical", "dentiste", "clinique", "veterinaire"].includes(normalizedSector)) return "medical"
    return "restaurant"
  })()

  const moduleNode = useMemo(() => {
    if (sectorKind === "automotive") {
      const tickets = calls.map((call) => {
        const meta = (call.metadata || {}) as Record<string, unknown>
        const formatted = formatMetadata(meta)

        const rawStatus = String(meta.status || "").toLowerCase()
        const status = rawStatus.includes("done") || rawStatus.includes("ready")
          ? "done"
          : rawStatus.includes("lift") || rawStatus.includes("progress") || rawStatus.includes("work")
            ? "lifting"
            : "waiting"

        return {
          id: call.id,
          title: formatted.title,
          badge: formatted.badge,
          subtitle: meta.issue ? String(meta.issue) : undefined,
          status,
        } as const
      })

      return <WorkshopKanban tickets={tickets} />
    }

    if (sectorKind === "medical") {
      const patients = calls.map((call) => {
        const meta = (call.metadata || {}) as Record<string, unknown>
        const formatted = formatMetadata(meta)

        return {
          id: call.id,
          title: formatted.title,
          subtitle: meta.history ? String(meta.history) : undefined,
          urgent: Boolean(meta.urgent),
          badge: formatted.badge,
        }
      })

      return <TriageList patients={patients} />
    }

    const tableCount = 8
    const tables = Array.from({ length: tableCount }, (_, i) => {
      const call = calls[i]
      if (!call) {
        return { id: `t-${i + 1}`, label: `Table ${i + 1}`, active: false } as const
      }

      const meta = (call.metadata || {}) as Record<string, unknown>
      const formatted = formatMetadata(meta)
      const guests = typeof meta.guests === 'number' ? meta.guests : undefined

      return {
        id: call.id,
        label: `Table ${i + 1}`,
        active: typeof guests === 'number' ? guests > 0 : true,
        guests,
        title: formatted.title,
        badge: formatted.badge,
      } as const
    })

    return <ServiceGrid tables={tables} />
  }, [calls, formatMetadata, sectorKind])

  return (
    <div className="space-y-6">
      <div className="glass-strong rounded-2xl p-6">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="text-xs tracking-tight text-muted-foreground">OMNI-AI MANAGER</div>
            <div className="mt-2 text-2xl font-medium tracking-tight text-foreground">
              {greeting},{' '}
              <span style={{ color: theme.primary }}>{user.companyName || user.name}</span>.
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              System Operational.
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full" style={{ backgroundColor: `${theme.primary}55` }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: theme.primary }} />
            </span>
            <span className="text-xs font-medium" style={{ color: theme.primary }}>
              Online
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {isPro && (
          <Link to="/dashboard/bookings">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Nouveau RDV
            </Button>
          </Link>
        )}
      </div>

      {isStarter ? (
        <Card className="glass-card border-border/30">
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Statistiques non disponibles</h3>
            <p className="text-muted-foreground mb-4">Passez au plan Pro pour accéder aux analytics détaillées</p>
            <Button className="bg-primary hover:bg-primary/90">Upgrade to Pro</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">RDV Aujourd&apos;hui</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.todayRdvsCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">RDV Semaine</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.weekRdvsCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taux Remplissage</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.fillRate}%</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenus estimés</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.revenue}€</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="glass-card rounded-xl border-border/30 p-4">
        {moduleNode}
      </div>
    </div>
  )
}

import { useEffect, useMemo, useState, useCallback } from "react"
import { getCurrentUser, getRDVs, getCallLogs } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import type { User, RDV, CallLog } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder"
import { Calendar, DollarSign, Plus, BarChart3, Lock, CarFront, Utensils, Activity, Phone, Power, Users } from "lucide-react"
import { Link } from "react-router-dom"
import { useBusinessConfig } from "@/hooks/useBusinessConfig"
import { WorkshopKanban } from "@/modules/automotive/WorkshopKanban"
import { ServiceGrid } from "@/modules/restaurant/ServiceGrid"
import { TriageList } from "@/modules/medical/TriageList"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [rdvs, setRdvs] = useState<RDV[]>([])
  const [calls, setCalls] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)
  const [aiEnabled, setAiEnabled] = useState(true)
  const [togglingAI, setTogglingAI] = useState(false)

  // Move all hooks to the top before any conditional returns
  const stats = useMemo(() => {
    if (!rdvs.length && !calls.length) return {
      todayRdvsCount: 0,
      weekRdvsCount: 0,
      fillRate: 0,
      revenue: 0,
      todayCallsCount: 0,
    }
    
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
    
    // Count today's calls
    const todayCallsCount = calls.filter((c) => {
      const callDate = new Date(c.timestamp).toISOString().split("T")[0]
      return callDate === today
    }).length

    return {
      todayRdvsCount: todayRdvs.length,
      weekRdvsCount: weekRdvs.length,
      fillRate,
      revenue,
      todayCallsCount,
    }
  }, [rdvs, calls])

  const { formatMetadata, theme } = useBusinessConfig(user?.sector || "restaurant")

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Bonjour'
    if (h < 18) return 'Bon après-midi'
    return 'Bonsoir'
  }, [])

  // Toggle AI enabled state
  const toggleAI = useCallback(async () => {
    if (!user) return
    setTogglingAI(true)
    try {
      const newState = !aiEnabled
      const currentSettings = (user.settings || {}) as Record<string, unknown>
      const { error } = await supabase
        .from('profiles')
        .update({ settings: { ...currentSettings, ai_enabled: newState } })
        .eq('id', user.id)
      
      if (error) throw error
      
      setAiEnabled(newState)
      toast.success(newState ? 'IA réactivée' : 'IA désactivée - Urgence')
    } catch {
      toast.error('Erreur lors du changement')
    } finally {
      setTogglingAI(false)
    }
  }, [user, aiEnabled])

  // Generate activity feed from recent calls and reservations
  const activityFeed = useMemo(() => {
    const activities: Array<{ id: string; icon: typeof Phone; text: string; time: Date; color: string }> = []
    
    // Add recent calls
    calls.slice(0, 3).forEach((call) => {
      activities.push({
        id: `call-${call.id}`,
        icon: Phone,
        text: `Appel reçu - ${call.status === 'completed' ? 'Terminé' : 'Manqué'}`,
        time: new Date(call.timestamp),
        color: call.status === 'completed' ? 'text-green-500' : 'text-red-500',
      })
    })
    
    // Add recent reservations
    rdvs.slice(0, 3).forEach((rdv) => {
      activities.push({
        id: `rdv-${rdv.id}`,
        icon: Users,
        text: `Réservation: ${rdv.clientName} (${rdv.guests || 1} pers.)`,
        time: new Date(rdv.date + 'T' + rdv.time),
        color: 'text-blue-500',
      })
    })
    
    // Sort by time descending and take top 5
    return activities
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 5)
  }, [calls, rdvs])

  const normalizedSector = useMemo(() => String(user?.sector || "restaurant").toLowerCase(), [user?.sector])
  
  const sectorKind = useMemo(() => {
    if (["automotive", "garage", "autoecole"].includes(normalizedSector)) return "automotive"
    if (["medical", "dentiste", "clinique", "veterinaire"].includes(normalizedSector)) return "medical"
    return "restaurant"
  }, [normalizedSector])

  const moduleNode = useMemo(() => {
    // Handle empty states
    if (calls.length === 0) {
      const emptyIcon = sectorKind === "automotive" ? CarFront : 
                        sectorKind === "medical" ? Activity : Utensils
      
      return (
        <EmptyPlaceholder
          icon={emptyIcon}
          title="Aucun appel reçu"
          description="Commencez à recevoir des appels pour voir les données ici"
          action={{
            label: "Voir les appels",
            onClick: () => window.location.href = "/dashboard/calls"
          }}
        />
      )
    }

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

  // Load AI enabled state from user settings
  useEffect(() => {
    if (user?.settings) {
      const settings = user.settings as Record<string, unknown>
      setAiEnabled(settings.ai_enabled !== false) // Default to true
    }
  }, [user])

  // Now conditional returns are safe
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
            <Card key={idx} className="glass-card border-border/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
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

      {/* Action Bar: Panic Button + New RDV */}
      <div className="flex items-center justify-between gap-4">
        {/* Panic Button - Emergency AI Kill Switch */}
        <Button
          variant={aiEnabled ? "destructive" : "default"}
          className={`gap-2 ${aiEnabled ? 'bg-red-600 hover:bg-red-700 pulse-red' : 'bg-green-600 hover:bg-green-700'}`}
          onClick={toggleAI}
          disabled={togglingAI}
        >
          <Power className="w-4 h-4" />
          {togglingAI ? 'Changement...' : aiEnabled ? '🚨 Couper l\'IA' : '✅ Réactiver l\'IA'}
        </Button>

        {isPro && (
          <Link to="/dashboard/reservations">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Nouvelle Réservation
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
            <Button className="bg-primary hover:bg-primary/90">Passer au plan Pro</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card border-border/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 active:scale-[0.98]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Réservations du jour</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.todayRdvsCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 active:scale-[0.98]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taux d'occupation</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.fillRate}%</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 active:scale-[0.98]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Appels IA</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.todayCallsCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 active:scale-[0.98]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Chiffre d'affaire</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stats.revenue}€</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Activity Feed */}
      <Card className="glass-card border-border/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Dernières Activités
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activityFeed.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune activité récente</p>
          ) : (
            <div className="space-y-3">
              {activityFeed.map((activity) => {
                const ActivityIcon = activity.icon
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                    <div className={`p-2 rounded-full bg-secondary/50 ${activity.color}`}>
                      <ActivityIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(activity.time, 'dd MMM à HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="glass-card rounded-xl border-border/30 p-4">
        {moduleNode}
      </div>
    </div>
  )
}

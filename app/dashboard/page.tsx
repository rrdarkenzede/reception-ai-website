"use client"

import { useEffect, useState } from "react"
import { getCurrentUser, getRDVs, getCallLogs } from "@/lib/store"
import type { User, RDV, CallLog } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  TrendingUp,
  Phone,
  DollarSign,
  Plus,
  BarChart3,
  Clock,
  Settings,
  ArrowUpRight,
  Lock,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [rdvs, setRdvs] = useState<RDV[]>([])
  const [calls, setCalls] = useState<CallLog[]>([])

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setRdvs(getRDVs(currentUser.id))
      setCalls(getCallLogs(currentUser.id))
    }
  }, [])

  if (!user) return null

  const isStarter = user.plan === "starter"
  const isPro = user.plan === "pro" || user.plan === "elite"
  const isElite = user.plan === "elite"

  // Calculate stats
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

  // For restaurant: calculate revenue
  const revenue = rdvs.filter((r) => r.status === "completed").reduce((acc, r) => acc + (r.guests || 1) * 25, 0) // Avg 25€/person

  const getQuickActionLabel = () => {
    switch (user.sector) {
      case "restaurant":
        return "Nouveau RDV"
      case "dentiste":
        return "Nouveau Patient"
      case "garage":
        return "Nouvelle Réparation"
      default:
        return "Nouveau RDV"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenue, {user.companyName || user.name}</p>
        </div>
        {isPro && (
          <Link href="/dashboard/reservations">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              {getQuickActionLabel()}
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
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
                  <p className="text-2xl font-bold text-foreground mt-1">{todayRdvs.length}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-4 h-4 text-success" />
                    <span className="text-sm text-success">+3</span>
                  </div>
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
                  <p className="text-2xl font-bold text-foreground mt-1">{weekRdvs.length}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-4 h-4 text-success" />
                    <span className="text-sm text-success">+15%</span>
                  </div>
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
                  <p className="text-2xl font-bold text-foreground mt-1">{fillRate}%</p>
                  <div className="w-full h-2 bg-secondary rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${fillRate}%` }} />
                  </div>
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
                  <p className="text-sm text-muted-foreground">
                    {user.sector === "garage" ? "Devis" : "Revenus estimés"}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {user.sector === "garage"
                      ? `${rdvs.reduce((acc, r) => acc + (r.estimatedCost || 0), 0)}€`
                      : `${revenue}€`}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowUpRight className="w-4 h-4 text-success" />
                    <span className="text-sm text-success">+5%</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/dashboard/reservations">
          <Button
            variant="outline"
            className="w-full h-auto py-4 flex flex-col gap-2 bg-secondary/30 border-border/30 hover:bg-primary/10 hover:border-primary/30"
          >
            <Plus className="w-5 h-5 text-primary" />
            <span className="text-sm">Nouveau RDV</span>
          </Button>
        </Link>
        {isPro && (
          <Link href="/dashboard/stock">
            <Button
              variant="outline"
              className="w-full h-auto py-4 flex flex-col gap-2 bg-secondary/30 border-border/30 hover:bg-primary/10 hover:border-primary/30"
            >
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="text-sm">Voir Stats</span>
            </Button>
          </Link>
        )}
        <Link href="/dashboard/calls">
          <Button
            variant="outline"
            className="w-full h-auto py-4 flex flex-col gap-2 bg-secondary/30 border-border/30 hover:bg-primary/10 hover:border-primary/30"
          >
            <Phone className="w-5 h-5 text-primary" />
            <span className="text-sm">Historique Appels</span>
          </Button>
        </Link>
        <Link href="/dashboard/settings">
          <Button
            variant="outline"
            className="w-full h-auto py-4 flex flex-col gap-2 bg-secondary/30 border-border/30 hover:bg-primary/10 hover:border-primary/30"
          >
            <Settings className="w-5 h-5 text-primary" />
            <span className="text-sm">Settings</span>
          </Button>
        </Link>
      </div>

      {/* Recent RDVs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-border/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Prochains RDV</span>
              <Link href="/dashboard/reservations" className="text-sm text-primary hover:underline font-normal">
                Voir tout
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rdvs
                .filter((r) => r.status === "confirmed" || r.status === "pending")
                .slice(0, 5)
                .map((rdv) => (
                  <div
                    key={rdv.id}
                    className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{rdv.clientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {rdv.date} à {rdv.time}
                          {rdv.guests && ` • ${rdv.guests} pers.`}
                          {rdv.vehicleBrand && ` • ${rdv.vehicleBrand} ${rdv.vehicleModel}`}
                          {rdv.serviceType && ` • ${rdv.serviceType}`}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        rdv.status === "confirmed"
                          ? "bg-success/10 text-success"
                          : rdv.status === "pending"
                            ? "bg-warning/10 text-warning"
                            : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {rdv.status === "confirmed" ? "Confirmé" : rdv.status === "pending" ? "En attente" : rdv.status}
                    </span>
                  </div>
                ))}
              {rdvs.filter((r) => r.status === "confirmed" || r.status === "pending").length === 0 && (
                <p className="text-center text-muted-foreground py-4">Aucun RDV à venir</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Derniers Appels</span>
              <Link href="/dashboard/calls" className="text-sm text-primary hover:underline font-normal">
                Voir tout
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {calls.slice(0, 5).map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        call.status === "completed"
                          ? "bg-success/10"
                          : call.status === "missed"
                            ? "bg-destructive/10"
                            : "bg-secondary"
                      }`}
                    >
                      <Phone
                        className={`w-5 h-5 ${
                          call.status === "completed"
                            ? "text-success"
                            : call.status === "missed"
                              ? "text-destructive"
                              : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{call.clientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : "Manqué"} •{" "}
                        {call.type === "incoming" ? "Entrant" : "Sortant"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      call.status === "completed"
                        ? "bg-success/10 text-success"
                        : call.status === "missed"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {call.status === "completed" ? "Complété" : call.status === "missed" ? "Manqué" : "En cours"}
                  </span>
                </div>
              ))}
              {calls.length === 0 && <p className="text-center text-muted-foreground py-4">Aucun appel récent</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

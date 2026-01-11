import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, DollarSign, Phone, Calendar, ArrowRight, Plus } from "lucide-react"
import { getUsers, getRDVs, getCallLogs } from "@/lib/store"

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalClients: 0,
    starterClients: 0,
    proClients: 0,
    eliteClients: 0,
    totalRDV: 0,
    totalCalls: 0,
    mrr: 0,
  })

  useEffect(() => {
    const users = getUsers()
    const rdvs = getRDVs()
    const calls = getCallLogs()

    const starterClients = users.filter((u) => u.plan === "starter" || !u.plan).length
    const proClients = users.filter((u) => u.plan === "pro").length
    const eliteClients = users.filter((u) => u.plan === "elite").length

    // MRR calculation (one-time payment but shown as equivalent monthly)
    const mrr = proClients * 500 + eliteClients * 1000

    setStats({
      totalClients: users.length,
      starterClients,
      proClients,
      eliteClients,
      totalRDV: rdvs.length,
      totalCalls: calls.length,
      mrr,
    })
  }, [])

  const statCards = [
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Revenus",
      value: `${stats.mrr.toLocaleString()}€`,
      icon: DollarSign,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Réservations",
      value: stats.totalRDV,
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Appels IA",
      value: stats.totalCalls,
      icon: Phone,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord Admin</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble de votre activité</p>
        </div>
        <Link to="/admin/clients">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nouveau Client
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="glass-card rounded-xl p-6 border-border/30">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Plans breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 border-border/30">
          <h2 className="text-lg font-semibold text-foreground mb-4">Répartition des Plans</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                <span className="text-foreground">Starter</span>
              </div>
              <span className="font-semibold text-foreground">{stats.starterClients}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-foreground">Pro (500€)</span>
              </div>
              <span className="font-semibold text-foreground">{stats.proClients}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-foreground">Elite (1000€)</span>
              </div>
              <span className="font-semibold text-foreground">{stats.eliteClients}</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="glass-card rounded-xl p-6 border-border/30">
          <h2 className="text-lg font-semibold text-foreground mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <Link to="/admin/clients" className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-foreground">Gérer les clients</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link to="/admin/analytics" className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-foreground">Voir les analytics</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

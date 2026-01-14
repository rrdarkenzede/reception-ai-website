import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, Phone, Calendar, ArrowRight, Plus } from "lucide-react"
import { getGlobalStats } from "@/lib/store"
import { Link } from "react-router-dom"

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalBookings24h: 0,
    mrr: 0,
  })

  useEffect(() => {
    async function load() {
      const data = await getGlobalStats()
      setStats(data)
    }
    load()
  }, [])

  const statCards = [
    {
      title: "Total Restaurants",
      value: stats.totalRestaurants,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "MRR Global",
      value: `${stats.mrr.toLocaleString()}€`,
      icon: DollarSign,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Réservations (24h)",
      value: stats.totalBookings24h,
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Appels IA (Total)",
      value: "Coming Soon", // Need to implement global call stats if critical
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
          <h1 className="text-2xl font-bold text-foreground">Control Tower</h1>
          <p className="text-muted-foreground mt-1">Super Admin Overview</p>
        </div>
        <Link to="/admin/clients">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Gérer les Tenants
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

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 border-border/30">
          <h2 className="text-lg font-semibold text-foreground mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <Link to="/admin/clients" className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-foreground">Gérer les Restaurants</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

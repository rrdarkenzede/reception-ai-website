"use client"

import { useEffect, useState } from "react"
import { getUsers, getRDVs, getCallLogs } from "@/lib/store"
import type { User, RDV, CallLog } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Phone, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [rdvs, setRdvs] = useState<RDV[]>([])
  const [calls, setCalls] = useState<CallLog[]>([])

  useEffect(() => {
    setUsers(getUsers())
    setRdvs(getRDVs())
    setCalls(getCallLogs())
  }, [])

  const totalRevenue = users.reduce((acc, u) => {
    if (u.plan === "pro") return acc + 500
    if (u.plan === "elite") return acc + 1000
    return acc
  }, 0)

  const stats = [
    {
      title: "Clients Actifs",
      value: users.length,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "RDV ce mois",
      value: rdvs.length,
      change: "+8%",
      trend: "up",
      icon: Calendar,
      color: "text-success",
    },
    {
      title: "Appels traités",
      value: calls.length,
      change: "+23%",
      trend: "up",
      icon: Phone,
      color: "text-warning",
    },
    {
      title: "Revenue Mensuel",
      value: `${totalRevenue}€`,
      change: "+15%",
      trend: "up",
      icon: TrendingUp,
      color: "text-primary",
    },
  ]

  const planDistribution = {
    starter: users.filter((u) => u.plan === "starter").length,
    pro: users.filter((u) => u.plan === "pro").length,
    elite: users.filter((u) => u.plan === "elite").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Admin</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble de la plateforme</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-card border-border/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-success" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`text-sm ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-lg">Distribution des Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                  <span className="text-sm text-foreground">Starter</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{planDistribution.starter}</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-muted-foreground"
                  style={{ width: `${(planDistribution.starter / users.length) * 100 || 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">Pro</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{planDistribution.pro}</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(planDistribution.pro / users.length) * 100 || 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm text-foreground">Elite</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{planDistribution.elite}</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-warning"
                  style={{ width: `${(planDistribution.elite / users.length) * 100 || 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card border-border/30">
          <CardHeader>
            <CardTitle className="text-lg">Activité Récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.companyName || user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.sector}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      user.plan === "elite"
                        ? "bg-warning/10 text-warning"
                        : user.plan === "pro"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {user.plan?.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

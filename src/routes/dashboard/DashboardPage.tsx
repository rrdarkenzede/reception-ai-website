import { useEffect, useState } from "react"
import { getCurrentUser, getRDVs, getCallLogs } from "@/lib/store"
import type { User, RDV, CallLog } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Phone, DollarSign, Plus, BarChart3, Clock, Settings, ArrowUpRight, Lock } from "lucide-react"
import { Link } from "react-router-dom"

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
  const revenue = rdvs.filter((r) => r.status === "completed").reduce((acc, r) => acc + (r.guests || 1) * 25, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenue, {user.companyName || user.name}</p>
        </div>
        {isPro && (
          <Link to="/dashboard/reservations">
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
                  <p className="text-2xl font-bold text-foreground mt-1">{todayRdvs.length}</p>
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
                  <p className="text-2xl font-bold text-foreground mt-1">{revenue}€</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

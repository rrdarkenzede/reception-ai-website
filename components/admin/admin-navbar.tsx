"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Users, TrendingUp, DollarSign } from "lucide-react"
import { logout, getUsers, getRDVs } from "@/lib/store"

export function AdminNavbar() {
  const router = useRouter()
  const users = getUsers()
  const rdvs = getRDVs()
  const totalRevenue = users.reduce((acc, u) => {
    if (u.plan === "pro") return acc + 500
    if (u.plan === "elite") return acc + 1000
    return acc
  }, 0)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="h-16 bg-card border-b border-border/50 flex items-center justify-between px-6">
      {/* Quick Stats */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Clients:</span>
          <span className="font-semibold text-foreground">{users.length}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-success" />
          <span className="text-muted-foreground">RDV Total:</span>
          <span className="font-semibold text-foreground">{rdvs.length}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-warning" />
          <span className="text-muted-foreground">MRR:</span>
          <span className="font-semibold text-foreground">{totalRevenue}€</span>
        </div>
      </div>

      {/* Logout */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <LogOut className="w-4 h-4" />
        Déconnexion
      </Button>
    </header>
  )
}

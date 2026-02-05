import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import type { ComponentType } from 'react'
import type { Sector, Plan } from '@/lib/types'
import {
  LayoutDashboard,
  Calendar,
  Table2,
  UtensilsCrossed,
  Tag,
  Phone,
  Settings,
  Target,
} from "lucide-react"

interface ClientSidebarProps {
  sector: Sector
  plan: Plan
}

interface MenuItem {
  icon: ComponentType<{ className?: string }>
  label: string
  href: string
  minPlan?: Plan
}

const sectorMenus: Record<Sector, MenuItem[]> = {
  restaurant: [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard" },
    { icon: Calendar, label: "Réservations", href: "/dashboard/reservations" },
    { icon: Table2, label: "Tables", href: "/dashboard/tables", minPlan: "pro" },
    { icon: UtensilsCrossed, label: "Ma Carte", href: "/dashboard/menu" },
    { icon: Tag, label: "Marketing / Promos", href: "/dashboard/promos", minPlan: "pro" },
    { icon: Phone, label: "Appels IA", href: "/dashboard/calls" },
    { icon: Settings, label: "Réglages", href: "/dashboard/settings" },
  ],
}

const planOrder: Plan[] = ["free", "pro", "enterprise"]

export function ClientSidebar({ sector, plan }: ClientSidebarProps) {
  const location = useLocation()
  const pathname = location.pathname
  const menu = sectorMenus[sector] || sectorMenus.restaurant

  const canAccess = (minPlan?: Plan) => {
    if (!minPlan) return true
    return planOrder.indexOf(plan) >= planOrder.indexOf(minPlan)
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border/50 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Target className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground">ReceptionAI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menu.map((item) => {
          const isActive = pathname === item.href
          const hasAccess = canAccess(item.minPlan)

          if (!hasAccess) {
            return null
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav >
    </aside >
  )
}

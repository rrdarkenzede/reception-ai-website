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
  Users,
  DoorOpen,
  Stethoscope,
  AlertTriangle,
  Wrench,
  Car,
  FileText,
  Target,
  ClipboardList,
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
    { icon: UtensilsCrossed, label: "Ma Carte", href: "/dashboard/menu", minPlan: "pro" },
    { icon: Tag, label: "Marketing / Promos", href: "/dashboard/promos", minPlan: "pro" },
    { icon: Phone, label: "Appels IA", href: "/dashboard/calls" },
    { icon: Settings, label: "Réglages", href: "/dashboard/settings" },
  ],
  dentiste: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Patients", href: "/dashboard/reservations" },
    { icon: DoorOpen, label: "Salles", href: "/dashboard/rooms", minPlan: "pro" },
    { icon: Stethoscope, label: "Services", href: "/dashboard/stock", minPlan: "pro" },
    { icon: AlertTriangle, label: "Urgences", href: "/dashboard/urgences", minPlan: "elite" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  garage: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Wrench, label: "Réparations", href: "/dashboard/reservations" },
    { icon: Car, label: "Véhicules", href: "/dashboard/vehicles", minPlan: "pro" },
    { icon: ClipboardList, label: "Pièces", href: "/dashboard/stock", minPlan: "pro" },
    { icon: FileText, label: "Devis", href: "/dashboard/quotes", minPlan: "pro" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  immobilier: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Visites", href: "/dashboard/reservations" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  juridique: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Consultations", href: "/dashboard/reservations" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  beaute: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Rendez-vous", href: "/dashboard/reservations" },
    { icon: UtensilsCrossed, label: "Prestations", href: "/dashboard/stock", minPlan: "pro" },
    { icon: Tag, label: "Promos", href: "/dashboard/promos", minPlan: "pro" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  beauty: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Rendez-vous", href: "/dashboard/reservations" },
    { icon: UtensilsCrossed, label: "Prestations", href: "/dashboard/stock", minPlan: "pro" },
    { icon: Tag, label: "Promos", href: "/dashboard/promos", minPlan: "pro" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  sport: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Réservations", href: "/dashboard/reservations" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  autoecole: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Leçons", href: "/dashboard/reservations" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  veterinaire: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Consultations", href: "/dashboard/reservations" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  clinique: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Rendez-vous", href: "/dashboard/reservations" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  fitness: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Réservations", href: "/dashboard/reservations" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  medical: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Rendez-vous", href: "/dashboard/reservations" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  legal: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Consultations", href: "/dashboard/reservations" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  real_estate: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Visites", href: "/dashboard/reservations" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  automotive: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Wrench, label: "Réparations", href: "/dashboard/reservations" },
    { icon: Car, label: "Véhicules", href: "/dashboard/vehicles", minPlan: "pro" },
    { icon: ClipboardList, label: "Pièces", href: "/dashboard/stock", minPlan: "pro" },
    { icon: FileText, label: "Devis", href: "/dashboard/quotes", minPlan: "pro" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
  trades: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Calendar, label: "Interventions", href: "/dashboard/reservations" },
    { icon: Phone, label: "Appels", href: "/dashboard/calls" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ],
}

// Assign 'beauty' to match 'beaute' exactly since we couldn't reference it inside
sectorMenus.beauty = sectorMenus.beaute;

const planOrder: Plan[] = ["starter", "pro", "elite"]

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

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, CreditCard, BarChart3, Settings, FileText, HelpCircle, Target } from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Clients", href: "/admin/clients" },
  { icon: CreditCard, label: "Plans", href: "/admin/plans" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
  { icon: FileText, label: "Logs", href: "/admin/logs" },
  { icon: HelpCircle, label: "Support", href: "/admin/support" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border/50 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Target className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground">Admin Panel</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
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
      </nav>
    </aside>
  )
}

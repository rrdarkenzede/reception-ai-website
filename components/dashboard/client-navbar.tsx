"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, CreditCard, Plug, HelpCircle, ChevronDown } from "lucide-react"
import { logout } from "@/lib/store"
import type { User } from "@/lib/types"
import { SECTORS } from "@/lib/types"

interface ClientNavbarProps {
  user: User
  onPanicClick?: () => void
  isPaused?: boolean
}

export function ClientNavbar({ user, onPanicClick, isPaused }: ClientNavbarProps) {
  const router = useRouter()
  const sector = SECTORS.find((s) => s.value === user.sector)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getPlanBadgeStyle = () => {
    switch (user.plan) {
      case "elite":
        return "bg-gradient-to-r from-warning/20 to-primary/20 text-warning border border-warning/30"
      case "pro":
        return "bg-primary/10 text-primary border border-primary/30"
      default:
        return "bg-secondary text-muted-foreground"
    }
  }

  return (
    <header className="h-16 bg-card border-b border-border/50 flex items-center justify-between px-6">
      {/* Client Info */}
      <div className="flex items-center gap-4">
        <div>
          <p className="font-semibold text-foreground">{user.companyName || user.name}</p>
          <p className="text-xs text-muted-foreground">
            {sector?.icon} {sector?.label} • Secteur Activé
          </p>
        </div>
      </div>

      {/* Center - Plan & Sector Badges */}
      <div className="flex items-center gap-3">
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getPlanBadgeStyle()}`}>
          {user.plan?.toUpperCase()}
        </span>
        <span className="text-sm px-3 py-1.5 rounded-full bg-secondary/50 text-muted-foreground">
          {sector?.icon} {sector?.label}
        </span>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        {/* Panic Button - Elite only */}
        {user.plan === "elite" && onPanicClick && (
          <Button
            onClick={onPanicClick}
            className={`rounded-full w-14 h-14 p-0 font-bold text-sm ${
              isPaused
                ? "bg-warning hover:bg-warning/90 text-warning-foreground"
                : "bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse-glow"
            }`}
          >
            {isPaused ? "GO" : "STOP"}
          </Button>
        )}

        {/* Settings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <Settings className="w-4 h-4" />
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2">
              <Settings className="w-4 h-4" /> Profil
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <CreditCard className="w-4 h-4" /> Facturation
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Plug className="w-4 h-4" /> Intégrations
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <HelpCircle className="w-4 h-4" /> Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4" /> Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

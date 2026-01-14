import { Navigate, useNavigate } from "react-router-dom"
import { getCurrentUser, logout } from "@/lib/store"
import { PolymorphicLayout } from "@/components/layout/PolymorphicLayout"
import { Button } from "@/components/ui/button"
import { Ghost } from "lucide-react"

import { useState, useEffect } from "react"
import type { User, BusinessType, Plan } from "@/lib/types"

export default function DashboardLayout() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGhostMode, setIsGhostMode] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const u = await getCurrentUser()
        setUser(u)
        if (typeof window !== "undefined" && localStorage.getItem("ghost_mode_ctx")) {
            setIsGhostMode(true)
        }
      } catch (error) {
        console.error("Failed to load user:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stopGhostMode = () => {
    localStorage.removeItem("ghost_mode_ctx")
    window.location.href = "/admin/clients" // Reload to clear store state properly
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Redirect to Admin Panel if Super Admin and NOT in Ghost Mode (masked by store, but good to be explicit if store didn't mask)
  if (user.isSuperAdmin && !isGhostMode) {
    return <Navigate to="/admin" replace />
  }

  // Safely cast with fallback defaults
  const businessType: BusinessType = (user.sector as BusinessType) || "restaurant"
  const tier: Plan = (user.plan as Plan) || "starter"

  return (
    <>
        {isGhostMode && (
            <div className="bg-destructive/10 border-b border-destructive/20 text-destructive px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                    <Ghost className="w-4 h-4" />
                    MODE GHOST D'ADMINISTRATION ACTIF - Vous voyez le compte de {user.name}
                </div>
                <Button size="sm" variant="destructive" onClick={stopGhostMode}>
                    Quitter
                </Button>
            </div>
        )}
        <PolymorphicLayout
        businessType={businessType}
        tier={tier}
        companyName={user.companyName || ""}
        userName={user.name}
        userEmail={user.email}
        onLogout={async () => {
            if (isGhostMode) {
                stopGhostMode()
            } else {
                await logout()
                navigate("/login")
            }
        }}
        />
    </>
  )
}

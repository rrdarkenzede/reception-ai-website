import { Navigate, useNavigate } from "react-router-dom"
import { getCurrentUser, logout } from "@/lib/store"
import { PolymorphicLayout } from "@/components/layout/PolymorphicLayout"

import { useState, useEffect } from "react"
import type { User, BusinessType, Plan } from "@/lib/types"

export default function DashboardLayout() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const u = await getCurrentUser()
        setUser(u)
      } catch (error) {
        console.error("Failed to load user:", error)
        // Optionally redirect to login or show error
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" replace />
  }

  // Safely cast with fallback defaults
  const businessType: BusinessType = (user.sector as BusinessType) || "restaurant"
  const tier: Plan = (user.plan as Plan) || "starter"

  return (
    <PolymorphicLayout
      businessType={businessType}
      tier={tier}
      companyName={user.companyName || ""}
      userName={user.name}
      userEmail={user.email}
      onLogout={async () => {
        await logout()
        navigate("/login")
      }}
    />
  )
}

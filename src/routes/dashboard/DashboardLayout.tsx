import { Navigate, useNavigate } from "react-router-dom"
import { getCurrentUser, logout } from "@/lib/store"
import { PolymorphicLayout } from "@/components/layout/PolymorphicLayout"

import { useState, useEffect } from "react"
import type { User } from "@/lib/types"

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

  return (
    <PolymorphicLayout
      businessType={(user.sector || "restaurant") as any}
      tier={(user.plan || "starter") as any}
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

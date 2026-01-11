import { Outlet, Navigate } from "react-router-dom"
import { getCurrentUser } from "@/lib/store"
import { ClientSidebar } from "@/components/dashboard/client-sidebar"
import { ClientNavbar } from "@/components/dashboard/client-navbar"

import { useState, useEffect } from "react"
import type { User } from "@/lib/types"

export default function DashboardLayout() {
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

  if (!user || user.role === "admin") {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar sector={user.sector || "restaurant"} plan={user.plan || "starter"} />
      <div className="ml-64">
        <ClientNavbar user={user} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

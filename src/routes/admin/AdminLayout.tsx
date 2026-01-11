import { Outlet, Navigate } from "react-router-dom"
import { getCurrentUser } from "@/lib/store"
import { useEffect, useState } from "react"
import type { User } from "@/lib/types"

export default function AdminLayout() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const u = await getCurrentUser()
        setUser(u)
      } catch (error) {
        console.error("Failed to load user:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}

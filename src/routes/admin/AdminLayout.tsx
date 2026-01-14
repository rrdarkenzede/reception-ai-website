import { Outlet, Navigate, useNavigate } from "react-router-dom"
import { getCurrentUser, logout } from "@/lib/store"
import { useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function AdminLayout() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

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
      {/* Header with logout button */}
      <header className="h-16 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          {user && (
            <span className="text-sm text-muted-foreground">
              Connecté: {user.name} ({user.email})
            </span>
          )}
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </Button>
      </header>
      
      {/* Main content */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}

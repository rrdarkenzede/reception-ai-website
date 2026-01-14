import { Outlet, Navigate, useNavigate, Link, useLocation } from "react-router-dom"
import { getCurrentUser, logout } from "@/lib/store"
import { useEffect, useState } from "react"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminLayout() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

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

  // Check for Super Admin
  if (!user || !user.isSuperAdmin) {
    if (user) {
        // If logged in but not admin, go to dashboard
        return <Navigate to="/dashboard" replace />
    }
    return <Navigate to="/login" replace />
  }

  const navItems = [
    { href: "/admin", label: "Global Stats", icon: LayoutDashboard },
    { href: "/admin/clients", label: "Tenants", icon: Building2 },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card/50 backdrop-blur-md flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
           <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
             Super Admin
           </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                    <Link 
                        key={item.href} 
                        to={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                            isActive 
                                ? "bg-primary text-primary-foreground" 
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {item.label}
                    </Link>
                )
            })}
        </nav>

        <div className="p-4 border-t">
          <div className="mb-4 px-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="w-full flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto bg-muted/10">
        <header className="h-16 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
             <h2 className="text-lg font-medium">Dashboard</h2>
        </header>
        <div className="p-6">
            <Outlet />
        </div>
      </main>
    </div>
  )
}

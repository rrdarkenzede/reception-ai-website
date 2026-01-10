import { Outlet, Navigate } from "react-router-dom"
import { getCurrentUser } from "@/lib/store"
import { ClientSidebar } from "@/components/dashboard/client-sidebar"
import { ClientNavbar } from "@/components/dashboard/client-navbar"

export default function DashboardLayout() {
  const user = getCurrentUser()

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

import { Outlet, Navigate } from "react-router-dom"
import { getCurrentUser } from "@/lib/store"

export default function AdminLayout() {
  const user = getCurrentUser()

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}

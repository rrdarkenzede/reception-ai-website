import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import LandingPage from '@/routes/LandingPage'
import LoginPage from '@/routes/LoginPage'
import DashboardLayout from '@/routes/dashboard/DashboardLayout'
import DashboardPage from '@/routes/dashboard/DashboardPage'
import AdminLayout from '@/routes/admin/AdminLayout'
import AdminPage from '@/routes/admin/AdminPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="reservations" element={<div>Reservations</div>} />
          <Route path="calls" element={<div>Calls</div>} />
          <Route path="stock" element={<div>Stock</div>} />
          <Route path="promos" element={<div>Promos</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
          <Route path="clients" element={<div>Clients</div>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="bottom-right" />
    </>
  )
}

export default App

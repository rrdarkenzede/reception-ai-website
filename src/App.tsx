import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'

// Landing & Auth
import LandingPage from '@/routes/LandingPage'
import LoginPage from '@/routes/LoginPage'
import ContactPage from '@/routes/ContactPage'
import BlogPage from '@/routes/BlogPage'
import AboutPage from '@/routes/AboutPage'

// Legal
import PrivacyPage from '@/routes/legal/PrivacyPage'
import TermsPage from '@/routes/legal/TermsPage'

// Dashboard
import DashboardLayout from '@/routes/dashboard/DashboardLayout'
import DashboardPage from '@/routes/dashboard/DashboardPage'
import ReservationsPage from '@/routes/dashboard/ReservationsPage'
import CallsPage from '@/routes/dashboard/CallsPage'
import StockPage from '@/routes/dashboard/StockPage'
import PromosPage from '@/routes/dashboard/PromosPage'
import SettingsPage from '@/routes/dashboard/SettingsPage'

// Admin
import AdminLayout from '@/routes/admin/AdminLayout'
import AdminPage from '@/routes/admin/AdminPage'
import AdminClientsPage from '@/routes/admin/AdminClientsPage'

function App() {
  return (
    <>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Legal pages */}
        <Route path="/legal/privacy" element={<PrivacyPage />} />
        <Route path="/legal/terms" element={<TermsPage />} />

        {/* Dashboard (authenticated users) */}
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="calls" element={<CallsPage />} />
          <Route path="stock" element={<StockPage />} />
          <Route path="promos" element={<PromosPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin panel */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
          <Route path="clients" element={<AdminClientsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="bottom-right" />
    </>
  )
}

export default App

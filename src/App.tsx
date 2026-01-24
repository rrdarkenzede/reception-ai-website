import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { NotificationProvider } from '@/contexts/NotificationContext'

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
import BookingsPage from '@/routes/dashboard/BookingsPage'
import ReservationsPage from '@/routes/dashboard/ReservationsPage'
import CallsPage from '@/routes/dashboard/CallsPage'
import StockPage from '@/routes/dashboard/StockPage'
import MenuPage from '@/routes/dashboard/MenuPage'
import PromosPage from '@/routes/dashboard/PromosPage'
import SettingsPage from '@/routes/dashboard/SettingsPage'
import KitchenPage from '@/routes/dashboard/KitchenPage'
import ClientsPage from '@/routes/dashboard/ClientsPage'
import AgendaPage from '@/routes/dashboard/AgendaPage'
import ServicesPage from '@/routes/dashboard/ServicesPage'
import SupportPage from '@/routes/dashboard/SupportPage'

import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Admin
import AdminLayout from '@/routes/admin/AdminLayout'
import AdminPage from '@/routes/admin/AdminPage'
import AdminClientsPage from '@/routes/admin/AdminClientsPage'
import AdminTicketsPage from '@/routes/admin/AdminTicketsPage'

function App() {
  return (
    <NotificationProvider>
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
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="calls" element={<CallsPage />} />
          <Route path="stock" element={<StockPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="promos" element={<PromosPage />} />
          <Route path="marketing" element={<PromosPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="kitchen" element={<KitchenPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>

        {/* Admin panel */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
          <Route path="clients" element={<AdminClientsPage />} />
          <Route path="tickets" element={<AdminTicketsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="bottom-right" />
    </NotificationProvider>
  )
}

export default App

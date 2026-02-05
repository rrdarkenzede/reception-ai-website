import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LandingPage } from './routes/LandingPage';
import { LoginPage } from './routes/LoginPage';
import { ContactPage } from './routes/ContactPage';
import { DashboardLayout } from './routes/dashboard/DashboardLayout';
import { DashboardPage } from './routes/dashboard/DashboardPage';
import { AgendaPage } from './routes/dashboard/AgendaPage';
import { MenuPage } from './routes/dashboard/MenuPage';
import { CallsPage } from './routes/dashboard/CallsPage';
import { PromosPage } from './routes/dashboard/PromosPage';
import { KitchenPage } from './routes/dashboard/KitchenPage';
import { SettingsPage } from './routes/dashboard/SettingsPage';
import { SupportPage } from './routes/dashboard/SupportPage';
import { AdminLayout } from './routes/admin/AdminLayout';
import { AdminPage } from './routes/admin/AdminPage';
import { AdminClientsPage } from './routes/admin/AdminClientsPage';
import { AdminTicketsPage } from './routes/admin/AdminTicketsPage';

export function App() {
  return (
    <BrowserRouter>
      <div className="noise-overlay" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="calls" element={<CallsPage />} />
          <Route path="promos" element={<PromosPage />} />
          <Route path="kitchen" element={<KitchenPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPage />} />
          <Route path="clients" element={<AdminClientsPage />} />
          <Route path="tickets" element={<AdminTicketsPage />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(10, 10, 10, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f1f5f9',
          },
        }}
      />
    </BrowserRouter>
  );
}

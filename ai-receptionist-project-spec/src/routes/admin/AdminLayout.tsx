import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  LayoutDashboard, 
  Users,
  MessageSquare,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { auth } from '@/lib/store';
import { Profile } from '@/lib/types';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", href: "/admin" },
  { icon: Users, label: "Clients", href: "/admin/clients" },
  { icon: MessageSquare, label: "Tickets Support", href: "/admin/tickets" },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<Profile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!currentUser.is_super_admin) {
      navigate('/dashboard');
      return;
    }
    
    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col glass-card border-r border-border transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && <span className="font-semibold text-orange-400">Admin Panel</span>}
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform", !isSidebarOpen && "rotate-180")} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "sidebar-item",
                location.pathname === item.href && "active",
                !isSidebarOpen && "justify-center px-3"
              )}
              title={!isSidebarOpen ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Dashboard Link */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-border">
            <Link
              to="/dashboard"
              className="sidebar-item text-cyan-400 hover:bg-cyan-500/10"
            >
              <Bot className="w-5 h-5" />
              <span>Mon Dashboard</span>
            </Link>
          </div>
        )}

        {/* User & Logout */}
        <div className="p-4 border-t border-border">
          {isSidebarOpen && (
            <div className="mb-3 text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-muted-foreground truncate text-xs">{user.email}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={cn(
              "sidebar-item text-destructive hover:bg-destructive/10 w-full",
              !isSidebarOpen && "justify-center px-3"
            )}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-orange-400">Admin</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border overflow-hidden"
            >
              <nav className="p-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "sidebar-item",
                      location.pathname === item.href && "active"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="sidebar-item text-cyan-400"
                >
                  <Bot className="w-5 h-5" />
                  <span>Mon Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="sidebar-item text-destructive hover:bg-destructive/10 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:p-6 p-4 pt-20 md:pt-6 overflow-auto">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

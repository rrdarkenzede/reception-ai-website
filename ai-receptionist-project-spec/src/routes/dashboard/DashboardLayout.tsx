import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  LayoutDashboard, 
  Calendar, 
  Utensils, 
  Phone, 
  Megaphone, 
  ChefHat, 
  Settings, 
  HelpCircle,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  Ghost,
  Building2
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { auth, initializeDemoData } from '@/lib/store';
import { Profile, SubscriptionTier } from '@/lib/types';
import { canAccessTier, getTierBadgeColor, getTierLabel } from '@/lib/tier-access';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  minTier?: SubscriptionTier;
}

const NAV_ITEMS: NavItem[] = [
  { icon: LayoutDashboard, label: "Tableau de bord", href: "/dashboard" },
  { icon: Calendar, label: "Agenda", href: "/dashboard/agenda" },
  { icon: Utensils, label: "La Carte", href: "/dashboard/menu" },
  { icon: Phone, label: "Journal d'appels", href: "/dashboard/calls" },
  { icon: Megaphone, label: "Marketing", href: "/dashboard/promos", minTier: "pro" },
  { icon: ChefHat, label: "Cuisine (KDS)", href: "/dashboard/kitchen", minTier: "enterprise" },
  { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
  { icon: HelpCircle, label: "Support", href: "/dashboard/support" },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<Profile | null>(null);
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    const ghostUser = auth.getGhostUser();
    
    if (!currentUser && !ghostUser) {
      navigate('/login');
      return;
    }
    
    if (ghostUser) {
      setUser(ghostUser);
      setIsGhostMode(true);
      initializeDemoData(ghostUser.id);
    } else if (currentUser) {
      setUser(currentUser);
      initializeDemoData(currentUser.id);
    }
  }, [navigate]);

  const handleLogout = () => {
    if (isGhostMode) {
      auth.exitGhostMode();
      navigate('/admin/clients');
    } else {
      auth.signOut();
      navigate('/login');
    }
  };

  const canAccess = (minTier?: SubscriptionTier) => {
    if (!minTier || !user) return true;
    return canAccessTier(user.tier, minTier);
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
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && <span className="font-semibold gradient-text-cyan">ReceptionAI</span>}
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform", !isSidebarOpen && "rotate-180")} />
          </button>
        </div>

        {/* Ghost Mode Banner */}
        {isGhostMode && isSidebarOpen && (
          <div className="m-4 p-3 rounded-lg bg-orange-500/20 border border-orange-500/40 text-center">
            <div className="flex items-center justify-center gap-2 text-orange-400 text-sm">
              <Ghost className="w-4 h-4" />
              <span>Mode Ghost</span>
            </div>
          </div>
        )}

        {/* Company Info */}
        {isSidebarOpen && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.company_name || user.name}</div>
                <div className={cn("badge text-xs mt-1", getTierBadgeColor(user.tier))}>
                  {getTierLabel(user.tier)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.filter(item => canAccess(item.minTier)).map((item) => (
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

        {/* Admin Link */}
        {user.is_super_admin && isSidebarOpen && (
          <div className="p-4 border-t border-border">
            <Link
              to="/admin"
              className="sidebar-item text-orange-400 hover:bg-orange-500/10"
            >
              <Settings className="w-5 h-5" />
              <span>Panel Admin</span>
            </Link>
          </div>
        )}

        {/* User & Logout */}
        <div className="p-4 border-t border-border">
          {isSidebarOpen && (
            <div className="mb-3 text-sm">
              <div className="text-muted-foreground truncate">{user.email}</div>
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
            {isSidebarOpen && <span>{isGhostMode ? 'Quitter Ghost' : 'Déconnexion'}</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">ReceptionAI</span>
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
                {NAV_ITEMS.filter(item => canAccess(item.minTier)).map((item) => (
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
                <button
                  onClick={handleLogout}
                  className="sidebar-item text-destructive hover:bg-destructive/10 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{isGhostMode ? 'Quitter Ghost' : 'Déconnexion'}</span>
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:p-6 p-4 pt-20 md:pt-6 overflow-auto">
        <Outlet context={{ user, isGhostMode }} />
      </main>
    </div>
  );
}

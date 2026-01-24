import { useState, type ElementType } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useBusinessConfig } from '@/hooks/useBusinessConfig';
import { useNotifications } from '@/contexts/NotificationContext';
import type { BusinessType, Plan } from '@/lib/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Icons
import {
    LayoutDashboard,
    Calendar,
    Settings,
    Menu,
    LogOut,
    Bell,
    ChevronDown,
    ChevronRight,
    Users,
    Star,
    CheckCircle,
    AlertCircle,
    ChefHat,
    UtensilsCrossed,
    Phone,
    Megaphone,
    LifeBuoy,
} from 'lucide-react';

// UI Components
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// TYPES
// ============================================================================

interface PolymorphicLayoutProps {
    businessType: BusinessType;
    tier: Plan;
    companyName: string;
    userName: string;
    userEmail: string;
    userAvatar?: string;
    onLogout?: () => void;
}

interface NavItem {
    icon: ElementType;
    label: string;
    href: string;
    minTier?: Plan;
}

// ============================================================================
// NAVIGATION CONFIG
// ============================================================================

const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
        { icon: LayoutDashboard, label: 'Tableau de bord', href: '/dashboard' },
        { icon: Calendar, label: 'Agenda', href: '/dashboard/agenda' },
        { icon: UtensilsCrossed, label: 'La Carte', href: '/dashboard/menu' },
        { icon: Phone, label: 'Journal d\'appels', href: '/dashboard/calls' },
        { icon: Megaphone, label: 'Marketing', href: '/dashboard/promos', minTier: 'pro' },
        { icon: ChefHat, label: 'Cuisine (KDS)', href: '/dashboard/kitchen', minTier: 'elite' },
        { icon: LifeBuoy, label: 'Support', href: '/dashboard/support' },
        { icon: Settings, label: 'Paramètres', href: '/dashboard/settings' },
    ];

    return baseItems;
};

// Breadcrumb labels mapping
const BREADCRUMB_LABELS: Record<string, string> = {
    'dashboard': 'Tableau de bord',
    'agenda': 'Agenda',
    'menu': 'La Carte',
    'calls': 'Journal d\'appels',
    'promos': 'Marketing',
    'kitchen': 'Cuisine (KDS)',
    'settings': 'Paramètres',
    'reservations': 'Réservations',
};

const TIER_ORDER: Plan[] = ['free', 'starter', 'pro', 'elite', 'enterprise'];

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

interface SidebarProps {
    businessType: BusinessType;
    tier: Plan;
    companyName: string;
    isMobile?: boolean;
    onNavigate?: () => void;
    onLogout?: () => void;
}

function Sidebar({ businessType, tier, companyName, isMobile = false, onNavigate, onLogout }: SidebarProps) {
    const location = useLocation();
    const { theme, Icon, label } = useBusinessConfig(businessType);
    const navItems = getNavItems();

    const canAccess = (minTier?: Plan) => {
        if (!minTier) return true;
        return TIER_ORDER.indexOf(tier) >= TIER_ORDER.indexOf(minTier);
    };

    return (
        <div
            className={cn(
                'flex flex-col h-full',
                isMobile ? 'bg-background' : 'bg-card'
            )}
        >
            {/* Logo & Company Name */}
            <div
                className="h-16 flex items-center gap-3 px-6 border-b"
                style={{ borderColor: `${theme.primary}30` }}
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                        boxShadow: theme.glow,
                    }}
                >
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground truncate max-w-[140px]">
                        {companyName}
                    </span>
                    <span
                        className="text-xs"
                        style={{ color: theme.primary }}
                    >
                        {label}
                    </span>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        if (!canAccess(item.minTier)) return null;

                        const isActive = location.pathname === item.href;
                        const ItemIcon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={onNavigate}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'text-white shadow-lg'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                )}
                                style={
                                    isActive
                                        ? {
                                            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                                            boxShadow: theme.glow,
                                        }
                                        : undefined
                                }
                            >
                                <ItemIcon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            {/* User Profile Section - Like "Luigi Pizza" in reference */}
            <div className="p-4 border-t border-border/50 space-y-3">
                {/* User Profile */}
                <div className="flex items-center gap-3 px-2 py-2">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{
                            background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                        }}
                    >
                        {companyName.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold text-foreground truncate">
                            {companyName}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                            Plan {tier.charAt(0).toUpperCase() + tier.slice(1)}
                        </span>
                    </div>
                </div>
                
                {/* Logout Button */}
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={onLogout}
                >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </Button>
            </div>
        </div>
    );
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

interface HeaderProps {
    businessType: BusinessType;
    userName: string;
    userEmail: string;
    userAvatar?: string;
    onLogout?: () => void;
    onMobileMenuOpen: () => void;
}

function Header({
    businessType,
    userName,
    userEmail,
    userAvatar,
    onLogout,
    onMobileMenuOpen,
}: HeaderProps) {
    const { theme } = useBusinessConfig(businessType);
    const location = useLocation();
    const { notifications, markAsRead, clearAll, unreadCount } = useNotifications();
    
    const modeLabel = `${String(businessType).toUpperCase()} MODE`;
    const initials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Generate breadcrumb from current path
    const breadcrumbItems = location.pathname
        .split('/')
        .filter(Boolean)
        .map((segment, index, array) => {
            const path = '/' + array.slice(0, index + 1).join('/');
            const label = BREADCRUMB_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
            const isLast = index === array.length - 1;
            return { path, label, isLast };
        });

    // Helper to get notification icon
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'reservation': return <Users className="w-4 h-4" />;
            case 'promo': return <Star className="w-4 h-4" />;
            case 'knowledge': return <CheckCircle className="w-4 h-4" />;
            case 'system': return <AlertCircle className="w-4 h-4" />;
            default: return <Bell className="w-4 h-4" />;
        }
    };

    // Helper to format notification time
    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `Il y a ${minutes} min`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `Il y a ${hours}h`;
        return format(date, 'dd MMM', { locale: fr });
    };

    return (
        <header
            className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 lg:px-6 border-b bg-card/50 backdrop-blur-md"
            style={{ borderColor: `${theme.primary}20` }}
        >
            {/* Left Section: Mobile Menu + Breadcrumb */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    onClick={onMobileMenuOpen}
                >
                    <Menu className="w-5 h-5 text-foreground" />
                </button>

                {/* Breadcrumb - Desktop only */}
                <nav className="hidden lg:flex items-center gap-1 text-sm">
                    {breadcrumbItems.map((item, index) => (
                        <div key={item.path} className="flex items-center gap-1">
                            {index > 0 && (
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                            {item.isLast ? (
                                <span className="font-medium text-foreground">{item.label}</span>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                {/* Mode Cuisine Button */}
                <Link to="/dashboard/kitchen">
                    <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-2 bg-orange-500/10 border-orange-500/50 text-orange-500 hover:bg-orange-500/20 hover:text-orange-400"
                    >
                        <ChefHat className="w-4 h-4" />
                        <span className="hidden md:inline">Mode Cuisine</span>
                    </Button>
                </Link>

                {/* Notification Bell with Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="relative z-50 cursor-pointer hover:bg-white/10 min-w-[40px] min-h-[40px] w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                            aria-label="Notifications"
                        >
                            <Bell className="w-5 h-5 text-slate-200" />
                            {unreadCount > 0 && (
                                <Badge 
                                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center p-0"
                                >
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                        <DropdownMenuLabel className="flex items-center justify-between">
                            <span>Notifications</span>
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto py-1 px-2 text-xs"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        clearAll();
                                    }}
                                >
                                    Tout lire
                                </Button>
                            )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {notifications.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Aucune notification</p>
                            </div>
                        ) : (
                            notifications.slice(0, 5).map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={cn(
                                        "flex items-start gap-3 p-3 cursor-pointer",
                                        !notification.read && "bg-primary/5"
                                    )}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className={cn(
                                        "p-2 rounded-full shrink-0",
                                        notification.type === 'reservation' && "bg-blue-500/20 text-blue-500",
                                        notification.type === 'promo' && "bg-yellow-500/20 text-yellow-500",
                                        notification.type === 'knowledge' && "bg-green-500/20 text-green-500",
                                        notification.type === 'system' && "bg-red-500/20 text-red-500"
                                    )}>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-sm font-medium truncate">{notification.title}</span>
                                            <span className="text-xs text-muted-foreground shrink-0">
                                                {formatTime(notification.timestamp)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                            {notification.message}
                                        </p>
                                    </div>
                                </DropdownMenuItem>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors">
                            <Avatar className="w-9 h-9 border-2" style={{ borderColor: theme.primary }}>
                                <AvatarImage src={userAvatar} alt={userName} />
                                <AvatarFallback
                                    style={{
                                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                                        color: 'white',
                                    }}
                                >
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:flex flex-col items-start">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-foreground">{userName}</span>
                                    <span
                                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                                        style={{
                                            color: theme.primary,
                                            borderColor: `${theme.primary}30`,
                                            backgroundColor: `${theme.primary}15`,
                                            boxShadow: theme.glow,
                                        }}
                                    >
                                        {modeLabel}
                                    </span>
                                </div>
                                <span className="text-xs text-muted-foreground">{userEmail}</span>
                            </div>
                            <ChevronDown className="hidden md:block w-4 h-4 text-muted-foreground" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to="/dashboard/settings">
                                <Settings className="w-4 h-4 mr-2" />
                                Réglages
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={onLogout}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Déconnexion
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

// ============================================================================
// MAIN LAYOUT COMPONENT
// ============================================================================

export function PolymorphicLayout({
    businessType,
    tier,
    companyName,
    userName,
    userEmail,
    userAvatar,
    onLogout,
}: PolymorphicLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme } = useBusinessConfig(businessType);

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside
                className="hidden lg:block fixed left-0 top-0 h-screen w-[260px] border-r"
                style={{ borderColor: `${theme.primary}30` }}
            >
                <Sidebar
                    businessType={businessType}
                    tier={tier}
                    companyName={companyName}
                    onLogout={onLogout}
                />
            </aside>

            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-72">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <Sidebar
                        businessType={businessType}
                        tier={tier}
                        companyName={companyName}
                        isMobile
                        onNavigate={() => setMobileMenuOpen(false)}
                        onLogout={onLogout}
                    />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="lg:pl-[260px]">
                {/* Header */}
                <Header
                    businessType={businessType}
                    userName={userName}
                    userEmail={userEmail}
                    userAvatar={userAvatar}
                    onLogout={onLogout}
                    onMobileMenuOpen={() => setMobileMenuOpen(true)}
                />

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>

            {/* CSS Variables for theme */}
            <style>{`
        :root {
          --theme-primary: ${theme.primary};
          --theme-secondary: ${theme.secondary};
          --theme-accent: ${theme.accent};
          --theme-border: ${theme.border};
          --theme-glow: ${theme.glow};
        }
        
        .pulse-red {
          animation: pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse-red {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            opacity: 0.8;
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
        }
      `}</style>
        </div>
    );
}

export default PolymorphicLayout;

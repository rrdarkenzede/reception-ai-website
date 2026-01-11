import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useBusinessConfig } from '@/hooks/useBusinessConfig';
import type { BusinessType, Plan } from '@/lib/types';

// Icons
import {
    LayoutDashboard,
    Calendar,
    Phone,
    Settings,
    BookOpen,
    Menu,
    LogOut,
    Bell,
    ChevronDown,
    Target,
} from 'lucide-react';

// UI Components
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    icon: React.ElementType;
    label: string;
    href: string;
    minTier?: Plan;
}

// ============================================================================
// NAVIGATION CONFIG
// ============================================================================

const getNavItems = (businessType: string): NavItem[] => {
    const baseItems: NavItem[] = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Calendar, label: 'Agenda', href: '/dashboard/agenda' },
        { icon: Phone, label: 'Appels', href: '/dashboard/calls' },
        { icon: BookOpen, label: 'Ressources', href: '/dashboard/resources', minTier: 'pro' },
        { icon: Settings, label: 'Paramètres', href: '/dashboard/settings' },
    ];

    return baseItems;
};

const TIER_ORDER: Plan[] = ['starter', 'pro', 'elite'];

// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

interface SidebarProps {
    businessType: BusinessType;
    tier: Plan;
    companyName: string;
    isMobile?: boolean;
    onNavigate?: () => void;
}

function Sidebar({ businessType, tier, companyName, isMobile = false, onNavigate }: SidebarProps) {
    const location = useLocation();
    const { theme, Icon, label } = useBusinessConfig(businessType);
    const navItems = getNavItems(businessType);

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

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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

            {/* Tier Badge */}
            <div className="p-4 border-t border-border/50">
                <div
                    className="flex items-center gap-2 px-4 py-2 rounded-lg"
                    style={{ backgroundColor: `${theme.primary}15` }}
                >
                    <Target className="w-4 h-4" style={{ color: theme.primary }} />
                    <span className="text-xs font-medium" style={{ color: theme.primary }}>
                        Plan {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </span>
                </div>
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
    const initials = userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <header
            className="h-16 flex items-center justify-between px-4 lg:px-6 border-b bg-card/50 backdrop-blur-sm"
            style={{ borderColor: `${theme.primary}20` }}
        >
            {/* Mobile Menu Button */}
            <button
                className="lg:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                onClick={onMobileMenuOpen}
            >
                <Menu className="w-5 h-5 text-foreground" />
            </button>

            {/* Spacer for desktop */}
            <div className="hidden lg:block" />

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button
                    className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    style={{ color: theme.primary }}
                >
                    <Bell className="w-5 h-5" />
                    <span
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                        style={{ backgroundColor: theme.accent }}
                    >
                        3
                    </span>
                </button>

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
                                <span className="text-sm font-medium text-foreground">{userName}</span>
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
                                Paramètres
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
                className="hidden lg:block fixed left-0 top-0 h-screen w-64 border-r"
                style={{ borderColor: `${theme.primary}30` }}
            >
                <Sidebar
                    businessType={businessType}
                    tier={tier}
                    companyName={companyName}
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
                    />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="lg:pl-64">
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

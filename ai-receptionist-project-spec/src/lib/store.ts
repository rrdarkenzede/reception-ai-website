import { Profile, Booking, CallLog, MenuItem, SupportTicket, Restaurant } from './types';

// Mock data store for demo purposes
// In production, these would be replaced with Supabase calls

// Demo users
export const DEMO_USERS: Profile[] = [
  {
    id: 'super-admin-1',
    email: 'rayanebendaho0@gmail.com',
    name: 'Rayane Bendaho',
    company_name: 'ReceptionAI',
    role: 'owner',
    tier: 'enterprise',
    is_super_admin: true,
    settings: {
      restaurant_config: {
        quota_ia: 100,
        welcome_message: 'Bienvenue chez ReceptionAI!',
        fallback_message: 'Notre équipe reviendra vers vous rapidement.',
        tables: [],
      },
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'client-fouquets',
    email: 'contact@fouquets-paris.fr',
    name: 'Jean-François Piège',
    company_name: "Le Fouquet's Paris",
    restaurant_id: 'rest-fouquets',
    role: 'owner',
    tier: 'enterprise',
    is_super_admin: false,
    settings: {
      restaurant_config: {
        quota_ia: 50,
        welcome_message: "Bienvenue au Fouquet's Paris. Comment puis-je vous aider?",
        fallback_message: 'Veuillez patienter, notre équipe prend le relais.',
        tables: [
          { id: 'T1', name: 'Table 1', seats: 2, is_online_reservable: true },
          { id: 'T2', name: 'Table 2', seats: 4, is_online_reservable: true },
          { id: 'T3', name: 'Table 3', seats: 6, is_online_reservable: true },
          { id: 'T4', name: 'Salon Privé', seats: 10, is_online_reservable: false },
        ],
      },
      business_hours: {
        mon: { open: '12:00', close: '23:00', active: true },
        tue: { open: '12:00', close: '23:00', active: true },
        wed: { open: '12:00', close: '23:00', active: true },
        thu: { open: '12:00', close: '23:00', active: true },
        fri: { open: '12:00', close: '00:00', active: true },
        sat: { open: '12:00', close: '00:00', active: true },
        sun: { open: '12:00', close: '22:00', active: true },
      },
      ai_knowledge: [
        { id: 'k1', trigger: 'parking', response: 'Voiturier disponible devant le restaurant.' },
        { id: 'k2', trigger: 'code vestimentaire', response: 'Tenue élégante requise, veste recommandée.' },
        { id: 'k3', trigger: 'allergies', response: 'Notre chef peut adapter tous les plats selon vos allergies.' },
      ],
      marketing: {
        active_promos: [
          { id: 'p1', natural_text: 'Menu Déjeuner Affaires à 85€ - Entrée, Plat, Dessert', active: true, push_mode: true },
        ],
      },
    },
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'client-kebab',
    email: 'kebab.express@gmail.com',
    name: 'Mehdi Khadiri',
    company_name: 'Kebab Express',
    restaurant_id: 'rest-kebab',
    role: 'owner',
    tier: 'pro',
    is_super_admin: false,
    settings: {
      restaurant_config: {
        quota_ia: 20,
        welcome_message: 'Bienvenue chez Kebab Express! Commande ou réservation?',
        fallback_message: 'Rappellez-nous dans quelques minutes.',
        tables: [
          { id: 'T1', name: 'Table 1', seats: 4, is_online_reservable: true },
          { id: 'T2', name: 'Table 2', seats: 4, is_online_reservable: true },
        ],
      },
    },
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
];

// Demo restaurants
export const DEMO_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-fouquets',
    name: "Le Fouquet's Paris",
    subscription_tier: 'enterprise',
    is_active: true,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'rest-kebab',
    name: 'Kebab Express',
    subscription_tier: 'pro',
    is_active: true,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
];

// Demo bookings
export const createDemoBookings = (profileId: string): Booking[] => [
  {
    id: 'book-1',
    profile_id: profileId,
    client_name: 'Marie Dupont',
    email: 'marie@example.com',
    phone: '+33612345678',
    date: new Date().toISOString().split('T')[0],
    time: '12:30',
    status: 'confirmed',
    guests: 2,
    table_id: 'T1',
    notes: 'Anniversaire de mariage',
    metadata: { occasion: 'anniversary' },
    created_at: new Date().toISOString(),
  },
  {
    id: 'book-2',
    profile_id: profileId,
    client_name: 'Pierre Martin',
    phone: '+33698765432',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    status: 'pending',
    guests: 4,
    table_id: 'T2',
    created_at: new Date().toISOString(),
  },
  {
    id: 'book-3',
    profile_id: profileId,
    client_name: 'Sophie Bernard',
    email: 'sophie.b@mail.com',
    phone: '+33687654321',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '20:30',
    status: 'vip',
    guests: 6,
    table_id: 'T3',
    notes: 'Cliente régulière - Champagne offert',
    created_at: new Date().toISOString(),
  },
];

// Demo call logs
export const createDemoCallLogs = (profileId: string): CallLog[] => [
  {
    id: 'call-1',
    profile_id: profileId,
    client_name: 'Marie Dupont',
    phone: '+33612345678',
    type: 'incoming',
    status: 'completed',
    duration: 180,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    summary: "Réservation pour 2 personnes demain midi. Client a demandé une table en terrasse si possible. Réservation confirmée pour 12h30.",
    sentiment: 'positive',
  },
  {
    id: 'call-2',
    profile_id: profileId,
    client_name: 'Jean Lefebvre',
    phone: '+33698765432',
    type: 'incoming',
    status: 'completed',
    duration: 45,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    summary: "Demande d'informations sur les horaires d'ouverture et le menu végétarien.",
    sentiment: 'neutral',
  },
  {
    id: 'call-3',
    profile_id: profileId,
    phone: '+33601020304',
    type: 'incoming',
    status: 'abandoned',
    duration: 3,
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    summary: "Appel raccroché après 3 secondes.",
    sentiment: 'neutral',
  },
];

// Demo menu items
export const createDemoMenuItems = (profileId: string): MenuItem[] => [
  {
    id: 'menu-1',
    profile_id: profileId,
    name: 'Foie Gras Maison',
    description: 'Foie gras de canard mi-cuit, chutney de figues',
    price: 32,
    category: 'Entrées',
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'menu-2',
    profile_id: profileId,
    name: 'Carpaccio de Saint-Jacques',
    description: 'Noix de Saint-Jacques, agrumes, huile de truffe',
    price: 28,
    category: 'Entrées',
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'menu-3',
    profile_id: profileId,
    name: 'Filet de Boeuf Rossini',
    description: 'Filet de boeuf, foie gras poêlé, sauce Périgueux',
    price: 58,
    category: 'Viandes',
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'menu-4',
    profile_id: profileId,
    name: 'Homard Thermidor',
    description: 'Demi-homard gratiné, sauce crémeuse au cognac',
    price: 72,
    category: 'Poissons',
    in_stock: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'menu-5',
    profile_id: profileId,
    name: 'Soufflé au Chocolat',
    description: 'Soufflé chaud au chocolat Valrhona, glace vanille',
    price: 18,
    category: 'Desserts',
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'menu-6',
    profile_id: profileId,
    name: 'Champagne Ruinart Brut',
    description: 'Coupe de Champagne Ruinart',
    price: 22,
    category: 'Boissons',
    in_stock: true,
    created_at: new Date().toISOString(),
  },
];

// Demo support tickets
export const createDemoTickets = (): SupportTicket[] => [
  {
    id: 'ticket-1',
    profile_id: 'client-kebab',
    subject: "Problème de synchronisation du menu",
    message: "Bonjour, j'ai modifié mon menu mais les changements ne sont pas pris en compte par l'IA.",
    status: 'open',
    priority: 'medium',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ticket-2',
    profile_id: 'client-fouquets',
    subject: "Demande d'ajout de fonctionnalité",
    message: "Serait-il possible d'avoir une intégration avec notre système de caisse ?",
    status: 'in_progress',
    priority: 'low',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
  },
];

// Current user state (simulated auth)
let currentUser: Profile | null = null;

export const auth = {
  signIn: (email: string, _password: string): Profile | null => {
    const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      currentUser = user;
      localStorage.setItem('reception_ai_user', JSON.stringify(user));
      return user;
    }
    return null;
  },
  
  signOut: () => {
    currentUser = null;
    localStorage.removeItem('reception_ai_user');
    localStorage.removeItem('ghost_mode_ctx');
  },
  
  getCurrentUser: (): Profile | null => {
    if (currentUser) return currentUser;
    const stored = localStorage.getItem('reception_ai_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    return null;
  },
  
  getGhostUser: (): Profile | null => {
    const ghostId = localStorage.getItem('ghost_mode_ctx');
    if (ghostId) {
      return DEMO_USERS.find(u => u.id === ghostId) || null;
    }
    return null;
  },
  
  enterGhostMode: (userId: string) => {
    localStorage.setItem('ghost_mode_ctx', userId);
  },
  
  exitGhostMode: () => {
    localStorage.removeItem('ghost_mode_ctx');
  },
  
  isInGhostMode: (): boolean => {
    return localStorage.getItem('ghost_mode_ctx') !== null;
  },
};

// In-memory data stores
let bookings: Booking[] = [];
let callLogs: CallLog[] = [];
let menuItems: MenuItem[] = [];
let tickets: SupportTicket[] = createDemoTickets();

// Initialize demo data
export const initializeDemoData = (profileId: string) => {
  bookings = createDemoBookings(profileId);
  callLogs = createDemoCallLogs(profileId);
  menuItems = createDemoMenuItems(profileId);
};

// Booking CRUD
export const bookingStore = {
  getAll: (profileId: string): Booking[] => {
    return bookings.filter(b => b.profile_id === profileId);
  },
  
  getByDate: (profileId: string, date: string): Booking[] => {
    return bookings.filter(b => b.profile_id === profileId && b.date === date);
  },
  
  create: (booking: Omit<Booking, 'id' | 'created_at'>): Booking => {
    const newBooking: Booking = {
      ...booking,
      id: `book-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    bookings.push(newBooking);
    return newBooking;
  },
  
  update: (id: string, updates: Partial<Booking>): Booking | null => {
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      return bookings[index];
    }
    return null;
  },
  
  delete: (id: string): boolean => {
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings.splice(index, 1);
      return true;
    }
    return false;
  },
};

// Call logs CRUD
export const callLogStore = {
  getAll: (profileId: string): CallLog[] => {
    return callLogs.filter(c => c.profile_id === profileId);
  },
  
  getRecent: (profileId: string, limit: number = 10): CallLog[] => {
    return callLogs
      .filter(c => c.profile_id === profileId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },
};

// Menu items CRUD
export const menuStore = {
  getAll: (profileId: string): MenuItem[] => {
    return menuItems.filter(m => m.profile_id === profileId);
  },
  
  getByCategory: (profileId: string, category: string): MenuItem[] => {
    return menuItems.filter(m => m.profile_id === profileId && m.category === category);
  },
  
  create: (item: Omit<MenuItem, 'id' | 'created_at'>): MenuItem => {
    const newItem: MenuItem = {
      ...item,
      id: `menu-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    menuItems.push(newItem);
    return newItem;
  },
  
  update: (id: string, updates: Partial<MenuItem>): MenuItem | null => {
    const index = menuItems.findIndex(m => m.id === id);
    if (index !== -1) {
      menuItems[index] = { ...menuItems[index], ...updates };
      return menuItems[index];
    }
    return null;
  },
  
  delete: (id: string): boolean => {
    const index = menuItems.findIndex(m => m.id === id);
    if (index !== -1) {
      menuItems.splice(index, 1);
      return true;
    }
    return false;
  },
  
  toggleStock: (id: string, inStock: boolean): MenuItem | null => {
    return menuStore.update(id, { in_stock: inStock });
  },
};

// Support tickets CRUD
export const ticketStore = {
  getAll: (): SupportTicket[] => {
    return tickets;
  },
  
  getByProfile: (profileId: string): SupportTicket[] => {
    return tickets.filter(t => t.profile_id === profileId);
  },
  
  create: (ticket: Omit<SupportTicket, 'id' | 'created_at' | 'updated_at' | 'status'>): SupportTicket => {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    tickets.push(newTicket);
    return newTicket;
  },
  
  updateStatus: (id: string, status: SupportTicket['status']): SupportTicket | null => {
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      tickets[index] = { ...tickets[index], status, updated_at: new Date().toISOString() };
      return tickets[index];
    }
    return null;
  },
};

// Stats
export const getStats = (profileId: string) => {
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.profile_id === profileId && b.date === today);
  const todayCalls = callLogs.filter(c => {
    const callDate = new Date(c.timestamp).toISOString().split('T')[0];
    return c.profile_id === profileId && callDate === today;
  });
  
  const conversionRate = todayCalls.length > 0 
    ? Math.round((todayBookings.length / todayCalls.length) * 100) 
    : 0;
  
  return {
    callsToday: todayCalls.length,
    bookingsToday: todayBookings.length,
    conversionRate,
    activeCall: false,
  };
};

// Admin stats
export const getAdminStats = () => {
  const totalRestaurants = DEMO_RESTAURANTS.length;
  const activeRestaurants = DEMO_RESTAURANTS.filter(r => r.is_active).length;
  const totalCalls = callLogs.length;
  
  // Simulated MRR based on tiers
  const mrr = DEMO_USERS.reduce((acc, user) => {
    if (user.is_super_admin) return acc;
    switch (user.tier) {
      case 'enterprise': return acc + 499;
      case 'pro': return acc + 199;
      default: return acc;
    }
  }, 0);
  
  return {
    totalRestaurants,
    activeRestaurants,
    totalCalls,
    mrr,
    openTickets: tickets.filter(t => t.status === 'open').length,
  };
};

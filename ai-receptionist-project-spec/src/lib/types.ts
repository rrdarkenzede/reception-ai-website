// Subscription tiers
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

// User roles
export type UserRole = 'owner' | 'staff' | 'admin';

// User profile
export interface Profile {
  id: string;
  email: string;
  name: string;
  company_name?: string;
  restaurant_id?: string;
  role: UserRole;
  tier: SubscriptionTier;
  is_super_admin: boolean;
  settings?: ProfileSettings;
  created_at: string;
  updated_at: string;
}

// Profile settings
export interface ProfileSettings {
  restaurant_config?: {
    quota_ia: number;
    welcome_message: string;
    fallback_message: string;
    tables: TableConfig[];
  };
  business_hours?: Record<string, {
    open: string;
    close: string;
    active: boolean;
  }>;
  ai_knowledge?: KnowledgeItem[];
  marketing?: {
    active_promos: AgentPromo[];
  };
}

// Table configuration
export interface TableConfig {
  id: string;
  name: string;
  seats: number;
  is_online_reservable: boolean;
}

// Knowledge base item
export interface KnowledgeItem {
  id: string;
  trigger: string;
  response: string;
}

// Agent promo
export interface AgentPromo {
  id: string;
  natural_text: string;
  active: boolean;
  target_items?: string[];
  push_mode?: boolean;
}

// Restaurant
export interface Restaurant {
  id: string;
  name: string;
  subscription_tier: SubscriptionTier;
  retell_agent_id?: string;
  is_active: boolean;
  settings?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Booking status
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'vip';

// Booking / RDV
export interface Booking {
  id: string;
  profile_id: string;
  client_name: string;
  email?: string;
  phone?: string;
  date: string;
  time: string;
  status: BookingStatus;
  guests: number;
  table_id?: string;
  notes?: string;
  metadata?: {
    occasion?: string;
    order_type?: 'delivery' | 'takeaway' | 'dine_in';
    special_requests?: string[];
    items?: OrderItem[];
  };
  created_at: string;
}

// Order item for kitchen
export interface OrderItem {
  name: string;
  quantity: number;
  notes?: string;
}

// Call log
export type CallStatus = 'completed' | 'missed' | 'abandoned' | 'in_progress';
export type CallSentiment = 'positive' | 'neutral' | 'urgent' | 'negative';

export interface CallLog {
  id: string;
  profile_id: string;
  client_name?: string;
  phone?: string;
  type: 'incoming' | 'outgoing';
  status: CallStatus;
  duration?: number;
  timestamp: string;
  summary?: string;
  transcript?: string;
  recording_url?: string;
  sentiment?: CallSentiment;
  metadata?: Record<string, unknown>;
}

// Menu item / Stock item
export interface MenuItem {
  id: string;
  profile_id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  in_stock: boolean;
  created_at: string;
}

// Support ticket
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportTicket {
  id: string;
  profile_id: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

// Navigation item
export interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  minTier?: SubscriptionTier;
}

// Business type for polymorphic design
export type BusinessType = 'restaurant' | 'medical' | 'legal';

// Dashboard stats
export interface DashboardStats {
  callsToday: number;
  bookingsToday: number;
  conversionRate: number;
  activeCall: boolean;
}

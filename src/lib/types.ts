export type UserRole = "admin" | "client"
export type Plan = "free" | "starter" | "pro" | "elite" | "enterprise"
export type BusinessType = "restaurant" | "beauty" | "beaute" | "fitness" | "medical" | "dentiste" | "clinique" | "veterinaire" | "juridique" | "legal" | "real_estate" | "immobilier" | "automotive" | "garage" | "autoecole" | "trades" | "sport";
export type Sector = BusinessType // Legacy alias for compatibility

// Settings interfaces
export interface AgentPromo {
  id: string
  natural_text: string
  active: boolean
  target_items?: string[]
  push_mode?: boolean
  created_at?: string
}

export interface RestaurantConfig {
  menu_items?: StockItem[]
  promos?: AgentPromo // Changed from generic Promo to specific AgentPromo
  [key: string]: unknown
}

export interface UserSettings {
  restaurant_config?: RestaurantConfig
  [key: string]: unknown
}


export interface Restaurant {
  id: string
  name: string
  subscription_tier: string
  settings: Record<string, unknown>
  created_at: string
  is_active: boolean
}

export interface User {
  id: string
  email: string
  password: string
  name: string
  companyName?: string
  restaurantId?: string
  isSuperAdmin?: boolean
  role: UserRole
  sector?: Sector
  plan?: Plan
  webhookUrl?: string
  settings?: UserSettings
  createdAt: string
}

export interface RDV {
  id: string
  userId: string
  clientName: string
  email?: string
  phone?: string
  date: string
  time: string
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "vip"
  notes?: string
  // Restaurant specific
  guests?: number
  tableId?: string
  // Dentiste specific
  patientName?: string
  serviceType?: string
  roomId?: string
  medicalNotes?: string
  // Garage specific
  vehicleBrand?: string
  vehicleModel?: string
  licensePlate?: string
  repairType?: string
  estimatedCost?: number
  technicalNotes?: string
  // Metadata for additional data
  metadata?: {
    occasion?: string
    order_type?: 'delivery' | 'takeaway' | 'dine_in'
    special_requests?: string[] | string
    [key: string]: unknown
  }
}

export interface StockItem {
  id: string
  userId: string
  name: string
  description?: string
  price?: number
  category?: string
  imageUrl?: string
  isActive: boolean
}

export interface Promo {
  id: string
  userId: string
  title: string
  description?: string
  code: string
  discount: number
  discountType: "percent" | "fixed"
  startDate: string
  endDate?: string
  isActive: boolean
}

export interface CallLog {
  id: string
  userId: string
  clientName: string
  phone: string
  type: "incoming" | "outgoing"
  status: "completed" | "missed" | "in_progress"
  duration?: number
  timestamp: string
  summary?: string
  transcript?: string
  recordingUrl?: string
  sentiment?: "positive" | "neutral" | "urgent" | "negative" | string
  // Sector-specific metadata
  metadata?: Record<string, unknown>
}

export const SECTORS: { value: Sector; label: string; icon: string }[] = [
  { value: "restaurant", label: "Restaurant", icon: "🍽️" },
  { value: "beauty", label: "Salon Beauté", icon: "💇" },
  { value: "fitness", label: "Salle Sport", icon: "🏋️" },
  { value: "medical", label: "Clinique", icon: "🏥" },
  { value: "legal", label: "Juridique", icon: "⚖️" },
  { value: "real_estate", label: "Immobilier", icon: "🏠" },
  { value: "automotive", label: "Garage", icon: "🚗" },
  { value: "trades", label: "Artisans", icon: "🔧" },
]

export const PLANS: { value: Plan; label: string; price: number; features: string[] }[] = [
  {
    value: "starter",
    label: "Starter",
    price: 0,
    features: ["Lecture seule des RDV", "Journal d'appels basique", "Support email"],
  },
  {
    value: "pro",
    label: "Pro",
    price: 500,
    features: [
      "Gestion complète des RDV",
      "Dashboard analytics",
      "Gestion du menu/stock",
      "Promos & Annonces",
      "Support prioritaire",
    ],
  },
  {
    value: "elite",
    label: "Elite",
    price: 1000,
    features: [
      "Toutes les fonctionnalités Pro",
      "IA avancée + Smart Triggers",
      "Marketing automatisé",
      "Panic Button",
      "API personnalisée",
      "Account Manager dédié",
    ],
  },
]

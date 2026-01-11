export type UserRole = "admin" | "client"
export type Plan = "starter" | "pro" | "elite"
export type BusinessType = "restaurant" | "beauty" | "fitness" | "medical" | "legal" | "real_estate" | "automotive" | "trades" | "dentiste" | "garage" | "immobilier" | "juridique" | "beaute" | "sport" | "autoecole" | "veterinaire" | "clinique";
export type Sector = BusinessType // Legacy alias for compatibility

export interface User {
  id: string
  email: string
  password: string
  name: string
  companyName?: string
  role: UserRole
  sector?: Sector
  plan?: Plan
  webhookUrl?: string
  settings?: Record<string, unknown>
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
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
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
  { value: "dentiste", label: "Dentiste", icon: "🦷" },
  { value: "garage", label: "Garage", icon: "🚗" },
  { value: "immobilier", label: "Immobilier", icon: "🏠" },
  { value: "juridique", label: "Juridique", icon: "⚖️" },
  { value: "beaute", label: "Salon Beauté", icon: "💇" },
  { value: "sport", label: "Salle Sport", icon: "🏋️" },
  { value: "autoecole", label: "Auto-école", icon: "📚" },
  { value: "veterinaire", label: "Vétérinaire", icon: "🐶" },
  { value: "clinique", label: "Clinique", icon: "🏥" },
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

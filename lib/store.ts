import type { User, RDV, StockItem, Promo, CallLog } from "./types"

const STORAGE_KEY = "receptionai_data"

interface AppState {
  users: User[]
  rdvs: RDV[]
  stockItems: StockItem[]
  promos: Promo[]
  callLogs: CallLog[]
  currentUserId: string | null
}

const defaultUsers: User[] = [
  {
    id: "admin-1",
    email: "admin@receptionai.com",
    password: "admin123",
    name: "Super Admin",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-luigi",
    email: "luigi@luigipizza.it",
    password: "pizza123",
    name: "Luigi Rossi",
    companyName: "Luigi Pizza",
    role: "client",
    sector: "restaurant",
    plan: "pro",
    createdAt: "2024-06-15T00:00:00Z",
  },
  {
    id: "user-dupont",
    email: "dupont@dentiste.fr",
    password: "dupont123",
    name: "Dr. Jean Dupont",
    companyName: "Cabinet Dentaire Dupont",
    role: "client",
    sector: "dentiste",
    plan: "starter",
    createdAt: "2024-07-20T00:00:00Z",
  },
  {
    id: "user-garage",
    email: "garage@dupont.com",
    password: "garage123",
    name: "Pierre Dupont",
    companyName: "Garage Dupont",
    role: "client",
    sector: "garage",
    plan: "elite",
    createdAt: "2024-08-10T00:00:00Z",
  },
]

const defaultRDVs: RDV[] = [
  // Luigi Pizza RDVs
  {
    id: "rdv-1",
    userId: "user-luigi",
    clientName: "Marie Martin",
    phone: "+33612345678",
    date: "2026-01-10",
    time: "19:00",
    status: "confirmed",
    guests: 4,
    tableId: "table-3",
    notes: "Anniversaire",
  },
  {
    id: "rdv-2",
    userId: "user-luigi",
    clientName: "Paul Bernard",
    phone: "+33623456789",
    date: "2026-01-10",
    time: "20:00",
    status: "pending",
    guests: 2,
    tableId: "table-1",
  },
  {
    id: "rdv-3",
    userId: "user-luigi",
    clientName: "Sophie Leroy",
    phone: "+33634567890",
    date: "2026-01-10",
    time: "20:30",
    status: "confirmed",
    guests: 6,
    tableId: "table-5",
    notes: "Repas d'affaires",
  },
  {
    id: "rdv-4",
    userId: "user-luigi",
    clientName: "Jean Moreau",
    phone: "+33645678901",
    date: "2026-01-11",
    time: "12:30",
    status: "confirmed",
    guests: 3,
    tableId: "table-2",
  },
  {
    id: "rdv-5",
    userId: "user-luigi",
    clientName: "Claire Petit",
    phone: "+33656789012",
    date: "2026-01-11",
    time: "19:30",
    status: "pending",
    guests: 2,
    tableId: "table-4",
  },
  {
    id: "rdv-6",
    userId: "user-luigi",
    clientName: "Marc Durand",
    phone: "+33667890123",
    date: "2026-01-12",
    time: "20:00",
    status: "cancelled",
    guests: 4,
    tableId: "table-3",
  },
  {
    id: "rdv-7",
    userId: "user-luigi",
    clientName: "Anne Simon",
    phone: "+33678901234",
    date: "2026-01-09",
    time: "19:00",
    status: "completed",
    guests: 2,
    tableId: "table-1",
  },
  {
    id: "rdv-8",
    userId: "user-luigi",
    clientName: "Lucas Robert",
    phone: "+33689012345",
    date: "2026-01-09",
    time: "20:30",
    status: "completed",
    guests: 5,
    tableId: "table-6",
  },
  {
    id: "rdv-9",
    userId: "user-luigi",
    clientName: "Emma Richard",
    phone: "+33690123456",
    date: "2026-01-13",
    time: "19:00",
    status: "pending",
    guests: 4,
    tableId: "table-3",
  },
  {
    id: "rdv-10",
    userId: "user-luigi",
    clientName: "Hugo Michel",
    phone: "+33601234567",
    date: "2026-01-13",
    time: "20:00",
    status: "confirmed",
    guests: 2,
    tableId: "table-2",
  },
  {
    id: "rdv-11",
    userId: "user-luigi",
    clientName: "Léa Garcia",
    phone: "+33612345670",
    date: "2026-01-14",
    time: "12:00",
    status: "pending",
    guests: 3,
    tableId: "table-4",
  },
  {
    id: "rdv-12",
    userId: "user-luigi",
    clientName: "Thomas Martinez",
    phone: "+33623456781",
    date: "2026-01-14",
    time: "19:30",
    status: "confirmed",
    guests: 6,
    tableId: "table-5",
  },
  // Dr Dupont RDVs
  {
    id: "rdv-d1",
    userId: "user-dupont",
    patientName: "Alice Blanc",
    clientName: "Alice Blanc",
    phone: "+33712345678",
    date: "2026-01-10",
    time: "09:00",
    status: "confirmed",
    serviceType: "Détartrage",
    roomId: "salle-1",
  },
  {
    id: "rdv-d2",
    userId: "user-dupont",
    patientName: "Robert Noir",
    clientName: "Robert Noir",
    phone: "+33723456789",
    date: "2026-01-10",
    time: "10:00",
    status: "pending",
    serviceType: "Consultation",
    roomId: "salle-2",
  },
  {
    id: "rdv-d3",
    userId: "user-dupont",
    patientName: "Julie Gris",
    clientName: "Julie Gris",
    phone: "+33734567890",
    date: "2026-01-10",
    time: "11:00",
    status: "confirmed",
    serviceType: "Extraction",
    roomId: "salle-1",
    medicalNotes: "Patient anxieux",
  },
  {
    id: "rdv-d4",
    userId: "user-dupont",
    patientName: "Michel Vert",
    clientName: "Michel Vert",
    phone: "+33745678901",
    date: "2026-01-11",
    time: "09:30",
    status: "pending",
    serviceType: "Plombage",
    roomId: "salle-2",
  },
  {
    id: "rdv-d5",
    userId: "user-dupont",
    patientName: "Sophie Rouge",
    clientName: "Sophie Rouge",
    phone: "+33756789012",
    date: "2026-01-11",
    time: "14:00",
    status: "confirmed",
    serviceType: "Détartrage",
    roomId: "salle-1",
  },
  {
    id: "rdv-d6",
    userId: "user-dupont",
    patientName: "Pierre Jaune",
    clientName: "Pierre Jaune",
    phone: "+33767890123",
    date: "2026-01-09",
    time: "10:00",
    status: "completed",
    serviceType: "Consultation",
    roomId: "salle-1",
  },
  {
    id: "rdv-d7",
    userId: "user-dupont",
    patientName: "Marie Bleu",
    clientName: "Marie Bleu",
    phone: "+33778901234",
    date: "2026-01-09",
    time: "15:00",
    status: "completed",
    serviceType: "Blanchiment",
    roomId: "salle-2",
  },
  {
    id: "rdv-d8",
    userId: "user-dupont",
    patientName: "Luc Orange",
    clientName: "Luc Orange",
    phone: "+33789012345",
    date: "2026-01-12",
    time: "09:00",
    status: "pending",
    serviceType: "Extraction",
    roomId: "salle-1",
  },
  // Garage Dupont RDVs
  {
    id: "rdv-g1",
    userId: "user-garage",
    clientName: "Jean Auto",
    phone: "+33812345678",
    date: "2026-01-10",
    time: "08:00",
    status: "in_progress",
    vehicleBrand: "Audi",
    vehicleModel: "A3",
    licensePlate: "AB-123-CD",
    repairType: "Révision complète",
    estimatedCost: 450,
  },
  {
    id: "rdv-g2",
    userId: "user-garage",
    clientName: "Marie Voiture",
    phone: "+33823456789",
    date: "2026-01-10",
    time: "10:00",
    status: "confirmed",
    vehicleBrand: "Peugeot",
    vehicleModel: "308",
    licensePlate: "EF-456-GH",
    repairType: "Changement pneus",
    estimatedCost: 320,
  },
  {
    id: "rdv-g3",
    userId: "user-garage",
    clientName: "Paul Moto",
    phone: "+33834567890",
    date: "2026-01-10",
    time: "14:00",
    status: "pending",
    vehicleBrand: "Renault",
    vehicleModel: "Clio",
    licensePlate: "IJ-789-KL",
    repairType: "Freins",
    estimatedCost: 280,
  },
  {
    id: "rdv-g4",
    userId: "user-garage",
    clientName: "Claire Camion",
    phone: "+33845678901",
    date: "2026-01-11",
    time: "08:30",
    status: "confirmed",
    vehicleBrand: "BMW",
    vehicleModel: "Serie 3",
    licensePlate: "MN-012-OP",
    repairType: "Vidange",
    estimatedCost: 120,
  },
  {
    id: "rdv-g5",
    userId: "user-garage",
    clientName: "Marc Tracteur",
    phone: "+33856789012",
    date: "2026-01-11",
    time: "11:00",
    status: "pending",
    vehicleBrand: "Mercedes",
    vehicleModel: "Classe A",
    licensePlate: "QR-345-ST",
    repairType: "Diagnostic",
    estimatedCost: 80,
  },
  {
    id: "rdv-g6",
    userId: "user-garage",
    clientName: "Anne Bus",
    phone: "+33867890123",
    date: "2026-01-09",
    time: "09:00",
    status: "completed",
    vehicleBrand: "Volkswagen",
    vehicleModel: "Golf",
    licensePlate: "UV-678-WX",
    repairType: "Révision",
    estimatedCost: 380,
  },
  {
    id: "rdv-g7",
    userId: "user-garage",
    clientName: "Lucas Van",
    phone: "+33878901234",
    date: "2026-01-09",
    time: "14:00",
    status: "completed",
    vehicleBrand: "Toyota",
    vehicleModel: "Yaris",
    licensePlate: "YZ-901-AB",
    repairType: "Climatisation",
    estimatedCost: 250,
  },
  {
    id: "rdv-g8",
    userId: "user-garage",
    clientName: "Emma Scooter",
    phone: "+33889012345",
    date: "2026-01-12",
    time: "08:00",
    status: "pending",
    vehicleBrand: "Ford",
    vehicleModel: "Focus",
    licensePlate: "CD-234-EF",
    repairType: "Embrayage",
    estimatedCost: 650,
  },
  {
    id: "rdv-g9",
    userId: "user-garage",
    clientName: "Hugo Vélo",
    phone: "+33890123456",
    date: "2026-01-12",
    time: "10:00",
    status: "confirmed",
    vehicleBrand: "Citroen",
    vehicleModel: "C3",
    licensePlate: "GH-567-IJ",
    repairType: "Batterie",
    estimatedCost: 180,
  },
  {
    id: "rdv-g10",
    userId: "user-garage",
    clientName: "Léa Roller",
    phone: "+33801234567",
    date: "2026-01-13",
    time: "09:00",
    status: "pending",
    vehicleBrand: "Nissan",
    vehicleModel: "Qashqai",
    licensePlate: "KL-890-MN",
    repairType: "Courroie distribution",
    estimatedCost: 550,
  },
  {
    id: "rdv-g11",
    userId: "user-garage",
    clientName: "Thomas Skate",
    phone: "+33812345670",
    date: "2026-01-13",
    time: "14:00",
    status: "confirmed",
    vehicleBrand: "Opel",
    vehicleModel: "Corsa",
    licensePlate: "OP-123-QR",
    repairType: "Échappement",
    estimatedCost: 420,
  },
  {
    id: "rdv-g12",
    userId: "user-garage",
    clientName: "Chloé Trot",
    phone: "+33823456781",
    date: "2026-01-14",
    time: "08:00",
    status: "pending",
    vehicleBrand: "Hyundai",
    vehicleModel: "i20",
    licensePlate: "ST-456-UV",
    repairType: "Amortisseurs",
    estimatedCost: 380,
  },
  {
    id: "rdv-g13",
    userId: "user-garage",
    clientName: "Nathan Course",
    phone: "+33834567892",
    date: "2026-01-14",
    time: "11:00",
    status: "confirmed",
    vehicleBrand: "Kia",
    vehicleModel: "Sportage",
    licensePlate: "WX-789-YZ",
    repairType: "Révision complète",
    estimatedCost: 520,
  },
  {
    id: "rdv-g14",
    userId: "user-garage",
    clientName: "Jade Marche",
    phone: "+33845678903",
    date: "2026-01-15",
    time: "09:00",
    status: "pending",
    vehicleBrand: "Seat",
    vehicleModel: "Ibiza",
    licensePlate: "AB-012-CD",
    repairType: "Vidange",
    estimatedCost: 95,
  },
  {
    id: "rdv-g15",
    userId: "user-garage",
    clientName: "Raphaël Nage",
    phone: "+33856789014",
    date: "2026-01-15",
    time: "14:00",
    status: "confirmed",
    vehicleBrand: "Skoda",
    vehicleModel: "Octavia",
    licensePlate: "EF-345-GH",
    repairType: "Pneus hiver",
    estimatedCost: 480,
  },
]

const defaultStockItems: StockItem[] = [
  // Luigi Pizza menu items
  {
    id: "stock-1",
    userId: "user-luigi",
    name: "Pizza Margherita",
    description: "Tomate, mozzarella, basilic",
    price: 12,
    category: "Pizzas",
    isActive: true,
  },
  {
    id: "stock-2",
    userId: "user-luigi",
    name: "Pizza 4 Fromages",
    description: "Mozzarella, gorgonzola, parmesan, chèvre",
    price: 15,
    category: "Pizzas",
    isActive: true,
  },
  {
    id: "stock-3",
    userId: "user-luigi",
    name: "Pizza Pepperoni",
    description: "Tomate, mozzarella, pepperoni",
    price: 14,
    category: "Pizzas",
    isActive: true,
  },
  {
    id: "stock-4",
    userId: "user-luigi",
    name: "Tiramisu",
    description: "Dessert italien traditionnel",
    price: 8,
    category: "Desserts",
    isActive: true,
  },
  {
    id: "stock-5",
    userId: "user-luigi",
    name: "Panna Cotta",
    description: "Crème vanille et coulis fruits rouges",
    price: 7,
    category: "Desserts",
    isActive: false,
  },
  // Dentiste services
  {
    id: "stock-d1",
    userId: "user-dupont",
    name: "Consultation",
    description: "Examen dentaire complet",
    price: 50,
    category: "Consultations",
    isActive: true,
  },
  {
    id: "stock-d2",
    userId: "user-dupont",
    name: "Détartrage",
    description: "Nettoyage professionnel",
    price: 80,
    category: "Soins",
    isActive: true,
  },
  {
    id: "stock-d3",
    userId: "user-dupont",
    name: "Extraction",
    description: "Extraction dentaire simple",
    price: 120,
    category: "Soins",
    isActive: true,
  },
  // Garage services
  {
    id: "stock-g1",
    userId: "user-garage",
    name: "Vidange",
    description: "Changement huile moteur",
    price: 95,
    category: "Entretien",
    isActive: true,
  },
  {
    id: "stock-g2",
    userId: "user-garage",
    name: "Révision complète",
    description: "Contrôle 50 points",
    price: 250,
    category: "Entretien",
    isActive: true,
  },
  {
    id: "stock-g3",
    userId: "user-garage",
    name: "Changement pneus",
    description: "4 pneus montés équilibrés",
    price: 60,
    category: "Pneumatiques",
    isActive: true,
  },
]

const defaultPromos: Promo[] = [
  {
    id: "promo-1",
    userId: "user-luigi",
    title: "25% sur les Pizzas",
    description: "Samedi soir uniquement",
    code: "PIZZA25",
    discount: 25,
    discountType: "percent",
    startDate: "2026-01-10",
    endDate: "2026-01-12",
    isActive: true,
  },
  {
    id: "promo-2",
    userId: "user-luigi",
    title: "Dessert offert",
    description: "Pour toute commande > 30€",
    code: "DOLCE",
    discount: 8,
    discountType: "fixed",
    startDate: "2026-01-01",
    isActive: true,
  },
]

const defaultCallLogs: CallLog[] = [
  {
    id: "call-1",
    userId: "user-luigi",
    clientName: "Marie Martin",
    phone: "+33612345678",
    type: "incoming",
    status: "completed",
    duration: 222,
    timestamp: "2026-01-09T14:32:00Z",
    summary: "👤 4 personnes | ⏰ Samedi 19h",
    metadata: { guests: 4, time: "19:00" },
  },
  {
    id: "call-2",
    userId: "user-luigi",
    clientName: "Paul Bernard",
    phone: "+33623456789",
    type: "incoming",
    status: "completed",
    duration: 156,
    timestamp: "2026-01-09T15:45:00Z",
    summary: "👤 2 personnes | ⏰ Samedi 20h",
    metadata: { guests: 2, time: "20:00" },
  },
  {
    id: "call-3",
    userId: "user-luigi",
    clientName: "Inconnu",
    phone: "+33698765432",
    type: "incoming",
    status: "missed",
    timestamp: "2026-01-09T16:20:00Z",
  },
  {
    id: "call-4",
    userId: "user-dupont",
    clientName: "Alice Blanc",
    phone: "+33712345678",
    type: "incoming",
    status: "completed",
    duration: 180,
    timestamp: "2026-01-09T09:15:00Z",
    summary: "🦷 Détartrage | 🚪 Salle 1",
    metadata: { service: "Détartrage", room: "Salle 1" },
  },
  {
    id: "call-5",
    userId: "user-garage",
    clientName: "Jean Auto",
    phone: "+33812345678",
    type: "incoming",
    status: "completed",
    duration: 245,
    timestamp: "2026-01-09T08:30:00Z",
    summary: "🚗 Audi A3 | 🔧 Révision complète",
    metadata: { vehicle: "Audi A3", repair: "Révision complète" },
  },
  {
    id: "call-6",
    userId: "user-garage",
    clientName: "Marie Voiture",
    phone: "+33823456789",
    type: "outgoing",
    status: "completed",
    duration: 120,
    timestamp: "2026-01-09T11:00:00Z",
    summary: "🚗 Peugeot 308 | 📞 Rappel RDV",
    metadata: { vehicle: "Peugeot 308", reason: "Rappel" },
  },
]

const defaultState: AppState = {
  users: defaultUsers,
  rdvs: defaultRDVs,
  stockItems: defaultStockItems,
  promos: defaultPromos,
  callLogs: defaultCallLogs,
  currentUserId: null,
}

function getState(): AppState {
  if (typeof window === "undefined") return defaultState
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState))
    return defaultState
  }
  return JSON.parse(stored)
}

function setState(state: AppState): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// Auth functions
export function login(email: string, password: string): User | null {
  const state = getState()
  const user = state.users.find((u) => u.email === email && u.password === password)
  if (user) {
    state.currentUserId = user.id
    setState(state)
  }
  return user || null
}

export function logout(): void {
  const state = getState()
  state.currentUserId = null
  setState(state)
}

export function getCurrentUser(): User | null {
  const state = getState()
  if (!state.currentUserId) return null
  return state.users.find((u) => u.id === state.currentUserId) || null
}

export function signup(data: Omit<User, "id" | "createdAt" | "role">): User {
  const state = getState()
  const newUser: User = {
    ...data,
    id: `user-${Date.now()}`,
    role: "client",
    plan: "starter",
    createdAt: new Date().toISOString(),
  }
  state.users.push(newUser)
  state.currentUserId = newUser.id
  setState(state)
  return newUser
}

// User management (admin)
export function getUsers(): User[] {
  return getState().users.filter((u) => u.role === "client")
}

export function getUserById(id: string): User | null {
  return getState().users.find((u) => u.id === id) || null
}

export function updateUser(id: string, data: Partial<User>): User | null {
  const state = getState()
  const index = state.users.findIndex((u) => u.id === id)
  if (index === -1) return null
  state.users[index] = { ...state.users[index], ...data }
  setState(state)
  return state.users[index]
}

export function deleteUser(id: string): boolean {
  const state = getState()
  const index = state.users.findIndex((u) => u.id === id)
  if (index === -1) return false
  state.users.splice(index, 1)
  // Also delete related data
  state.rdvs = state.rdvs.filter((r) => r.userId !== id)
  state.stockItems = state.stockItems.filter((s) => s.userId !== id)
  state.promos = state.promos.filter((p) => p.userId !== id)
  state.callLogs = state.callLogs.filter((c) => c.userId !== id)
  setState(state)
  return true
}

export function addUser(data: Omit<User, "id" | "createdAt">): User {
  const state = getState()
  const newUser: User = {
    ...data,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  state.users.push(newUser)
  setState(state)
  return newUser
}

// RDV functions
export function getRDVs(userId?: string): RDV[] {
  const state = getState()
  if (userId) return state.rdvs.filter((r) => r.userId === userId)
  return state.rdvs
}

export function getRDVById(id: string): RDV | null {
  return getState().rdvs.find((r) => r.id === id) || null
}

export function addRDV(data: Omit<RDV, "id">): RDV {
  const state = getState()
  const newRDV: RDV = { ...data, id: `rdv-${Date.now()}` }
  state.rdvs.push(newRDV)
  setState(state)
  return newRDV
}

export function updateRDV(id: string, data: Partial<RDV>): RDV | null {
  const state = getState()
  const index = state.rdvs.findIndex((r) => r.id === id)
  if (index === -1) return null
  state.rdvs[index] = { ...state.rdvs[index], ...data }
  setState(state)
  return state.rdvs[index]
}

export function deleteRDV(id: string): boolean {
  const state = getState()
  const index = state.rdvs.findIndex((r) => r.id === id)
  if (index === -1) return false
  state.rdvs.splice(index, 1)
  setState(state)
  return true
}

// Stock functions
export function getStockItems(userId?: string): StockItem[] {
  const state = getState()
  if (userId) return state.stockItems.filter((s) => s.userId === userId)
  return state.stockItems
}

export function addStockItem(data: Omit<StockItem, "id">): StockItem {
  const state = getState()
  const newItem: StockItem = { ...data, id: `stock-${Date.now()}` }
  state.stockItems.push(newItem)
  setState(state)
  return newItem
}

export function updateStockItem(id: string, data: Partial<StockItem>): StockItem | null {
  const state = getState()
  const index = state.stockItems.findIndex((s) => s.id === id)
  if (index === -1) return null
  state.stockItems[index] = { ...state.stockItems[index], ...data }
  setState(state)
  return state.stockItems[index]
}

export function deleteStockItem(id: string): boolean {
  const state = getState()
  const index = state.stockItems.findIndex((s) => s.id === id)
  if (index === -1) return false
  state.stockItems.splice(index, 1)
  setState(state)
  return true
}

// Promo functions
export function getPromos(userId?: string): Promo[] {
  const state = getState()
  if (userId) return state.promos.filter((p) => p.userId === userId)
  return state.promos
}

export function addPromo(data: Omit<Promo, "id">): Promo {
  const state = getState()
  const newPromo: Promo = { ...data, id: `promo-${Date.now()}` }
  state.promos.push(newPromo)
  setState(state)
  return newPromo
}

export function updatePromo(id: string, data: Partial<Promo>): Promo | null {
  const state = getState()
  const index = state.promos.findIndex((p) => p.id === id)
  if (index === -1) return null
  state.promos[index] = { ...state.promos[index], ...data }
  setState(state)
  return state.promos[index]
}

export function deletePromo(id: string): boolean {
  const state = getState()
  const index = state.promos.findIndex((p) => p.id === id)
  if (index === -1) return false
  state.promos.splice(index, 1)
  setState(state)
  return true
}

// Call log functions
export function getCallLogs(userId?: string): CallLog[] {
  const state = getState()
  if (userId) return state.callLogs.filter((c) => c.userId === userId)
  return state.callLogs
}

export function addCallLog(data: Omit<CallLog, "id">): CallLog {
  const state = getState()
  const newCall: CallLog = { ...data, id: `call-${Date.now()}` }
  state.callLogs.push(newCall)
  setState(state)
  return newCall
}

// Reset to default state
export function resetData(): void {
  setState(defaultState)
}

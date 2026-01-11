import { supabase } from "./supabase"
import type { User, RDV, StockItem, Promo, CallLog } from "./types"

// --- User / Auth ---

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { session }, error: authError } = await supabase.auth.getSession()
  if (authError || !session?.user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error || !profile) return null

  // Map DB profile to User type
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name, // Ensure profile has name
    password: "", // Not stored in profile, handled by Auth
    companyName: profile.company_name,
    role: profile.settings?.role || "client",
    sector: profile.business_type,
    plan: profile.tier,
    settings: profile.settings,
    webhookUrl: profile.webhook_url,
    createdAt: profile.created_at,
  } as User
}

export const getUsers = async (): Promise<User[]> => {
  // Admin only - fetch all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return profiles.map(p => ({
    id: p.id,
    email: p.email,
    name: p.name,
    password: "",
    companyName: p.company_name,
    role: p.settings?.role || "client",
    sector: p.business_type,
    plan: p.tier,
    settings: p.settings,
    webhookUrl: p.webhook_url,
    createdAt: p.created_at
  })) as User[]
}

export const createUser = async (user: Partial<User>) => {
  // Note: This only creates the profile. Auth user must be created via Sign Up or Supabase Dashboard.
  const dbProfile = {
    email: user.email,
    name: user.name,
    company_name: user.companyName,
    business_type: user.sector,
    tier: user.plan,
    webhook_url: user.webhookUrl,
    settings: { role: user.role || 'client' }
  }
  const { error } = await supabase.from('profiles').insert(dbProfile)
  if (error) console.error("Error creating user profile:", error)
}

export const updateUser = async (id: string, updates: Partial<User>) => {
  // Map User updates to profile columns
  const profileUpdates: any = {}
  if (updates.name) profileUpdates.name = updates.name
  if (updates.companyName) profileUpdates.company_name = updates.companyName
  if (updates.sector) profileUpdates.business_type = updates.sector
  if (updates.plan) profileUpdates.tier = updates.plan
  if (updates.webhookUrl !== undefined) profileUpdates.webhook_url = updates.webhookUrl

  // For specialized settings, merge into existing settings
  if (updates.role) {
    // This implies we need to fetch existing settings first or use a jsonb_set logic
    // For simplicity, we assume we might overwrite or ignored here as role is sensitive
  }

  const { error } = await supabase
    .from('profiles')
    .update(profileUpdates)
    .eq('id', id)

  if (error) console.error("Error updating user:", error)
}

export const deleteUser = async (id: string) => {
  // Delete profile (cascades to other tables)
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)

  if (error) console.error("Error deleting user:", error)
}

// --- RDVs / Bookings ---

export const getRDVs = async (userId: string): Promise<RDV[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('profile_id', userId)

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  // Map DB booking to RDV
  return data.map((b: any) => ({
    id: b.id,
    userId: b.profile_id,
    clientName: b.client_name,
    email: b.email,
    phone: b.phone,
    date: b.date,
    time: b.time,
    status: b.status,
    notes: b.internal_notes,
    // Spread metadata for specific fields
    ...b.metadata
  }))
}

export const addRDV = async (rdv: Partial<RDV>) => {
  const dbBooking = {
    profile_id: rdv.userId,
    client_name: rdv.clientName,
    email: rdv.email,
    phone: rdv.phone,
    date: rdv.date,
    time: rdv.time,
    status: rdv.status || 'pending',
    internal_notes: rdv.notes,
    metadata: {
      guests: rdv.guests,
      tableId: rdv.tableId,
      patientName: rdv.patientName,
      serviceType: rdv.serviceType,
      roomId: rdv.roomId,
      medicalNotes: rdv.medicalNotes,
      vehicleBrand: rdv.vehicleBrand,
      vehicleModel: rdv.vehicleModel,
      licensePlate: rdv.licensePlate,
      repairType: rdv.repairType,
      estimatedCost: rdv.estimatedCost,
      technicalNotes: rdv.technicalNotes
    }
  }
  const { error } = await supabase.from('bookings').insert(dbBooking)
  if (error) console.error("Error adding booking:", error)
}

export const updateRDV = async (id: string, updates: Partial<RDV>) => {
  // Fetch current metadata to merge? Simple map for now.
  const dbUpdates: any = {}
  if (updates.clientName) dbUpdates.client_name = updates.clientName
  if (updates.email) dbUpdates.email = updates.email
  if (updates.phone) dbUpdates.phone = updates.phone
  if (updates.date) dbUpdates.date = updates.date
  if (updates.time) dbUpdates.time = updates.time
  if (updates.status) dbUpdates.status = updates.status
  if (updates.notes) dbUpdates.internal_notes = updates.notes

  // Metadata updates strictly overwrite for now or we need a deep merge
  // Not critical for prototype

  const { error } = await supabase.from('bookings').update(dbUpdates).eq('id', id)
  if (error) console.error("Error updating booking:", error)
}

export const deleteRDV = async (id: string) => {
  const { error } = await supabase.from('bookings').delete().eq('id', id)
  if (error) console.error("Error deleting booking:", error)
}

// --- Stock Items ---

export const getStockItems = async (userId: string): Promise<StockItem[]> => {
  const { data, error } = await supabase
    .from('stock_items')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error("Error fetching stock:", error)
    return []
  }

  // Map data
  return data.map((d: any) => ({
    id: d.id,
    userId: d.user_id,
    name: d.name,
    description: d.description,
    price: d.price,
    category: d.category,
    isActive: d.is_active,
    imageUrl: d.image_url
  }))
}

export const addStockItem = async (item: Partial<StockItem>) => {
  const { error } = await supabase.from('stock_items').insert({
    user_id: item.userId,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    is_active: item.isActive ?? true,
    image_url: item.imageUrl
  })
  if (error) console.error("Error adding stock:", error)
}

export const updateStockItem = async (id: string, updates: Partial<StockItem>) => {
  const dbUpdates: any = {}
  if (updates.name) dbUpdates.name = updates.name
  if (updates.description) dbUpdates.description = updates.description
  if (updates.price) dbUpdates.price = updates.price
  if (updates.category) dbUpdates.category = updates.category
  if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive

  const { error } = await supabase.from('stock_items').update(dbUpdates).eq('id', id)
  if (error) console.error("Error updating stock:", error)
}

export const deleteStockItem = async (id: string) => {
  const { error } = await supabase.from('stock_items').delete().eq('id', id)
  if (error) console.error("Error deleting stock:", error)
}

// --- Promos ---

export const getPromos = async (userId: string): Promise<Promo[]> => {
  const { data, error } = await supabase
    .from('promos')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error("Error fetching promos:", error)
    return []
  }

  return data.map((d: any) => ({
    id: d.id,
    userId: d.user_id,
    title: d.title,
    description: d.description,
    code: d.code,
    discount: d.discount,
    discountType: d.discount_type,
    startDate: d.start_date,
    endDate: d.end_date,
    isActive: d.is_active
  }))
}

export const addPromo = async (promo: Partial<Promo>) => {
  const { error } = await supabase.from('promos').insert({
    user_id: promo.userId,
    title: promo.title,
    description: promo.description,
    code: promo.code,
    discount: promo.discount,
    discount_type: promo.discountType,
    start_date: promo.startDate,
    end_date: promo.endDate,
    is_active: promo.isActive ?? true
  })
  if (error) console.error("Error adding promo:", error)
}

export const updatePromo = async (id: string, updates: Partial<Promo>) => {
  const dbUpdates: any = {}
  if (updates.title) dbUpdates.title = updates.title
  if (updates.description) dbUpdates.description = updates.description
  if (updates.code) dbUpdates.code = updates.code
  if (updates.discount) dbUpdates.discount = updates.discount
  if (updates.discountType) dbUpdates.discount_type = updates.discountType
  if (updates.startDate) dbUpdates.start_date = updates.startDate
  if (updates.endDate) dbUpdates.end_date = updates.endDate
  if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive

  const { error } = await supabase.from('promos').update(dbUpdates).eq('id', id)
  if (error) console.error("Error updating promo:", error)
}

export const deletePromo = async (id: string) => {
  const { error } = await supabase.from('promos').delete().eq('id', id)
  if (error) console.error("Error deleting promo:", error)
}

// --- Call Logs ---

export const getCallLogs = async (userId: string): Promise<CallLog[]> => {
  const { data, error } = await supabase
    .from('call_logs')
    .select('*')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching calls:", error)
    return []
  }

  return data.map((c: any) => ({
    id: c.id,
    userId: c.profile_id,
    clientName: c.caller_name || c.metadata?.caller_name || "Inconnu",
    phone: c.caller_phone || "Masqué",
    type: c.type,
    status: c.status,
    duration: c.duration,
    timestamp: c.created_at,
    summary: c.transcript || c.metadata?.summary,
    metadata: c.metadata
  }))
}

export const addCallLog = async (log: Partial<CallLog>) => {
  // Used mainly by system or webhook really
  const { error } = await supabase.from('call_logs').insert({
    profile_id: log.userId,
    caller_name: log.clientName,
    caller_phone: log.phone,
    type: log.type,
    status: log.status,
    duration: log.duration,
    created_at: log.timestamp || new Date().toISOString(),
    metadata: log.metadata
  })
  if (error) console.error("Error adding call log:", error)
}

// --- Utils ---

export const resetData = () => {
  // No-op for Supabase store
}

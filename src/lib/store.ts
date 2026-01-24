import { supabase } from "./supabase"
import type { User, RDV, StockItem, Promo, CallLog } from "./types"

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v)

const asString = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : fallback

const asOptionalString = (v: unknown): string | undefined =>
  typeof v === "string" ? v : undefined

const asNumber = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined

// --- User / Auth ---

export const login = async (email: string, password: string): Promise<User | null> => {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return null
  return await getCurrentUser()
}

export const logout = async () => {
  await supabase.auth.signOut()
}

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { session }, error: authError } = await supabase.auth.getSession()
  if (authError || !session?.user) return null

  let targetUserId = session.user.id
  let isImpersonating = false

  // Ghost Mode Check
  if (typeof window !== "undefined") {
    const ghostCtx = localStorage.getItem("ghost_mode_ctx")
    if (ghostCtx) {
        try {
            const { userId } = JSON.parse(ghostCtx)
            // Verify real user is admin before switching context logic
            // Note: RLS is the real guard, this is just for frontend state consistency
            const { data: adminCheck } = await supabase
                .from('profiles')
                .select('is_super_admin')
                .eq('id', session.user.id)
                .single()
            
            if (adminCheck?.is_super_admin && userId) {
                targetUserId = userId
                isImpersonating = true
            }
        } catch (e) {
            console.error("Invalid ghost context", e)
        }
    }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetUserId)
    .single()

  if (error || !profile) return null

  // Map DB profile to User type
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name, // Ensure profile has name
    password: "", // Not stored in profile, handled by Auth
    companyName: profile.company_name,
    role: profile.role || "client",
    sector: profile.business_type,
    plan: profile.tier,
    settings: profile.settings,
    webhookUrl: profile.webhook_url,
    createdAt: profile.created_at,
    restaurantId: profile.restaurant_id,
    isSuperAdmin: isImpersonating ? false : profile.is_super_admin // If impersonating, appear as the client
  } as User
}

export const getUsers = async (): Promise<User[]> => {
  // Admin only - fetch all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')

  if (error) {
    // Error fetching users - likely due to permissions or network issues
    return []
  }

  return profiles.map(p => ({
    id: p.id,
    email: p.email,
    name: p.name,
    password: "",
    companyName: p.company_name,
    role: p.role || "client",
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
  if (error) {
    // Error creating user profile - likely RLS violation or missing fields
  }
}

export const updateUser = async (id: string, updates: Partial<User>) => {
  // Map User updates to profile columns
  const profileUpdates: Record<string, unknown> = {}
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

  if (error) {
    // Error updating user - check if user exists and has permissions
  }
}

export const deleteUser = async (id: string) => {
  // Delete profile (cascades to other tables)
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)

  if (error) {
    // Error deleting user - check RLS policies and foreign key constraints
  }
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

  return data
    .map((row: unknown) => (isRecord(row) ? row : {}))
    .map((b) => {
      const meta = isRecord(b.metadata) ? b.metadata : {}

      return {
        id: asString(b.id),
        userId: asString(b.profile_id),
        clientName: asString(b.client_name, "Inconnu"),
        email: typeof b.email === "string" ? b.email : undefined,
        phone: typeof b.phone === "string" ? b.phone : undefined,
        date: asString(b.date),
        time: asString(b.time),
        status: asString(b.status) as RDV["status"],
        notes: typeof b.internal_notes === "string" ? b.internal_notes : undefined,
        ...meta,
      } as RDV
    })
}

export const getAllRDVs = async (): Promise<RDV[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return []
  }

  return data
    .map((row: unknown) => (isRecord(row) ? row : {}))
    .map((b) => {
      const meta = isRecord(b.metadata) ? b.metadata : {}

      return {
        id: asString(b.id),
        userId: asString(b.profile_id),
        clientName: asString(b.client_name, "Inconnu"),
        email: typeof b.email === "string" ? b.email : undefined,
        phone: typeof b.phone === "string" ? b.phone : undefined,
        date: asString(b.date),
        time: asString(b.time),
        status: asString(b.status) as RDV["status"],
        notes: typeof b.internal_notes === "string" ? b.internal_notes : undefined,
        ...meta,
      } as RDV
    })
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
  if (error) {
    // Error adding booking - check required fields and RLS policies
  }
}

export const updateRDV = async (id: string, updates: Partial<RDV>) => {
  // Fetch current metadata to merge? Simple map for now.
  const dbUpdates: Record<string, unknown> = {}
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
  if (error) {
    // Error updating booking - verify booking exists and user has permissions
  }
}

export const deleteRDV = async (id: string) => {
  const { error } = await supabase.from('bookings').delete().eq('id', id)
  if (error) {
    // Error deleting booking - check foreign key constraints
  }
}

// --- Admin / Restaurants ---

export const getAllRestaurants = async () => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, retell_agent_id, profiles(id, email, role)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching restaurants:", error)
    return []
  }
  return data
}

export const updateRestaurantStatus = async (id: string, isActive: boolean) => {
  const { error } = await supabase
    .from('restaurants')
    .update({ is_active: isActive })
    .eq('id', id)
  
  return error
}

export const updateRestaurantTier = async (id: string, tier: string) => {
  const { error } = await supabase
    .from('restaurants')
    .update({ subscription_tier: tier })
    .eq('id', id)
  
  return error
}

export const updateRetellAgentId = async (id: string, agentId: string | null) => {
  const { error } = await supabase
    .from('restaurants')
    .update({ retell_agent_id: agentId || null })
    .eq('id', id)
  
  return error
}

export const deleteRestaurant = async (id: string) => {
  // 1. Get associated profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .eq('restaurant_id', id)

  const profileIds = profiles?.map(p => p.id) || []

  // 2. Delete items linked via profile_id
  if (profileIds.length > 0) {
    const tablesUsingProfileId = [
      'stock_items', 'promos', 'resources', 'locations', 
      'knowledge_base', 'booking_notes', 'triggers', 'services'
    ]
    
    // Execute deletions in parallel for profile-linked tables
    await Promise.all(
      tablesUsingProfileId.map(table => 
        supabase.from(table).delete().in('profile_id', profileIds)
      )
    )
    
    // Separate for support_tickets to avoid double delete logic confusion (handled below via restaurant_id is safer)
    await supabase.from('support_tickets').delete().in('profile_id', profileIds)
  }

  // 3. Delete items linked via restaurant_id
  const tablesUsingRestaurantId = [
    'menu_items', 'restaurant_tables', 'support_tickets',
    'bookings', 'call_logs'
  ]

  // Execute deletions in parallel for restaurant-linked tables
  await Promise.all(
    tablesUsingRestaurantId.map(table => 
      supabase.from(table).delete().eq('restaurant_id', id)
    )
  )
  
  // 4. Unlink profiles (don't delete them, just remove restaurant association)
  await supabase.from('profiles').update({ restaurant_id: null }).eq('restaurant_id', id)
  
  // 5. Finally delete the restaurant
  const { error } = await supabase.from('restaurants').delete().eq('id', id)
  return error
}

export const createRestaurantWithOwner = async (email: string, name: string, tier: string) => {
  // 1. Create the restaurant first
  const { data: restaurant, error: restError } = await supabase
    .from('restaurants')
    .insert({ name, subscription_tier: tier, is_active: true })
    .select()
    .single()
  
  if (restError || !restaurant) {
    return { error: restError?.message || 'Failed to create restaurant' }
  }
  
  // 2. Invite the user via Supabase Auth (sends email)
  const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { restaurant_id: restaurant.id, name: name }
  })
  
  if (authError) {
    // Rollback: delete the restaurant we just created
    await supabase.from('restaurants').delete().eq('id', restaurant.id)
    return { error: `Auth error: ${authError.message}` }
  }
  
  // 3. Create the profile linked to the restaurant
  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    email: email,
    name: name,
    company_name: name,
    restaurant_id: restaurant.id,
    tier: tier,
    role: 'owner'
  })
  
  if (profileError) {
    return { error: `Profile error: ${profileError.message}`, restaurant }
  }
  
  return { restaurant, user: authData.user }
}

export const getGlobalStats = async () => {
  // Parallel fetch for stats
  const [restaurants, bookings] = await Promise.all([
     supabase.from('restaurants').select('id, subscription_tier', { count: 'exact' }),
     supabase.from('bookings').select('id', { count: 'exact' }).gte('created_at', new Date(Date.now() - 24*60*60*1000).toISOString())
  ])

  return {
    totalRestaurants: restaurants.count ?? 0,
    totalBookings24h: bookings.count ?? 0,
    // MRR calculation simplified
    mrr: (restaurants.data || []).reduce((acc, r) => {
       const price = r.subscription_tier === 'elite' ? 1000 : r.subscription_tier === 'pro' ? 500 : 0
       return acc + price
    }, 0)
  }
}

// --- Stock Items ---

export const getStockItems = async (userId: string): Promise<StockItem[]> => {
  const { data, error } = await supabase
    .from('stock_items')
    .select('*')
    .eq('profile_id', userId)
    // NOTE: Removed .eq('is_active', true) - we want ALL items, inactive ones are greyed out
    .order('created_at', { ascending: false })

  if (error) {
    // Error fetching stock items - verify table exists and RLS permissions
    return []
  }

  return data
    .map((row: unknown) => (isRecord(row) ? row : {}))
    .map((d) => ({
      id: asString(d.id),
      userId: asString(d.profile_id),
      name: asString(d.name),
      description: typeof d.description === "string" ? d.description : undefined,
      price: asNumber(d.price),
      category: typeof d.category === "string" ? d.category : undefined,
      isActive: typeof d.is_active === "boolean" ? d.is_active : true,
      imageUrl: typeof d.image_url === "string" ? d.image_url : undefined,
    }))
}

export const addStockItem = async (item: Partial<StockItem>) => {
  const { error } = await supabase.from('stock_items').insert({
    profile_id: item.userId,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    is_active: item.isActive ?? true,
    image_url: item.imageUrl
  })
  if (error) {
    // Error adding stock item - check required fields and constraints
  }
}

export const updateStockItem = async (id: string, updates: Partial<StockItem>) => {
  const dbUpdates: Record<string, unknown> = {}
  if (updates.name) dbUpdates.name = updates.name
  if (updates.description) dbUpdates.description = updates.description
  if (updates.price) dbUpdates.price = updates.price
  if (updates.category) dbUpdates.category = updates.category
  if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive
  if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl

  const { error } = await supabase.from('stock_items').update(dbUpdates).eq('id', id)
  if (error) {
    // Error updating stock item - verify item exists and user permissions
  }
}

export const deleteStockItem = async (id: string) => {
  const { error } = await supabase.from('stock_items').delete().eq('id', id)
  if (error) {
    // Error deleting stock item - check foreign key constraints
  }
}

// --- Promos ---

export const getPromos = async (userId: string): Promise<Promo[]> => {
  const { data, error } = await supabase
    .from('promos')
    .select('*')
    .eq('profile_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    // Error fetching promos - verify table exists and RLS permissions
    return []
  }

  return data
    .map((row: unknown) => (isRecord(row) ? row : {}))
    .map((d) => ({
      id: asString(d.id),
      userId: asString(d.profile_id),
      title: asString(d.title),
      description: typeof d.description === "string" ? d.description : undefined,
      code: typeof d.code === "string" ? d.code : "",
      discount: typeof d.discount === "number" ? d.discount : 0,
      discountType: asString(d.discount_type) as Promo["discountType"],
      startDate: asString(d.start_date),
      endDate: typeof d.end_date === "string" ? d.end_date : undefined,
      isActive: typeof d.is_active === "boolean" ? d.is_active : true,
    }))
}

export const addPromo = async (promo: Partial<Promo>) => {
  const { error } = await supabase.from('promos').insert({
    profile_id: promo.userId,
    title: promo.title,
    description: promo.description,
    code: promo.code,
    discount: promo.discount,
    discount_type: promo.discountType,
    start_date: promo.startDate,
    end_date: promo.endDate,
    is_active: promo.isActive ?? true
  })
  if (error) {
    // Error adding promo - check unique code constraint and required fields
  }
}

export const updatePromo = async (id: string, updates: Partial<Promo>) => {
  const dbUpdates: Record<string, unknown> = {}
  if (updates.title) dbUpdates.title = updates.title
  if (updates.description) dbUpdates.description = updates.description
  if (updates.code) dbUpdates.code = updates.code
  if (updates.discount) dbUpdates.discount = updates.discount
  if (updates.discountType) dbUpdates.discount_type = updates.discountType
  if (updates.startDate) dbUpdates.start_date = updates.startDate
  if (updates.endDate) dbUpdates.end_date = updates.endDate
  if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive

  const { error } = await supabase.from('promos').update(dbUpdates).eq('id', id)
  if (error) {
    // Error updating promo - verify promo exists and user permissions
  }
}

export const deletePromo = async (id: string) => {
  const { error } = await supabase.from('promos').delete().eq('id', id)
  if (error) {
    // Error deleting promo - check foreign key constraints
  }
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

  return data
    .map((row: unknown) => (isRecord(row) ? row : {}))
    .map((c) => {
      const meta = isRecord(c.metadata) ? c.metadata : undefined

      return {
        id: asString(c.id),
        userId: asString(c.profile_id),
        clientName: asString(c.caller_name, asString(meta?.caller_name, "Inconnu")),
        phone: asString(c.caller_phone, "Masqué"),
        type: asString(c.type) as CallLog["type"],
        status: asString(c.status) as CallLog["status"],
        duration: asNumber(c.duration),
        timestamp: asString(c.created_at),
        summary: asOptionalString(c.summary) ?? asOptionalString(meta?.summary),
        transcript: typeof c.transcript === "string" ? c.transcript : undefined,
        recordingUrl: typeof c.recording_url === "string" ? c.recording_url : undefined,
        sentiment: typeof c.sentiment === "string" ? c.sentiment : undefined,
        metadata: meta,
      }
    })
}

export const getAllCallLogs = async (): Promise<CallLog[]> => {
  const { data, error } = await supabase
    .from('call_logs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching calls:", error)
    return []
  }

  return data
    .map((row: unknown) => (isRecord(row) ? row : {}))
    .map((c) => {
      const meta = isRecord(c.metadata) ? c.metadata : undefined

      return {
        id: asString(c.id),
        userId: asString(c.profile_id),
        clientName: asString(c.caller_name, asString(meta?.caller_name, "Inconnu")),
        phone: asString(c.caller_phone, "Masqué"),
        type: asString(c.type) as CallLog["type"],
        status: asString(c.status) as CallLog["status"],
        duration: asNumber(c.duration),
        timestamp: asString(c.created_at),
        summary: asOptionalString(c.summary) ?? asOptionalString(meta?.summary),
        transcript: typeof c.transcript === "string" ? c.transcript : undefined,
        recordingUrl: typeof c.recording_url === "string" ? c.recording_url : undefined,
        sentiment: typeof c.sentiment === "string" ? c.sentiment : undefined,
        metadata: meta,
      }
    })
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
  if (error) {
    // Error adding call log - typically webhook authentication or data validation issue
  }
}

// --- Utils ---

export const resetData = () => {
  // No-op for Supabase store
}

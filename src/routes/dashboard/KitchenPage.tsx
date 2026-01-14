import { useEffect, useMemo, useState } from 'react'
import { getCurrentUser, getRDVs } from '@/lib/store'
import type { RDV, User } from '@/lib/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, Users, Utensils, ChefHat } from 'lucide-react'

// Mock data for demo
const MOCK_KITCHEN_ORDERS: RDV[] = [
  {
    id: 'kitchen_1',
    userId: 'demo',
    clientName: 'Mme Dupont',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '19:30',
    status: 'confirmed',
    guests: 2,
    tableId: 'T4',
    notes: 'Allergie Arachide',
    metadata: { occasion: 'VIP', order_type: 'dine_in' }
  },
  {
    id: 'kitchen_2',
    userId: 'demo',
    clientName: 'M. Martin',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '20:00',
    status: 'confirmed',
    guests: 6,
    tableId: 'T-Large',
    metadata: { occasion: 'Anniversaire', order_type: 'dine_in' }
  },
  {
    id: 'kitchen_3',
    userId: 'demo',
    clientName: 'Famille Bernard',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '20:30',
    status: 'confirmed',
    guests: 4,
    tableId: 'T7',
    notes: 'Allergie Gluten - Sans blé',
    metadata: { order_type: 'dine_in', special_requests: ['Sans gluten'] }
  },
  {
    id: 'kitchen_4',
    userId: 'demo',
    clientName: 'Pierre Leblanc',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '21:00',
    status: 'confirmed',
    guests: 2,
    tableId: 'T2',
    metadata: { order_type: 'dine_in' }
  }
]

export default function KitchenPage() {
  const [user, setUser] = useState<User | null>(null)
  const [rdvs, setRdvs] = useState<RDV[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Load data
  useEffect(() => {
    async function load() {
      const u = await getCurrentUser()
      setUser(u)
      if (!u) return
      const rdvData = await getRDVs(u.id)
      setRdvs(rdvData.length > 0 ? rdvData : MOCK_KITCHEN_ORDERS)
    }
    load()
  }, [])

  // Filter today's reservations and sort by time
  const todayRdvs = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return rdvs
      .filter(r => r.date === today && r.status !== 'cancelled')
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [rdvs])

  // Reservations with allergies
  const allergyRdvs = useMemo(() => {
    return todayRdvs.filter(r => 
      r.notes?.toLowerCase().includes('allergi') ||
      r.metadata?.special_requests?.toString().toLowerCase().includes('allergi')
    )
  }, [todayRdvs])

  // Service flow - group by hour
  const serviceFlow = useMemo(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const flow: { hour: string; tables: number; covers: number }[] = []
    
    for (let h = currentHour; h <= currentHour + 3; h++) {
      const hourStr = `${h.toString().padStart(2, '0')}:`
      const hourRdvs = todayRdvs.filter(r => r.time.startsWith(hourStr))
      if (hourRdvs.length > 0 || h === currentHour) {
        flow.push({
          hour: `${h}:00`,
          tables: hourRdvs.length,
          covers: hourRdvs.reduce((sum, r) => sum + (r.guests || 2), 0)
        })
      }
    }
    return flow
  }, [todayRdvs])

  // Stats
  const stats = useMemo(() => ({
    totalTables: todayRdvs.length,
    totalCovers: todayRdvs.reduce((sum, r) => sum + (r.guests || 2), 0),
    allergyCount: allergyRdvs.length
  }), [todayRdvs, allergyRdvs])

  // Get config from settings
  const rushThreshold = (user?.settings as any)?.restaurant_config?.rush_threshold || 20
  const welcomeMessage = (user?.settings as any)?.restaurant_config?.welcome_message || "Bienvenue chez nous !"

  const isRushMode = todayRdvs.length >= rushThreshold

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <ChefHat className="w-16 h-16 text-white animate-pulse" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-black text-white p-6 space-y-6 transition-colors duration-1000 ${isRushMode ? 'bg-red-950/30' : ''}`}>
      {/* Header with Giant Clock */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-full ${isRushMode ? 'bg-red-600 animate-pulse' : 'bg-zinc-900'}`}>
            <ChefHat className={`w-12 h-12 ${isRushMode ? 'text-white' : 'text-orange-500'}`} />
          </div>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              MODE CUISINE
              {isRushMode && <Badge className="bg-red-600 text-white text-xl px-3 py-1 animate-pulse">ALERTE RUSH ({rushThreshold}+)</Badge>}
            </h1>
            <p className="text-zinc-500 text-lg flex items-center gap-2">
              <span className="text-cyan-400">" {welcomeMessage} "</span>
            </p>
          </div>
        </div>
        
        {/* Giant Clock */}
        <div className="text-right">
          <div className="text-7xl font-mono font-bold tracking-wider">
            {format(currentTime, 'HH:mm')}
          </div>
          <div className="text-2xl text-zinc-500">
            {format(currentTime, 'EEEE d MMMM', { locale: fr })}
          </div>
        </div>
      </div>

      {/* Allergy Alert Banner - HUGE RED WARNING */}
      {allergyRdvs.length > 0 && (
        <div className="bg-red-600 border-4 border-red-400 rounded-xl p-6 animate-pulse">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-16 h-16 text-white" />
            <div className="flex-1">
              <div className="text-4xl font-bold mb-2">⚠️ ATTENTION ALLERGIES</div>
              <div className="text-2xl space-y-1">
                {allergyRdvs.map(rdv => (
                  <div key={rdv.id} className="flex items-center gap-4">
                    <span className="font-bold">{rdv.tableId || '—'}</span>
                    <span>{rdv.clientName}</span>
                    <Badge className="bg-white text-red-600 text-lg px-3 py-1">
                      {rdv.notes || rdv.metadata?.special_requests}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 text-center">
            <Utensils className="w-10 h-10 text-orange-500 mx-auto mb-2" />
            <div className="text-5xl font-bold">{stats.totalTables}</div>
            <div className="text-xl text-zinc-500">Tables</div>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6 text-center">
            <Users className="w-10 h-10 text-blue-500 mx-auto mb-2" />
            <div className="text-5xl font-bold">{stats.totalCovers}</div>
            <div className="text-xl text-zinc-500">Couverts</div>
          </CardContent>
        </Card>
        <Card className={`border-2 ${stats.allergyCount > 0 ? 'bg-red-900/50 border-red-500' : 'bg-zinc-900 border-zinc-800'}`}>
          <CardContent className="p-6 text-center">
            <AlertTriangle className={`w-10 h-10 mx-auto mb-2 ${stats.allergyCount > 0 ? 'text-red-500' : 'text-zinc-600'}`} />
            <div className="text-5xl font-bold">{stats.allergyCount}</div>
            <div className="text-xl text-zinc-500">Allergies</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Service Flow - Left Side */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-8 h-8 text-cyan-500" />
              <h2 className="text-3xl font-bold">SERVICE FLOW</h2>
            </div>
            <div className="space-y-4">
              {serviceFlow.map((slot, index) => (
                <div 
                  key={slot.hour}
                  className={`p-4 rounded-xl border-2 ${
                    index === 0 
                      ? 'bg-cyan-500/20 border-cyan-500' 
                      : 'bg-zinc-800/50 border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-mono font-bold">{slot.hour}</div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{slot.tables} tables</div>
                      <div className="text-xl text-zinc-400">{slot.covers} couverts</div>
                    </div>
                  </div>
                </div>
              ))}
              {serviceFlow.length === 0 && (
                <div className="text-center text-2xl text-zinc-500 py-8">
                  Aucun service prévu
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Orders - Right Side */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Utensils className="w-8 h-8 text-orange-500" />
              <h2 className="text-3xl font-bold">COMMANDES ACTIVES</h2>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {todayRdvs.map((rdv) => {
                const hasAllergy = rdv.notes?.toLowerCase().includes('allergi') ||
                  rdv.metadata?.special_requests?.toString().toLowerCase().includes('allergi')
                
                return (
                  <div 
                    key={rdv.id}
                    className={`p-4 rounded-xl border-2 ${
                      hasAllergy 
                        ? 'bg-red-900/30 border-red-500' 
                        : 'bg-zinc-800/50 border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-mono font-bold text-cyan-400">
                          {rdv.time}
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{rdv.clientName}</div>
                          <div className="text-lg text-zinc-400">
                            {rdv.tableId || '—'} • {rdv.guests || 2} pers
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasAllergy && (
                          <Badge className="bg-red-500 text-white text-lg px-3 py-1">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            ALLERGIE
                          </Badge>
                        )}
                        {rdv.metadata?.occasion === 'VIP' && (
                          <Badge className="bg-purple-500 text-white text-lg px-3 py-1">
                            VIP
                          </Badge>
                        )}
                        {rdv.metadata?.occasion?.toLowerCase().includes('anniversaire') && (
                          <Badge className="bg-pink-500 text-white text-lg px-3 py-1">
                            🎂
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {todayRdvs.length === 0 && (
                <div className="text-center text-2xl text-zinc-500 py-8">
                  Aucune commande
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

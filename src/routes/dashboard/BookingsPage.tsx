import { useEffect, useMemo, useState } from 'react'
import { getCurrentUser, getRDVs } from '@/lib/store'
import type { RDV, User } from '@/lib/types'
import { Calendar } from '@/components/ui/calendar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { format, addHours } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Users, Clock, CheckCircle, AlertCircle, XCircle, Star, ShoppingBag, Truck, Bell, MoreVertical, MapPin, CalendarDays, TrendingUp, Utensils } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'
import { useSmartSuggestions } from '@/hooks/useSmartSuggestions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

// Mock data for demo when DB is empty
const MOCK_RESERVATIONS: RDV[] = [
  {
    id: 'mock_1',
    userId: 'demo',
    clientName: 'Mme Dupont',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '19:30',
    status: 'vip',
    guests: 2,
    notes: 'Client VIP fidèle',
    tableId: 'T4',
    metadata: { occasion: 'VIP', order_type: 'dine_in' }
  },
  {
    id: 'mock_2',
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
    id: 'mock_3',
    userId: 'demo',
    clientName: 'Sophie Bernard',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '21:00',
    status: 'pending',
    guests: 2,
    metadata: { order_type: 'dine_in' }
  },
  {
    id: 'mock_4',
    userId: 'demo',
    clientName: 'Pierre Leblanc',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '19:00',
    status: 'confirmed',
    guests: 4,
    tableId: 'T2',
    metadata: { order_type: 'dine_in' }
  },
  {
    id: 'mock_5',
    userId: 'demo',
    clientName: 'Famille Moreau',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '20:30',
    status: 'confirmed',
    guests: 5,
    tableId: 'T7',
    metadata: { order_type: 'dine_in', special_requests: ['Chaise haute'] }
  }
]

interface TimelineBlock {
  id: string
  startTime: Date
  endTime: Date
  clientName: string
  guests: number
  status: string
  occasion?: string
  orderType?: string
  position: number
  color: string
}

export default function BookingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [rdvs, setRdvs] = useState<RDV[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const { addNotification } = useNotifications()
  const { suggestions, processInput, markSuggestionAsUsed } = useSmartSuggestions()

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser()
      setUser(u)
      if (!u) return
      const rdvData = await getRDVs(u.id)
      // Use mock data if no real data exists
      setRdvs(rdvData.length > 0 ? rdvData : MOCK_RESERVATIONS)
      
      // Notify about new reservations
      rdvData.forEach(rdv => {
        if (rdv.status === 'pending') {
          addNotification({
            type: 'reservation',
            title: '🍽️ Nouvelle réservation',
            message: `${rdv.clientName} - ${rdv.guests || 2} personnes à ${rdv.time}`,
            actionUrl: `/reservations/${rdv.id}`
          })
        }
      })
    }

    load()
  }, [addNotification])

  const upcoming = useMemo(() => {
    const now = new Date()
    return rdvs
      .filter((r) => {
        const dt = new Date(`${r.date}T${r.time}`)
        return dt.getTime() >= now.getTime() - 60_000
      })
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
  }, [rdvs])

  const selectedKey = selectedDay ? format(selectedDay, 'yyyy-MM-dd') : undefined

  const dayItems = useMemo(() => {
    if (!selectedKey) return []
    return upcoming.filter((r) => r.date === selectedKey)
  }, [upcoming, selectedKey])

  // Timeline data for the selected day
  const timelineBlocks = useMemo((): TimelineBlock[] => {
    if (!selectedKey) return []

    return dayItems.map((rdv, index) => {
      const startTime = new Date(`${rdv.date}T${rdv.time}`)
      const endTime = addHours(startTime, 2) // Assume 2-hour duration
      
      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case 'confirmed': return 'bg-green-500/20 border-green-500'
          case 'pending': return 'bg-yellow-500/20 border-yellow-500'
          case 'vip': return 'bg-purple-500/20 border-purple-500'
          case 'cancelled': return 'bg-red-500/20 border-red-500'
          default: return 'bg-blue-500/20 border-blue-500'
        }
      }

      return {
        id: rdv.id,
        startTime,
        endTime,
        clientName: rdv.clientName,
        guests: typeof rdv.guests === 'number' ? rdv.guests : 2,
        status: rdv.status,
        occasion: rdv.metadata?.occasion,
        orderType: rdv.metadata?.order_type,
        position: index,
        color: getStatusColor(rdv.status)
      }
    })
  }, [dayItems, selectedKey])

  // Statistics for the header - personalized for restaurant
  const stats = useMemo(() => {
    const totalCovers = dayItems.reduce((sum, r) => sum + (typeof r.guests === 'number' ? r.guests : 2), 0)
    const confirmedCount = dayItems.filter(r => r.status === 'confirmed').length
    const vipCount = dayItems.filter(r => r.status === 'vip' || r.metadata?.occasion === 'VIP').length
    const deliveryCount = dayItems.filter(r => r.metadata?.order_type === 'delivery').length
    const takeawayCount = dayItems.filter(r => r.metadata?.order_type === 'takeaway').length
    
    return {
      covers: totalCovers,
      confirmed: confirmedCount,
      vip: vipCount,
      delivery: deliveryCount,
      takeaway: takeawayCount,
      total: dayItems.length,
      fillRate: dayItems.length > 0 ? Math.round((confirmedCount / dayItems.length) * 100) : 0,
      nextService: dayItems.length > 0 
        ? dayItems.sort((a, b) => a.time.localeCompare(b.time))[0]?.time || '—'
        : '—'
    }
  }, [dayItems])

  // Handle search with smart suggestions
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (value.length > 2) {
      processInput(value)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: any) => {
    markSuggestionAsUsed(suggestion.id)
    addNotification({
      type: 'knowledge',
      title: '💡 Proposition utilisée',
      message: suggestion.response,
    })
    setShowSuggestions(false)
  }

  const renderTimelineView = () => {
    const hours = Array.from({ length: 8 }, (_, i) => 17 + i) // 17:00 to 01:00 for restaurant hours
    
    return (
      <div className="space-y-4">
        {/* Timeline Header */}
        <div className="flex gap-2 px-4 overflow-x-auto">
          {hours.map(hour => (
            <div key={hour} className="flex-1 min-w-[80px] text-center">
              <div className="text-xs font-medium text-muted-foreground">
                {hour === 24 ? '00:00' : `${hour}:00`}
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Grid */}
        <div className="relative min-h-[120px]">
          {/* Background grid */}
          <div className="flex gap-2 border-t border-border/30">
            {hours.map(hour => (
              <div key={hour} className="flex-1 border-l border-border/20 min-h-[100px]" />
            ))}
          </div>

          {/* Reservation blocks */}
          <div className="absolute inset-0 flex gap-2 px-2">
            {timelineBlocks.map((block) => {
              const startHour = block.startTime.getHours()
              const startMinute = block.startTime.getMinutes()
              const endHour = block.endTime.getHours()
              const endMinute = block.endTime.getMinutes()

              // Calculate position and width
              const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute)
              const startOffset = ((startHour - 17) * 60 + startMinute) / 60 // Hours since 17:00
              const width = totalMinutes / 60

              const getStatusBadge = (status: string) => {
                switch (status.toLowerCase()) {
                  case 'confirmed': return { variant: 'default' as const, color: 'bg-green-500', text: 'Confirmé' }
                  case 'pending': return { variant: 'secondary' as const, color: 'bg-yellow-500', text: 'En Attente' }
                  case 'vip': return { variant: 'default' as const, color: 'bg-purple-500', text: 'VIP' }
                  case 'cancelled': return { variant: 'destructive' as const, color: 'bg-red-500', text: 'Annulé' }
                  default: return { variant: 'secondary' as const, color: 'bg-gray-500', text: status }
                }
              }

              const badge = getStatusBadge(block.status)

              return (
                <div
                  key={block.id}
                  className={cn(
                    'absolute top-2 rounded-lg border p-2 glass-card transition-all hover:shadow-lg',
                    block.color,
                    'min-w-[120px] max-w-[180px]'
                  )}
                  style={{
                    left: `${startOffset * 12.5}%`, // 100% / 8 hours
                    width: `${Math.max(width * 12.5, 15)}%`, // Minimum width
                    zIndex: 10 - block.position
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium text-foreground truncate">
                        {block.clientName}
                      </div>
                      {block.occasion === 'VIP' && <Star className="w-3 h-3 text-purple-500" />}
                    </div>
                    
                    {/* Show different icons based on order type */}
                    <div className="flex items-center gap-1">
                      {block.orderType === 'delivery' ? (
                        <Truck className="w-3 h-3 text-muted-foreground" />
                      ) : block.orderType === 'takeaway' ? (
                        <ShoppingBag className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <Users className="w-3 h-3 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {block.orderType === 'delivery' ? 'Livraison' : 
                         block.orderType === 'takeaway' ? 'Emporter' : 
                         `${block.guests} couverts`}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {format(block.startTime, 'HH:mm')}
                      </span>
                    </div>
                    <Badge variant={badge.variant} className="text-[10px] px-1 py-0">
                      {badge.text}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderListView = () => {
    return (
      <div className="space-y-3">
        {dayItems.map((rdv) => {
          const getStatusBadge = (status: string) => {
            switch (status.toLowerCase()) {
              case 'confirmed': return { variant: 'default' as const, color: 'bg-green-500', text: 'Confirmé' }
              case 'pending': return { variant: 'secondary' as const, color: 'bg-yellow-500', text: 'En Attente' }
              case 'vip': return { variant: 'default' as const, color: 'bg-purple-500', text: 'VIP' }
              case 'cancelled': return { variant: 'destructive' as const, color: 'bg-red-500', text: 'Annulé' }
              default: return { variant: 'secondary' as const, color: 'bg-gray-500', text: status }
            }
          }

          const badge = getStatusBadge(rdv.status)
          const covers = typeof rdv.guests === 'number' ? rdv.guests : 2
          const orderType = rdv.metadata?.order_type

          return (
            <Card key={rdv.id} className={cn(
              "glass-card border-border/30 transition-all",
              rdv.status === 'cancelled' && "opacity-50"
            )}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-sm font-medium text-foreground">
                        {rdv.clientName}
                      </div>
                      {/* Auto-badges */}
                      {(rdv.status === 'vip' || rdv.notes?.toLowerCase().includes('vip')) && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 text-[10px]">
                          <Star className="w-3 h-3 mr-1" />VIP
                        </Badge>
                      )}
                      {rdv.metadata?.occasion?.toLowerCase().includes('anniversaire') && (
                        <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/50 text-[10px]">
                          🎂 Anniversaire
                        </Badge>
                      )}
                      <Badge variant={badge.variant} className="text-xs">
                        {badge.text}
                      </Badge>
                      {rdv.tableId && (
                        <Badge variant="outline" className="text-[10px]">
                          <MapPin className="w-3 h-3 mr-1" />{rdv.tableId}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rdv.time}
                      </div>
                      
                      {/* Show appropriate info based on order type */}
                      {orderType === 'delivery' ? (
                        <div className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          Livraison ({covers} pers)
                        </div>
                      ) : orderType === 'takeaway' ? (
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" />
                          Emporter ({covers} pers)
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {covers} couverts
                        </div>
                      )}
                    </div>

                    {rdv.metadata?.special_requests && (
                      <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                        <strong>Spéciales:</strong> {Array.isArray(rdv.metadata.special_requests) 
                          ? rdv.metadata.special_requests.join(', ')
                          : rdv.metadata.special_requests}
                      </div>
                    )}
                  </div>

                  {/* Meatball Menu with Advanced Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {rdv.status === 'pending' && (
                        <>
                          <DropdownMenuItem onClick={() => toast.success(`✅ ${rdv.clientName} confirmé`)}>
                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                            Confirmer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.error(`❌ ${rdv.clientName} refusé`)}>
                            <XCircle className="w-4 h-4 mr-2 text-red-500" />
                            Refuser
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onClick={() => toast.info(`🪑 Assignez une table à ${rdv.clientName}`)}>
                        <MapPin className="w-4 h-4 mr-2" />
                        Assigner Table
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info(`📝 Ajoutez une note pour ${rdv.clientName}`)}>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Noter Client
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => toast.warning(`⚠️ ${rdv.clientName} marqué No-Show`)}
                        className="text-destructive"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Marquer No-Show
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {dayItems.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Aucune réservation pour cette date
          </div>
        )}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Notifications */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Centre de Réservation</h1>
          <p className="text-muted-foreground">Gérez vos réservations et commandes</p>
        </div>
        
        <div className="flex gap-2">
          {/* Smart Search */}
          <div className="relative">
            <Input
              placeholder="Rechercher ou poser une question..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-64"
            />
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border/30 rounded-lg shadow-lg p-2 z-50">
                <div className="text-xs text-muted-foreground mb-2">Suggestions IA:</div>
                {suggestions.slice(0, 3).map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <div className="text-sm font-medium text-foreground">
                      {suggestion.trigger}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {suggestion.response}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              addNotification({
                type: 'system',
                title: '📢 Système',
                message: 'Centre de notifications activé',
              })
            }}
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Statistics Cards - Premium Design */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Total Résas</div>
                <div className="text-2xl font-bold text-foreground">
                  {stats.total}
                </div>
              </div>
              <CalendarDays className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Couverts</div>
                <div className="text-2xl font-bold text-foreground">
                  {stats.covers} <span className="text-sm font-normal text-muted-foreground">pers</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Taux Remplissage</div>
                <TrendingUp className="w-5 h-5 text-green-500/50" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.fillRate}%</div>
              <Progress value={stats.fillRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Prochain Service</div>
                <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Dîner</span> {stats.nextService}
                </div>
              </div>
              <Utensils className="w-8 h-8 text-orange-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-1">
          <Card className="glass-card border-border/30">
            <CardContent className="p-4">
              <div className="mb-4">
                <div className="text-sm font-medium text-foreground">
                  {selectedDay ? format(selectedDay, 'dd MMMM yyyy', { locale: fr }) : 'Sélectionner une date'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedKey ? `${dayItems.length} réservations` : ''}
                </div>
              </div>
              <Calendar
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                className="rounded-md border-0"
              />
            </CardContent>
          </Card>
        </div>

        {/* Timeline/List View */}
        <div className="lg:col-span-3">
          <Card className="glass-card border-border/30">
            <CardContent className="p-4">
              <Tabs defaultValue="list" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="list">Vue Liste</TabsTrigger>
                  <TabsTrigger value="timeline">Vue Timeline</TabsTrigger>
                  <TabsTrigger value="salle">Vue Salle</TabsTrigger>
                </TabsList>
                
                <TabsContent value="list" className="mt-4">
                  {renderListView()}
                </TabsContent>
                
                <TabsContent value="timeline" className="mt-4">
                  {renderTimelineView()}
                </TabsContent>

                <TabsContent value="salle" className="mt-4">
                  {/* Salle View - Table Grid */}
                  <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                    {Array.from({ length: 20 }, (_, i) => {
                      const tableId = `T${i + 1}`
                      const reservation = dayItems.find(r => r.tableId === tableId)
                      const isOccupied = !!reservation
                      
                      return (
                        <Card 
                          key={tableId}
                          className={cn(
                            "transition-all cursor-pointer hover:scale-105",
                            isOccupied 
                              ? "bg-red-500/20 border-red-500/50" 
                              : "bg-green-500/20 border-green-500/50 hover:bg-green-500/30"
                          )}
                        >
                          <CardContent className="p-3 text-center">
                            <div className="text-xs font-bold text-foreground">{tableId}</div>
                            {reservation ? (
                              <>
                                <div className="text-[10px] text-muted-foreground truncate mt-1">
                                  {reservation.clientName}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {reservation.time} • {reservation.guests}p
                                </div>
                              </>
                            ) : (
                              <div className="text-[10px] text-green-400 mt-1">Libre</div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

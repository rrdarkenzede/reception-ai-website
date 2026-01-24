import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { getCurrentUser, getRDVs, getCallLogs } from "@/lib/store"
import type { User, RDV, CallLog } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

// Dashboard Components
import { LiveFeed } from "@/components/dashboard/LiveFeed"
import { StatsToday } from "@/components/dashboard/StatsToday"
import { ActionsRequises } from "@/components/dashboard/ActionsRequises"
import { WeeklyAgenda } from "@/components/dashboard/WeeklyAgenda"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [rdvs, setRdvs] = useState<RDV[]>([])
  const [calls, setCalls] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]
    const todayCallsCount = calls.filter((c) => {
      const callDate = new Date(c.timestamp).toISOString().split("T")[0]
      return callDate === today
    }).length

    return {
      todayCallsCount,
    }
  }, [calls])

  // Generate actions from pending reservations and reminders
  const actions = useMemo(() => {
    const pendingRdvs = rdvs.filter(r => r.status === 'pending')
    const result = []
    
    if (pendingRdvs.length > 0) {
      result.push({
        id: 'pending-rdvs',
        title: `${pendingRdvs.length} réservation${pendingRdvs.length > 1 ? 's' : ''} à confirmer`,
        type: 'warning' as const,
        count: pendingRdvs.length
      })
    }

    // Filter for urgent/missed calls
    const urgentCalls = calls.filter(c => c.status === 'missed' || c.sentiment === 'urgent' || c.metadata?.is_urgent)

    if (urgentCalls.length > 0) {
      result.push({
        id: 'urgent-callback',
        title: `${urgentCalls.length} appel${urgentCalls.length > 1 ? 's' : ''} à traiter`,
        type: 'urgent' as const,
        count: urgentCalls.length
      })
    }

    return result
  }, [rdvs, calls])
  // Generate events for weekly agenda
  const agendaEvents = useMemo(() => {
    return rdvs.map(rdv => ({
      id: rdv.id,
      date: new Date(rdv.date + 'T' + rdv.time),
      title: `${rdv.clientName} - ${rdv.guests || 1} pers.`,
      type: 'reservation' as const
    }))
  }, [rdvs])

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const currentUser = await getCurrentUser()
        if (!mounted) return
        if (currentUser) {
          setUser(currentUser)
          const [r, c] = await Promise.all([
            getRDVs(currentUser.id),
            getCallLogs(currentUser.id),
          ])
          if (!mounted) return
          setRdvs(r)
          setCalls(c)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Top section skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-[280px] w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[130px] w-full rounded-2xl" />
            <Skeleton className="h-[130px] w-full rounded-2xl" />
          </div>
        </div>
        {/* Agenda skeleton */}
        <Skeleton className="h-[200px] w-full rounded-2xl" />
      </div>
    )
  }

  if (!user) return null

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Section: Live Feed + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Feed - Takes 2 columns */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <LiveFeed hasIncomingCall={false} />
        </motion.div>

        {/* Right Column: Stats + Actions */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <StatsToday 
            callsCount={stats.todayCallsCount} 
            trend="up" 
            trendValue="+12%"
          />
          <ActionsRequises 
            actions={actions}
            onActionClick={(action) => console.log('Action clicked:', action)}
          />
        </motion.div>
      </div>

      {/* Weekly Agenda */}
      <motion.div variants={itemVariants}>
        <WeeklyAgenda 
          events={agendaEvents}
          onDayClick={(date) => console.log('Day clicked:', date)}
          onEventClick={(event) => console.log('Event clicked:', event)}
        />
      </motion.div>
    </motion.div>
  )
}

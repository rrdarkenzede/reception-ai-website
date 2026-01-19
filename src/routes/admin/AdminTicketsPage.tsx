import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
    Ticket, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    User,
    Building2,
    MessageSquare,
    RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface SupportTicket {
    id: string
    profile_id: string | null
    restaurant_id: string | null
    guest_name: string | null
    guest_email: string | null
    guest_phone: string | null
    category: string
    subject: string
    message: string
    status: string
    priority: string
    created_at: string
    // Joined data
    profiles?: { company_name: string; email: string } | null
    restaurants?: { name: string } | null
}

const categoryLabels: Record<string, string> = {
    menu_change: "📋 Menu",
    bug: "🐛 Bug",
    feature: "✨ Feature",
    billing: "💳 Facturation",
    other: "❓ Autre"
}

const priorityColors: Record<string, string> = {
    low: "bg-gray-500/20 text-gray-400",
    normal: "bg-blue-500/20 text-blue-400",
    high: "bg-orange-500/20 text-orange-400",
    urgent: "bg-red-500/20 text-red-400"
}

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const loadTickets = async () => {
        try {
            const { data, error } = await supabase
                .from('support_tickets')
                .select(`
                    *,
                    profiles:profile_id(company_name, email),
                    restaurants:restaurant_id(name)
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setTickets(data || [])
        } catch (error) {
            console.error('Error loading tickets:', error)
            toast.error('Erreur de chargement des tickets')
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        loadTickets()
    }, [])

    const handleRefresh = () => {
        setRefreshing(true)
        loadTickets()
    }

    const handleToggleStatus = async (ticket: SupportTicket) => {
        const newStatus = ticket.status === 'open' ? 'resolved' : 'open'
        
        // Optimistic update
        setTickets(prev => prev.map(t => 
            t.id === ticket.id ? { ...t, status: newStatus } : t
        ))

        try {
            const { error } = await supabase
                .from('support_tickets')
                .update({ 
                    status: newStatus, 
                    resolved_at: newStatus === 'resolved' ? new Date().toISOString() : null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', ticket.id)

            if (error) throw error
            toast.success(newStatus === 'resolved' ? 'Ticket résolu !' : 'Ticket rouvert')
        } catch (error) {
            console.error('Error updating ticket:', error)
            toast.error('Erreur de mise à jour')
            // Rollback
            setTickets(prev => prev.map(t => 
                t.id === ticket.id ? { ...t, status: ticket.status } : t
            ))
        }
    }

    const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress')
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed')

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-64" />
                <div className="space-y-4">
                    {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center border border-purple-500/20">
                            <Ticket className="w-5 h-5 text-purple-400" />
                        </div>
                        Tickets Support
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {openTickets.length} ticket(s) en attente • {resolvedTickets.length} résolu(s)
                    </p>
                </div>

                <Button 
                    variant="outline" 
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Actualiser
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="glass-card border-border/30">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">{openTickets.length}</div>
                            <div className="text-xs text-muted-foreground">En attente</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-border/30">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">{resolvedTickets.length}</div>
                            <div className="text-xs text-muted-foreground">Résolus</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-border/30">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">
                                {tickets.filter(t => t.profile_id).length}
                            </div>
                            <div className="text-xs text-muted-foreground">Clients</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card border-border/30">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">
                                {tickets.filter(t => !t.profile_id).length}
                            </div>
                            <div className="text-xs text-muted-foreground">Visiteurs</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Open Tickets */}
            {openTickets.length > 0 && (
                <Card className="glass-card border-border/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-400" />
                            Tickets Ouverts ({openTickets.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {openTickets.map(ticket => (
                            <TicketRow 
                                key={ticket.id} 
                                ticket={ticket} 
                                onToggle={() => handleToggleStatus(ticket)}
                            />
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Resolved Tickets */}
            {resolvedTickets.length > 0 && (
                <Card className="glass-card border-border/30 opacity-70">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            Tickets Résolus ({resolvedTickets.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {resolvedTickets.slice(0, 5).map(ticket => (
                            <TicketRow 
                                key={ticket.id} 
                                ticket={ticket} 
                                onToggle={() => handleToggleStatus(ticket)}
                            />
                        ))}
                        {resolvedTickets.length > 5 && (
                            <p className="text-sm text-muted-foreground text-center py-2">
                                + {resolvedTickets.length - 5} autres tickets résolus
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {tickets.length === 0 && (
                <div className="text-center py-16 glass-card rounded-xl">
                    <Ticket className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Aucun ticket</h3>
                    <p className="text-muted-foreground">Les demandes de support apparaîtront ici.</p>
                </div>
            )}
        </div>
    )
}

function TicketRow({ ticket, onToggle }: { ticket: SupportTicket; onToggle: () => void }) {
    const isResolved = ticket.status === 'resolved' || ticket.status === 'closed'
    const userName = ticket.profiles?.company_name || ticket.guest_name || 'Visiteur'
    const userEmail = ticket.profiles?.email || ticket.guest_email || '-'

    return (
        <div className={`p-4 rounded-lg border border-white/5 bg-white/2 hover:bg-white/5 transition-colors ${isResolved ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className="pt-1">
                    <Checkbox 
                        checked={isResolved}
                        onCheckedChange={onToggle}
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge className={priorityColors[ticket.priority] || priorityColors.normal}>
                            {ticket.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {categoryLabels[ticket.category] || ticket.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            {format(new Date(ticket.created_at), "dd MMM à HH:mm", { locale: fr })}
                        </span>
                    </div>

                    <h4 className={`font-medium text-foreground mb-1 ${isResolved ? 'line-through opacity-70' : ''}`}>
                        {ticket.subject}
                    </h4>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {ticket.message}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            {ticket.profile_id ? (
                                <Building2 className="w-3 h-3" />
                            ) : (
                                <User className="w-3 h-3" />
                            )}
                            {userName}
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {userEmail}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

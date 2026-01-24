import { useMemo, useState, useEffect } from "react"
import { getCurrentUser, getCallLogs } from "@/lib/store"
import type { CallLog, User } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Phone, Search, PhoneMissed, CheckCircle2, PhoneOff, CalendarPlus } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

export default function CallsPage() {
    const [calls, setCalls] = useState<CallLog[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [page, setPage] = useState(1)
    const pageSize = 10

    // Modal State
    const [showNewModal, setShowNewModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        clientName: '',
        phone: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '12:00',
        guests: 2,
        notes: ''
    })

    useEffect(() => {
        let mounted = true

        async function load() {
            try {
                const u = await getCurrentUser()
                if (!mounted) return
                setUser(u)
                if (u) {
                    const data = await getCallLogs(u.id)
                    if (!mounted) return
                    setCalls(data)
                } else {
                    setCalls([])
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

    const filteredCalls = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()

        return calls
            .filter((call) => {
                const name = (call.clientName || call.phone || "").toLowerCase()
                const matchesSearch = q.length === 0 || name.includes(q)
                const matchesStatus = statusFilter === "all" || call.status === statusFilter
                return matchesSearch && matchesStatus
            })
            .sort((a, b) => {
                const bt = new Date(b.timestamp).getTime()
                const at = new Date(a.timestamp).getTime()
                if (Number.isNaN(bt) && Number.isNaN(at)) return 0
                if (Number.isNaN(bt)) return 1
                if (Number.isNaN(at)) return -1
                return bt - at
            })
    }, [calls, searchQuery, statusFilter])

    const pageCount = Math.max(1, Math.ceil(filteredCalls.length / pageSize))

    const pagedCalls = useMemo(() => {
        const safePage = Math.min(Math.max(page, 1), pageCount)
        const start = (safePage - 1) * pageSize
        return filteredCalls.slice(start, start + pageSize)
    }, [filteredCalls, page, pageCount])

    useEffect(() => {
        setPage(1)
    }, [searchQuery, statusFilter])

    const formatTimestamp = (timestamp: string) => {
        const dt = new Date(timestamp)
        if (Number.isNaN(dt.getTime())) return "-"
        return format(dt, "dd MMM, HH:mm", { locale: fr })
    }

    const getStatusIcon = (status: CallLog["status"]) => {
        if (status === "missed") return <PhoneMissed className="h-4 w-4 text-red-400" />
        if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-green-400" />
        return <div className="h-4 w-4 rounded-full border border-white/10 bg-white/3" />
    }

    const getStatusLabel = (status: CallLog["status"]) => {
        if (status === "missed") return "Abandon" // Renamed from Manqué
        if (status === "completed") return "Réservé"
        return status || "-"
    }

    const handlePhoneClick = (phone: string) => {
        if (!phone) return
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            window.location.href = `tel:${phone}`
        } else {
            navigator.clipboard.writeText(phone)
            toast.info("Numéro copié !")
        }
    }

    const handleCreateBooking = (call: CallLog) => {
        setFormData({
            clientName: call.clientName || '',
            phone: call.phone || '',
            date: format(new Date(), 'yyyy-MM-dd'),
            time: '12:00',
            guests: 2,
            notes: `Réservation suite à l'appel de ${format(new Date(call.timestamp), 'HH:mm')}`
        })
        setShowNewModal(true)
    }

    const handleSaveBooking = async () => {
        if (!user?.restaurantId) return
        setIsSubmitting(true)

        try {
            const { error } = await supabase
                .from('bookings')
                .insert({
                    restaurant_id: user.restaurantId,
                    client_name: formData.clientName,
                    booking_date: formData.date,
                    booking_time: formData.time,
                    guests: formData.guests,
                    phone: formData.phone,
                    notes: formData.notes,
                    status: 'confirmed'
                })

            if (error) throw error
            
            toast.success("Réservation ajoutée")
            setShowNewModal(false)
        } catch (e) {
            console.error(e)
            toast.error("Erreur lors de la création")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Stats
    const totalCalls = calls.length
    const completedCalls = calls.filter((c) => c.status === "completed").length
    const missedCalls = calls.filter((c) => c.status === "missed").length

    const isEmpty = !loading && calls.length === 0

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Phone className="w-6 h-6" />
                    Journal d'appels
                </h1>
                <p className="text-muted-foreground mt-1">{calls.length} appels enregistrés</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loading ? (
                    <>
                        <div className="glass-card rounded-xl p-4 border-border/30"><Skeleton className="h-4 w-24" /><Skeleton className="mt-3 h-7 w-16" /></div>
                        <div className="glass-card rounded-xl p-4 border-border/30"><Skeleton className="h-4 w-24" /><Skeleton className="mt-3 h-7 w-16" /></div>
                        <div className="glass-card rounded-xl p-4 border-border/30"><Skeleton className="h-4 w-24" /><Skeleton className="mt-3 h-7 w-16" /></div>
                    </>
                ) : (
                    <>
                        <div className="glass-card rounded-xl p-4 border-border/30">
                            <div className="text-sm text-muted-foreground">Total appels</div>
                            <div className="text-2xl font-bold text-foreground mt-1">{totalCalls}</div>
                        </div>
                        <div className="glass-card rounded-xl p-4 border-border/30">
                            <div className="text-sm text-muted-foreground">Réservés</div>
                            <div className="text-2xl font-bold text-green-500 mt-1">{completedCalls}</div>
                        </div>
                        <div className="glass-card rounded-xl p-4 border-border/30">
                            <div className="text-sm text-muted-foreground">Abandons</div>
                            <div className="text-2xl font-bold text-red-500 mt-1">{missedCalls}</div>
                        </div>
                    </>
                )}
            </div>

            {isEmpty ? (
                <div className="glass-strong rounded-2xl border-border/30 p-10 text-center">
                    <PhoneOff className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4 text-lg font-semibold text-foreground">Aucun appel pour le moment</div>
                    <div className="mt-1 text-sm text-muted-foreground">Le journal d'appels apparaîtra ici dès que le système commencera à recevoir des appels.</div>
                </div>
            ) : null}

            {/* Filters */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        className="pl-10"
                        placeholder="Rechercher par nom ou téléphone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="completed">Réservé</SelectItem>
                        <SelectItem value="missed">Abandon</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table - Clean list: Caller, Time, Status */}
            <div className="glass-card rounded-xl border-border/30 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Appelant</TableHead>
                            <TableHead>Téléphone</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <>
                                {Array.from({ length: 6 }).map((_, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ) : pagedCalls.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    Aucun appel trouvé
                                </TableCell>
                            </TableRow>
                        ) : (
                            pagedCalls.map((call) => (
                                <TableRow key={call.id}>
                                    <TableCell>
                                        <div className="font-medium text-foreground">
                                            {call.clientName || "Inconnu"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="ghost" 
                                            className="p-0 h-auto font-normal text-muted-foreground hover:text-cyan-400"
                                            onClick={() => handlePhoneClick(call.phone)}
                                        >
                                            {call.phone || "-"}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-foreground">{formatTimestamp(call.timestamp)}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(call.status)}
                                            <Badge 
                                                variant="outline" 
                                                className={call.status === "completed" 
                                                    ? "bg-green-500/10 text-green-400 border-green-500/30" 
                                                    : call.status === "missed"
                                                    ? "bg-red-500/10 text-red-400 border-red-500/30"
                                                    : ""
                                                }
                                            >
                                                {getStatusLabel(call.status)}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            className="h-8 w-8 p-0"
                                            onClick={() => handleCreateBooking(call)}
                                            title="Créer une réservation"
                                        >
                                            <CalendarPlus className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                    Page {page} / {pageCount} • {filteredCalls.length} résultats
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                        Préc.
                    </Button>
                    <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>
                        Suiv.
                    </Button>
                </div>
            </div>

            {/* Modal de Réservation */}
            <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Créer une Réservation</DialogTitle>
                        <DialogDescription>
                            Suite à l'appel de {formData.clientName || 'Client inconnu'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input 
                                    type="date"
                                    value={formData.date} 
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Heure</Label>
                                <Input 
                                    type="time" 
                                    value={formData.time} 
                                    onChange={(e) => setFormData({...formData, time: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nom du client</Label>
                                <Input 
                                    value={formData.clientName} 
                                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Téléphone</Label>
                                <Input 
                                    value={formData.phone} 
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Couverts</Label>
                            <Input 
                                type="number" 
                                min={1} 
                                value={formData.guests} 
                                onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea 
                                value={formData.notes} 
                                onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewModal(false)}>Annuler</Button>
                        <Button onClick={handleSaveBooking} disabled={isSubmitting}>Enregistrer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

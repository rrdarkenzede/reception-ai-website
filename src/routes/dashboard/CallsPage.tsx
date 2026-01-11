import { useState, useEffect } from "react"
import { getCurrentUser, getCallLogs } from "@/lib/store"
import type { CallLog } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Phone, Search, Clock, PhoneIncoming, PhoneOutgoing, PhoneMissed, User } from "lucide-react"

export default function CallsPage() {
    const [calls, setCalls] = useState<CallLog[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [typeFilter, setTypeFilter] = useState<string>("all")

    useEffect(() => {
        loadCalls()
    }, [])

    const loadCalls = () => {
        const user = getCurrentUser()
        if (user) {
            setCalls(getCallLogs(user.id))
        }
    }

    const filteredCalls = calls
        .filter((call) => {
            const matchesSearch =
                call.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                call.phone.includes(searchQuery)
            const matchesStatus = statusFilter === "all" || call.status === statusFilter
            const matchesType = typeFilter === "all" || call.type === typeFilter
            return matchesSearch && matchesStatus && matchesType
        })
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Terminé</Badge>
            case "missed":
                return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Manqué</Badge>
            case "in_progress":
                return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">En cours</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "incoming":
                return <PhoneIncoming className="w-4 h-4 text-green-500" />
            case "outgoing":
                return <PhoneOutgoing className="w-4 h-4 text-blue-500" />
            default:
                return <PhoneMissed className="w-4 h-4 text-red-500" />
        }
    }

    const formatDuration = (seconds?: number) => {
        if (!seconds) return "-"
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp)
        return {
            date: date.toLocaleDateString("fr-FR"),
            time: date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        }
    }

    // Stats
    const totalCalls = calls.length
    const completedCalls = calls.filter((c) => c.status === "completed").length
    const missedCalls = calls.filter((c) => c.status === "missed").length
    const avgDuration = calls.filter((c) => c.duration).reduce((acc, c) => acc + (c.duration || 0), 0) / (completedCalls || 1)

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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card rounded-xl p-4 border-border/30">
                    <div className="text-sm text-muted-foreground">Total appels</div>
                    <div className="text-2xl font-bold text-foreground mt-1">{totalCalls}</div>
                </div>
                <div className="glass-card rounded-xl p-4 border-border/30">
                    <div className="text-sm text-muted-foreground">Terminés</div>
                    <div className="text-2xl font-bold text-green-500 mt-1">{completedCalls}</div>
                </div>
                <div className="glass-card rounded-xl p-4 border-border/30">
                    <div className="text-sm text-muted-foreground">Manqués</div>
                    <div className="text-2xl font-bold text-red-500 mt-1">{missedCalls}</div>
                </div>
                <div className="glass-card rounded-xl p-4 border-border/30">
                    <div className="text-sm text-muted-foreground">Durée moyenne</div>
                    <div className="text-2xl font-bold text-foreground mt-1">{formatDuration(Math.round(avgDuration))}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        className="pl-10"
                        placeholder="Rechercher..."
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
                        <SelectItem value="completed">Terminé</SelectItem>
                        <SelectItem value="missed">Manqué</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-36">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="incoming">Entrant</SelectItem>
                        <SelectItem value="outgoing">Sortant</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="glass-card rounded-xl border-border/30 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Date & Heure</TableHead>
                            <TableHead>Durée</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Résumé</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCalls.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Aucun appel trouvé
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCalls.map((call) => {
                                const { date, time } = formatTimestamp(call.timestamp)
                                return (
                                    <TableRow key={call.id}>
                                        <TableCell>{getTypeIcon(call.type)}</TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium text-foreground flex items-center gap-1">
                                                    <User className="w-3 h-3 text-muted-foreground" />
                                                    {call.clientName || "Inconnu"}
                                                </div>
                                                <div className="text-sm text-muted-foreground">{call.phone}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-foreground">{date}</div>
                                            <div className="text-sm text-muted-foreground">{time}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-muted-foreground" />
                                                {formatDuration(call.duration)}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(call.status)}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                                            {call.summary || "-"}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

import { useMemo, useState, useEffect } from "react"
import { getCurrentUser, getCallLogs } from "@/lib/store"
import type { CallLog, User } from "@/lib/types"
import { useBusinessConfig } from "@/hooks/useBusinessConfig"
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
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Phone, Search, PhoneMissed, CheckCircle2, Play, PhoneOff } from "lucide-react"

export default function CallsPage() {
    const [calls, setCalls] = useState<CallLog[]>([])
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [page, setPage] = useState(1)
    const pageSize = 10

    const [audioOpen, setAudioOpen] = useState(false)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [audioTitle, setAudioTitle] = useState<string>("Recording")

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

    const { formatMetadata } = useBusinessConfig(user?.sector || "restaurant")

    const filteredCalls = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()

        return calls
            .filter((call) => {
                const transcript = (call.transcript || call.summary || "").toLowerCase()
                const matchesSearch = q.length === 0 || transcript.includes(q)
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

    const formatDuration = (seconds?: number) => {
        if (!seconds) return "-"
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

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

    const getSentimentDot = (sentiment?: string) => {
        const s = String(sentiment || "neutral").toLowerCase()
        const color =
            s === "positive" ? "bg-green-400" :
            s === "urgent" || s === "negative" ? "bg-red-400" :
            "bg-slate-400"
        return <span className={`inline-flex h-2 w-2 rounded-full ${color}`} />
    }

    // Stats
    const totalCalls = calls.length
    const completedCalls = calls.filter((c) => c.status === "completed").length
    const missedCalls = calls.filter((c) => c.status === "missed").length
    const avgDuration = calls.filter((c) => c.duration).reduce((acc, c) => acc + (c.duration || 0), 0) / (completedCalls || 1)

    const isEmpty = !loading && calls.length === 0
    const isEmptyFiltered = !loading && calls.length > 0 && filteredCalls.length === 0

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
                {loading ? (
                    <>
                        <div className="glass-card rounded-xl p-4 border-border/30"><Skeleton className="h-4 w-24" /><Skeleton className="mt-3 h-7 w-16" /></div>
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
                            <div className="text-sm text-muted-foreground">Terminés</div>
                            <div className="text-2xl font-bold text-green-500 mt-1">{completedCalls}</div>
                        </div>
                        <div className="glass-card rounded-xl p-4 border-border/30">
                            <div className="text-sm text-muted-foreground">Manqués</div>
                            <div className="text-2xl font-bold text-red-500 mt-1">{missedCalls}</div>
                        </div>
                        <div className="glass-card rounded-xl p-4 border-border/30">
                            <div className="text-sm text-muted-foreground">Durée moy.</div>
                            <div className="text-2xl font-bold text-foreground mt-1">{formatDuration(Math.round(avgDuration))}</div>
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
                        <SelectItem value="in_progress">En cours</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="glass-card rounded-xl border-border/30 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Détails</TableHead>
                            <TableHead>Sentiment</TableHead>
                            <TableHead>Enreg.</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <>
                                {Array.from({ length: 6 }).map((_, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /><Skeleton className="mt-2 h-3 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-44" /><Skeleton className="mt-2 h-3 w-36" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                                    </TableRow>
                                ))}
                            </>
                        ) : pagedCalls.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    {isEmptyFiltered ? "Aucun appel trouvé" : "Aucun appel trouvé"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            pagedCalls.map((call) => {
                                const meta = (call.metadata || {}) as Record<string, unknown>
                                const formatted = formatMetadata(meta)
                                const dt = formatTimestamp(call.timestamp)

                                const badge = formatted.badge
                                const alert = formatted.alert
                                const recordingAvailable = Boolean(call.recordingUrl)

                                return (
                                    <TableRow key={call.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(call.status)}
                                                <span className="text-xs text-muted-foreground">{call.status}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-foreground font-medium">{dt}</div>
                                            <div className="text-xs text-muted-foreground">{formatDuration(call.duration)}</div>
                                        </TableCell>
                                        <TableCell className="min-w-[220px]">
                                            <div className="flex items-center gap-2">
                                                <div className="min-w-0">
                                                    <div className="truncate font-medium text-foreground">{formatted.title}</div>
                                                    <div className="truncate text-xs text-muted-foreground">
                                                        {call.clientName} • {call.phone}
                                                    </div>
                                                </div>
                                                {badge ? (
                                                    <Badge className="ml-auto bg-white/3 text-foreground border-white/10">
                                                        {badge}
                                                    </Badge>
                                                ) : null}
                                                {alert ? (
                                                    <Badge className="ml-2 bg-red-950/20 text-red-200 border-red-500/30">
                                                        {alert}
                                                    </Badge>
                                                ) : null}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getSentimentDot(call.sentiment)}
                                                <span className="text-xs text-muted-foreground">{call.sentiment || "neutral"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={!recordingAvailable}
                                                onClick={() => {
                                                    if (!call.recordingUrl) return
                                                    setAudioUrl(call.recordingUrl)
                                                    setAudioTitle(formatted.title)
                                                    setAudioOpen(true)
                                                }}
                                                className="gap-2"
                                            >
                                                <Play className="h-4 w-4" />
                                                Écouter
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
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

            <Dialog open={audioOpen} onOpenChange={setAudioOpen}>
                <DialogContent className="glass-strong border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-foreground">{audioTitle}</DialogTitle>
                    </DialogHeader>
                    {audioUrl ? (
                        <audio controls autoPlay className="w-full">
                            <source src={audioUrl} />
                        </audio>
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    )
}

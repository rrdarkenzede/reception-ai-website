import { useState, useEffect } from "react"
import { getCurrentUser, getRDVs, updateRDV, deleteRDV, addRDV } from "@/lib/store"
import type { RDV } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Pencil, Trash2, Search, Phone, Users, Clock } from "lucide-react"
import { toast } from "sonner"

export default function ReservationsPage() {
    const [rdvs, setRdvs] = useState<RDV[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingRdv, setEditingRdv] = useState<RDV | null>(null)

    // Form state
    const [formClientName, setFormClientName] = useState("")
    const [formPhone, setFormPhone] = useState("")
    const [formDate, setFormDate] = useState("")
    const [formTime, setFormTime] = useState("")
    const [formGuests, setFormGuests] = useState("2")
    const [formNotes, setFormNotes] = useState("")
    const [formStatus, setFormStatus] = useState<string>("pending")

    useEffect(() => {
        loadRdvs()
    }, [])

    const loadRdvs = () => {
        const user = getCurrentUser()
        if (user) {
            setRdvs(getRDVs(user.id))
        }
    }

    const resetForm = () => {
        setFormClientName("")
        setFormPhone("")
        setFormDate("")
        setFormTime("")
        setFormGuests("2")
        setFormNotes("")
        setFormStatus("pending")
    }

    const handleCreate = () => {
        if (!formClientName || !formPhone || !formDate || !formTime) {
            toast.error("Veuillez remplir tous les champs obligatoires")
            return
        }

        const user = getCurrentUser()
        if (!user) return

        addRDV({
            userId: user.id,
            clientName: formClientName,
            phone: formPhone,
            date: formDate,
            time: formTime,
            guests: parseInt(formGuests),
            notes: formNotes,
            status: formStatus as any,
        })

        toast.success("Réservation créée avec succès")
        setIsCreateOpen(false)
        resetForm()
        loadRdvs()
    }

    const handleEdit = (rdv: RDV) => {
        setEditingRdv(rdv)
        setFormClientName(rdv.clientName)
        setFormPhone(rdv.phone || "")
        setFormDate(rdv.date)
        setFormTime(rdv.time)
        setFormGuests(String(rdv.guests || 2))
        setFormNotes(rdv.notes || "")
        setFormStatus(rdv.status)
    }

    const handleUpdate = () => {
        if (!editingRdv) return

        updateRDV(editingRdv.id, {
            clientName: formClientName,
            phone: formPhone,
            date: formDate,
            time: formTime,
            guests: parseInt(formGuests),
            notes: formNotes,
            status: formStatus as any,
        })

        toast.success("Réservation mise à jour")
        setEditingRdv(null)
        resetForm()
        loadRdvs()
    }

    const handleDelete = (rdv: RDV) => {
        if (confirm(`Supprimer la réservation de "${rdv.clientName}" ?`)) {
            deleteRDV(rdv.id)
            toast.success("Réservation supprimée")
            loadRdvs()
        }
    }

    const filteredRdvs = rdvs
        .filter((rdv) => {
            const matchesSearch =
                rdv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (rdv.phone || "").includes(searchQuery)
            const matchesStatus = statusFilter === "all" || rdv.status === statusFilter
            return matchesSearch && matchesStatus
        })
        .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`)
            const dateB = new Date(`${b.date}T${b.time}`)
            return dateB.getTime() - dateA.getTime()
        })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Confirmé</Badge>
            case "pending":
                return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">En attente</Badge>
            case "completed":
                return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30">Terminé</Badge>
            case "cancelled":
                return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Annulé</Badge>
            case "in_progress":
                return <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/30">En cours</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const RdvForm = ({ isEdit = false }: { isEdit?: boolean }) => (
        <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Nom du client *</Label>
                    <Input value={formClientName} onChange={(e) => setFormClientName(e.target.value)} placeholder="Marie Martin" />
                </div>
                <div className="space-y-2">
                    <Label>Téléphone *</Label>
                    <Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="+33612345678" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Heure *</Label>
                    <Input type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Personnes</Label>
                    <Input type="number" min="1" value={formGuests} onChange={(e) => setFormGuests(e.target.value)} />
                </div>
            </div>
            {isEdit && (
                <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select value={formStatus} onValueChange={setFormStatus}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="confirmed">Confirmé</SelectItem>
                            <SelectItem value="completed">Terminé</SelectItem>
                            <SelectItem value="cancelled">Annulé</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
            <div className="space-y-2">
                <Label>Notes</Label>
                <Input value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="Anniversaire, allergies, etc." />
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        Réservations
                    </h1>
                    <p className="text-muted-foreground mt-1">{rdvs.length} réservations au total</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nouvelle Réservation
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nouvelle réservation</DialogTitle>
                            <DialogDescription>Créez une réservation manuellement.</DialogDescription>
                        </DialogHeader>
                        <RdvForm />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Annuler</Button>
                            <Button onClick={handleCreate}>Créer</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="confirmed">Confirmé</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                        <SelectItem value="cancelled">Annulé</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="glass-card rounded-xl border-border/30 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Date & Heure</TableHead>
                            <TableHead>Personnes</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRdvs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Aucune réservation trouvée
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRdvs.map((rdv) => (
                                <TableRow key={rdv.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium text-foreground">{rdv.clientName}</div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                {rdv.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <span>{new Date(rdv.date).toLocaleDateString("fr-FR")}</span>
                                            <Clock className="w-4 h-4 text-muted-foreground ml-2" />
                                            <span>{rdv.time}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4 text-muted-foreground" />
                                            {rdv.guests || 1}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(rdv.status)}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate">
                                        {rdv.notes || "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Dialog open={editingRdv?.id === rdv.id} onOpenChange={(open) => !open && setEditingRdv(null)}>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(rdv)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Modifier la réservation</DialogTitle>
                                                    </DialogHeader>
                                                    <RdvForm isEdit />
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setEditingRdv(null)}>Annuler</Button>
                                                        <Button onClick={handleUpdate}>Enregistrer</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(rdv)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

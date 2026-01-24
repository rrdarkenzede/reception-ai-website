import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Search, Building2, Ghost, Trash2, Plus, Loader2, Check, X } from "lucide-react"
import { 
    getAllRestaurants, 
    updateRestaurantStatus, 
    updateRestaurantTier,
    updateRetellAgentId,
    deleteRestaurant,
    createRestaurantWithOwner
} from "@/lib/store"
import { toast } from "sonner"

interface RestaurantData {
    id: string
    name: string
    subscription_tier: string
    retell_agent_id: string | null
    created_at: string
    is_active: boolean
    profiles: { id: string, email: string, role: string }[] | null
}

const PLAN_OPTIONS = [
    { value: "free", label: "Free", color: "text-muted-foreground" },
    { value: "starter", label: "Starter", color: "text-blue-500" },
    { value: "pro", label: "Pro", color: "text-purple-500" },
    { value: "enterprise", label: "Enterprise", color: "text-yellow-500" },
]

export default function AdminClientsPage() {
    const [restaurants, setRestaurants] = useState<RestaurantData[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)
    
    // New Restaurant Modal
    const [showNewModal, setShowNewModal] = useState(false)
    const [newEmail, setNewEmail] = useState("")
    const [newName, setNewName] = useState("")
    const [newPlan, setNewPlan] = useState("starter")
    const [creating, setCreating] = useState(false)
    
    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState<RestaurantData | null>(null)
    const [deleteConfirmText, setDeleteConfirmText] = useState("")
    const [deleting, setDeleting] = useState(false)
    
    // Inline editing state
    const [editingAgentId, setEditingAgentId] = useState<string | null>(null)
    const [agentIdValues, setAgentIdValues] = useState<Record<string, string>>({})
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

    useEffect(() => {
        loadRestaurants()
    }, [])

    const loadRestaurants = async () => {
        setLoading(true)
        const data = await getAllRestaurants()
        // @ts-ignore - data includes retell_agent_id from query
        setRestaurants(data || [])
        
        // Initialize agent ID values
        const idMap: Record<string, string> = {}
        data?.forEach((r: RestaurantData) => {
            idMap[r.id] = r.retell_agent_id || ""
        })
        setAgentIdValues(idMap)
        setLoading(false)
    }

    // --- Status Toggle ---
    const toggleStatus = async (r: RestaurantData) => {
        const newStatus = !r.is_active
        const err = await updateRestaurantStatus(r.id, newStatus)
        if (err) toast.error("Erreur mise à jour statut")
        else {
            toast.success(`Restaurant ${newStatus ? 'activé' : 'suspendu'}`)
            loadRestaurants()
        }
    }

    // --- Plan Change ---
    const handlePlanChange = async (r: RestaurantData, newTier: string) => {
        const err = await updateRestaurantTier(r.id, newTier)
        if (err) toast.error("Erreur mise à jour plan")
        else {
            toast.success(`Plan mis à jour: ${newTier}`)
            loadRestaurants()
        }
    }

    // --- Agent ID Inline Edit ---
    const handleAgentIdBlur = async (r: RestaurantData) => {
        const newValue = agentIdValues[r.id]?.trim() || null
        const oldValue = r.retell_agent_id || null
        
        if (newValue === oldValue) {
            setEditingAgentId(null)
            return
        }
        
        const err = await updateRetellAgentId(r.id, newValue)
        if (err) {
            toast.error("Erreur sauvegarde Agent ID")
            // Reset to old value
            setAgentIdValues(prev => ({ ...prev, [r.id]: r.retell_agent_id || "" }))
        } else {
            toast.success("Agent ID sauvegardé")
        }
        setEditingAgentId(null)
        loadRestaurants()
    }

    // --- Ghost Login ---
    const handleGhostLogin = (r: RestaurantData) => {
        const owner = r.profiles?.find(p => p.role === 'owner') || r.profiles?.[0]
        if (owner?.id) {
            localStorage.setItem("ghost_mode_ctx", JSON.stringify({ restaurantId: r.id, userId: owner.id }))
            window.location.href = "/dashboard"
        } else {
            toast.error("Impossible d'impersonnifier: Utilisateur introuvable")
        }
    }

    // --- Delete Restaurant ---
    const handleDelete = async () => {
        if (!deleteTarget || deleteConfirmText !== "DELETE") return
        
        setDeleting(true)
        const err = await deleteRestaurant(deleteTarget.id)
        setDeleting(false)
        
        if (err) {
            toast.error(`Erreur suppression: ${err.message}`)
        } else {
            toast.success(`Restaurant "${deleteTarget.name}" supprimé définitivement`)
            setDeleteTarget(null)
            setDeleteConfirmText("")
            loadRestaurants()
        }
    }

    // --- Create New Restaurant ---
    const handleCreate = async () => {
        if (!newEmail || !newName) {
            toast.error("Email et nom requis")
            return
        }
        
        setCreating(true)
        const result = await createRestaurantWithOwner(newEmail, newName, newPlan)
        setCreating(false)
        
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(`Restaurant créé! Invitation envoyée à ${newEmail}`)
            setShowNewModal(false)
            setNewEmail("")
            setNewName("")
            setNewPlan("starter")
            loadRestaurants()
        }
    }

    const filtered = restaurants.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.profiles?.some(p => p.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        r.retell_agent_id?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Building2 className="w-6 h-6" />
                        Gestion des Tenants
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {restaurants.length} restaurants • {restaurants.filter(r => r.is_active).length} actifs
                    </p>
                </div>
                
                {/* New Restaurant Button */}
                <Dialog open={showNewModal} onOpenChange={setShowNewModal}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nouveau Restaurant
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer un nouveau restaurant</DialogTitle>
                            <DialogDescription>
                                Un email d'invitation sera envoyé au propriétaire.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="owner-email">Email du propriétaire</Label>
                                <Input 
                                    id="owner-email"
                                    type="email"
                                    placeholder="owner@restaurant.com"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="restaurant-name">Nom du restaurant</Label>
                                <Input 
                                    id="restaurant-name"
                                    placeholder="Chez Luigi"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan">Plan initial</Label>
                                <Select value={newPlan} onValueChange={setNewPlan}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PLAN_OPTIONS.map(p => (
                                            <SelectItem key={p.value} value={p.value}>
                                                {p.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowNewModal(false)}>
                                Annuler
                            </Button>
                            <Button onClick={handleCreate} disabled={creating}>
                                {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Créer & Inviter
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    className="pl-10 max-w-md"
                    placeholder="Rechercher par nom, email ou Agent ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="glass-card rounded-xl border-border/30 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30">
                            <TableHead>Restaurant</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>Retell Agent ID</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Aucun résultat
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map(r => {
                                const owner = r.profiles?.find(p => p.role === 'owner') || r.profiles?.[0]
                                const planOption = PLAN_OPTIONS.find(p => p.value === r.subscription_tier)
                                
                                return (
                                    <TableRow key={r.id} className={!r.is_active ? "opacity-50" : ""}>
                                        {/* Restaurant Name */}
                                        <TableCell className="font-medium">
                                            <div>{r.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(r.created_at).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        
                                        {/* Owner Email */}
                                        <TableCell className="text-sm">
                                            {owner?.email || <span className="text-muted-foreground">Aucun</span>}
                                        </TableCell>
                                        
                                        {/* Agent ID - Inline Edit */}
                                        <TableCell>
                                            <div className="flex items-center gap-1 max-w-[180px]">
                                                <Input
                                                    ref={el => inputRefs.current[r.id] = el}
                                                    className="h-8 text-xs font-mono"
                                                    placeholder="agent_xxx..."
                                                    value={agentIdValues[r.id] || ""}
                                                    onChange={(e) => setAgentIdValues(prev => ({ 
                                                        ...prev, 
                                                        [r.id]: e.target.value 
                                                    }))}
                                                    onFocus={() => setEditingAgentId(r.id)}
                                                    onBlur={() => handleAgentIdBlur(r)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            inputRefs.current[r.id]?.blur()
                                                        }
                                                        if (e.key === "Escape") {
                                                            setAgentIdValues(prev => ({ 
                                                                ...prev, 
                                                                [r.id]: r.retell_agent_id || "" 
                                                            }))
                                                            setEditingAgentId(null)
                                                        }
                                                    }}
                                                />
                                                {editingAgentId === r.id && (
                                                    <div className="flex gap-0.5">
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost" 
                                                            className="h-6 w-6"
                                                            onClick={() => inputRefs.current[r.id]?.blur()}
                                                        >
                                                            <Check className="w-3 h-3 text-green-500" />
                                                        </Button>
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost" 
                                                            className="h-6 w-6"
                                                            onClick={() => {
                                                                setAgentIdValues(prev => ({ 
                                                                    ...prev, 
                                                                    [r.id]: r.retell_agent_id || "" 
                                                                }))
                                                                setEditingAgentId(null)
                                                            }}
                                                        >
                                                            <X className="w-3 h-3 text-red-500" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        
                                        {/* Plan Dropdown */}
                                        <TableCell>
                                            <Select 
                                                value={r.subscription_tier} 
                                                onValueChange={(val) => handlePlanChange(r, val)}
                                            >
                                                <SelectTrigger className={`w-[120px] h-8 ${planOption?.color}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PLAN_OPTIONS.map(p => (
                                                        <SelectItem key={p.value} value={p.value}>
                                                            <span className={p.color}>{p.label}</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        
                                        {/* Status Toggle */}
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={r.is_active}
                                                    onCheckedChange={() => toggleStatus(r)}
                                                />
                                                <Badge variant={r.is_active ? "default" : "destructive"}>
                                                    {r.is_active ? "Actif" : "Suspendu"}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        
                                        {/* Actions */}
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Ghost Login */}
                                                <Button 
                                                    size="sm" 
                                                    variant="secondary"
                                                    className="gap-1"
                                                    onClick={() => handleGhostLogin(r)}
                                                >
                                                    <Ghost className="w-3 h-3" />
                                                    Login As
                                                </Button>
                                                
                                                {/* Delete */}
                                                <AlertDialog 
                                                    open={deleteTarget?.id === r.id}
                                                    onOpenChange={(open) => {
                                                        if (!open) {
                                                            setDeleteTarget(null)
                                                            setDeleteConfirmText("")
                                                        }
                                                    }}
                                                >
                                                    <AlertDialogTrigger asChild>
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost"
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => setDeleteTarget(r)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-destructive">
                                                                ⚠️ Supprimer définitivement
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="space-y-2" asChild>
                                                                <div className="text-sm text-muted-foreground">
                                                                    <p>
                                                                        Vous êtes sur le point de supprimer <strong>{r.name}</strong>.
                                                                    </p>
                                                                    <p className="text-destructive font-medium mt-2">
                                                                        Cette action supprimera TOUTES les données associées:
                                                                    </p>
                                                                    <ul className="list-disc list-inside mt-1 ml-1">
                                                                        <li>Réservations</li>
                                                                        <li>Menu / Stock</li>
                                                                        <li>Promotions</li>
                                                                        <li>Historique des appels</li>
                                                                    </ul>
                                                                    <div className="pt-4">
                                                                        <Label>Tapez <strong>DELETE</strong> pour confirmer:</Label>
                                                                        <Input 
                                                                            className="mt-2"
                                                                            placeholder="DELETE"
                                                                            value={deleteConfirmText}
                                                                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                disabled={deleteConfirmText !== "DELETE" || deleting}
                                                                onClick={handleDelete}
                                                            >
                                                                {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                                Supprimer
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
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

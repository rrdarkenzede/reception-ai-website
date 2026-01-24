import { useState, useEffect } from "react"
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
import { Search, Building2, Ghost, Trash2, Plus, Loader2 } from "lucide-react"
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
    { value: "pro", label: "Pro", color: "text-purple-500" },
    { value: "elite", label: "Elite", color: "text-blue-500" },
    { value: "enterprise", label: "Enterprise", color: "text-yellow-500" },
]

export default function AdminClientsPage() {
    const [restaurants, setRestaurants] = useState<RestaurantData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [planFilter, setPlanFilter] = useState("all")
    
    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newRestName, setNewRestName] = useState("")
    const [newRestEmail, setNewRestEmail] = useState("")
    const [newRestPassword, setNewRestPassword] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    // Delete State
    const [deleteTarget, setDeleteTarget] = useState<RestaurantData | null>(null)
    const [deleteConfirmText, setDeleteConfirmText] = useState("")
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const data = await getAllRestaurants()
            // Map types if necessary or cast if store returns matching structure
            // Adjusting type because getAllRestaurants might return Supabase types
            // For now assuming the hook returns what we need or close to it
            setRestaurants(data as any as RestaurantData[]) 
        } catch (error) {
            console.error("Failed to load restaurants:", error)
            toast.error("Erreur lors du chargement des restaurants")
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (id: string, currentStatus: boolean) => {
        try {
            await updateRestaurantStatus(id, !currentStatus)
            setRestaurants(prev => prev.map(r => r.id === id ? { ...r, is_active: !currentStatus } : r))
            toast.success(`Restaurant ${!currentStatus ? 'activé' : 'désactivé'}`)
        } catch (e) {
            toast.error("Erreur mise à jour statut")
        }
    }

    const handleTierChange = async (id: string, newTier: string) => {
        try {
            await updateRestaurantTier(id, newTier)
            setRestaurants(prev => prev.map(r => r.id === id ? { ...r, subscription_tier: newTier } : r))
            toast.success(`Plan mis à jour vers ${newTier}`)
        } catch (e) {
            toast.error("Erreur mise à jour plan")
        }
    }

    const handleAgentIdBlur = async (id: string, currentVal: string | null, newVal: string) => {
        if (currentVal === newVal) return
        try {
            await updateRetellAgentId(id, newVal)
            setRestaurants(prev => prev.map(r => r.id === id ? { ...r, retell_agent_id: newVal } : r))
            toast.success("Agent ID mis à jour")
        } catch (e) {
            toast.error("Erreur mise à jour Agent ID")
        }
    }

    const handleCreate = async () => {
        if (!newRestName || !newRestEmail || !newRestPassword) {
            toast.error("Veuillez remplir tous les champs")
            return
        }
        setIsCreating(true)
        try {
            await createRestaurantWithOwner(newRestName, newRestEmail, newRestPassword)
            toast.success("Restaurant et compte Admin créés !")
            setShowCreateModal(false)
            setNewRestName("")
            setNewRestEmail("")
            setNewRestPassword("")
            loadData()
        } catch (e: any) {
            console.error(e)
            toast.error("Erreur création: " + (e.message || "Inconnue"))
        } finally {
            setIsCreating(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteTarget || deleteConfirmText !== "DELETE") return
        setDeleting(true)
        try {
            await deleteRestaurant(deleteTarget.id)
            toast.success("Restaurant supprimé définitivement")
            setRestaurants(prev => prev.filter(r => r.id !== deleteTarget.id))
            setDeleteTarget(null)
            setDeleteConfirmText("")
        } catch (e) {
            console.error(e)
            toast.error("Erreur lors de la suppression")
        } finally {
            setDeleting(false)
        }
    }

    const handleGhostLogin = async (restaurant: RestaurantData) => {
        // Find the owner user ID to impersonate
        const ownerProfile = restaurant.profiles?.find(p => p.role === 'owner' || p.role === 'admin') || restaurant.profiles?.[0]
        
        if (!ownerProfile) {
            toast.error("Aucun profil utilisateur trouvé pour ce restaurant")
            return
        }

        if (confirm(`Se connecter en tant que ${restaurant.name} ?`)) {
            // Set Ghost Context
            localStorage.setItem("ghost_mode_ctx", JSON.stringify({ 
                userId: ownerProfile.id,
                restaurantId: restaurant.id,
                name: restaurant.name
            }))
            
            toast.success("Connexion Ghost active...")
            
            // Force reload to apply store changes
            setTimeout(() => {
                window.location.href = "/dashboard"
            }, 500)
        }
    }

    const filteredRestaurants = restaurants.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (r.profiles?.[0]?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
        const matchesPlan = planFilter === 'all' || r.subscription_tier === planFilter
        return matchesSearch && matchesPlan
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Building2 className="w-6 h-6" />
                        Gestion des Restaurants
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gérez les établissements partenaires et leurs abonnements.
                    </p>
                </div>
                <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4" />
                            Nouveau Restaurant
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer un Restaurant</DialogTitle>
                            <DialogDescription>Ceci créera aussi un compte Administrateur pour ce restaurant.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nom du Restaurant</Label>
                                <Input value={newRestName} onChange={e => setNewRestName(e.target.value)} placeholder="Ex: Chez Luigi" />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Admin</Label>
                                <Input value={newRestEmail} onChange={e => setNewRestEmail(e.target.value)} placeholder="admin@luigi.com" type="email" />
                            </div>
                            <div className="space-y-2">
                                <Label>Mot de passe Provisoire</Label>
                                <Input value={newRestPassword} onChange={e => setNewRestPassword(e.target.value)} placeholder="*******" type="password" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowCreateModal(false)}>Annuler</Button>
                            <Button onClick={handleCreate} disabled={isCreating}>
                                {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Créer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-card/50 p-4 rounded-xl border border-border/50">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                        placeholder="Rechercher un restaurant..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrer par plan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les plans</SelectItem>
                        {PLAN_OPTIONS.map(p => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="glass-card rounded-xl border-border/30 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30">
                            <TableHead>Restaurant</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>ID Agent Vocal</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="h-4 w-32 bg-muted rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-40 bg-muted rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-16 bg-muted rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-4 w-12 bg-muted rounded animate-pulse" /></TableCell>
                                    <TableCell><div className="h-8 w-8 bg-muted rounded animate-pulse ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredRestaurants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    Aucun restaurant trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRestaurants.map((r) => {
                                const ownerEmail = r.profiles?.find(p => p.role === 'admin' || p.role === 'owner')?.email || 'N/A'
                                const currentPlan = PLAN_OPTIONS.find(p => p.value === r.subscription_tier) || PLAN_OPTIONS[0]

                                return (
                                    <TableRow key={r.id}>
                                        <TableCell>
                                            <div className="font-medium text-foreground">{r.name}</div>
                                            <div className="text-xs text-muted-foreground">ID: {r.id.slice(0, 8)}...</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{ownerEmail}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                defaultValue={r.retell_agent_id || ""}
                                                onBlur={(e) => handleAgentIdBlur(r.id, r.retell_agent_id, e.target.value)}
                                                className="h-8 w-32 font-mono text-xs bg-muted/50"
                                                placeholder="Non configuré"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Select 
                                                defaultValue={r.subscription_tier} 
                                                onValueChange={(val) => handleTierChange(r.id, val)}
                                            >
                                                <SelectTrigger className="h-8 w-28 border-transparent bg-transparent hover:bg-muted/50">
                                                    <Badge variant="outline" className={`${currentPlan.color} border-current`}>
                                                        {currentPlan.label}
                                                    </Badge>
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
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch 
                                                    checked={r.is_active}
                                                    onCheckedChange={() => handleStatusChange(r.id, r.is_active)}
                                                />
                                                <span className={`text-xs ${r.is_active ? 'text-green-500' : 'text-muted-foreground'}`}>
                                                    {r.is_active ? 'Actif' : 'Inactif'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="secondary"
                                                    className="gap-1 h-8"
                                                    onClick={() => handleGhostLogin(r)}
                                                >
                                                    <Ghost className="w-3 h-3" />
                                                    <span className="sr-only lg:not-sr-only">Login</span>
                                                </Button>
                                                
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
                                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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

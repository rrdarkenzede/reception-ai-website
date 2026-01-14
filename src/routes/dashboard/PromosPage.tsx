import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/store"
import type { User, AgentPromo as Promo } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Megaphone, Plus, Pencil, Trash2, Target, Zap, ChefHat } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

interface MenuItem {
    id: string
    name: string
    category: string
    price: number
    available: boolean
}



// Extracted PromoForm component to fix React reconciliation issues
interface PromoFormProps {
    formNaturalText: string
    setFormNaturalText: (value: string) => void
    formSelectedItems: string[]
    toggleItemSelection: (itemId: string) => void
    formPushMode: boolean
    setFormPushMode: (value: boolean) => void
    menuItems: MenuItem[]
}

function PromoForm({
    formNaturalText,
    setFormNaturalText,
    formSelectedItems,
    toggleItemSelection,
    formPushMode,
    setFormPushMode,
    menuItems,
}: PromoFormProps) {
    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="promo-natural-text">Décrivez votre offre *</Label>
                <Textarea
                    id="promo-natural-text"
                    value={formNaturalText}
                    onChange={(e) => setFormNaturalText(e.target.value)}
                    placeholder="Ex: -50% sur les desserts ce soir"
                    className="min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground">
                    Utilisez un langage naturel. L'IA comprendra automatiquement votre offre.
                </p>
            </div>

            <div className="space-y-2">
                <Label>Sélectionnez les plats concernés (optionnel)</Label>
                {menuItems.length === 0 ? (
                    <div className="p-4 border border-dashed border-zinc-700 rounded-lg text-center">
                        <ChefHat className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">Aucun plat trouvé.</p>
                        <a 
                            href="/dashboard/stock" 
                            className="text-sm text-cyan-400 hover:text-cyan-300 underline"
                        >
                            Allez dans "Ma Carte" pour en ajouter →
                        </a>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 p-3 border border-zinc-800 rounded-lg bg-zinc-900/50 max-h-48 overflow-y-auto">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleItemSelection(item.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                                    formSelectedItems.includes(item.id)
                                        ? 'border-cyan-500 text-white bg-cyan-500/20 shadow-cyan-500/25 shadow-sm'
                                        : 'border-zinc-700 text-zinc-400 bg-transparent hover:border-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                {item.name} • {item.price.toFixed(0)}€
                            </button>
                        ))}
                    </div>
                )}
                {formSelectedItems.length > 0 && (
                    <p className="text-xs text-cyan-400">
                        ✓ {formSelectedItems.length} plat(s) sélectionné(s)
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                    <Label className="text-sm font-medium">FORCER LA SUGGESTION IA</Label>
                    <p className="text-xs text-muted-foreground">
                        L'IA proposera cette offre à chaque appel
                    </p>
                </div>
                <Switch
                    checked={formPushMode}
                    onCheckedChange={setFormPushMode}
                />
            </div>

            {formPushMode && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-red-500">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm font-medium">Mode Push Activé</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Cette offre sera prioritairement suggérée par l'IA lors des appels entrants.
                    </p>
                </div>
            )}
        </div>
    )
}

export default function PromosPage() {
    const [user, setUser] = useState<User | null>(null)
    const [promos, setPromos] = useState<Promo[]>([])
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingPromo, setEditingPromo] = useState<Promo | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Form state
    const [formNaturalText, setFormNaturalText] = useState("")
    const [formSelectedItems, setFormSelectedItems] = useState<string[]>([])
    const [formPushMode, setFormPushMode] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const u = await getCurrentUser()
        setUser(u)
        if (!u) return

        // Load menu items from stock_items table (where StockPage saves them)
        const { data: stockItems, error: stockError } = await supabase
            .from('stock_items')
            .select('*')
            .eq('profile_id', u.id)
            .order('created_at', { ascending: false })

        if (stockError) {
            console.error("PromosPage: Error loading stock items", stockError)
        }

        const items = (stockItems || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category || 'General',
            price: item.price || 0,
            available: item.is_active
        }))
        setMenuItems(items)

        // Load existing promos from settings.marketing.active_promos
        const { data: profile } = await supabase
            .from('profiles')
            .select('settings')
            .eq('id', u.id)
            .single()

        const settings = (profile?.settings || {}) as Record<string, any>
        const marketing = settings.marketing || {}
        const existingPromos = Array.isArray(marketing.active_promos) 
            ? marketing.active_promos 
            : []
        
        setPromos(existingPromos)
        setIsLoading(false)
    }

    const updatePromos = async (updatedPromos: Promo[]) => {
        if (!user) return

        // Optimistic UI update
        setPromos(updatedPromos)

        try {
            // Fetch current settings to ensure we don't overwrite other fields
            const { data: profile } = await supabase
                .from('profiles')
                .select('settings')
                .eq('id', user.id)
                .single()
            
            const currentSettings = (profile?.settings || {}) as Record<string, any>
            
            const newSettings = {
                ...currentSettings,
                marketing: {
                    ...(currentSettings.marketing || {}),
                    active_promos: updatedPromos
                }
            }

            const { error } = await supabase
                .from('profiles')
                .update({ settings: newSettings })
                .eq('id', user.id)

            if (error) throw error

            // DB save confirmed - toast handled by caller

        } catch (error) {
            console.error("Error saving promos:", error)
            toast.error("Erreur de sauvegarde des promotions")
            // Rollback (optional, but good practice)
            loadData() 
        }
    }

    const resetForm = () => {
        setFormNaturalText("")
        setFormSelectedItems([])
        setFormPushMode(false)
    }

    const handleCreate = async () => {
        if (!formNaturalText) {
            toast.error("Veuillez décrire votre offre")
            return
        }

        const newPromo: Promo = {
            id: `promo_${Date.now()}`,
            natural_text: formNaturalText,
            active: true,
            target_items: formSelectedItems.length > 0 ? formSelectedItems : undefined,
            push_mode: formPushMode,
            created_at: new Date().toISOString()
        }

        const updatedPromos = [...promos, newPromo]
        await updatePromos(updatedPromos)

        toast.success("Promotion créée")
        setIsCreateOpen(false)
        resetForm()
    }

    const handleEdit = (promo: Promo) => {
        setEditingPromo(promo)
        setFormNaturalText(promo.natural_text)
        setFormSelectedItems(promo.target_items || [])
        setFormPushMode(promo.push_mode || false)
    }

    const handleUpdate = async () => {
        if (!editingPromo) return

        const updatedPromo: Promo = {
            ...editingPromo,
            natural_text: formNaturalText,
            target_items: formSelectedItems.length > 0 ? formSelectedItems : undefined,
            push_mode: formPushMode
        }

        const updatedPromos = promos.map(p => p.id === editingPromo.id ? updatedPromo : p)
        await updatePromos(updatedPromos)

        toast.success("Promotion mise à jour")
        setEditingPromo(null)
        resetForm()
    }

    const handleDelete = async (promo: Promo) => {
        if (confirm(`Supprimer "${promo.natural_text}" ?`)) {
            const updatedPromos = promos.filter(p => p.id !== promo.id)
            await updatePromos(updatedPromos)
            toast.success("Promotion supprimée")
        }
    }

    const handleToggleActive = async (promo: Promo) => {
        const updatedPromo = { ...promo, active: !promo.active }
        const updatedPromos = promos.map(p => p.id === promo.id ? updatedPromo : p)
        await updatePromos(updatedPromos)
        toast.success(promo.active ? "Promotion désactivée" : "Promotion activée")
    }

    const toggleItemSelection = (itemId: string) => {
        setFormSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        )
    }


    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Chargement...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Megaphone className="w-6 h-6" />
                        Marketing / Promos
                    </h1>
                    <p className="text-muted-foreground mt-1">{promos.length} promotion(s) active(s)</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nouvelle Promo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-border/50 max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Créer une promotion</DialogTitle>
                            <DialogDescription>
                                Configurez votre nouvelle offre promotionnelle ici.
                            </DialogDescription>
                        </DialogHeader>
                        <PromoForm
                            formNaturalText={formNaturalText}
                            setFormNaturalText={setFormNaturalText}
                            formSelectedItems={formSelectedItems}
                            toggleItemSelection={toggleItemSelection}
                            formPushMode={formPushMode}
                            setFormPushMode={setFormPushMode}
                            menuItems={menuItems}
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Annuler</Button>
                            <Button onClick={handleCreate}>Créer</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Promo Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {promos.map((promo) => (
                    <Card key={promo.id} className={`glass-card border-border/30 transition-all ${!promo.active ? "opacity-50" : ""
                        } ${promo.push_mode ? "ring-2 ring-red-500/50 shadow-red-500/20" : ""}`}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${promo.push_mode
                                        ? 'bg-red-500/20'
                                        : 'bg-primary/10'
                                        }`}>
                                        {promo.push_mode ? (
                                            <Zap className="w-5 h-5 text-red-500" />
                                        ) : (
                                            <Target className="w-5 h-5 text-primary" />
                                        )}
                                    </div>
                                    <Badge
                                        className={promo.active
                                            ? "bg-green-500/20 text-green-500 border-green-500/30 cursor-pointer"
                                            : "bg-muted text-muted-foreground cursor-pointer"
                                        }
                                        onClick={() => handleToggleActive(promo)}
                                    >
                                        {promo.active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>

                            <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                                {promo.natural_text}
                            </h3>

                            {promo.target_items && promo.target_items.length > 0 && (
                                <div className="mb-3">
                                    <div className="text-xs text-muted-foreground mb-1">Plats concernés:</div>
                                    <div className="flex flex-wrap gap-1">
                                        {promo.target_items.map(itemId => {
                                            const item = menuItems.find(m => m.id === itemId)
                                            return item ? (
                                                <Badge key={itemId} variant="secondary" className="text-xs">
                                                    {item.name}
                                                </Badge>
                                            ) : null
                                        })}
                                    </div>
                                </div>
                            )}

                            {promo.push_mode && (
                                <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg mb-3">
                                    <div className="flex items-center gap-2 text-red-500 text-xs">
                                        <Zap className="w-3 h-3" />
                                        <span className="font-medium">Mode Push</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Dialog open={editingPromo?.id === promo.id} onOpenChange={(open) => !open && setEditingPromo(null)}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleEdit(promo)}>
                                            <Pencil className="w-3 h-3" />
                                            Modifier
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="glass-card border-border/50 max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>Modifier la promotion</DialogTitle>
                                            <DialogDescription>
                                                Modifiez les détails de votre promotion existante.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <PromoForm
                                            formNaturalText={formNaturalText}
                                            setFormNaturalText={setFormNaturalText}
                                            formSelectedItems={formSelectedItems}
                                            toggleItemSelection={toggleItemSelection}
                                            formPushMode={formPushMode}
                                            setFormPushMode={setFormPushMode}
                                            menuItems={menuItems}
                                        />
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setEditingPromo(null)}>Annuler</Button>
                                            <Button onClick={handleUpdate}>Enregistrer</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(promo)}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {promos.length === 0 && (
                <Card className="glass-card border-border/30">
                    <CardContent className="text-center py-12">
                        <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">Aucune promotion</h3>
                        <p className="text-muted-foreground mb-4">
                            Créez votre première offre pour attirer plus de clients !
                        </p>
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Créer votre première promo
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="glass-card border-border/50 max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Créer une promotion</DialogTitle>
                                    <DialogDescription>
                                        Lancez votre première offre pour attirer des clients.
                                    </DialogDescription>
                                </DialogHeader>
                                <PromoForm
                                    formNaturalText={formNaturalText}
                                    setFormNaturalText={setFormNaturalText}
                                    formSelectedItems={formSelectedItems}
                                    toggleItemSelection={toggleItemSelection}
                                    formPushMode={formPushMode}
                                    setFormPushMode={setFormPushMode}
                                    menuItems={menuItems}
                                />
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Annuler</Button>
                                    <Button onClick={handleCreate}>Créer</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

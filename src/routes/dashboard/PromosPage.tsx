import { useState, useEffect } from "react"
import { getCurrentUser, getPromos, addPromo, updatePromo, deletePromo } from "@/lib/store"
import type { Promo } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Megaphone, Plus, Pencil, Trash2, Percent, Euro, Calendar } from "lucide-react"
import { toast } from "sonner"

export default function PromosPage() {
    const [promos, setPromos] = useState<Promo[]>([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingPromo, setEditingPromo] = useState<Promo | null>(null)

    // Form state
    const [formTitle, setFormTitle] = useState("")
    const [formDescription, setFormDescription] = useState("")
    const [formCode, setFormCode] = useState("")
    const [formDiscount, setFormDiscount] = useState("")
    const [formDiscountType, setFormDiscountType] = useState<"percent" | "fixed">("percent")
    const [formStartDate, setFormStartDate] = useState("")
    const [formEndDate, setFormEndDate] = useState("")
    const [formIsActive, setFormIsActive] = useState(true)

    useEffect(() => {
        loadPromos()
    }, [])

    const loadPromos = async () => {
        const user = await getCurrentUser()
        if (user) {
            setPromos(await getPromos(user.id))
        }
    }

    const resetForm = () => {
        setFormTitle("")
        setFormDescription("")
        setFormCode("")
        setFormDiscount("")
        setFormDiscountType("percent")
        setFormStartDate("")
        setFormEndDate("")
        setFormIsActive(true)
    }

    const handleCreate = async () => {
        if (!formTitle || !formDiscount) {
            toast.error("Veuillez remplir les champs obligatoires")
            return
        }

        const user = await getCurrentUser()
        if (!user) return

        await addPromo({
            userId: user.id,
            title: formTitle,
            description: formDescription,
            code: formCode,
            discount: parseFloat(formDiscount),
            discountType: formDiscountType,
            startDate: formStartDate,
            endDate: formEndDate || undefined,
            isActive: formIsActive,
        })

        toast.success("Promotion créée")
        setIsCreateOpen(false)
        resetForm()
        await loadPromos()
    }

    const handleEdit = (promo: Promo) => {
        setEditingPromo(promo)
        setFormTitle(promo.title)
        setFormDescription(promo.description || "")
        setFormCode(promo.code || "")
        setFormDiscount(String(promo.discount))
        setFormDiscountType(promo.discountType || "percent")
        setFormStartDate(promo.startDate || "")
        setFormEndDate(promo.endDate || "")
        setFormIsActive(promo.isActive)
    }

    const handleUpdate = async () => {
        if (!editingPromo) return

        await updatePromo(editingPromo.id, {
            title: formTitle,
            description: formDescription,
            code: formCode,
            discount: parseFloat(formDiscount),
            discountType: formDiscountType,
            startDate: formStartDate,
            endDate: formEndDate,
            isActive: formIsActive,
        })

        toast.success("Promotion mise à jour")
        setEditingPromo(null)
        resetForm()
        await loadPromos()
    }

    const handleDelete = async (promo: Promo) => {
        if (confirm(`Supprimer "${promo.title}" ?`)) {
            await deletePromo(promo.id)
            toast.success("Promotion supprimée")
            await loadPromos()
        }
    }

    const handleToggleActive = async (promo: Promo) => {
        await updatePromo(promo.id, { isActive: !promo.isActive })
        await loadPromos()
        toast.success(promo.isActive ? "Promotion désactivée" : "Promotion activée")
    }

    const PromoForm = () => (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label>Titre *</Label>
                <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="25% sur les Pizzas" />
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Valable ce week-end uniquement" />
            </div>
            <div className="space-y-2">
                <Label>Code promo</Label>
                <Input value={formCode} onChange={(e) => setFormCode(e.target.value.toUpperCase())} placeholder="PIZZA25" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Réduction *</Label>
                    <Input type="number" value={formDiscount} onChange={(e) => setFormDiscount(e.target.value)} placeholder="25" />
                </div>
                <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={formDiscountType} onValueChange={(v) => setFormDiscountType(v as any)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="percent">Pourcentage (%)</SelectItem>
                            <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Date début</Label>
                    <Input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Date fin</Label>
                    <Input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch checked={formIsActive} onCheckedChange={setFormIsActive} />
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Megaphone className="w-6 h-6" />
                        Promos & Annonces
                    </h1>
                    <p className="text-muted-foreground mt-1">{promos.length} promotions</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nouvelle Promo
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer une promotion</DialogTitle>
                        </DialogHeader>
                        <PromoForm />
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
                    <Card key={promo.id} className={`glass-card border-border/30 ${!promo.isActive ? "opacity-50" : ""}`}>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    {promo.discountType === "percent" ? (
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Percent className="w-5 h-5 text-primary" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                            <Euro className="w-5 h-5 text-green-500" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-2xl font-bold text-primary">
                                            {promo.discount}{promo.discountType === "percent" ? "%" : "€"}
                                        </div>
                                    </div>
                                </div>
                                <Badge
                                    className={promo.isActive
                                        ? "bg-green-500/20 text-green-500 border-green-500/30"
                                        : "bg-muted text-muted-foreground"
                                    }
                                    onClick={() => handleToggleActive(promo)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {promo.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>

                            <h3 className="font-semibold text-foreground mb-1">{promo.title}</h3>
                            {promo.description && (
                                <p className="text-sm text-muted-foreground mb-3">{promo.description}</p>
                            )}

                            {promo.code && (
                                <div className="bg-secondary/50 rounded-lg px-3 py-2 mb-3 font-mono text-sm text-center">
                                    {promo.code}
                                </div>
                            )}

                            {(promo.startDate || promo.endDate) && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                                    <Calendar className="w-3 h-3" />
                                    {promo.startDate && new Date(promo.startDate).toLocaleDateString("fr-FR")}
                                    {promo.startDate && promo.endDate && " → "}
                                    {promo.endDate && new Date(promo.endDate).toLocaleDateString("fr-FR")}
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
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Modifier la promotion</DialogTitle>
                                        </DialogHeader>
                                        <PromoForm />
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
                <div className="text-center py-12 text-muted-foreground">
                    Aucune promotion. Créez votre première offre !
                </div>
            )}
        </div>
    )
}

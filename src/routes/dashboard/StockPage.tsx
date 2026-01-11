import { useState, useEffect } from "react"
import { getCurrentUser, getStockItems, addStockItem, updateStockItem, deleteStockItem } from "@/lib/store"
import type { StockItem } from "@/lib/types"
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, Pencil, Trash2, Search, Euro } from "lucide-react"
import { toast } from "sonner"

export default function StockPage() {
    const [items, setItems] = useState<StockItem[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<StockItem | null>(null)

    // Form state
    const [formName, setFormName] = useState("")
    const [formDescription, setFormDescription] = useState("")
    const [formPrice, setFormPrice] = useState("")
    const [formCategory, setFormCategory] = useState("")
    const [formIsActive, setFormIsActive] = useState(true)

    useEffect(() => {
        loadItems()
    }, [])

    const loadItems = () => {
        const user = getCurrentUser()
        if (user) {
            setItems(getStockItems(user.id))
        }
    }

    const resetForm = () => {
        setFormName("")
        setFormDescription("")
        setFormPrice("")
        setFormCategory("")
        setFormIsActive(true)
    }

    const handleCreate = () => {
        if (!formName || !formPrice) {
            toast.error("Veuillez remplir les champs obligatoires")
            return
        }

        const user = getCurrentUser()
        if (!user) return

        addStockItem({
            userId: user.id,
            name: formName,
            description: formDescription,
            price: parseFloat(formPrice),
            category: formCategory,
            isActive: formIsActive,
        })

        toast.success("Article ajouté")
        setIsCreateOpen(false)
        resetForm()
        loadItems()
    }

    const handleEdit = (item: StockItem) => {
        setEditingItem(item)
        setFormName(item.name)
        setFormDescription(item.description || "")
        setFormPrice(String(item.price))
        setFormCategory(item.category || "")
        setFormIsActive(item.isActive)
    }

    const handleUpdate = () => {
        if (!editingItem) return

        updateStockItem(editingItem.id, {
            name: formName,
            description: formDescription,
            price: parseFloat(formPrice),
            category: formCategory,
            isActive: formIsActive,
        })

        toast.success("Article mis à jour")
        setEditingItem(null)
        resetForm()
        loadItems()
    }

    const handleDelete = (item: StockItem) => {
        if (confirm(`Supprimer "${item.name}" ?`)) {
            deleteStockItem(item.id)
            toast.success("Article supprimé")
            loadItems()
        }
    }

    const handleToggleActive = (item: StockItem) => {
        updateStockItem(item.id, { isActive: !item.isActive })
        loadItems()
        toast.success(item.isActive ? "Article désactivé" : "Article activé")
    }

    const filteredItems = items.filter(
        (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Group by category
    const categories = [...new Set(filteredItems.map((i) => i.category || "Sans catégorie"))]

    const ItemForm = () => (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label>Nom *</Label>
                <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Pizza Margherita" />
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Tomate, mozzarella, basilic" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Prix (€) *</Label>
                    <Input type="number" step="0.01" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="12.00" />
                </div>
                <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Input value={formCategory} onChange={(e) => setFormCategory(e.target.value)} placeholder="Pizzas, Desserts..." />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <Label>Disponible</Label>
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
                        <Package className="w-6 h-6" />
                        Menu / Stock
                    </h1>
                    <p className="text-muted-foreground mt-1">{items.length} articles</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nouvel Article
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ajouter un article</DialogTitle>
                        </DialogHeader>
                        <ItemForm />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Annuler</Button>
                            <Button onClick={handleCreate}>Ajouter</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    className="pl-10"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Items by category */}
            {categories.map((category) => (
                <div key={category} className="space-y-3">
                    <h2 className="text-lg font-semibold text-foreground">{category}</h2>
                    <div className="glass-card rounded-xl border-border/30 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Article</TableHead>
                                    <TableHead>Prix</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems
                                    .filter((i) => (i.category || "Sans catégorie") === category)
                                    .map((item) => (
                                        <TableRow key={item.id} className={!item.isActive ? "opacity-50" : ""}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium text-foreground">{item.name}</div>
                                                    {item.description && (
                                                        <div className="text-sm text-muted-foreground">{item.description}</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 font-medium">
                                                    <Euro className="w-4 h-4 text-muted-foreground" />
                                                    {(item.price || 0).toFixed(2)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={item.isActive
                                                        ? "bg-green-500/20 text-green-500 border-green-500/30"
                                                        : "bg-red-500/20 text-red-500 border-red-500/30"
                                                    }
                                                    onClick={() => handleToggleActive(item)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {item.isActive ? "Disponible" : "Indisponible"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Dialog open={editingItem?.id === item.id} onOpenChange={(open) => !open && setEditingItem(null)}>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Modifier l'article</DialogTitle>
                                                            </DialogHeader>
                                                            <ItemForm />
                                                            <DialogFooter>
                                                                <Button variant="outline" onClick={() => setEditingItem(null)}>Annuler</Button>
                                                                <Button onClick={handleUpdate}>Enregistrer</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            ))}

            {filteredItems.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    Aucun article trouvé. Ajoutez votre premier article !
                </div>
            )}
        </div>
    )
}

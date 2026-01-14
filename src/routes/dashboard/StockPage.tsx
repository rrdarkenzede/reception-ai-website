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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Package, Plus, Pencil, Trash2, Search, Image as ImageIcon, Pizza, Coffee, Beer, UtensilsCrossed } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Extracted ItemForm component
interface ItemFormProps {
    formName: string
    setFormName: (value: string) => void
    formDescription: string
    setFormDescription: (value: string) => void
    formPrice: string
    setFormPrice: (value: string) => void
    formCategory: string
    setFormCategory: (value: string) => void
    formIsActive: boolean
    setFormIsActive: (value: boolean) => void
}

function ItemForm({
    formName,
    setFormName,
    formDescription,
    setFormDescription,
    formPrice,
    setFormPrice,
    formCategory,
    setFormCategory,
    formIsActive,
    setFormIsActive,
}: ItemFormProps) {
    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="item-name">Nom *</Label>
                <Input
                    id="item-name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Pizza Margherita"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="item-description">Description</Label>
                <Input
                    id="item-description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Tomate, mozzarella, basilic"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="item-price">Prix (€) *</Label>
                    <Input
                        id="item-price"
                        type="number"
                        step="0.01"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="12.00"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="item-category">Catégorie</Label>
                    <Input
                        id="item-category"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        placeholder="Pizzas, Desserts..."
                    />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="item-active">Disponible</Label>
                <Switch id="item-active" checked={formIsActive} onCheckedChange={setFormIsActive} />
            </div>
        </div>
    )
}

const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase()
    if (cat.includes('pizza') || cat.includes('burger')) return Pizza
    if (cat.includes('boisson') || cat.includes('vin') || cat.includes('bar')) return Beer
    if (cat.includes('dessert') || cat.includes('café')) return Coffee
    return UtensilsCrossed
}

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

    const loadItems = async () => {
        const user = await getCurrentUser()
        if (user) {
            setItems(await getStockItems(user.id))
        }
    }

    const resetForm = () => {
        setFormName("")
        setFormDescription("")
        setFormPrice("")
        setFormCategory("")
        setFormIsActive(true)
    }

    const handleCreate = async () => {
        if (!formName || !formPrice) {
            toast.error("Veuillez remplir les champs obligatoires")
            return
        }

        const existingItem = items.find(
            item => item.name.toLowerCase().trim() === formName.toLowerCase().trim()
        )
        if (existingItem) {
            toast.error(`"${formName}" existe déjà.`)
            return
        }

        const user = await getCurrentUser()
        if (!user) return

        await addStockItem({
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
        await loadItems()
    }

    const handleEdit = (item: StockItem) => {
        setEditingItem(item)
        setFormName(item.name)
        setFormDescription(item.description || "")
        setFormPrice(String(item.price))
        setFormCategory(item.category || "")
        setFormIsActive(item.isActive)
    }

    const handleUpdate = async () => {
        if (!editingItem) return

        await updateStockItem(editingItem.id, {
            name: formName,
            description: formDescription,
            price: parseFloat(formPrice),
            category: formCategory,
            isActive: formIsActive,
        })

        toast.success("Article mis à jour")
        setEditingItem(null)
        resetForm()
        await loadItems()
    }

    const handleDelete = async (item: StockItem) => {
        if (confirm(`Supprimer "${item.name}" ?`)) {
            await deleteStockItem(item.id)
            toast.success("Article supprimé")
            await loadItems()
        }
    }

    const handleToggleActive = async (item: StockItem, newValue: boolean) => {
        // Optimistic UI
        setItems(prevItems => prevItems.map(i => i.id === item.id ? { ...i, isActive: newValue } : i))
        
        try {
            await updateStockItem(item.id, { isActive: newValue })
            toast.success(newValue ? "Article activé" : "Article désactivé - Stock épuisé")
        } catch (error) {
            console.error("Failed to update stock:", error)
            toast.error("Erreur de mise à jour")
            loadItems() // Rollback
        }
    }

    const filteredItems = items.filter(
        (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const categories = [...new Set(filteredItems.map((i) => i.category || "Sans catégorie"))]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Package className="w-6 h-6" />
                        Menu / Stock
                    </h1>
                    <p className="text-muted-foreground mt-1">{items.length} articles - Gérez votre carte ici</p>
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
                            <DialogDescription>Remplissez les informations du nouvel article.</DialogDescription>
                        </DialogHeader>
                        <ItemForm
                            formName={formName}
                            setFormName={setFormName}
                            formDescription={formDescription}
                            setFormDescription={setFormDescription}
                            formPrice={formPrice}
                            setFormPrice={setFormPrice}
                            formCategory={formCategory}
                            setFormCategory={setFormCategory}
                            formIsActive={formIsActive}
                            setFormIsActive={setFormIsActive}
                        />
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
                    placeholder="Rechercher un plat, une boisson..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Items by category */}
            {categories.map((category) => {
                const CategoryIcon = getCategoryIcon(category)
                return (
                    <div key={category} className="space-y-3">
                        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                             <CategoryIcon className="w-5 h-5 opacity-70" />
                            {category}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredItems
                                .filter((i) => (i.category || "Sans catégorie") === category)
                                .map((item) => (
                                    <Card 
                                        key={item.id} 
                                        className={cn(
                                            "glass-card border-border/30 overflow-hidden transition-all duration-300",
                                            !item.isActive && "opacity-60 grayscale bg-muted/20"
                                        )}
                                    >
                                        <div className="aspect-video w-full bg-muted/30 flex items-center justify-center relative group">
                                            {/* Placeholder Image Logic could be improved with real URLs */}
                                            <ImageIcon className="w-10 h-10 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
                                            
                                            {/* Edit Button overlay */}
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                 <Dialog open={editingItem?.id === item.id} onOpenChange={(open) => !open && setEditingItem(null)}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Modifier l'article</DialogTitle>
                                                        </DialogHeader>
                                                        <ItemForm
                                                            formName={formName}
                                                            setFormName={setFormName}
                                                            formDescription={formDescription}
                                                            setFormDescription={setFormDescription}
                                                            formPrice={formPrice}
                                                            setFormPrice={setFormPrice}
                                                            formCategory={formCategory}
                                                            setFormCategory={setFormCategory}
                                                            formIsActive={formIsActive}
                                                            setFormIsActive={setFormIsActive}
                                                        />
                                                        <DialogFooter>
                                                            <Button variant="outline" onClick={() => setEditingItem(null)}>Annuler</Button>
                                                            <Button onClick={handleUpdate}>Enregistrer</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                        
                                        <CardContent className="p-4 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="font-semibold text-lg leading-tight">{item.name}</div>
                                                <div className="font-mono font-medium text-primary">{(item.price || 0).toFixed(0)}€</div>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5em]">
                                                {item.description || "Aucune description"}
                                            </p>
                                        </CardContent>
                                        
                                        <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-border/10 mt-2">
                                            <div className="flex items-center gap-2 pt-4">
                                                <Switch 
                                                    checked={item.isActive}
                                                    onCheckedChange={(checked) => handleToggleActive(item, checked)}
                                                />
                                                <span className={cn("text-xs font-medium", item.isActive ? "text-green-500" : "text-muted-foreground")}>
                                                    {item.isActive ? "DISPONIBLE" : "ÉPUISÉ"}
                                                </span>
                                            </div>
                                            
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-destructive/50 hover:text-destructive hover:bg-destructive/10 mt-4" 
                                                onClick={() => handleDelete(item)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                        </div>
                    </div>
                )
            })}

            {filteredItems.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    Aucun article trouvé. Ajoutez votre premier article !
                </div>
            )}
        </div>
    )
}


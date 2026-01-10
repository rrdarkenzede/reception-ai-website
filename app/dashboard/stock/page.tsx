"use client"

import { useEffect, useState } from "react"
import { getCurrentUser, getStockItems, addStockItem, updateStockItem, deleteStockItem } from "@/lib/store"
import type { User, StockItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Lock, Filter } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function StockPage() {
  const [user, setUser] = useState<User | null>(null)
  const [items, setItems] = useState<StockItem[]>([])
  const [filteredItems, setFilteredItems] = useState<StockItem[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formPrice, setFormPrice] = useState("")
  const [formCategory, setFormCategory] = useState("")

  const loadData = () => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      const userItems = getStockItems(currentUser.id)
      setItems(userItems)
      applyFilter(userItems, statusFilter)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const applyFilter = (itemList: StockItem[], filter: string) => {
    if (filter === "all") {
      setFilteredItems(itemList)
    } else if (filter === "active") {
      setFilteredItems(itemList.filter((i) => i.isActive))
    } else {
      setFilteredItems(itemList.filter((i) => !i.isActive))
    }
  }

  useEffect(() => {
    applyFilter(items, statusFilter)
  }, [statusFilter, items])

  const isPro = user?.plan === "pro" || user?.plan === "elite"

  const getPageTitle = () => {
    switch (user?.sector) {
      case "restaurant":
        return "Menu"
      case "dentiste":
        return "Services"
      case "garage":
        return "Pièces & Services"
      case "beaute":
        return "Prestations"
      default:
        return "Catalogue"
    }
  }

  const getCategories = () => {
    switch (user?.sector) {
      case "restaurant":
        return ["Entrées", "Plats", "Pizzas", "Desserts", "Boissons"]
      case "dentiste":
        return ["Consultations", "Soins", "Chirurgie", "Esthétique"]
      case "garage":
        return ["Entretien", "Réparation", "Pneumatiques", "Pièces"]
      case "beaute":
        return ["Coiffure", "Soins visage", "Manucure", "Massage"]
      default:
        return ["Catégorie 1", "Catégorie 2"]
    }
  }

  const resetForm = () => {
    setFormName("")
    setFormDescription("")
    setFormPrice("")
    setFormCategory("")
    setSelectedItem(null)
  }

  const handleToggleActive = (item: StockItem) => {
    updateStockItem(item.id, { isActive: !item.isActive })
    toast.success(item.isActive ? "Item désactivé" : "Item activé")
    loadData()
  }

  const handleAddItem = () => {
    if (!user) return
    addStockItem({
      userId: user.id,
      name: formName,
      description: formDescription,
      price: formPrice ? Number.parseFloat(formPrice) : undefined,
      category: formCategory,
      isActive: true,
    })
    toast.success("Item ajouté")
    setIsAddDialogOpen(false)
    resetForm()
    loadData()
  }

  const handleEditItem = () => {
    if (!selectedItem) return
    updateStockItem(selectedItem.id, {
      name: formName,
      description: formDescription,
      price: formPrice ? Number.parseFloat(formPrice) : undefined,
      category: formCategory,
    })
    toast.success("Item modifié")
    setIsEditDialogOpen(false)
    resetForm()
    loadData()
  }

  const handleDeleteItem = () => {
    if (!selectedItem) return
    deleteStockItem(selectedItem.id)
    toast.success("Item supprimé")
    setIsDeleteDialogOpen(false)
    resetForm()
    loadData()
  }

  const openEditDialog = (item: StockItem) => {
    setSelectedItem(item)
    setFormName(item.name)
    setFormDescription(item.description || "")
    setFormPrice(item.price?.toString() || "")
    setFormCategory(item.category || "")
    setIsEditDialogOpen(true)
  }

  if (!user) return null

  if (!isPro) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Card className="glass-card border-border/30 max-w-md">
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Fonctionnalité Pro</h3>
            <p className="text-muted-foreground mb-4">
              La gestion du {getPageTitle().toLowerCase()} nécessite le plan Pro ou Elite.
            </p>
            <Button className="bg-primary hover:bg-primary/90">Upgrade to Pro</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{getPageTitle()}</h1>
          <p className="text-muted-foreground">Gérez votre catalogue de produits et services</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 bg-secondary/30 border-border/30">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="inactive">Inactifs</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              resetForm()
              setIsAddDialogOpen(true)
            }}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className={cn(
              "glass-card border-border/30 transition-all",
              !item.isActive && "opacity-60",
              item.isActive && "hover:border-primary/30",
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className={cn("font-semibold text-foreground", !item.isActive && "line-through")}>{item.name}</h3>
                  {item.category && <span className="text-xs text-muted-foreground">{item.category}</span>}
                </div>
                <Switch checked={item.isActive} onCheckedChange={() => handleToggleActive(item)} />
              </div>

              {item.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
              )}

              <div className="flex items-center justify-between">
                {item.price !== undefined && <span className="text-lg font-semibold text-primary">{item.price}€</span>}
                <div className="flex gap-1 ml-auto">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(item)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => {
                      setSelectedItem(item)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Aucun item trouvé. Ajoutez votre premier {getPageTitle().toLowerCase()}.
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="glass-card border-border/50">
          <DialogHeader>
            <DialogTitle>Ajouter un item</DialogTitle>
            <DialogDescription>Créez un nouveau produit ou service</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prix (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCategories().map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button onClick={handleAddItem} className="bg-primary hover:bg-primary/90">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-card border-border/50">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;item</DialogTitle>
            <DialogDescription>Modifiez les informations du produit ou service</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prix (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCategories().map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button onClick={handleEditItem} className="bg-primary hover:bg-primary/90">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass-card border-border/50">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer &quot;{selectedItem?.name}&quot; ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

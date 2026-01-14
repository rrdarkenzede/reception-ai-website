import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/store'
import type { User } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { UtensilsCrossed, Plus, Edit2, Trash2, Save } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  available: boolean
}

export default function MenuPage() {
  const [user, setUser] = useState<User | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    category: 'Pizza',
    price: 0,
    available: true
  })
  const [isLoading, setIsLoading] = useState(true)

  const categories = ['Pizza', 'Dessert', 'Boisson', 'Entrée', 'Plat Principal']

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser()
      setUser(u)
      if (!u) return

      // Load menu items from user settings
      const settings = u.settings
      const restaurantConfig = settings?.restaurant_config
      const rawItems = restaurantConfig?.menu_items || []
      const items: MenuItem[] = rawItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category || 'Pizza',
        price: item.price || 0,
        available: item.isActive
      }))

      setMenuItems(items)
      setIsLoading(false)
    }

    load()
  }, [])

  const updateMenuItems = async (updatedItems: MenuItem[]) => {
    if (!user) return

    // Prepare settings structure for Supabase
    const settings = (user.settings || {}) as Record<string, any>
    const restaurantConfig = settings.restaurant_config || {}

    const newSettings = {
      ...settings,
      restaurant_config: {
        ...restaurantConfig,
        menu_items: updatedItems.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          isActive: item.available
        }))
      }
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ settings: newSettings })
        .eq('id', user.id)

      if (error) throw error

      // Update local state and user object
      setMenuItems(updatedItems)
      user.settings = newSettings // Keep in sync for subsequent calls
      toast.success('Carte mise à jour')
    } catch (error) {
      console.error('Menu save error:', error)
      toast.error('Erreur de sauvegarde')
    }
  }

  const toggleAvailability = async (itemId: string) => {
    const updatedItems = menuItems.map(item =>
      item.id === itemId ? { ...item, available: !item.available } : item
    )
    await updateMenuItems(updatedItems)
  }

  const saveNewItem = async () => {
    if (!newItem.name || !newItem.price) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    const item: MenuItem = {
      id: `menu_${Date.now()}`,
      name: newItem.name,
      category: newItem.category || 'Pizza',
      price: newItem.price,
      available: newItem.available || true
    }

    const updatedItems = [...menuItems, item]
    await updateMenuItems(updatedItems)

    // Reset form
    setNewItem({
      name: '',
      category: 'Pizza',
      price: 0,
      available: true
    })
  }

  const saveEditedItem = async () => {
    if (!editingItem) return

    const updatedItems = menuItems.map(item =>
      item.id === editingItem.id ? editingItem : item
    )
    await updateMenuItems(updatedItems)
    setEditingItem(null)
  }

  const deleteItem = async (itemId: string) => {
    const updatedItems = menuItems.filter(item => item.id !== itemId)
    await updateMenuItems(updatedItems)
  }

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

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
          <h1 className="text-2xl font-bold text-foreground">Ma Carte</h1>
          <p className="text-muted-foreground">Gérez votre menu et vos prix</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un plat
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border/50 z-[100]">
            <DialogHeader>
              <DialogTitle>Nouveau plat</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du plat</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Ex: Pizza Margherita"
                />
              </div>

              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.50"
                  min="0"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                  placeholder="12.00"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={newItem.available}
                  onCheckedChange={(checked) => setNewItem({ ...newItem, available: checked })}
                />
                <Label htmlFor="available">Disponible immédiatement</Label>
              </div>

              <Button onClick={saveNewItem} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Ajouter le plat
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Items by Category */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <Card key={category} className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5" />
                {category}
                <Badge variant="secondary">{items.length} articles</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${item.available
                        ? 'bg-background border-border/50'
                        : 'bg-muted/30 border-border/20 opacity-50 grayscale'
                      }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${item.available ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {item.name}
                        </h3>
                        {!item.available && (
                          <Badge variant="destructive" className="text-xs">
                            Indisponible
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.price.toFixed(2)} €
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.available}
                        onCheckedChange={() => toggleAvailability(item.id)}
                      />

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingItem(item)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card border-border/50 z-[100]">
                          <DialogHeader>
                            <DialogTitle>Modifier le plat</DialogTitle>
                          </DialogHeader>
                          {editingItem && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edit-name">Nom du plat</Label>
                                <Input
                                  id="edit-name"
                                  value={editingItem.name}
                                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                />
                              </div>

                              <div>
                                <Label htmlFor="edit-category">Catégorie</Label>
                                <Select value={editingItem.category} onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categories.map(cat => (
                                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="edit-price">Prix (€)</Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  step="0.50"
                                  min="0"
                                  value={editingItem.price}
                                  onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                                />
                              </div>

                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="edit-available"
                                  checked={editingItem.available}
                                  onCheckedChange={(checked) => setEditingItem({ ...editingItem, available: checked })}
                                />
                                <Label htmlFor="edit-available">Disponible</Label>
                              </div>

                              <div className="flex gap-2">
                                <Button onClick={saveEditedItem} className="flex-1">
                                  <Save className="w-4 h-4 mr-2" />
                                  Sauvegarder
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => deleteItem(editingItem.id)}
                                  className="gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {menuItems.length === 0 && (
          <Card className="glass-card border-border/30">
            <CardContent className="text-center py-10">
              <UtensilsCrossed className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Aucun plat dans votre carte</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter vos premiers plats pour construire votre menu.
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Ajouter votre premier plat
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-border/50 z-[100]">
                  <DialogHeader>
                    <DialogTitle>Nouveau plat</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="first-name">Nom du plat</Label>
                      <Input
                        id="first-name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Ex: Pizza Margherita"
                      />
                    </div>

                    <div>
                      <Label htmlFor="first-category">Catégorie</Label>
                      <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="first-price">Prix (€)</Label>
                      <Input
                        id="first-price"
                        type="number"
                        step="0.50"
                        min="0"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                        placeholder="12.00"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="first-available"
                        checked={newItem.available}
                        onCheckedChange={(checked) => setNewItem({ ...newItem, available: checked })}
                      />
                      <Label htmlFor="first-available">Disponible immédiatement</Label>
                    </div>

                    <Button onClick={saveNewItem} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Ajouter le plat
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

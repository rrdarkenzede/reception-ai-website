import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/store"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  UtensilsCrossed, 
  Search, 
  Plus, 
  Wine,
  Cake,
  Soup
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  in_stock: boolean
  image_url: string | null
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase()
  if (cat.includes('entrée') || cat.includes('soupe')) return Soup
  if (cat.includes('dessert')) return Cake
  if (cat.includes('boisson') || cat.includes('cocktail')) return Wine
  return UtensilsCrossed
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [restaurantId, setRestaurantId] = useState<string | null>(null)

  useEffect(() => {
    loadMenuItems()
  }, [])

  const loadMenuItems = async () => {
    try {
      const user = await getCurrentUser()
      if (!user?.restaurantId) {
        setLoading(false)
        return
      }
      
      setRestaurantId(user.restaurantId)

      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', user.restaurantId)
        .order('category', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error loading menu items:', error)
      toast.error('Erreur de chargement du menu')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStock = async (item: MenuItem, newValue: boolean) => {
    // Optimistic UI update
    setItems(prev => prev.map(i => 
      i.id === item.id ? { ...i, in_stock: newValue } : i
    ))

    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ in_stock: newValue, updated_at: new Date().toISOString() })
        .eq('id', item.id)

      if (error) throw error
      
      toast.success(
        newValue 
          ? `"${item.name}" remis en stock` 
          : `"${item.name}" marqué en rupture (Mode 86)`
      )
    } catch (error) {
      console.error('Error updating stock:', error)
      toast.error('Erreur de mise à jour')
      // Rollback
      setItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, in_stock: !newValue } : i
      ))
    }
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = [...new Set(filteredItems.map(i => i.category))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement du menu...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-600/20 flex items-center justify-center border border-orange-500/20">
              <UtensilsCrossed className="w-5 h-5 text-orange-400" />
            </div>
            La Carte
          </h1>
          <p className="text-muted-foreground mt-1">
            {items.length} articles • Gérez la disponibilité de vos plats
          </p>
        </div>

        <Button className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500">
          <Plus className="w-4 h-4" />
          Ajouter un plat
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-10 bg-white/5 border-white/10"
          placeholder="Rechercher un plat, une catégorie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Menu Items by Category */}
      {categories.map(category => {
        const CategoryIcon = getCategoryIcon(category)
        const categoryItems = filteredItems.filter(i => i.category === category)
        
        return (
          <div key={category} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center gap-3">
              <CategoryIcon className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">{category}</h2>
              <span className="text-sm text-muted-foreground">({categoryItems.length})</span>
            </div>

            {/* Items Table */}
            <div className="glass-card rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                      Article
                    </th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                      Description
                    </th>
                    <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                      Prix
                    </th>
                    <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                      En Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {categoryItems.map(item => (
                    <tr 
                      key={item.id} 
                      className={cn(
                        "transition-colors hover:bg-white/5",
                        !item.in_stock && "opacity-50 bg-red-500/5"
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{item.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground max-w-md truncate">
                          {item.description || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono font-semibold text-foreground">
                          {item.price.toFixed(0)}€
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <Switch
                            checked={item.in_stock}
                            onCheckedChange={(checked) => handleToggleStock(item, checked)}
                          />
                          <span className={cn(
                            "text-xs font-medium min-w-[60px]",
                            item.in_stock ? "text-emerald-400" : "text-red-400"
                          )}>
                            {item.in_stock ? "DISPO" : "ÉPUISÉ"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-16 glass-card rounded-xl">
          <UtensilsCrossed className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Aucun article dans la carte</h3>
          <p className="text-muted-foreground mb-6">Commencez par ajouter vos plats et boissons</p>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Ajouter le premier article
          </Button>
        </div>
      )}
    </div>
  )
}

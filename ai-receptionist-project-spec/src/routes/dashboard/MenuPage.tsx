import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  X, 
  Search, 
  Grid, 
  List,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Profile, MenuItem } from '@/lib/types';
import { menuStore } from '@/lib/store';
import { canAccessFeature } from '@/lib/tier-access';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface DashboardContext {
  user: Profile;
}

const CATEGORIES = [
  "Toutes", "Entrées", "Plats", "Viandes", "Poissons",
  "Desserts", "Boissons", "Cocktails", "Accompagnements"
];

export function MenuPage() {
  const { user } = useOutletContext<DashboardContext>();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'Plats',
    in_stock: true
  });

  const canUseMode86 = canAccessFeature(user.tier, 'mode86');

  useEffect(() => {
    if (user) {
      setItems(menuStore.getAll(user.id));
    }
  }, [user]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openNewItemModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Plats',
      in_stock: true
    });
    setIsModalOpen(true);
  };

  const openEditItemModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      in_stock: item.in_stock
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      const updated = menuStore.update(editingItem.id, formData);
      if (updated) {
        setItems(menuStore.getAll(user.id));
        toast.success('Article modifié');
      }
    } else {
      const newItem = menuStore.create({
        ...formData,
        profile_id: user.id
      });
      setItems([...items, newItem]);
      toast.success('Article créé');
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (item: MenuItem) => {
    if (confirm(`Supprimer "${item.name}" ?`)) {
      menuStore.delete(item.id);
      setItems(menuStore.getAll(user.id));
      toast.success('Article supprimé');
    }
  };

  const handleToggleStock = (item: MenuItem) => {
    if (!canUseMode86) {
      toast.error('Mode 86 disponible avec le plan Pro');
      return;
    }
    
    const updated = menuStore.toggleStock(item.id, !item.in_stock);
    if (updated) {
      setItems(menuStore.getAll(user.id));
      toast.success(item.in_stock ? 'Article en rupture (86)' : 'Article disponible');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">La Carte</h1>
          <p className="text-muted-foreground">Gérez votre menu et les disponibilités</p>
        </div>
        <button onClick={openNewItemModal} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter un article
        </button>
      </div>

      {/* Mode 86 Warning */}
      {!canUseMode86 && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <div className="text-sm">
            <span className="font-medium text-yellow-500">Mode 86 limité.</span>
            <span className="text-muted-foreground ml-1">
              Passez au plan Pro pour gérer les ruptures de stock en temps réel.
            </span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher un article..."
            className="input-field pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="flex gap-1 glass-card rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/5'
              )}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded transition-colors",
                viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/5'
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full whitespace-nowrap transition-all",
              selectedCategory === category
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                : "glass-card hover:bg-white/5"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Items Grid/List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Aucun article trouvé
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "glass-card rounded-xl p-4 relative group",
                !item.in_stock && "opacity-60"
              )}
            >
              {/* Stock Badge */}
              {!item.in_stock && (
                <div className="absolute top-2 right-2 badge badge-red text-xs">
                  86
                </div>
              )}

              <div className="mb-3">
                <h3 className="font-semibold">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-cyan-400">{item.price.toFixed(2)} €</div>
                <span className="text-xs text-muted-foreground">{item.category}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => handleToggleStock(item)}
                  className={cn(
                    "toggle-switch flex-shrink-0",
                    item.in_stock && "active"
                  )}
                  title={canUseMode86 ? (item.in_stock ? 'Marquer en rupture' : 'Marquer disponible') : 'Plan Pro requis'}
                />
                <span className="text-xs text-muted-foreground flex-1">
                  {item.in_stock ? 'Disponible' : 'Rupture'}
                </span>
                <button
                  onClick={() => openEditItemModal(item)}
                  className="p-2 rounded-lg hover:bg-white/5"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id} className={cn(!item.in_stock && "opacity-60")}>
                  <td>
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-muted-foreground line-clamp-1">{item.description}</div>
                    )}
                  </td>
                  <td>{item.category}</td>
                  <td className="font-semibold text-cyan-400">{item.price.toFixed(2)} €</td>
                  <td>
                    <button
                      onClick={() => handleToggleStock(item)}
                      className={cn(
                        "toggle-switch",
                        item.in_stock && "active"
                      )}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditItemModal(item)}
                        className="p-2 rounded-lg hover:bg-white/5"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Item Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingItem ? 'Modifier l\'article' : 'Nouvel article'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nom *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="input-field mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="input-field mt-1 min-h-[80px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Prix (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="input-field mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Catégorie</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="input-field mt-1"
                    >
                      {CATEGORIES.filter(c => c !== 'Toutes').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, in_stock: !formData.in_stock })}
                    className={cn("toggle-switch", formData.in_stock && "active")}
                  />
                  <span className="text-sm">
                    {formData.in_stock ? 'Disponible' : 'En rupture'}
                  </span>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingItem ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

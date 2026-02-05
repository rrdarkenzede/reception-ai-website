import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Search, 
  Plus, 
  X,
  Ghost,
  Edit,
  Power,
  Filter
} from 'lucide-react';
import { DEMO_USERS, DEMO_RESTAURANTS, auth } from '@/lib/store';
import { Profile, Restaurant, SubscriptionTier } from '@/lib/types';
import { getTierBadgeColor, getTierLabel } from '@/lib/tier-access';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function AdminClientsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<SubscriptionTier | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    tier: 'pro' as SubscriptionTier
  });

  // Get clients (non-admin users)
  const clients = DEMO_USERS.filter(u => !u.is_super_admin);
  
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || client.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const getRestaurant = (restaurantId?: string): Restaurant | undefined => {
    return DEMO_RESTAURANTS.find(r => r.id === restaurantId);
  };

  const handleGhostMode = (user: Profile) => {
    auth.enterGhostMode(user.id);
    toast.success(`Mode Ghost activé pour ${user.company_name || user.name}`);
    navigate('/dashboard');
  };

  const handleToggleActive = (restaurantId?: string) => {
    if (restaurantId) {
      toast.success('Statut modifié');
    }
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Client ${formData.company} créé avec succès`);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', company: '', tier: 'pro' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Clients</h1>
          <p className="text-muted-foreground">Gérez les restaurants et leurs abonnements</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouveau client
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, email ou établissement..."
            className="input-field pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <select
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value as SubscriptionTier | 'all')}
            className="input-field"
          >
            <option value="all">Tous les plans</option>
            <option value="free">Gratuit</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Clients List */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground glass-card rounded-xl">
          <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun client trouvé</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClients.map((client, index) => {
            const restaurant = getRestaurant(client.restaurant_id);
            
            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Client Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold truncate">{client.company_name || client.name}</h3>
                        <span className={cn("badge text-xs", getTierBadgeColor(client.tier))}>
                          {getTierLabel(client.tier)}
                        </span>
                        {restaurant?.is_active ? (
                          <span className="badge badge-emerald text-xs">Actif</span>
                        ) : (
                          <span className="badge badge-red text-xs">Inactif</span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span>{client.name}</span>
                        <span className="mx-2">•</span>
                        <span>{client.email}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Inscrit le {format(new Date(client.created_at), "d MMMM yyyy", { locale: fr })}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGhostMode(client)}
                      className="btn-secondary flex items-center gap-2 text-orange-400 border-orange-500/30 hover:bg-orange-500/10"
                    >
                      <Ghost className="w-4 h-4" />
                      <span className="hidden sm:inline">Ghost Mode</span>
                    </button>
                    <button
                      onClick={() => toast.info('Édition en cours de développement')}
                      className="p-2 rounded-lg glass-card hover:bg-white/5"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(client.restaurant_id)}
                      className={cn(
                        "p-2 rounded-lg",
                        restaurant?.is_active 
                          ? "glass-card hover:bg-red-500/10 text-red-400" 
                          : "glass-card hover:bg-emerald-500/10 text-emerald-400"
                      )}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-cyan-400">24</div>
                    <div className="text-xs text-muted-foreground">Appels ce mois</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-400">18</div>
                    <div className="text-xs text-muted-foreground">Réservations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">75%</div>
                    <div className="text-xs text-muted-foreground">Conversion</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Client Modal */}
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
                <h2 className="text-xl font-semibold">Nouveau client</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nom du propriétaire *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="input-field mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="input-field mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Nom de l'établissement *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="input-field mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Plan d'abonnement</label>
                  <select
                    value={formData.tier}
                    onChange={e => setFormData({ ...formData, tier: e.target.value as SubscriptionTier })}
                    className="input-field mt-1"
                  >
                    <option value="free">Gratuit</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Créer le client
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

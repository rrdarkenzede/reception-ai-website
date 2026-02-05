import { useState } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  X, 
  Megaphone,
  Zap,
  Edit,
  Trash2
} from 'lucide-react';
import { Profile, AgentPromo } from '@/lib/types';
import { canAccessFeature } from '@/lib/tier-access';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface DashboardContext {
  user: Profile;
}

export function PromosPage() {
  const { user } = useOutletContext<DashboardContext>();
  
  // Check tier access
  if (!canAccessFeature(user.tier, 'promos')) {
    return <Navigate to="/dashboard" replace />;
  }

  const [promos, setPromos] = useState<AgentPromo[]>(
    user.settings?.marketing?.active_promos || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<AgentPromo | null>(null);
  const [formData, setFormData] = useState({
    natural_text: '',
    active: true,
    push_mode: false
  });

  const openNewPromoModal = () => {
    setEditingPromo(null);
    setFormData({
      natural_text: '',
      active: true,
      push_mode: false
    });
    setIsModalOpen(true);
  };

  const openEditPromoModal = (promo: AgentPromo) => {
    setEditingPromo(promo);
    setFormData({
      natural_text: promo.natural_text,
      active: promo.active,
      push_mode: promo.push_mode || false
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPromo) {
      setPromos(promos.map(p => 
        p.id === editingPromo.id 
          ? { ...p, ...formData }
          : p
      ));
      toast.success('Promotion modifiée');
    } else {
      const newPromo: AgentPromo = {
        id: `promo-${Date.now()}`,
        ...formData
      };
      setPromos([...promos, newPromo]);
      toast.success('Promotion créée');
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (promo: AgentPromo) => {
    if (confirm('Supprimer cette promotion ?')) {
      setPromos(promos.filter(p => p.id !== promo.id));
      toast.success('Promotion supprimée');
    }
  };

  const handleToggleActive = (promo: AgentPromo) => {
    setPromos(promos.map(p => 
      p.id === promo.id 
        ? { ...p, active: !p.active }
        : p
    ));
    toast.success(promo.active ? 'Promotion désactivée' : 'Promotion activée');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Marketing</h1>
          <p className="text-muted-foreground">Gérez vos promotions et offres spéciales</p>
        </div>
        <button onClick={openNewPromoModal} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvelle promotion
        </button>
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Comment fonctionnent les promotions ?</h3>
            <p className="text-sm text-muted-foreground">
              Créez des promotions textuelles que l'IA mentionnera lors des appels. 
              Activez le <strong>Mode Push</strong> pour que l'IA propose spontanément la promotion 
              aux clients sans qu'ils ne demandent.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Promos List */}
      {promos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground glass-card rounded-xl">
          <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucune promotion active</p>
          <button onClick={openNewPromoModal} className="btn-secondary mt-4">
            Créer ma première promotion
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {promos.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "glass-card rounded-xl p-6",
                !promo.active && "opacity-60"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  promo.active ? "bg-emerald-500/20" : "bg-white/5"
                )}>
                  {promo.push_mode ? (
                    <Zap className={cn("w-5 h-5", promo.active ? "text-emerald-400" : "text-muted-foreground")} />
                  ) : (
                    <Megaphone className={cn("w-5 h-5", promo.active ? "text-emerald-400" : "text-muted-foreground")} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="font-medium">{promo.natural_text}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {promo.push_mode && (
                        <span className="badge badge-orange text-xs">Push</span>
                      )}
                      <span className={cn(
                        "badge text-xs",
                        promo.active ? "badge-emerald" : "badge-red"
                      )}>
                        {promo.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => handleToggleActive(promo)}
                      className={cn(
                        "toggle-switch",
                        promo.active && "active"
                      )}
                    />
                    <span className="text-sm text-muted-foreground">
                      {promo.active ? 'Activée' : 'Désactivée'}
                    </span>
                    <div className="flex-1" />
                    <button
                      onClick={() => openEditPromoModal(promo)}
                      className="p-2 rounded-lg hover:bg-white/5"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(promo)}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Promo Modal */}
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
                  {editingPromo ? 'Modifier la promotion' : 'Nouvelle promotion'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Texte de la promotion *</label>
                  <textarea
                    value={formData.natural_text}
                    onChange={e => setFormData({ ...formData, natural_text: e.target.value })}
                    className="input-field mt-1 min-h-[100px] resize-none"
                    placeholder="Ex: Menu du midi à 15.90€ - Entrée + Plat + Dessert"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Ce texte sera lu par l'IA aux clients
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, push_mode: !formData.push_mode })}
                    className={cn("toggle-switch", formData.push_mode && "active")}
                  />
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-400" />
                      Mode Push
                    </div>
                    <p className="text-xs text-muted-foreground">
                      L'IA proposera cette promotion spontanément
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, active: !formData.active })}
                    className={cn("toggle-switch", formData.active && "active")}
                  />
                  <span className="text-sm">
                    {formData.active ? 'Promotion active' : 'Promotion inactive'}
                  </span>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingPromo ? 'Modifier' : 'Créer'}
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

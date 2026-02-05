import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Plus, 
  X,
  Send,
  Clock,
  MessageSquare
} from 'lucide-react';
import { Profile, SupportTicket, TicketPriority } from '@/lib/types';
import { ticketStore } from '@/lib/store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface DashboardContext {
  user: Profile;
}

export function SupportPage() {
  const { user } = useOutletContext<DashboardContext>();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium' as TicketPriority
  });

  useEffect(() => {
    setTickets(ticketStore.getByProfile(user.id));
  }, [user.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTicket = ticketStore.create({
      ...formData,
      profile_id: user.id,
      priority: formData.priority,
    });
    
    setTickets([newTicket, ...tickets]);
    setFormData({ subject: '', message: '', priority: 'medium' });
    setIsModalOpen(false);
    toast.success('Ticket créé avec succès');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="badge badge-cyan">Ouvert</span>;
      case 'in_progress':
        return <span className="badge badge-yellow">En cours</span>;
      case 'resolved':
        return <span className="badge badge-emerald">Résolu</span>;
      case 'closed':
        return <span className="badge badge-red">Fermé</span>;
      default:
        return <span className="badge badge-cyan">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <span className="text-xs text-muted-foreground">Basse</span>;
      case 'medium':
        return <span className="text-xs text-yellow-400">Moyenne</span>;
      case 'high':
        return <span className="text-xs text-orange-400">Haute</span>;
      case 'urgent':
        return <span className="text-xs text-red-400">Urgente</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-cyan-400" />
            Support
          </h1>
          <p className="text-muted-foreground">Besoin d'aide ? Créez un ticket</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouveau ticket
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
            <MessageSquare className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Comment ça marche ?</h3>
            <p className="text-sm text-muted-foreground">
              Créez un ticket pour toute question ou problème. Notre équipe vous répondra 
              généralement sous 24 heures ouvrées. Pour les urgences, marquez la priorité comme "Urgente".
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground glass-card rounded-xl">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun ticket de support</p>
          <button onClick={() => setIsModalOpen(true)} className="btn-secondary mt-4">
            Créer mon premier ticket
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium truncate">{ticket.subject}</h3>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {ticket.message}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(ticket.created_at), "d MMM 'à' HH:mm", { locale: fr })}
                    </span>
                    <span>Priorité: {getPriorityBadge(ticket.priority)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* New Ticket Modal */}
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
                <h2 className="text-xl font-semibold">Nouveau ticket</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Sujet *</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field mt-1"
                    placeholder="Décrivez brièvement votre problème"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="input-field mt-1 min-h-[120px] resize-none"
                    placeholder="Décrivez votre problème en détail..."
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Priorité</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                    className="input-field mt-1"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Envoyer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card rounded-2xl p-6 w-full max-w-lg mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">{selectedTicket.subject}</h2>
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-sm">{selectedTicket.message}</p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span>Créé le {format(new Date(selectedTicket.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</span>
                    <span>•</span>
                    <span>Priorité: {getPriorityBadge(selectedTicket.priority)}</span>
                  </div>
                </div>

                {selectedTicket.status === 'open' && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>En attente de réponse de notre équipe...</p>
                  </div>
                )}

                {selectedTicket.status === 'in_progress' && (
                  <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-cyan-400">S</span>
                      </div>
                      <div>
                        <div className="font-medium text-cyan-400">Support ReceptionAI</div>
                        <p className="text-sm mt-1">
                          Merci pour votre message. Nous examinons votre demande et reviendrons vers vous rapidement.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setSelectedTicket(null)} 
                className="btn-secondary w-full mt-6"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  X,
  Clock,
  Send,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ticketStore, DEMO_USERS } from '@/lib/store';
import { SupportTicket, TicketStatus } from '@/lib/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

export function AdminTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    setTickets(ticketStore.getAll());
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getClient = (profileId: string) => {
    return DEMO_USERS.find(u => u.id === profileId);
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

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />;
      case 'high':
        return <div className="w-2 h-2 rounded-full bg-orange-500" />;
      case 'medium':
        return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-500" />;
    }
  };

  const handleUpdateStatus = (ticketId: string, status: TicketStatus) => {
    ticketStore.updateStatus(ticketId, status);
    setTickets(ticketStore.getAll());
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status });
    }
    toast.success(`Ticket marqué comme "${status}"`);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    
    handleUpdateStatus(selectedTicket.id, 'in_progress');
    setReplyMessage('');
    toast.success('Réponse envoyée');
  };

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Tickets Support</h1>
        <p className="text-muted-foreground">Gérez les demandes de support client</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-cyan-400">{stats.open}</div>
          <div className="text-sm text-muted-foreground">Ouverts</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
          <div className="text-sm text-muted-foreground">En cours</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-emerald-400">{stats.resolved}</div>
          <div className="text-sm text-muted-foreground">Résolus</div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher par sujet ou contenu..."
            className="input-field pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as TicketStatus | 'all')}
            className="input-field"
          >
            <option value="all">Tous les statuts</option>
            <option value="open">Ouverts</option>
            <option value="in_progress">En cours</option>
            <option value="resolved">Résolus</option>
            <option value="closed">Fermés</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground glass-card rounded-xl">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun ticket trouvé</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket, index) => {
            const client = getClient(ticket.profile_id);
            
            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start gap-4">
                  {getPriorityIndicator(ticket.priority)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium truncate">{ticket.subject}</h3>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                      {ticket.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{client?.company_name || client?.name || 'Client inconnu'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(ticket.created_at), "d MMM 'à' HH:mm", { locale: fr })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

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
              className="glass-card rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold">{selectedTicket.subject}</h2>
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    De: {getClient(selectedTicket.profile_id)?.company_name || 'Client'}
                    <span className="mx-2">•</span>
                    {format(new Date(selectedTicket.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </div>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Original Message */}
              <div className="p-4 rounded-lg bg-white/5 mb-6">
                <p className="text-sm whitespace-pre-wrap">{selectedTicket.message}</p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => handleUpdateStatus(selectedTicket.id, 'in_progress')}
                  className={cn(
                    "btn-secondary text-sm",
                    selectedTicket.status === 'in_progress' && "bg-yellow-500/20 text-yellow-400"
                  )}
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  En cours
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved')}
                  className={cn(
                    "btn-secondary text-sm",
                    selectedTicket.status === 'resolved' && "bg-emerald-500/20 text-emerald-400"
                  )}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Résolu
                </button>
              </div>

              {/* Reply Section */}
              <div className="space-y-4">
                <h3 className="font-medium">Répondre</h3>
                <textarea
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  className="input-field min-h-[120px] resize-none"
                  placeholder="Écrivez votre réponse..."
                />
                <div className="flex gap-3">
                  <button onClick={() => setSelectedTicket(null)} className="btn-secondary flex-1">
                    Fermer
                  </button>
                  <button 
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim()}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" /> Envoyer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

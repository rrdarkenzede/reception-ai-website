import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Clock, 
  PlayCircle,
  Search,
  Filter
} from 'lucide-react';
import { Profile, CallLog } from '@/lib/types';
import { callLogStore } from '@/lib/store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DashboardContext {
  user: Profile;
}

export function CallsPage() {
  const { user } = useOutletContext<DashboardContext>();
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'missed' | 'abandoned'>('all');

  useEffect(() => {
    if (user) {
      setCalls(callLogStore.getAll(user.id));
    }
  }, [user]);

  const filteredCalls = calls.filter(call => {
    const matchesSearch = 
      (call.client_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (call.phone?.includes(searchQuery)) ||
      (call.summary?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || call.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getSentimentEmoji = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'urgent': return '🚨';
      case 'negative': return '😕';
      default: return '📞';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-emerald">Terminé</span>;
      case 'missed':
        return <span className="badge badge-red">Manqué</span>;
      case 'abandoned':
        return <span className="badge badge-yellow">Abandonné</span>;
      case 'in_progress':
        return <span className="badge badge-cyan">En cours</span>;
      default:
        return <span className="badge badge-cyan">{status}</span>;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = {
    total: calls.length,
    completed: calls.filter(c => c.status === 'completed').length,
    missed: calls.filter(c => c.status === 'missed').length,
    abandoned: calls.filter(c => c.status === 'abandoned').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Journal d'appels</h1>
        <p className="text-muted-foreground">Historique et analyses des appels</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-emerald-400">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">Terminés</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-red-400">{stats.missed}</div>
          <div className="text-sm text-muted-foreground">Manqués</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-yellow-400">{stats.abandoned}</div>
          <div className="text-sm text-muted-foreground">Abandonnés</div>
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
            placeholder="Rechercher par nom, téléphone ou résumé..."
            className="input-field pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <select
            value={selectedFilter}
            onChange={e => setSelectedFilter(e.target.value as typeof selectedFilter)}
            className="input-field"
          >
            <option value="all">Tous les appels</option>
            <option value="completed">Terminés</option>
            <option value="missed">Manqués</option>
            <option value="abandoned">Abandonnés</option>
          </select>
        </div>
      </div>

      {/* Calls List */}
      {filteredCalls.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Aucun appel trouvé
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCalls.map((call, index) => (
            <motion.div
              key={call.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="flex items-start gap-4">
                {/* Sentiment Emoji */}
                <div className="text-3xl">{getSentimentEmoji(call.sentiment)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="font-semibold">{call.client_name || 'Inconnu'}</div>
                      {call.phone && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {call.phone}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(call.status)}
                    </div>
                  </div>

                  {call.summary && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {call.summary}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(new Date(call.timestamp), "d MMM 'à' HH:mm", { locale: fr })}
                    </span>
                    <span>
                      Durée: {formatDuration(call.duration)}
                    </span>
                    {call.recording_url && (
                      <button className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300">
                        <PlayCircle className="w-4 h-4" />
                        Écouter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

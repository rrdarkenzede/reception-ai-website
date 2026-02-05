import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Calendar, 
  TrendingUp, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Users
} from 'lucide-react';
import { Profile, Booking, CallLog } from '@/lib/types';
import { getStats, bookingStore, callLogStore } from '@/lib/store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DashboardContext {
  user: Profile;
  isGhostMode: boolean;
}

export function DashboardPage() {
  const { user } = useOutletContext<DashboardContext>();
  const [stats, setStats] = useState({ callsToday: 0, bookingsToday: 0, conversionRate: 0, activeCall: false });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentCalls, setRecentCalls] = useState<CallLog[]>([]);

  useEffect(() => {
    if (user) {
      setStats(getStats(user.id));
      setRecentBookings(bookingStore.getAll(user.id).slice(0, 5));
      setRecentCalls(callLogStore.getRecent(user.id, 5));
    }
  }, [user]);

  const statsCards = [
    {
      title: "Appels aujourd'hui",
      value: stats.callsToday,
      icon: Phone,
      change: "+12%",
      positive: true,
      color: "cyan"
    },
    {
      title: "Réservations",
      value: stats.bookingsToday,
      icon: Calendar,
      change: "+8%",
      positive: true,
      color: "emerald"
    },
    {
      title: "Taux de conversion",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
      change: "+5%",
      positive: true,
      color: "blue"
    },
    {
      title: "Statut IA",
      value: stats.activeCall ? "En appel" : "En ligne",
      icon: Activity,
      color: stats.activeCall ? "orange" : "emerald",
      isStatus: true
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-emerald">Confirmé</span>;
      case 'pending':
        return <span className="badge badge-yellow">En attente</span>;
      case 'vip':
        return <span className="badge badge-orange">VIP</span>;
      case 'cancelled':
        return <span className="badge badge-red">Annulé</span>;
      default:
        return <span className="badge badge-cyan">{status}</span>;
    }
  };

  const getSentimentEmoji = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'urgent': return '🚨';
      case 'negative': return '😕';
      default: return '📞';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue, {user.name}. Voici un aperçu de votre activité.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                ${stat.color === 'cyan' ? 'bg-cyan-500/20' : ''}
                ${stat.color === 'emerald' ? 'bg-emerald-500/20' : ''}
                ${stat.color === 'blue' ? 'bg-blue-500/20' : ''}
                ${stat.color === 'orange' ? 'bg-orange-500/20' : ''}
              `}>
                <stat.icon className={`w-5 h-5
                  ${stat.color === 'cyan' ? 'text-cyan-400' : ''}
                  ${stat.color === 'emerald' ? 'text-emerald-400' : ''}
                  ${stat.color === 'blue' ? 'text-blue-400' : ''}
                  ${stat.color === 'orange' ? 'text-orange-400' : ''}
                `} />
              </div>
              {stat.change && (
                <div className={`flex items-center text-sm ${stat.positive ? 'text-emerald-400' : 'text-destructive'}`}>
                  {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              )}
              {stat.isStatus && (
                <div className={`w-2 h-2 rounded-full animate-pulse
                  ${stat.color === 'emerald' ? 'bg-emerald-400' : 'bg-orange-400'}
                `} />
              )}
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.title}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Réservations récentes</h2>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune réservation pour le moment
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-medium">{booking.client_name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {format(new Date(`${booking.date}T${booking.time}`), "d MMM 'à' HH:mm", { locale: fr })}
                        <span>• {booking.guests} pers.</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Calls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Derniers appels</h2>
            <Phone className="w-5 h-5 text-muted-foreground" />
          </div>

          {recentCalls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun appel pour le moment
            </div>
          ) : (
            <div className="space-y-4">
              {recentCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getSentimentEmoji(call.sentiment)}</div>
                    <div>
                      <div className="font-medium">{call.client_name || call.phone || 'Inconnu'}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {call.summary || 'Pas de résumé'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(call.timestamp), 'HH:mm')}
                    </div>
                    {call.duration && (
                      <div className="text-xs text-muted-foreground">
                        {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

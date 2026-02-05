import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Phone, 
  DollarSign, 
  MessageSquare,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';
import { getAdminStats, DEMO_RESTAURANTS } from '@/lib/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function AdminPage() {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    activeRestaurants: 0,
    totalCalls: 0,
    mrr: 0,
    openTickets: 0,
  });

  useEffect(() => {
    setStats(getAdminStats());
  }, []);

  // Mock chart data
  const callsData = [
    { day: 'Lun', calls: 45 },
    { day: 'Mar', calls: 52 },
    { day: 'Mer', calls: 38 },
    { day: 'Jeu', calls: 65 },
    { day: 'Ven', calls: 78 },
    { day: 'Sam', calls: 92 },
    { day: 'Dim', calls: 54 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 4200 },
    { month: 'Fév', revenue: 5100 },
    { month: 'Mar', revenue: 6800 },
    { month: 'Avr', revenue: 7200 },
    { month: 'Mai', revenue: 8900 },
    { month: 'Juin', revenue: 9500 },
  ];

  const statsCards = [
    {
      title: "MRR",
      value: `${stats.mrr.toLocaleString()} €`,
      icon: DollarSign,
      change: "+12%",
      color: "emerald"
    },
    {
      title: "Restaurants actifs",
      value: stats.activeRestaurants,
      subtitle: `/ ${stats.totalRestaurants} total`,
      icon: Building2,
      color: "cyan"
    },
    {
      title: "Appels totaux",
      value: stats.totalCalls,
      icon: Phone,
      change: "+8%",
      color: "blue"
    },
    {
      title: "Tickets ouverts",
      value: stats.openTickets,
      icon: MessageSquare,
      color: stats.openTickets > 0 ? "orange" : "emerald"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Panel Administrateur</h1>
        <p className="text-muted-foreground">Vue d'ensemble de la plateforme ReceptionAI</p>
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
                <div className="flex items-center text-sm text-emerald-400">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              )}
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">
              {stat.title}
              {stat.subtitle && <span className="ml-1">{stat.subtitle}</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calls Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Appels cette semaine</h2>
            <Phone className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={callsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(10,10,10,0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="calls" fill="#00f2ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Évolution MRR</h2>
            <DollarSign className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(10,10,10,0.95)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value} €`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Restaurants */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Restaurants récents</h2>
          <Users className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {DEMO_RESTAURANTS.map((restaurant) => (
            <div key={restaurant.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="font-medium">{restaurant.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Plan: <span className="capitalize">{restaurant.subscription_tier}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${restaurant.is_active ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span className="text-sm text-muted-foreground">
                  {restaurant.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">État du système</h2>
          <Activity className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-emerald-400">API Voice</span>
            </div>
            <p className="text-sm text-muted-foreground">Opérationnel - Latence 450ms</p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-emerald-400">Base de données</span>
            </div>
            <p className="text-sm text-muted-foreground">Opérationnel - 99.9% uptime</p>
          </div>
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-emerald-400">Webhooks</span>
            </div>
            <p className="text-sm text-muted-foreground">Opérationnel - 0 erreurs</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

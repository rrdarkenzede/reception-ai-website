import { motion } from 'framer-motion';
import { Phone, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsTodayProps {
  callsCount: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export function StatsToday({ callsCount, trend = 'neutral', trendValue }: StatsTodayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card rounded-2xl p-5 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">Aujourd'hui</span>
        {trend !== 'neutral' && trendValue && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend === 'up' ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          )}>
            <TrendingUp className={cn("w-3 h-3", trend === 'down' && "rotate-180")} />
            {trendValue}
          </div>
        )}
      </div>

      {/* Large number */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mb-2"
      >
        <span className="text-5xl font-bold text-foreground tracking-tight">{callsCount}</span>
      </motion.div>

      {/* Label */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <Phone className="w-4 h-4" />
        <span className="text-sm">Appels traités</span>
      </div>
    </motion.div>
  );
}

export default StatsToday;

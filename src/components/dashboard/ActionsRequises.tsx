import { motion } from 'framer-motion';
import { AlertTriangle, Bell, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Action {
  id: string;
  title: string;
  type: 'urgent' | 'warning' | 'info';
  count?: number;
}

interface ActionsRequisesProps {
  actions: Action[];
  onActionClick?: (action: Action) => void;
}

export function ActionsRequises({ actions, onActionClick }: ActionsRequisesProps) {
  const totalCount = actions.reduce((acc, a) => acc + (a.count || 1), 0);
  const hasUrgent = actions.some(a => a.type === 'urgent');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(
        "glass-card rounded-2xl p-5 h-full relative overflow-hidden",
        hasUrgent && "border-l-4 border-l-red-500"
      )}
    >
      {/* Urgent glow effect */}
      {hasUrgent && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <div className={cn(
          "p-2 rounded-lg",
          hasUrgent ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
        )}>
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h3 className={cn(
            "text-sm font-semibold",
            hasUrgent ? "text-red-400" : "text-orange-400"
          )}>
            Actions Requises
          </h3>
          <p className="text-xs text-muted-foreground">
            {totalCount} rappel{totalCount > 1 ? 's' : ''} à effectuer.
          </p>
        </div>
      </div>

      {/* Actions list */}
      <div className="space-y-2 mb-4 relative z-10">
        {actions.slice(0, 3).map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={cn(
              "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
              action.type === 'urgent' 
                ? "bg-red-500/10 hover:bg-red-500/20" 
                : "bg-secondary/30 hover:bg-secondary/50"
            )}
            onClick={() => onActionClick?.(action)}
          >
            <div className="flex items-center gap-2">
              <Bell className={cn(
                "w-4 h-4",
                action.type === 'urgent' ? "text-red-400" : "text-muted-foreground"
              )} />
              <span className="text-sm text-foreground">{action.title}</span>
            </div>
            {action.count && action.count > 1 && (
              <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                {action.count}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      {hasUrgent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10"
        >
          <Button 
            variant="destructive" 
            size="sm"
            className="w-full gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/25"
            onClick={() => onActionClick?.(actions.find(a => a.type === 'urgent')!)}
          >
            <AlertTriangle className="w-4 h-4" />
            Rappel Urgence
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ActionsRequises;

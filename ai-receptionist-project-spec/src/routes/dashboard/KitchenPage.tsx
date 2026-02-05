import { useState, useEffect } from 'react';
import { useOutletContext, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChefHat, 
  Clock, 
  CheckCircle,
  Users,
  MapPin,
  Package,
  Truck
} from 'lucide-react';
import { Profile, Booking } from '@/lib/types';
import { canAccessFeature } from '@/lib/tier-access';
import { bookingStore } from '@/lib/store';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

interface DashboardContext {
  user: Profile;
}

type OrderType = 'dine_in' | 'takeaway' | 'delivery';

interface KitchenOrder extends Booking {
  orderType: OrderType;
  items: { name: string; quantity: number; notes?: string }[];
  receivedAt: string;
}

export function KitchenPage() {
  const { user } = useOutletContext<DashboardContext>();
  
  // Check tier access
  if (!canAccessFeature(user.tier, 'kitchenView')) {
    return <Navigate to="/dashboard" replace />;
  }

  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<OrderType | 'all'>('all');

  useEffect(() => {
    // Generate demo kitchen orders from bookings
    const bookings = bookingStore.getAll(user.id);
    const kitchenOrders: KitchenOrder[] = bookings
      .filter(b => b.status !== 'cancelled')
      .map((booking, index) => ({
        ...booking,
        orderType: (['dine_in', 'takeaway', 'delivery'] as OrderType[])[index % 3],
        items: [
          { name: 'Pizza Margherita', quantity: 1 },
          { name: 'Tiramisu', quantity: 2, notes: 'Sans café' },
        ],
        receivedAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      }));
    setOrders(kitchenOrders);
  }, [user.id]);

  const getOrderTypeConfig = (type: OrderType) => {
    switch (type) {
      case 'dine_in':
        return {
          label: 'Sur place',
          icon: Users,
          color: 'bg-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/40',
          textColor: 'text-blue-400'
        };
      case 'takeaway':
        return {
          label: 'À emporter',
          icon: Package,
          color: 'bg-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/40',
          textColor: 'text-yellow-400'
        };
      case 'delivery':
        return {
          label: 'Livraison',
          icon: Truck,
          color: 'bg-orange-500',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/40',
          textColor: 'text-orange-400'
        };
    }
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders(orders.filter(o => o.id !== orderId));
    toast.success('Commande terminée !');
  };

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter(o => o.orderType === selectedFilter);

  const ordersByType = {
    dine_in: orders.filter(o => o.orderType === 'dine_in'),
    takeaway: orders.filter(o => o.orderType === 'takeaway'),
    delivery: orders.filter(o => o.orderType === 'delivery'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ChefHat className="w-7 h-7 text-cyan-400" />
            Kitchen Display System
          </h1>
          <p className="text-muted-foreground">Commandes en temps réel</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-400">En direct</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedFilter('all')}
          className={cn(
            "px-4 py-2 rounded-full whitespace-nowrap transition-all",
            selectedFilter === 'all'
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
              : "glass-card hover:bg-white/5"
          )}
        >
          Toutes ({orders.length})
        </button>
        {(['dine_in', 'takeaway', 'delivery'] as OrderType[]).map(type => {
          const config = getOrderTypeConfig(type);
          return (
            <button
              key={type}
              onClick={() => setSelectedFilter(type)}
              className={cn(
                "px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-2",
                selectedFilter === type
                  ? `${config.bgColor} ${config.textColor} border ${config.borderColor}`
                  : "glass-card hover:bg-white/5"
              )}
            >
              <config.icon className="w-4 h-4" />
              {config.label} ({ordersByType[type].length})
            </button>
          );
        })}
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground glass-card rounded-xl">
          <ChefHat className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucune commande en attente</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredOrders.map((order, index) => {
              const config = getOrderTypeConfig(order.orderType);
              const minutesAgo = Math.floor((Date.now() - new Date(order.receivedAt).getTime()) / 60000);
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: 100 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "glass-card rounded-xl overflow-hidden border-l-4",
                    config.borderColor
                  )}
                >
                  {/* Header */}
                  <div className={cn("p-3 flex items-center justify-between", config.bgColor)}>
                    <div className="flex items-center gap-2">
                      <config.icon className={cn("w-5 h-5", config.textColor)} />
                      <span className={cn("font-medium", config.textColor)}>{config.label}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {minutesAgo}min
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold">{order.client_name}</div>
                      {order.table_id && order.orderType === 'dine_in' && (
                        <span className="badge badge-cyan">{order.table_id}</span>
                      )}
                    </div>

                    {order.orderType === 'dine_in' && order.guests && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Users className="w-4 h-4" />
                        {order.guests} personnes
                      </div>
                    )}

                    {order.orderType === 'delivery' && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        45 Rue Oberkampf, Paris
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-2 mb-4 pt-3 border-t border-border">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="font-mono text-sm bg-white/10 px-2 py-0.5 rounded">
                            x{item.quantity}
                          </span>
                          <div className="flex-1">
                            <div className="text-sm">{item.name}</div>
                            {item.notes && (
                              <div className="text-xs text-yellow-400">⚠ {item.notes}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Terminée
                    </button>
                  </div>

                  {/* Time indicator */}
                  <div className={cn(
                    "h-1",
                    minutesAgo < 5 ? "bg-emerald-500" :
                    minutesAgo < 15 ? "bg-yellow-500" : "bg-red-500"
                  )} style={{ width: `${Math.min(100, (minutesAgo / 30) * 100)}%` }} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Legend */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="font-medium mb-3">Légende des couleurs</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-sm">Sur place</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500" />
            <span className="text-sm">À emporter</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span className="text-sm">Livraison</span>
          </div>
          <div className="border-l border-border pl-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded bg-emerald-500" />
              <span className="text-sm text-muted-foreground">&lt; 5min</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded bg-yellow-500" />
              <span className="text-sm text-muted-foreground">5-15min</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded bg-red-500" />
              <span className="text-sm text-muted-foreground">&gt; 15min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

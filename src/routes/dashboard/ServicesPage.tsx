import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, Edit2, Trash2, Clock, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';
import { getCurrentUser } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import type { User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  active: boolean;
  category: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Default services for restaurant
const DEFAULT_SERVICES: Service[] = [
  { id: '1', name: 'Réservation standard', description: 'Réservation de table classique', duration: 90, price: 0, active: true, category: 'Réservations' },
  { id: '2', name: 'Réservation groupe', description: 'Pour 8 personnes et plus', duration: 120, price: 0, active: true, category: 'Réservations' },
  { id: '3', name: 'Événement privé', description: 'Location salle pour événement', duration: 240, price: 500, active: true, category: 'Événements' },
  { id: '4', name: 'Brunch dominical', description: 'Formule brunch le dimanche', duration: 120, price: 35, active: true, category: 'Formules' },
  { id: '5', name: 'Menu dégustation', description: '7 plats signature du chef', duration: 150, price: 85, active: false, category: 'Formules' },
  { id: '6', name: 'Click & Collect', description: 'Commande à emporter', duration: 30, price: 0, active: true, category: 'À emporter' },
  { id: '7', name: 'Livraison', description: 'Livraison à domicile', duration: 45, price: 5, active: true, category: 'À emporter' },
];

export default function ServicesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Try to load services from user settings, fallback to defaults
          const userSettings = currentUser.settings as Record<string, unknown> | null;
          const savedServices = userSettings?.services as Service[] | undefined;
          setServices(savedServices || DEFAULT_SERVICES);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleService = async (serviceId: string) => {
    const updatedServices = services.map(s => 
      s.id === serviceId ? { ...s, active: !s.active } : s
    );
    setServices(updatedServices);

    // Persist to database
    if (user) {
      try {
        const currentSettings = (user.settings || {}) as Record<string, unknown>;
        await supabase
          .from('profiles')
          .update({ settings: { ...currentSettings, services: updatedServices } })
          .eq('id', user.id);
        toast.success('Service mis à jour');
      } catch {
        toast.error('Erreur lors de la mise à jour');
      }
    }
  };

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-sm text-muted-foreground">
            Configurez les services proposés à vos clients
          </p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Nouveau Service
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card border-border/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Briefcase className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{services.length}</p>
              <p className="text-sm text-muted-foreground">Services total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <ToggleRight className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {services.filter(s => s.active).length}
              </p>
              <p className="text-sm text-muted-foreground">Services actifs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500/10">
              <ToggleLeft className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {services.filter(s => !s.active).length}
              </p>
              <p className="text-sm text-muted-foreground">Services inactifs</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Services by Category */}
      {Object.entries(groupedServices).map(([category, categoryServices]) => (
        <motion.div key={category} variants={itemVariants}>
          <Card className="glass-card border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {category}
                <Badge variant="secondary" className="ml-2">
                  {categoryServices.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "relative p-4 rounded-xl border transition-all duration-200",
                      service.active 
                        ? "bg-secondary/20 border-border/30 hover:border-primary/30" 
                        : "bg-secondary/10 border-border/20 opacity-60"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{service.name}</h4>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      <Switch
                        checked={service.active}
                        onCheckedChange={() => toggleService(service.id)}
                      />
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration} min</span>
                      </div>
                      {service.price > 0 && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{service.price}€</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-4 right-12 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

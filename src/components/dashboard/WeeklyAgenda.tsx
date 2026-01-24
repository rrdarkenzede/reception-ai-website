import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Event {
  id: string;
  date: Date;
  title: string;
  type?: 'reservation' | 'call' | 'reminder';
}

interface WeeklyAgendaProps {
  events?: Event[];
  onDayClick?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
}

const DAYS_FR = ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.'];

export function WeeklyAgenda({ events = [], onDayClick, onEventClick }: WeeklyAgendaProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const weekStart = useMemo(() => 
    startOfWeek(currentDate, { weekStartsOn: 1 }), 
    [currentDate]
  );
  
  const weekDays = useMemo(() => 
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const today = new Date();

  const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  const getEventsForDay = (date: Date) => 
    events.filter(e => isSameDay(e.date, date));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card rounded-2xl p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Agenda</h3>
        
        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg hover:bg-secondary/50"
            onClick={goToPreviousWeek}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <span className="text-sm font-medium text-foreground min-w-[120px] text-center">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg hover:bg-secondary/50"
            onClick={goToNextWeek}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const isToday = isSameDay(day, today);
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              onClick={() => onDayClick?.(day)}
              className={cn(
                "relative flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all duration-200",
                isToday 
                  ? "bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 shadow-lg shadow-orange-500/10" 
                  : "bg-secondary/20 border border-transparent hover:bg-secondary/40 hover:border-white/10"
              )}
            >
              {/* Day name */}
              <span className={cn(
                "text-xs font-medium mb-1",
                isToday ? "text-orange-400" : "text-muted-foreground"
              )}>
                {DAYS_FR[index]}
              </span>

              {/* Day number */}
              <span className={cn(
                "text-lg font-bold",
                isToday ? "text-orange-400" : "text-foreground"
              )}>
                {format(day, 'd')}
              </span>

              {/* Event indicator */}
              <div className="h-2 flex items-center justify-center mt-2">
                {hasEvents && (
                  <div className="flex gap-1">
                    {dayEvents.slice(0, 3).map((event, i) => (
                      <motion.div
                        key={event.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          event.type === 'reservation' ? "bg-blue-400" :
                          event.type === 'call' ? "bg-green-400" :
                          event.type === 'reminder' ? "bg-orange-400" :
                          "bg-gray-400"
                        )}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Today's events preview */}
      {events.filter(e => isSameDay(e.date, today)).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 pt-4 border-t border-border/30"
        >
          <p className="text-xs text-muted-foreground mb-2">Aujourd'hui</p>
          <div className="space-y-2">
            {events.filter(e => isSameDay(e.date, today)).slice(0, 2).map((event) => (
              <div
                key={event.id}
                onClick={() => onEventClick?.(event)}
                className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  event.type === 'reservation' ? "bg-blue-400" :
                  event.type === 'call' ? "bg-green-400" :
                  "bg-orange-400"
                )} />
                <span className="text-sm text-foreground truncate">{event.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default WeeklyAgenda;

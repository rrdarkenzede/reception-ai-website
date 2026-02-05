import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X,
  Phone,
  Mail,
  Users,
  Clock,
  MessageSquare,
  Edit,
  Trash2
} from 'lucide-react';
import { Profile, Booking, BookingStatus } from '@/lib/types';
import { bookingStore } from '@/lib/store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface DashboardContext {
  user: Profile;
}

export function AgendaPage() {
  const { user } = useOutletContext<DashboardContext>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    notes: '',
    status: 'pending' as BookingStatus
  });

  useEffect(() => {
    if (user) {
      setBookings(bookingStore.getAll(user.id));
    }
  }, [user]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getBookingsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.filter(b => b.date === dateStr);
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const openNewBookingModal = () => {
    setEditingBooking(null);
    setFormData({
      client_name: '',
      email: '',
      phone: '',
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      time: '12:00',
      guests: 2,
      notes: '',
      status: 'pending'
    });
    setIsModalOpen(true);
  };

  const openEditBookingModal = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      client_name: booking.client_name,
      email: booking.email || '',
      phone: booking.phone || '',
      date: booking.date,
      time: booking.time,
      guests: booking.guests,
      notes: booking.notes || '',
      status: booking.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBooking) {
      const updated = bookingStore.update(editingBooking.id, formData);
      if (updated) {
        setBookings(bookingStore.getAll(user.id));
        toast.success('Réservation modifiée');
      }
    } else {
      const newBooking = bookingStore.create({
        ...formData,
        profile_id: user.id
      });
      setBookings([...bookings, newBooking]);
      toast.success('Réservation créée');
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (booking: Booking) => {
    if (confirm('Supprimer cette réservation ?')) {
      bookingStore.delete(booking.id);
      setBookings(bookingStore.getAll(user.id));
      toast.success('Réservation supprimée');
    }
  };

  const handleCall = (phone?: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      toast.error('Pas de numéro de téléphone');
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-500';
      case 'pending': return 'bg-yellow-500';
      case 'vip': return 'bg-orange-500';
      case 'cancelled': return 'bg-red-500';
      case 'in_progress': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-cyan-500';
    }
  };

  const selectedDayBookings = selectedDate ? getBookingsForDay(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agenda</h1>
          <p className="text-muted-foreground">Gérez vos réservations</p>
        </div>
        <button onClick={openNewBookingModal} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvelle réservation
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card rounded-xl p-6"
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-white/5 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: fr })}
            </h2>
            <button onClick={handleNextMonth} className="p-2 hover:bg-white/5 rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="text-center text-sm text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for start of month offset */}
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {days.map(day => {
              const dayBookings = getBookingsForDay(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "aspect-square rounded-lg p-1 flex flex-col items-center justify-start transition-all hover:bg-white/5",
                    isSelected && "ring-2 ring-cyan-400 bg-cyan-500/10",
                    isToday && !isSelected && "bg-white/5",
                    !isSameMonth(day, currentDate) && "opacity-30"
                  )}
                >
                  <span className={cn(
                    "text-sm w-6 h-6 flex items-center justify-center rounded-full",
                    isToday && "bg-cyan-500 text-black font-bold"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayBookings.length > 0 && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                      {dayBookings.slice(0, 3).map(b => (
                        <div
                          key={b.id}
                          className={cn("w-1.5 h-1.5 rounded-full", getStatusColor(b.status))}
                        />
                      ))}
                      {dayBookings.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{dayBookings.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Selected Day Bookings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="font-semibold mb-4">
            {selectedDate 
              ? format(selectedDate, "d MMMM yyyy", { locale: fr })
              : "Sélectionnez un jour"
            }
          </h3>

          {selectedDate && (
            <>
              {selectedDayBookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune réservation ce jour
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayBookings.map(booking => (
                    <div key={booking.id} className="p-3 rounded-lg bg-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{booking.client_name}</div>
                        <div className={cn("w-2 h-2 rounded-full", getStatusColor(booking.status))} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {booking.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {booking.guests}
                        </span>
                      </div>
                      {booking.notes && (
                        <div className="text-sm text-muted-foreground flex items-start gap-1">
                          <MessageSquare className="w-3 h-3 mt-0.5" />
                          <span className="line-clamp-2">{booking.notes}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleCall(booking.phone)}
                          className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditBookingModal(booking)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(booking)}
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Booking Modal */}
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
                <h2 className="text-xl font-semibold">
                  {editingBooking ? 'Modifier la réservation' : 'Nouvelle réservation'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nom du client *</label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                    className="input-field mt-1"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="input-field mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Heure *</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={e => setFormData({ ...formData, time: e.target.value })}
                      className="input-field mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Personnes</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.guests}
                      onChange={e => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Statut</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as BookingStatus })}
                      className="input-field mt-1"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmé</option>
                      <option value="vip">VIP</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field mt-1 pl-10"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="input-field mt-1 pl-10"
                      placeholder="client@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="input-field mt-1 min-h-[80px] resize-none"
                    placeholder="Informations complémentaires..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    {editingBooking ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

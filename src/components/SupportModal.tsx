import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Send, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  userEmail: string;
  userId: string;
}

export function SupportModal({ isOpen, onClose, restaurantName, userEmail: _userEmail, userId }: SupportModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'menu_change' | 'bug' | 'feature' | 'billing' | 'other'>('menu_change');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('support_tickets').insert({
        profile_id: userId,
        subject: subject || `[${restaurantName}] Demande de support`,
        message,
        category,
        status: 'open',
        priority: category === 'menu_change' ? 'high' : 'normal',
      });

      if (error) throw error;

      toast.success('Ticket envoyé ! Notre équipe vous recontactera sous 24h.');
      setSubject('');
      setMessage('');
      onClose();
    } catch (err) {
      console.error('Error submitting ticket:', err);
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none"
          >
            <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ff4d00]/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#ff4d00]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Contacter le Support</h2>
                    <p className="text-sm text-muted-foreground">{restaurantName}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Category */}
                <div className="space-y-2">
                  <Label>Type de demande</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'menu_change', label: 'Modification Menu' },
                      { value: 'bug', label: 'Problème Technique' },
                      { value: 'feature', label: 'Nouvelle Fonction' },
                      { value: 'billing', label: 'Facturation' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setCategory(opt.value as typeof category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          category === opt.value
                            ? 'bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/30'
                            : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    placeholder="Ex: Ajouter un nouveau plat au menu"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-white/5 border-white/10"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Décrivez votre demande en détail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="bg-white/5 border-white/10 resize-none"
                  />
                </div>

                {/* Alert */}
                <div className="p-4 rounded-lg bg-[#ff4d00]/10 border border-[#ff4d00]/20 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#ff4d00] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Pour les urgences menu (Mode 86), décrivez les plats concernés. 
                    Notre équipe traite ces demandes en priorité.
                  </p>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={!message || isSubmitting}
                  className="w-full bg-gradient-to-r from-[#00f2ff] to-blue-600 text-white font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer le Ticket
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

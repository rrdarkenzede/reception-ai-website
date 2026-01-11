import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SentimentRing } from './SentimentRing'
import { AudioPlayer } from './AudioPlayer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, PhoneIncoming, PhoneOutgoing, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface CallLog {
  id: string
  profile_id: string
  caller_name: string | null
  caller_phone: string | null
  type: 'incoming' | 'outgoing'
  status: 'completed' | 'missed' | 'in_progress' | 'cancelled'
  duration: number | null
  recording_url: string | null
  transcript: string | null
  sentiment_score: number | null
  metadata: Record<string, unknown>
  created_at: string
}

export function LiveCallFeed({ profileId }: { profileId: string }) {
  const [calls, setCalls] = useState<CallLog[]>([])
  const [expandedTranscript, setExpandedTranscript] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch initial calls
    const fetchCalls = async () => {
      try {
        const { data, error } = await supabase
          .from('call_logs')
          .select('*')
          .eq('profile_id', profileId)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error
        if (data) setCalls(data as CallLog[])
      } catch (error) {
        console.error('Error fetching calls:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCalls()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('call_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'call_logs',
          filter: `profile_id=eq.${profileId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCalls((prev) => [payload.new as CallLog, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setCalls((prev) =>
              prev.map((call) => (call.id === payload.new.id ? (payload.new as CallLog) : call))
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [profileId])

  if (loading) {
    return <div className="text-center text-muted-foreground p-8">Chargement des appels...</div>
  }

  return (
    <div className="space-y-4">
      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Feed d&apos;appels en direct
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {calls.length === 0 ? (
              <div className="text-center text-muted-foreground p-8">Aucun appel pour le moment</div>
            ) : (
              <div className="space-y-3">
                {calls.map((call) => (
                  <motion.div
                    key={call.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="glass-card rounded-lg p-4 border-border/30"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar with sentiment ring */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          {call.type === 'incoming' ? (
                            <PhoneIncoming className="w-6 h-6 text-primary" />
                          ) : (
                            <PhoneOutgoing className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        {call.sentiment_score && (
                          <div className="absolute -bottom-1 -right-1">
                            <SentimentRing score={call.sentiment_score} size={24} />
                          </div>
                        )}
                      </div>

                      {/* Call info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-foreground">
                              {call.caller_name || 'Appelant inconnu'}
                            </p>
                            <p className="text-sm text-muted-foreground">{call.caller_phone}</p>
                          </div>
                          <div className="text-right">
                            <span
                              className={cn(
                                'text-xs px-2 py-1 rounded-full',
                                call.status === 'completed'
                                  ? 'bg-success/10 text-success'
                                  : call.status === 'missed'
                                  ? 'bg-destructive/10 text-destructive'
                                  : 'bg-warning/10 text-warning'
                              )}
                            >
                              {call.status === 'completed'
                                ? 'Terminé'
                                : call.status === 'missed'
                                ? 'Manqué'
                                : 'En cours'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {call.duration ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s` : '-'}
                          </div>
                          <span>{new Date(call.created_at).toLocaleString('fr-FR')}</span>
                        </div>

                        {/* Audio player */}
                        {call.recording_url && (
                          <div className="mb-3">
                            <AudioPlayer url={call.recording_url} />
                          </div>
                        )}

                        {/* Transcript */}
                        {call.transcript && (
                          <div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setExpandedTranscript(expandedTranscript === call.id ? null : call.id)
                              }
                              className="text-xs"
                            >
                              {expandedTranscript === call.id ? (
                                <>
                                  Masquer la transcription <ChevronUp className="w-3 h-3 ml-1" />
                                </>
                              ) : (
                                <>
                                  Voir la transcription <ChevronDown className="w-3 h-3 ml-1" />
                                </>
                              )}
                            </Button>
                            {expandedTranscript === call.id && (
                              <div className="mt-2 p-3 bg-secondary/30 rounded-lg text-sm text-muted-foreground">
                                {call.transcript}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}

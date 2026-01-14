import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type TriagePatient = {
  id: string
  title: string
  subtitle?: string
  urgent?: boolean
  badge?: string
  createdAt?: string // Add timestamp for sorting
}

export function TriageList({ patients }: { patients: TriagePatient[] }) {
  // Sort by urgency first, then by creation date (newest first)
  const sortedPatients = [...patients].sort((a, b) => {
    // Urgent items first
    if (a.urgent && !b.urgent) return -1
    if (!a.urgent && b.urgent) return 1
    
    // Then by creation date (newest first)
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    
    return 0
  })

  return (
    <div className="space-y-2">
      {sortedPatients.map((p) => (
        <motion.div
          key={p.id}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-colors',
            'bg-white/3 border-white/8 backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]',
            p.urgent
              ? 'bg-red-950/20 border-red-500/30 text-red-200 animate-pulse-red' // Add pulse animation
              : 'hover:border-(--theme-primary)/60'
          )}
        >
          <div className="min-w-0">
            <div className={cn('flex items-center gap-2 truncate font-medium tracking-tight', p.urgent ? 'text-red-200' : 'text-foreground')}>
              {p.urgent ? (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400/60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-400" />
                </span>
              ) : null}
              <span className="truncate">{p.title}</span>
            </div>
            {p.subtitle ? (
              <div className={cn('mt-1 truncate text-sm', p.urgent ? 'text-red-200/70' : 'text-muted-foreground')}>
                {p.subtitle}
              </div>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {p.badge ? (
              <div
                className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                style={{
                  color: 'var(--theme-primary)',
                  borderColor: 'rgba(255,255,255,0.08)',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                }}
              >
                {p.badge}
              </div>
            ) : null}
            {p.urgent ? (
              <div className="rounded-full border border-red-500/30 bg-red-950/20 px-2 py-0.5 text-[10px] font-semibold text-red-200 animate-pulse-red">
                URGENT
              </div>
            ) : null}
          </div>
        </motion.div>
      ))}

      {sortedPatients.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">No patients</div>
      ) : null}
    </div>
  )
}

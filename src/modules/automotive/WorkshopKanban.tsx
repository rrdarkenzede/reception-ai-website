import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type KanbanStatus = 'waiting' | 'lifting' | 'done'

export type WorkshopTicket = {
  id: string
  title: string
  badge?: string
  subtitle?: string
  status: KanbanStatus
}

const columns: Array<{ id: KanbanStatus; label: string }> = [
  { id: 'waiting', label: 'Waiting' },
  { id: 'lifting', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

export function WorkshopKanban({ tickets }: { tickets: WorkshopTicket[] }) {
  const grouped = useMemo(() => {
    const map: Record<KanbanStatus, WorkshopTicket[]> = {
      waiting: [],
      lifting: [],
      done: [],
    }

    for (const t of tickets) map[t.status].push(t)
    return map
  }, [tickets])

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {columns.map((col) => (
        <div
          key={col.id}
          className="glass-card rounded-xl border-border/30 p-4"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}
        >
          <div className="mb-3 flex items-center justify-between rounded-lg border border-dashed border-white/10 px-3 py-2">
            <div className="text-xs font-medium tracking-tight text-foreground">Workshop Bay</div>
            <div className="text-xs text-muted-foreground">{col.label}</div>
          </div>

          <div className="space-y-2">
            {grouped[col.id].map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'group relative rounded-lg border p-3 transition-colors',
                  'backdrop-blur-md transition-colors',
                  'bg-white/3 border-white/8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]',
                  'hover:border-(--theme-primary)/60',
                  t.status === 'lifting' && 'shadow-[0_0_15px_-3px_rgba(250,204,21,0.3)]'
                )}
              >
                <div className="absolute left-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="cursor-grab select-none text-xs text-muted-foreground">⋮⋮</div>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-mono text-sm text-foreground">{t.title}</div>
                    {t.subtitle ? (
                      <div className="mt-0.5 truncate text-xs text-muted-foreground">{t.subtitle}</div>
                    ) : null}
                  </div>
                  {t.badge ? (
                    <div
                      className="shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold"
                      style={{
                        color: 'var(--theme-primary)',
                        borderColor: 'rgba(255,255,255,0.08)',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                      }}
                    >
                      {t.badge}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}

            {grouped[col.id].length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No vehicles in workshop</div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

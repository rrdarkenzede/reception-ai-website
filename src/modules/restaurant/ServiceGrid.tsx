import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type ServiceTable = {
  id: string
  label: string
  active: boolean
  guests?: number
  title?: string
  badge?: string
}

export function ServiceGrid({ tables }: { tables: ServiceTable[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tables.map((t) => (
        (() => {
          const occupied = typeof t.guests === 'number' ? t.guests > 0 : t.active

          return (
        <motion.div
          key={t.id}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'rounded-xl border p-4 transition-all duration-200',
            'backdrop-blur-md shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]',
            occupied
              ? 'bg-white/5 border-orange-500/50 hover:border-orange-500/70 hover:shadow-lg'
              : 'bg-white/3 border-white/8 opacity-60 hover:opacity-80'
          )}
          style={occupied ? { 
            boxShadow: '0 0 24px rgba(251, 146, 60, 0.25), 0 4px 12px rgba(251, 146, 60, 0.15)' 
          } : undefined}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm font-medium tracking-tight text-foreground">{t.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{occupied ? 'Occupied' : 'Empty'}</div>
            </div>
            {t.badge ? (
              <div
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                  'bg-black/60 text-orange-200 border-orange-500/40'
                )}
              >
                {t.badge}
              </div>
            ) : null}
          </div>

          {t.title ? (
            <div className="mt-4 text-xs text-muted-foreground">{t.title}</div>
          ) : (
            <div className="mt-4 text-xs text-muted-foreground">No reservation</div>
          )}
        </motion.div>
          )
        })()
      ))}
    </div>
  )
}

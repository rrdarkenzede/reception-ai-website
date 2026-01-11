'use client'

import * as React from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-4',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium text-foreground',
        nav: 'flex items-center gap-1',
        nav_button: cn(
          buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
          'h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20',
          '[&:has([aria-selected])]:bg-white/3',
          'first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
        ),
        day: cn(
          buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
        ),
        day_selected:
          'bg-white/6 text-foreground border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]',
        day_today: 'bg-white/4 text-foreground',
        day_outside: 'text-muted-foreground/40 opacity-60',
        day_disabled: 'text-muted-foreground/30 opacity-50',
        day_range_middle: 'aria-selected:bg-white/3 aria-selected:text-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ className: iconClassName, orientation, size }: { 
          className?: string
          size?: number
          disabled?: boolean
          orientation?: 'left' | 'right' | 'up' | 'down'
        }) => {
          const cls = cn(iconClassName)
          const iconSize = typeof size === 'number' ? size : 16

          if (orientation === 'left') return <ChevronLeft className={cls} size={iconSize} />
          if (orientation === 'up') return <ChevronUp className={cls} size={iconSize} />
          if (orientation === 'down') return <ChevronDown className={cls} size={iconSize} />
          return <ChevronRight className={cls} size={iconSize} />
        },
      }}
      {...props}
    />
  )
}

export { Calendar }

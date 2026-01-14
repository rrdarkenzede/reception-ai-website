import { LucideIcon } from "lucide-react"

interface EmptyPlaceholderProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyPlaceholder({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: EmptyPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted/30 mb-4">
        <Icon className="w-10 h-10 text-muted-foreground/30" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

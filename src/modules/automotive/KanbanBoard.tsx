import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Car, Clock, CheckCircle } from 'lucide-react'

interface Vehicle {
  id: string
  client_name: string
  vehicle_brand: string
  vehicle_model: string
  license_plate: string
  repair_type: string
  status: 'waiting' | 'workshop' | 'ready'
  estimated_cost?: number
}

interface KanbanBoardProps {
  vehicles: Vehicle[]
  onStatusChange: (id: string, status: Vehicle['status']) => void
}

const columns = [
  { id: 'waiting', label: 'En attente', icon: Clock, color: 'bg-warning/10 border-warning/30' },
  { id: 'workshop', label: 'Atelier', icon: Car, color: 'bg-primary/10 border-primary/30' },
  { id: 'ready', label: 'Prêt', icon: CheckCircle, color: 'bg-success/10 border-success/30' },
] as const

export function KanbanBoard({ vehicles, onStatusChange }: KanbanBoardProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: Vehicle['status']) => {
    if (draggedItem) {
      onStatusChange(draggedItem, status)
      setDraggedItem(null)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {columns.map((column) => {
        const columnVehicles = vehicles.filter((v) => v.status === column.id)
        const Icon = column.icon

        return (
          <Card key={column.id} className={cn('glass-card border-border/30', column.color)}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Icon className="w-4 h-4" />
                {column.label}
                <span className="ml-auto text-xs bg-secondary/50 px-2 py-0.5 rounded-full">
                  {columnVehicles.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
              className="space-y-2 min-h-[200px]"
            >
              {columnVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  draggable
                  onDragStart={() => handleDragStart(vehicle.id)}
                  className="p-3 glass-card rounded-lg border-border/30 cursor-move hover:border-primary/50 transition-colors"
                >
                  <div className="font-semibold text-sm">{vehicle.client_name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {vehicle.vehicle_brand} {vehicle.vehicle_model}
                  </div>
                  <div className="text-xs text-muted-foreground">{vehicle.license_plate}</div>
                  <div className="text-xs font-medium mt-2">{vehicle.repair_type}</div>
                  {vehicle.estimated_cost && (
                    <div className="text-xs text-primary font-semibold mt-1">
                      {vehicle.estimated_cost}€
                    </div>
                  )}
                </div>
              ))}
              {columnVehicles.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  Aucun véhicule
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

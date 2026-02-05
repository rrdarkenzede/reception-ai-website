import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface PanicButtonProps {
  onPanic: () => Promise<void>
  isPaused?: boolean
}

export function PanicButton({ onPanic, isPaused = false }: PanicButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePanic = async () => {
    setIsLoading(true)
    try {
      await onPanic()
      toast.error('Tous les appels ont été arrêtés')
    } catch (error) {
      toast.error('Erreur lors de l\'arrêt des appels')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className={cn(
            'gap-2',
            isPaused && 'animate-pulse-glow'
          )}
        >
          <AlertTriangle className="w-4 h-4" />
          {isPaused ? 'Service Arrêté' : 'Panic Button'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="glass-strong border-destructive/50">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Arrêt d&apos;urgence
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Cette action va arrêter immédiatement tous les appels entrant et sortant de votre système NeuralVoice™.
            Cette action ne peut pas être annulée automatiquement.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handlePanic}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? 'Arrêt en cours...' : 'Confirmer l\'arrêt'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

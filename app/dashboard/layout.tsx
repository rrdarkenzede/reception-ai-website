"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/store"
import type { User } from "@/lib/types"
import { ClientSidebar } from "@/components/dashboard/client-sidebar"
import { ClientNavbar } from "@/components/dashboard/client-navbar"
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [showPanicDialog, setShowPanicDialog] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
    } else if (currentUser.role === "admin") {
      router.push("/admin")
    } else {
      setUser(currentUser)
      setIsLoading(false)
    }
  }, [router])

  const handlePanicClick = () => {
    if (isPaused) {
      setIsPaused(false)
      toast.success("Appels repris avec succès")
    } else {
      setShowPanicDialog(true)
    }
  }

  const confirmPanic = () => {
    setIsPaused(true)
    setShowPanicDialog(false)
    toast.warning("Tous les appels sont en pause", {
      description: "Cliquez sur GO pour reprendre",
    })
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar sector={user.sector || "restaurant"} plan={user.plan || "starter"} />
      <div className="ml-64">
        <ClientNavbar user={user} onPanicClick={handlePanicClick} isPaused={isPaused} />
        <main className="p-6">{children}</main>
      </div>

      {/* Panic Confirmation Dialog */}
      <AlertDialog open={showPanicDialog} onOpenChange={setShowPanicDialog}>
        <AlertDialogContent className="glass-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Arrêter tous les appels ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action mettra en pause tous les appels entrants et sortants. Vous pourrez les reprendre à tout
              moment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPanic} className="bg-destructive hover:bg-destructive/90">
              Oui, Arrêter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

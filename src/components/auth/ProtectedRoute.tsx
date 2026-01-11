import { useEffect, useState, type ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"

type ProtectedRouteProps = {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!mounted) return
        setHasSession(!!session)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setHasSession(!!session)
      setLoading(false)
    })

    return () => {
      data.subscription.unsubscribe()
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  if (!hasSession) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

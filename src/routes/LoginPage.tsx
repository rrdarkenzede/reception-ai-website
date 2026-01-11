import { useState, useEffect, type FormEvent } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Target, Eye, EyeOff, Loader2, Phone } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [shake, setShake] = useState(false)

  useEffect(() => {
    let mounted = true

    async function checkExistingSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!mounted) return
      if (session) navigate("/dashboard", { replace: true })
    }

    checkExistingSession()

    return () => {
      mounted = false
    }
  }, [navigate])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      navigate("/dashboard", { replace: true })
    } catch {
      toast.error("Email ou mot de passe incorrect")
      setShake(true)
      window.setTimeout(() => setShake(false), 400)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden p-4">
      <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-linear-to-br from-cyan-500/40 via-indigo-500/30 to-fuchsia-500/30 blur-3xl animate-blob" />
      <div className="absolute -bottom-48 left-1/4 h-[520px] w-[520px] rounded-full bg-linear-to-br from-fuchsia-500/25 via-cyan-500/20 to-indigo-500/20 blur-3xl animate-blob" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Target className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold text-foreground">ReceptionAI</span>
        </Link>

        {/* Card */}
        <div className={"glass-card rounded-2xl p-8 border-border/30 " + (shake ? "animate-shake" : "")}>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Connexion</h1>
            <p className="text-sm text-muted-foreground mt-1">Accédez à votre espace client</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 bg-white/5 border-white/10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Initialize System
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-3 text-center">Comptes de démonstration</p>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs bg-white/5 border-white/10"
                onClick={(e) => {
                  e.preventDefault()
                  setEmail('admin@receptionai.com')
                  setPassword('admin123')
                }}
              >
                Admin: admin@receptionai.com
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full h-8 text-xs bg-white/5 border-white/10"
                onClick={(e) => {
                  e.preventDefault()
                  setEmail('entreprise@receptionai.com')
                  setPassword('entreprise123')
                }}
              >
                Entreprise: entreprise@receptionai.com
              </Button>
            </div>
          </div>

          {/* Contact info */}
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Vous n'avez pas encore de compte ?
            </p>
            <a
              href="tel:+33612345678"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <Phone className="w-4 h-4" />
              Contactez-nous pour en obtenir un
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          En vous connectant, vous acceptez nos{" "}
          <Link to="/legal/terms" className="text-primary hover:underline">CGU</Link>
          {" "}et notre{" "}
          <Link to="/legal/privacy" className="text-primary hover:underline">politique de confidentialité</Link>
        </p>
      </div>
    </div>
  )
}

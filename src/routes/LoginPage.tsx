import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Target, Eye, EyeOff, Loader2, Phone } from "lucide-react"
import { login } from "@/lib/store"
import { toast } from "sonner"

export default function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const user = login(email, password)
    if (user) {
      toast.success(`Bienvenue, ${user.name}!`)
      if (user.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/dashboard")
      }
    } else {
      toast.error("Email ou mot de passe incorrect")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Target className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold text-foreground">ReceptionAI</span>
        </Link>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 border-border/30">
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
                className="bg-secondary/50 border-border/50"
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
                  className="bg-secondary/50 border-border/50 pr-10"
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
              Se connecter
            </Button>
          </form>

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

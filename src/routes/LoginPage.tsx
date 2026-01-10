import { useState, useEffect } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Target, Eye, EyeOff, Loader2 } from "lucide-react"
import { login, signup } from "@/lib/store"
import { SECTORS } from "@/lib/types"
import { toast } from "sonner"

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") === "signup" ? "signup" : "login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Login form
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup form
  const [signupName, setSignupName] = useState("")
  const [signupCompany, setSignupCompany] = useState("")
  const [signupSector, setSignupSector] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 1) return { score, label: "Faible", color: "bg-destructive" }
    if (score === 2) return { score, label: "Moyen", color: "bg-warning" }
    if (score === 3) return { score, label: "Bon", color: "bg-primary" }
    return { score, label: "Excellent", color: "bg-success" }
  }

  const passwordStrength = getPasswordStrength(signupPassword)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const user = login(loginEmail, loginPassword)
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (signupPassword !== signupConfirmPassword) {
      toast.error("Les mots de passe ne correspondent pas")
      return
    }

    if (!acceptTerms) {
      toast.error("Veuillez accepter les conditions d'utilisation")
      return
    }

    setIsLoading(true)

    const user = signup({
      email: signupEmail,
      password: signupPassword,
      name: signupName,
      companyName: signupCompany,
      sector: signupSector as any,
      plan: "starter",
    })

    toast.success(`Compte créé! Bienvenue, ${user.name}!`)
    navigate("/dashboard")
    setIsLoading(false)
  }

  const handleDemoLogin = () => {
    setLoginEmail("luigi@luigipizza.it")
    setLoginPassword("pizza123")
    toast.info("Identifiants de démo remplis. Cliquez sur Connexion.")
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
          <span className="text-2xl font-semibold text-foreground">Omni-AI Manager</span>
        </Link>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 border-border/30">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary/50">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
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

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  Essayer avec un compte démo
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nom complet</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Jean Dupont"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-company">Nom de l'entreprise (optionnel)</Label>
                  <Input
                    id="signup-company"
                    type="text"
                    placeholder="Mon Entreprise"
                    value={signupCompany}
                    onChange={(e) => setSignupCompany(e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-sector">Secteur d'activité</Label>
                  <Select value={signupSector} onValueChange={setSignupSector} required>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Sélectionnez un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map((sector) => (
                        <SelectItem key={sector.value} value={sector.value}>
                          {sector.icon} {sector.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      className="bg-secondary/50 border-border/50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {signupPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Force du mot de passe</span>
                        <span className={passwordStrength.color.replace("bg-", "text-")}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirmer le mot de passe</Label>
                  <Input
                    id="signup-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    required
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                    J'accepte les{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      conditions d'utilisation
                    </Link>{" "}
                    et la{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      politique de confidentialité
                    </Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Créer mon compte
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

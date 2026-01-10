"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
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

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
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
        router.push("/admin")
      } else {
        router.push("/dashboard")
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
    router.push("/dashboard")
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
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Target className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold text-foreground">ReceptionAI</span>
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

                <div className="flex justify-end">
                  <button type="button" className="text-sm text-primary hover:underline">
                    Mot de passe oublié?
                  </button>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Se connecter
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Pas encore de compte?{" "}
                  <button type="button" onClick={() => setActiveTab("signup")} className="text-primary hover:underline">
                    S&apos;inscrire
                  </button>
                </p>
              </form>

              {/* Demo Account */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <p className="text-center text-sm text-muted-foreground mb-3">🎯 Compte démo (test instant)</p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-primary/30 hover:bg-primary/10 bg-transparent"
                  onClick={handleDemoLogin}
                >
                  Entrer avec Luigi Pizza
                </Button>
              </div>
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
                  <Label htmlFor="signup-company">Nom de l&apos;entreprise</Label>
                  <Input
                    id="signup-company"
                    type="text"
                    placeholder="Ma Société"
                    value={signupCompany}
                    onChange={(e) => setSignupCompany(e.target.value)}
                    required
                    className="bg-secondary/50 border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-sector">Secteur d&apos;activité</Label>
                  <Select value={signupSector} onValueChange={setSignupSector} required>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Choisir un secteur" />
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
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
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
                  {signupPassword && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{passwordStrength.label}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
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
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    J&apos;accepte les{" "}
                    <a href="#" className="text-primary hover:underline">
                      conditions d&apos;utilisation
                    </a>
                  </label>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  S&apos;inscrire
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Déjà un compte?{" "}
                  <button type="button" onClick={() => setActiveTab("login")} className="text-primary hover:underline">
                    Se connecter
                  </button>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}

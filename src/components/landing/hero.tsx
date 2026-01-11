import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, CheckCircle } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Disponible 24h/24, 7j/7
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
          <span className="text-foreground">Votre </span>
          <span className="gradient-text">Réceptionniste Intelligente</span>
          <br />
          <span className="text-foreground">ne dort jamais</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          Plus d'appels manqués, plus de réservations perdues. Notre solution gère vos appels
          et prend vos rendez-vous automatiquement, même à 3h du matin.
        </p>

        {/* Features list */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-primary" />
            Réservations automatiques
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-primary" />
            Réponses instantanées
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-primary" />
            Zéro appel manqué
          </span>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8">
              Demander une démo
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <a href="#pricing">
            <Button size="lg" variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10 bg-transparent">
              Voir les tarifs
            </Button>
          </a>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            ))}
          </div>
          <span className="text-sm">Plus de 200 professionnels nous font confiance</span>
        </div>
      </div>
    </section>
  )
}

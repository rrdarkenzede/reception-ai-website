import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Rocket, Play, Star } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
          <span className="gradient-text">La Réceptionniste IA</span>
          <br />
          <span className="text-foreground">qui prend vos RDV 24/7</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          Automatisez vos appels, gagnez du temps, augmentez vos réservations. Notre IA intelligente gère vos
          rendez-vous pendant que vous vous concentrez sur votre métier.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login?tab=signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8">
              <Rocket className="w-5 h-5" />
              Commencer Gratuitement
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10 bg-transparent">
            <Play className="w-5 h-5" />
            Voir la Démo
          </Button>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            ))}
          </div>
          <span className="text-sm">4.9/5 (847 avis)</span>
        </div>
      </div>
    </section>
  )
}

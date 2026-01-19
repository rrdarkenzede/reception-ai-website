import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRight, Headphones, Rocket } from "lucide-react"

export function Offers() {
  return (
    <section id="offers" className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent" />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full glass-card text-xs font-medium text-cyan-400 uppercase tracking-wider mb-4">
            Nos Offres
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Deux façons de <span className="gradient-text">commencer</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Chaque projet est unique. Nous adaptons notre approche à vos besoins.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: Audit & Démo */}
          <div className="glass-card-hover rounded-2xl p-8 flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/20 mb-6">
              <Headphones className="w-7 h-7 text-cyan-400" />
            </div>
            
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400 mb-3">
                Gratuit
              </span>
              <h3 className="text-2xl font-bold text-foreground mb-3">Audit & Démo</h3>
              <p className="text-muted-foreground leading-relaxed">
                Découvrez le potentiel de l'IA pour votre établissement. 
                Nous analysons vos flux d'appels et vous montrons une démonstration 
                personnalisée de notre solution.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Analyse de vos besoins spécifiques",
                "Démonstration vocale en direct",
                "Estimation du ROI potentiel",
                "Aucun engagement"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/contact">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 transition-all duration-300"
              >
                Réserver un appel
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Card 2: Installation Agence */}
          <div className="glass-card-hover rounded-2xl p-8 flex flex-col border-cyan-500/20">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center border border-purple-500/20 mb-6">
              <Rocket className="w-7 h-7 text-purple-400" />
            </div>
            
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-400 mb-3">
                Premium
              </span>
              <h3 className="text-2xl font-bold text-foreground mb-3">Installation Agence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Une configuration clé en main par notre équipe d'experts. 
                Nous paramétrons votre menu, entraînons l'IA sur votre contexte, 
                et déployons le système en 48h.
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Configuration complète du menu",
                "Entraînement IA personnalisé",
                "Knowledge Base sur-mesure",
                "Support dédié pendant 30 jours",
                "Intégrations tierces incluses"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/contact">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500/50 font-semibold transition-all duration-300"
              >
                Sur devis uniquement
              </Button>
            </Link>
          </div>
        </div>

        {/* Trust note */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          Plus de 50 établissements premium nous font confiance, du restaurant gastronomique au cabinet médical.
        </p>
      </div>
    </section>
  )
}

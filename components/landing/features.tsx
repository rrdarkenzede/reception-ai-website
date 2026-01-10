import { Phone, Bot, BarChart3, Shield, Zap, Target } from "lucide-react"

const features = [
  {
    icon: Phone,
    title: "Appels 24/7",
    description: "Répondez à vos clients à toute heure, même la nuit et les week-ends.",
  },
  {
    icon: Bot,
    title: "IA Intelligente",
    description: "Notre IA comprend le contexte et répond naturellement à vos clients.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Temps Réel",
    description: "Suivez vos réservations et statistiques en temps réel.",
  },
  {
    icon: Shield,
    title: "Sécurisé",
    description: "Vos données sont chiffrées et protégées selon les normes RGPD.",
  },
  {
    icon: Zap,
    title: "Intégration Facile",
    description: "Connectez votre système téléphonique en quelques minutes.",
  },
  {
    icon: Target,
    title: "Multi-Secteurs",
    description: "Adapté à tous les secteurs : restaurants, dentistes, garages...",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Fonctionnalités Puissantes</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour automatiser votre accueil téléphonique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card rounded-xl p-6 hover:scale-[1.02] hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

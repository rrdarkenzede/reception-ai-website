
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { PLANS } from "@/lib/types"

const allFeatures = [
  "Lecture seule des RDV",
  "Journal d'appels basique",
  "Support email",
  "Gestion complète des RDV",
  "Dashboard analytics",
  "Gestion du menu/stock",
  "Promos & Annonces",
  "Support prioritaire",
  "IA avancée + Smart Triggers",
  "Marketing automatisé",
  "Panic Button",
  "API personnalisée",
  "Account Manager dédié",
]

const planFeatures: Record<string, string[]> = {
  starter: allFeatures.slice(0, 3),
  pro: allFeatures.slice(0, 8),
  elite: allFeatures,
}

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Tarifs Simples et Transparents</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, index) => {
            const isPopular = plan.value === "pro"
            return (
              <div
                key={plan.value}
                className={`relative glass-card rounded-2xl p-8 flex flex-col ${isPopular ? "scale-105 border-primary/50 glow-cyan" : "border-border/30"
                  }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full">
                    Populaire
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{plan.label}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">{plan.price}€</span>
                    {plan.price > 0 && <span className="text-muted-foreground">/mois</span>}
                  </div>
                </div>

                <ul className="space-y-3 flex-1">
                  {allFeatures.map((feature) => {
                    const hasFeature = planFeatures[plan.value].includes(feature)
                    return (
                      <li
                        key={feature}
                        className={`flex items-start gap-2 text-sm ${hasFeature ? "text-foreground" : "text-muted-foreground/50"
                          }`}
                      >
                        {hasFeature ? (
                          <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/30 shrink-0 mt-0.5" />
                        )}
                        <span className={!hasFeature ? "line-through" : ""}>{feature}</span>
                      </li>
                    )
                  })}
                </ul>

                <Link to="/login?tab=signup" className="mt-8">
                  <Button
                    className={`w-full ${isPopular ? "bg-primary hover:bg-primary/90" : "bg-secondary hover:bg-secondary/80"
                      }`}
                  >
                    {plan.price === 0 ? "Commencer" : "Choisir ce Plan"}
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

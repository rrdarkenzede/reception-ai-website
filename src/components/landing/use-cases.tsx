"use client"

import { useState } from "react"
import { Utensils, Stethoscope, Scale, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const useCases = [
  {
    id: "restauration",
    label: "Restauration",
    icon: Utensils,
    tagline: "Fouquet's ou Kebab du coin : gérez les rushs sans stress.",
    description: "Que vous soyez un restaurant étoilé ou un fast-food de quartier, notre IA gère les commandes téléphoniques, les réservations de tables et répond aux questions sur votre menu. Fini les appels manqués pendant le coup de feu.",
    features: [
      "Prise de commandes vocale 24/7",
      "Réservations de tables automatiques",
      "Gestion intelligente des ruptures (Mode 86)",
      "Confirmation SMS & rappels clients"
    ],
    mockup: {
      title: "Commande #247",
      status: "Confirmée",
      items: ["2× Kebab Maison", "1× Frites XL", "2× Boissons"],
      time: "Retrait: 13:45"
    }
  },
  {
    id: "medical",
    label: "Médical",
    icon: Stethoscope,
    tagline: "Secrétariat débordé ? L'IA filtre les urgences.",
    description: "Votre secrétariat ne peut pas tout gérer. Notre IA qualifie les appels, identifie les urgences, et planifie les rendez-vous selon vos disponibilités. Libérez du temps pour vos patients.",
    features: [
      "Tri intelligent des urgences",
      "Prise de RDV selon vos créneaux",
      "Rappels de rendez-vous automatiques",
      "Intégration dossier patient"
    ],
    mockup: {
      title: "Nouveau RDV",
      status: "Planifié",
      items: ["Dr. Martin - Consultation", "Patient: Marie D.", "Motif: Contrôle annuel"],
      time: "Lundi 15h30"
    }
  },
  {
    id: "juridique",
    label: "Juridique",
    icon: Scale,
    tagline: "Prise de RDV qualifiée pour cabinets d'avocats.",
    description: "Chaque appel compte. Notre IA pré-qualifie les prospects, collecte les informations essentielles sur leur dossier, et planifie les consultations. Concentrez-vous sur vos clients.",
    features: [
      "Qualification des prospects",
      "Collecte d'informations préliminaires",
      "Agenda partagé multi-avocats",
      "Confidentialité garantie"
    ],
    mockup: {
      title: "Consultation",
      status: "Qualifié",
      items: ["Me. Dubois - Droit des affaires", "Prospect: SAS Tech", "Type: Litige commercial"],
      time: "Mardi 10h00"
    }
  }
]

function SectorMockup({ useCase }: { useCase: typeof useCases[0] }) {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-purple-600/10 rounded-3xl blur-2xl scale-105" />
      
      {/* Main mockup card */}
      <div className="relative glass-card rounded-2xl overflow-hidden">
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">ReceptionAI Dashboard</span>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Ticket card */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-foreground">{useCase.mockup.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{useCase.mockup.time}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-400">
                {useCase.mockup.status}
              </span>
            </div>
            
            <div className="space-y-2">
              {useCase.mockup.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[
              { label: "Appels/jour", value: "47" },
              { label: "Temps moyen", value: "2m 15s" },
              { label: "Satisfaction", value: "98%" }
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-lg bg-white/5">
                <p className="text-lg font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function UseCases() {
  const [activeTab, setActiveTab] = useState("restauration")
  const activeCase = useCases.find(uc => uc.id === activeTab)!

  return (
    <section id="use-cases" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full glass-card text-xs font-medium text-cyan-400 uppercase tracking-wider mb-4">
            Cas d'usage
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Pour les <span className="gradient-text">leaders</span> de leur secteur.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Une solution sur-mesure, adaptée aux spécificités de votre métier.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {useCases.map((useCase) => {
            const Icon = useCase.icon
            const isActive = activeTab === useCase.id
            return (
              <button
                key={useCase.id}
                onClick={() => setActiveTab(useCase.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' 
                    : 'glass-card text-muted-foreground hover:text-foreground hover:border-white/20'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {useCase.label}
              </button>
            )
          })}
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Description */}
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              {activeCase.tagline}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {activeCase.description}
            </p>
            
            {/* Features list */}
            <ul className="space-y-4 mb-8">
              {activeCase.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Link to="/contact">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40"
              >
                Discutons de votre projet
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Right: Mockup */}
          <div className="order-1 lg:order-2">
            <SectorMockup useCase={activeCase} />
          </div>
        </div>
      </div>
    </section>
  )
}

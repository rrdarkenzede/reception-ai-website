"use client"

import { useState } from "react"
import { SECTORS } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

const sectorDetails: Record<string, { description: string; features: string[] }> = {
  restaurant: {
    description: "Gérez vos réservations de tables, menus et promotions facilement.",
    features: ["Gestion des tables", "Menu digital", "Promos automatisées", "Confirmation SMS"],
  },
  dentiste: {
    description: "Planifiez les rendez-vous patients et gérez vos salles de soins.",
    features: ["Agenda patient", "Rappels automatiques", "Gestion urgences", "Dossiers médicaux"],
  },
  garage: {
    description: "Suivez les réparations, devis et historique véhicules de vos clients.",
    features: ["Suivi réparations", "Devis automatiques", "Historique véhicules", "Rappels entretien"],
  },
  immobilier: {
    description: "Organisez vos visites et suivez vos prospects efficacement.",
    features: ["Agenda visites", "Suivi prospects", "Matching biens", "Rappels automatiques"],
  },
  juridique: {
    description: "Gérez vos consultations et dossiers clients en toute confidentialité.",
    features: ["Agenda consultations", "Gestion dossiers", "Confidentialité", "Facturation"],
  },
  beaute: {
    description: "Planifiez les soins et gérez votre clientèle beauté.",
    features: ["Réservation soins", "Fichier clients", "Promos ciblées", "Rappels RDV"],
  },
  sport: {
    description: "Gérez les inscriptions cours et abonnements de vos membres.",
    features: ["Planning cours", "Gestion abonnements", "Réservation créneaux", "Suivi membres"],
  },
  autoecole: {
    description: "Planifiez les leçons et suivez la progression de vos élèves.",
    features: ["Planning moniteurs", "Suivi progression", "Réservation créneaux", "Examens"],
  },
  veterinaire: {
    description: "Gérez les consultations et le suivi santé des animaux.",
    features: ["Agenda consultations", "Dossiers santé", "Rappels vaccins", "Urgences"],
  },
  clinique: {
    description: "Planifiez les consultations médicales et gérez les patients.",
    features: ["Multi-praticiens", "Dossiers patients", "Urgences", "Laboratoire"],
  },
}

export function Sectors() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const sector = selectedSector ? SECTORS.find((s) => s.value === selectedSector) : null
  const details = selectedSector ? sectorDetails[selectedSector] : null

  return (
    <section id="sectors" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Adaptée à Tous les Secteurs</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Une solution personnalisée pour chaque type d&apos;activité
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {SECTORS.map((sector) => (
            <button
              key={sector.value}
              onClick={() => setSelectedSector(sector.value)}
              className="px-6 py-3 rounded-full glass-card hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 flex items-center gap-2"
            >
              <span className="text-xl">{sector.icon}</span>
              <span className="text-sm font-medium text-foreground">{sector.label}</span>
            </button>
          ))}
        </div>

        <Dialog open={!!selectedSector} onOpenChange={() => setSelectedSector(null)}>
          <DialogContent className="glass-card border-border/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <span className="text-3xl">{sector?.icon}</span>
                {sector?.label}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">{details?.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Fonctionnalités incluses :</h4>
              <ul className="space-y-2">
                {details?.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

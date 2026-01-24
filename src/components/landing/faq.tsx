import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Est-ce une voix robotique ?",
    answer: "Non. Nous utilisons les moteurs de synthèse vocale les plus avancés du marché (Notre technologie vocale). Avec une latence inférieure à 800ms, vos clients ne feront pas la différence avec un humain. La voix est naturelle, fluide, et s'adapte au ton de la conversation."
  },
  {
    question: "Comment se passe l'installation ?",
    answer: "Notre équipe 'Agence' s'occupe de tout. Onboarding clé en main en 48h : configuration de votre knowledge base, intégration à vos systèmes existants, tests et mise en production. Vous n'avez rien à faire techniquement."
  },
  {
    question: "Que se passe-t-il si l'IA ne comprend pas une demande ?",
    answer: "L'IA est entraînée pour reconnaître ses limites. En cas de demande complexe ou ambiguë, elle peut transférer l'appel vers un humain, prendre un message détaillé, ou proposer un rappel. Vous gardez toujours le contrôle."
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Absolument. Toutes vos données sont chiffrées (AES-256) en transit et au repos. Nous sommes conformes au RGPD, hébergés en Europe (AWS Paris). Vous restez propriétaire de vos données et pouvez les exporter à tout moment."
  },
  {
    question: "Puis-je personnaliser les réponses de l'IA ?",
    answer: "Oui, entièrement. Vous configurez la knowledge base depuis votre dashboard : menu, horaires, parking, WiFi, politiques maison... L'IA s'adapte à votre vocabulaire et à votre ton. Les mises à jour sont instantanées."
  },
  {
    question: "Quel est le coût réel ?",
    answer: "Nous proposons des forfaits adaptés à votre volume d'appels. Contactez-nous pour un audit gratuit : nous analyserons vos besoins et vous proposerons une offre sur-mesure. L'investissement se rentabilise dès le premier mois grâce aux appels récupérés."
  }
]

export function FAQ() {
  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full glass-card text-xs font-medium text-cyan-400 uppercase tracking-wider mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Questions <span className="gradient-text">fréquentes</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tout ce que vous devez savoir avant de commencer.
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`} 
              className="glass-card rounded-xl px-6 border-white/5 data-[state=open]:border-cyan-500/20 transition-colors duration-300"
            >
              <AccordionTrigger className="text-left text-foreground hover:no-underline py-5 text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Vous avez d'autres questions ?
          </p>
          <a 
            href="https://cal.com/reception-ai/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#00f2ff] hover:text-[#00f2ff]/80 font-medium transition-colors"
          >
            Réserver un appel découverte
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

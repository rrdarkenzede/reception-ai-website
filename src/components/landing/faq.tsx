import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "Comment fonctionne l'intégration Vapi?",
    answer:
      "Notre système s'intègre directement avec Vapi pour gérer vos appels. Vous recevez un numéro dédié ou redirigez vos appels vers notre plateforme. L'IA prend en charge les conversations et crée automatiquement les rendez-vous dans votre dashboard.",
  },
  {
    question: "Puis-je changer de secteur après inscription?",
    answer:
      "Oui, vous pouvez changer de secteur à tout moment depuis votre dashboard. L'interface s'adaptera automatiquement aux spécificités de votre nouveau secteur d'activité.",
  },
  {
    question: "Mes données sont-elles sécurisées?",
    answer:
      "Absolument. Toutes vos données sont chiffrées en transit et au repos. Nous sommes conformes au RGPD et nos serveurs sont hébergés en Europe. Vous gardez le contrôle total sur vos données.",
  },
  {
    question: "Puis-je essayer gratuitement?",
    answer:
      "Oui ! Notre plan Starter est gratuit et vous permet de découvrir la plateforme. Vous avez accès à la lecture de vos rendez-vous et au journal d'appels basique. Passez à Pro ou Elite quand vous êtes prêt.",
  },
  {
    question: "Comment les Smart Triggers fonctionnent?",
    answer:
      "Les Smart Triggers (disponibles en Elite) permettent d'automatiser des actions : rappels automatiques, confirmations, relances clients, SMS marketing... Tout se configure depuis votre dashboard.",
  },
  {
    question: "Le support est-il disponible?",
    answer:
      "Oui, nous offrons un support email pour tous les plans. Les plans Pro bénéficient d'un support prioritaire, et les plans Elite ont accès à un Account Manager dédié disponible par téléphone.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-secondary/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Questions Fréquentes</h2>
          <p className="mt-4 text-lg text-muted-foreground">Tout ce que vous devez savoir sur ReceptionAI</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="glass-card rounded-xl px-6 border-border/30">
              <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

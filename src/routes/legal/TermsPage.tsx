import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Target, ArrowLeft } from "lucide-react"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Header */}
            <header className="border-b border-border/50 glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Target className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-semibold text-foreground">ReceptionAI</span>
                    </Link>
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Retour
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-3xl font-bold text-foreground mb-8">Conditions Générales d'Utilisation</h1>

                <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
                    <p className="text-sm text-muted-foreground">Dernière mise à jour : 10 janvier 2026</p>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Objet</h2>
                        <p>
                            Les présentes conditions générales d'utilisation régissent l'accès et l'utilisation de la plateforme
                            ReceptionAI, service de réceptionniste intelligente pour professionnels.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Accès au service</h2>
                        <p>
                            L'accès à la plateforme est réservé aux clients ayant souscrit un abonnement auprès de ReceptionAI.
                            Les identifiants de connexion sont personnels et confidentiels.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Description du service</h2>
                        <p>
                            ReceptionAI propose une solution de gestion des appels et des réservations automatisée par intelligence artificielle.
                            Le service inclut la prise de rendez-vous, la gestion des appels et un tableau de bord de suivi.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Obligations de l'utilisateur</h2>
                        <p>L'utilisateur s'engage à :</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Fournir des informations exactes lors de la configuration</li>
                            <li>Ne pas partager ses identifiants de connexion</li>
                            <li>Utiliser le service conformément à sa destination</li>
                            <li>Respecter les lois et réglementations en vigueur</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Responsabilité</h2>
                        <p>
                            ReceptionAI s'efforce d'assurer la disponibilité du service 24h/24.
                            Toutefois, des interruptions pour maintenance peuvent survenir.
                            ReceptionAI ne saurait être tenue responsable des dommages indirects.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Propriété intellectuelle</h2>
                        <p>
                            Tous les éléments de la plateforme (logos, textes, fonctionnalités) sont la propriété exclusive de ReceptionAI
                            et sont protégés par les lois relatives à la propriété intellectuelle.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Contact</h2>
                        <p>
                            Pour toute question concernant ces conditions, contactez-nous à :
                            <a href="mailto:legal@receptionai.fr" className="text-primary hover:underline ml-1">legal@receptionai.fr</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}

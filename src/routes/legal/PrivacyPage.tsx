import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Target, ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
                <h1 className="text-3xl font-bold text-foreground mb-8">Politique de Confidentialité</h1>

                <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
                    <p className="text-sm text-muted-foreground">Dernière mise à jour : 10 janvier 2026</p>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Collecte des données</h2>
                        <p>
                            Nous collectons les informations que vous nous fournissez directement, notamment lors de la création de votre compte,
                            l'utilisation de nos services ou lorsque vous nous contactez.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Utilisation des données</h2>
                        <p>
                            Vos données sont utilisées pour fournir et améliorer nos services, vous contacter concernant votre compte,
                            et vous envoyer des informations importantes sur nos services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Protection des données</h2>
                        <p>
                            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles
                            contre tout accès, modification, divulgation ou destruction non autorisés.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Vos droits</h2>
                        <p>
                            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité
                            de vos données personnelles. Pour exercer ces droits, contactez-nous à :
                            <a href="mailto:privacy@receptionai.fr" className="text-primary hover:underline ml-1">privacy@receptionai.fr</a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Cookies</h2>
                        <p>
                            Nous utilisons des cookies essentiels pour le fonctionnement du site. Aucun cookie publicitaire n'est utilisé.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Contact</h2>
                        <p>
                            Pour toute question concernant cette politique, contactez-nous à :
                            <a href="mailto:contact@receptionai.fr" className="text-primary hover:underline ml-1">contact@receptionai.fr</a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}

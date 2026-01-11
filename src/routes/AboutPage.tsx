import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Target, ArrowLeft, Users, Lightbulb, Heart } from "lucide-react"

export default function AboutPage() {
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

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">À propos de ReceptionAI</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Nous aidons les professionnels à ne plus jamais manquer un appel ou une réservation.
                    </p>
                </div>

                {/* Mission */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Notre mission</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Chez ReceptionAI, nous croyons que chaque professionnel mérite d'avoir une réceptionniste
                        disponible 24h/24. Que vous soyez restaurateur, coiffeur, garagiste ou médecin,
                        vous ne devriez jamais perdre un client parce que vous étiez occupé à faire votre métier.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                        Notre technologie de pointe permet de prendre les appels, gérer les réservations et
                        répondre aux questions de vos clients, même à 3h du matin. Simple, efficace, abordable.
                    </p>
                </div>

                {/* Values */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="glass-card rounded-xl p-6 border-border/30 text-center">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <Lightbulb className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">Innovation</h3>
                        <p className="text-sm text-muted-foreground">
                            Nous utilisons les dernières avancées en IA pour vous offrir le meilleur service.
                        </p>
                    </div>

                    <div className="glass-card rounded-xl p-6 border-border/30 text-center">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">Proximité</h3>
                        <p className="text-sm text-muted-foreground">
                            Un accompagnement personnalisé pour chaque client, du début à la fin.
                        </p>
                    </div>

                    <div className="glass-card rounded-xl p-6 border-border/30 text-center">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">Passion</h3>
                        <p className="text-sm text-muted-foreground">
                            Nous sommes passionnés par la réussite de nos clients professionnels.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center glass-card rounded-2xl p-8 border-border/30">
                    <h2 className="text-xl font-bold text-foreground mb-4">Prêt à transformer votre accueil téléphonique ?</h2>
                    <Link to="/contact">
                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                            Nous contacter
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

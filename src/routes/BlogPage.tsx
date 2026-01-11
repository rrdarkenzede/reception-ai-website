import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Target, ArrowLeft, BookOpen } from "lucide-react"

const articles = [
    {
        title: "Comment automatiser la prise de rendez-vous dans votre restaurant",
        excerpt: "Découvrez comment notre IA peut gérer vos réservations 24h/24 et augmenter votre taux de remplissage.",
        date: "10 janvier 2026",
        category: "Restaurant",
    },
    {
        title: "5 raisons d'adopter une IA réceptionniste pour votre salon",
        excerpt: "Les salons de coiffure et instituts de beauté gagnent en moyenne 3h par jour grâce à l'automatisation.",
        date: "8 janvier 2026",
        category: "Beauté",
    },
    {
        title: "Réduire les no-shows : les bonnes pratiques",
        excerpt: "Nos clients ont réduit leurs rendez-vous manqués de 60% grâce aux rappels automatiques.",
        date: "5 janvier 2026",
        category: "Conseils",
    },
]

export default function BlogPage() {
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
                <div className="text-center mb-12">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Blog</h1>
                    <p className="text-lg text-muted-foreground">
                        Conseils et actualités pour optimiser votre activité
                    </p>
                </div>

                <div className="space-y-6">
                    {articles.map((article, index) => (
                        <article
                            key={index}
                            className="glass-card rounded-xl p-6 border-border/30 hover:border-primary/30 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                                    {article.category}
                                </span>
                                <span className="text-sm text-muted-foreground">{article.date}</span>
                            </div>
                            <h2 className="text-xl font-semibold text-foreground mb-2">{article.title}</h2>
                            <p className="text-muted-foreground">{article.excerpt}</p>
                        </article>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-muted-foreground">Plus d'articles à venir...</p>
                </div>
            </div>
        </div>
    )
}

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000))

        setIsSubmitted(true)
        setIsLoading(false)
        toast.success("Message envoyé ! Nous vous recontacterons rapidement.")
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Merci pour votre message !</h1>
                    <p className="text-muted-foreground mb-6">Nous vous recontacterons dans les plus brefs délais.</p>
                    <Link to="/">
                        <Button>Retour à l'accueil</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Header */}
            <header className="border-b border-border/50 glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Target className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-semibold text-foreground">ReceptionAI</span>
                    </Link>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left: Info */}
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            Contactez-nous
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Vous souhaitez en savoir plus sur notre solution ? Remplissez ce formulaire et nous vous recontacterons rapidement.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">Téléphone</h3>
                                    <a href="tel:+33612345678" className="text-muted-foreground hover:text-primary transition-colors">
                                        +33 6 12 34 56 78
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">Email</h3>
                                    <a href="mailto:contact@receptionai.fr" className="text-muted-foreground hover:text-primary transition-colors">
                                        contact@receptionai.fr
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">Adresse</h3>
                                    <p className="text-muted-foreground">Paris, France</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="glass-card rounded-2xl p-8 border-border/30">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom *</Label>
                                    <Input id="name" placeholder="Votre nom" required className="bg-secondary/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">Entreprise</Label>
                                    <Input id="company" placeholder="Nom de votre entreprise" className="bg-secondary/50" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input id="email" type="email" placeholder="votre@email.com" required className="bg-secondary/50" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone *</Label>
                                <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" required className="bg-secondary/50" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sector">Secteur d'activité *</Label>
                                <Select required>
                                    <SelectTrigger className="bg-secondary/50">
                                        <SelectValue placeholder="Sélectionnez votre secteur" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="restaurant">Restaurant / Pizzeria</SelectItem>
                                        <SelectItem value="beauty">Salon de beauté / Coiffure</SelectItem>
                                        <SelectItem value="medical">Cabinet médical</SelectItem>
                                        <SelectItem value="automotive">Garage automobile</SelectItem>
                                        <SelectItem value="trades">Artisan / Plombier / Électricien</SelectItem>
                                        <SelectItem value="other">Autre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Décrivez votre besoin..."
                                    rows={4}
                                    className="bg-secondary/50 resize-none"
                                />
                            </div>

                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 gap-2" disabled={isLoading}>
                                <Send className="w-4 h-4" />
                                {isLoading ? "Envoi en cours..." : "Envoyer"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

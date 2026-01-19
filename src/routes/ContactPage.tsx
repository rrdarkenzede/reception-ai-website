import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, Send, CheckCircle, Headphones, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/store"
import type { User } from "@/lib/types"

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [checkingAuth, setCheckingAuth] = useState(true)

    // Form state
    const [guestName, setGuestName] = useState("")
    const [guestEmail, setGuestEmail] = useState("")
    const [guestPhone, setGuestPhone] = useState("")
    const [category, setCategory] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    // Check if user is logged in
    useEffect(() => {
        async function checkUser() {
            const currentUser = await getCurrentUser()
            setUser(currentUser)
            setCheckingAuth(false)
        }
        checkUser()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Build ticket data
            const ticketData: Record<string, unknown> = {
                category: category || 'other',
                subject: subject || (user ? `Demande de ${user.companyName}` : 'Demande de contact'),
                message: message,
                status: 'open',
                priority: 'normal'
            }

            if (user) {
                // Logged in user
                ticketData.profile_id = user.id
                ticketData.restaurant_id = user.restaurantId
            } else {
                // Guest visitor
                ticketData.guest_name = guestName
                ticketData.guest_email = guestEmail
                ticketData.guest_phone = guestPhone
            }

            const { error } = await supabase
                .from('support_tickets')
                .insert(ticketData)

            if (error) throw error

            setIsSubmitted(true)
            toast.success("Demande envoyée ! Notre équipe vous recontactera rapidement.")
        } catch (error) {
            console.error('Error submitting ticket:', error)
            toast.error("Erreur lors de l'envoi. Veuillez réessayer.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
                        <CheckCircle className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Demande envoyée !</h1>
                    <p className="text-muted-foreground mb-6">
                        Notre équipe support traitera votre demande dans les plus brefs délais. 
                        Vous recevrez une réponse par email.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link to="/">
                            <Button variant="outline">Retour à l'accueil</Button>
                        </Link>
                        {user && (
                            <Link to="/dashboard">
                                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600">
                                    Mon Dashboard
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-muted-foreground">Chargement...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Header */}
            <header className="border-b border-border/50 glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold gradient-text">ReceptionAI</span>
                    </Link>
                    {user && (
                        <Link to="/dashboard">
                            <Button variant="outline" size="sm">Mon Dashboard</Button>
                        </Link>
                    )}
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
                        <Headphones className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        {user ? 'Support Client' : 'Contactez-nous'}
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {user 
                            ? `${user.companyName}, comment pouvons-nous vous aider ?`
                            : 'Vous souhaitez en savoir plus ? Notre équipe vous répond rapidement.'
                        }
                    </p>
                </div>

                {/* Form Card */}
                <div className="glass-card rounded-2xl p-8 border-border/30">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* GUEST FIELDS (only if not logged in) */}
                        {!user && (
                            <>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom *</Label>
                                        <Input 
                                            id="name" 
                                            placeholder="Votre nom" 
                                            required 
                                            value={guestName}
                                            onChange={(e) => setGuestName(e.target.value)}
                                            className="bg-secondary/50" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Téléphone</Label>
                                        <Input 
                                            id="phone" 
                                            type="tel" 
                                            placeholder="+33 6 12 34 56 78" 
                                            value={guestPhone}
                                            onChange={(e) => setGuestPhone(e.target.value)}
                                            className="bg-secondary/50" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        placeholder="votre@email.com" 
                                        required 
                                        value={guestEmail}
                                        onChange={(e) => setGuestEmail(e.target.value)}
                                        className="bg-secondary/50" 
                                    />
                                </div>
                            </>
                        )}

                        {/* LOGGED IN USER - Show their info */}
                        {user && (
                            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                        {user.companyName?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div className="font-medium text-foreground">{user.companyName}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CATEGORY (for logged in users) */}
                        {user && (
                            <div className="space-y-2">
                                <Label htmlFor="category">Type de demande *</Label>
                                <Select value={category} onValueChange={setCategory} required>
                                    <SelectTrigger className="bg-secondary/50">
                                        <SelectValue placeholder="Sélectionnez le type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="menu_change">📋 Modification du Menu</SelectItem>
                                        <SelectItem value="bug">🐛 Signaler un Bug</SelectItem>
                                        <SelectItem value="feature">✨ Nouvelle Fonctionnalité</SelectItem>
                                        <SelectItem value="billing">💳 Facturation</SelectItem>
                                        <SelectItem value="other">❓ Autre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* SUBJECT */}
                        <div className="space-y-2">
                            <Label htmlFor="subject">
                                {user ? 'Sujet *' : "Secteur d'activité"}
                            </Label>
                            {user ? (
                                <Input 
                                    id="subject" 
                                    placeholder="Ex: Changer le prix du Burger à 21€" 
                                    required 
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="bg-secondary/50" 
                                />
                            ) : (
                                <Select value={subject} onValueChange={setSubject}>
                                    <SelectTrigger className="bg-secondary/50">
                                        <SelectValue placeholder="Sélectionnez votre secteur" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Restaurant / Pizzeria">Restaurant / Pizzeria</SelectItem>
                                        <SelectItem value="Salon de beauté">Salon de beauté / Coiffure</SelectItem>
                                        <SelectItem value="Cabinet médical">Cabinet médical</SelectItem>
                                        <SelectItem value="Garage automobile">Garage automobile</SelectItem>
                                        <SelectItem value="Artisan">Artisan / Plombier / Électricien</SelectItem>
                                        <SelectItem value="Autre">Autre</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        {/* MESSAGE */}
                        <div className="space-y-2">
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                                id="message"
                                placeholder={user 
                                    ? "Décrivez votre demande en détail..." 
                                    : "Parlez-nous de votre projet..."
                                }
                                rows={5}
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="bg-secondary/50 resize-none"
                            />
                        </div>

                        {/* SUBMIT */}
                        <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 gap-2 py-6 text-base font-semibold" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>Envoi en cours...</>
                            ) : (
                                <>
                                    {user ? <MessageSquare className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                                    {user ? 'Envoyer ma demande au Support' : "Contacter l'équipe"}
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer note */}
                <p className="text-center text-sm text-muted-foreground mt-8">
                    Réponse garantie sous 24h ouvrées. Pour les urgences, utilisez le chat dans votre Dashboard.
                </p>
            </div>
        </div>
    )
}

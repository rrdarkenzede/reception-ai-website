import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LifeBuoy, Plus, MessageSquare, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/store"
import type { User } from "@/lib/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface Ticket {
    id: string
    subject: string
    category: string
    status: 'open' | 'closed' | 'pending' | 'resolved'
    created_at: string
    priority: string
    message: string
    admin_response: string | null
    responded_at: string | null
}

export default function SupportPage() {
    const [user, setUser] = useState<User | null>(null)
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [openNew, setOpenNew] = useState(false)
    
    // Form State
    const [category, setCategory] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const u = await getCurrentUser()
            setUser(u)
            if (u) {
                const { data } = await supabase
                    .from('support_tickets')
                    .select('*')
                    .eq('profile_id', u.id)
                    .order('created_at', { ascending: false })
                
                if (data) setTickets(data as Ticket[])
            }
        } catch (error) {
            console.error("Failed to load tickets:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setIsSubmitting(true)

        try {
            const { error } = await supabase
                .from('support_tickets')
                .insert({
                    profile_id: user.id,
                    restaurant_id: user.restaurantId,
                    category: category || 'other',
                    subject: subject,
                    message: message,
                    status: 'open',
                    priority: 'normal'
                })

            if (error) throw error

            toast.success('Ticket créé avec succès')
            setOpenNew(false)
            setCategory('')
            setSubject('')
            setMessage('')
            loadData()
        } catch (error) {
            console.error(error)
            toast.error("Erreur lors de la création du ticket")
        } finally {
            setIsSubmitting(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open': return <Badge variant="outline" className="border-blue-500 text-blue-500 bg-blue-500/10">Ouvert</Badge>
            case 'resolved': return <Badge variant="outline" className="border-green-500 text-green-500 bg-green-500/10">Résolu</Badge>
            case 'closed': return <Badge variant="outline" className="border-green-500 text-green-500 bg-green-500/10">Fermé</Badge>
            default: return <Badge variant="outline" className="border-yellow-500 text-yellow-500 bg-yellow-500/10">En attente</Badge>
        }
    }

    const getCategoryLabel = (cat: string) => {
        const map: Record<string, string> = {
            'menu_change': 'Modification Menu',
            'bug': 'Bug Technique',
            'feature': 'Suggestion',
            'billing': 'Facturation',
            'other': 'Autre'
        }
        return map[cat] || cat
    }

    if (loading) {
        return (
            <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <LifeBuoy className="w-6 h-6 text-cyan-400" />
                        Support Client
                    </h1>
                    <p className="text-muted-foreground mt-1">Besoin d'aide ou d'une modification ? Créez un ticket.</p>
                </div>
                <Dialog open={openNew} onOpenChange={setOpenNew}>
                    <DialogTrigger asChild>
                        <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium gap-2">
                            <Plus className="w-4 h-4" />
                            Nouveau Ticket
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ouvrir un ticket</DialogTitle>
                            <DialogDescription>
                                Remplissez le formulaire ci-dessous pour nous contacter.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Catégorie</Label>
                                <Select value={category} onValueChange={setCategory} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="menu_change">📋 Modification du Menu</SelectItem>
                                        <SelectItem value="bug">🐛 Signaler un Bug</SelectItem>
                                        <SelectItem value="feature">✨ Nouvelle Fonctionnalité</SelectItem>
                                        <SelectItem value="billing">💳 Facturation</SelectItem>
                                        <SelectItem value="other">Autre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Sujet</Label>
                                <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Ex: Ajouter le vin rouge..." required />
                            </div>
                            <div className="space-y-2">
                                <Label>Message</Label>
                                <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Détails de votre demande..." required rows={5} />
                            </div>
                            <Button type="submit" className="w-full bg-cyan-500 text-black hover:bg-cyan-600" disabled={isSubmitting}>
                                {isSubmitting ? "Envoi..." : "Envoyer le ticket"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {tickets.length === 0 ? (
                    <Card className="glass-card border-border/30 p-12 text-center">
                        <CardContent>
                            <div className="flex flex-col items-center">
                                <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium">Aucun ticket</h3>
                                <p className="text-muted-foreground">Vous n'avez aucune demande en cours.</p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    tickets.map(ticket => (
                        <motion.div 
                            key={ticket.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className={`glass-card border-border/30 transition-colors ${ticket.admin_response ? 'border-green-500/30' : 'hover:border-cyan-500/30'}`}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${ticket.admin_response ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                <MessageSquare className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground">{ticket.subject}</h3>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <span>{getCategoryLabel(ticket.category)}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {format(new Date(ticket.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {getStatusBadge(ticket.status)}
                                        </div>
                                    </div>

                                    {/* Original message */}
                                    <div className="p-3 rounded-lg bg-muted/20 border border-border/20 mb-3">
                                        <p className="text-sm text-muted-foreground">{ticket.message}</p>
                                    </div>

                                    {/* Admin Response */}
                                    {ticket.admin_response && (
                                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                                    📬 Réponse du Support
                                                </Badge>
                                                {ticket.responded_at && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {format(new Date(ticket.responded_at), "d MMM 'à' HH:mm", { locale: fr })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-foreground">{ticket.admin_response}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}

import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/store"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Building2, User as UserIcon, Phone, Lock, Shield } from "lucide-react"
import { SECTORS, PLANS } from "@/lib/types"

export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        setUser(getCurrentUser())
    }, [])

    if (!user) return null

    const sectorInfo = SECTORS.find((s) => s.value === user.sector)
    const planInfo = PLANS.find((p) => p.value === user.plan)

    const getPlanBadge = () => {
        switch (user.plan) {
            case "elite":
                return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Elite</Badge>
            case "pro":
                return <Badge className="bg-primary/20 text-primary border-primary/30">Pro</Badge>
            default:
                return <Badge variant="secondary">Starter</Badge>
        }
    }

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Settings className="w-6 h-6" />
                    Paramètres
                </h1>
                <p className="text-muted-foreground mt-1">Gérez les paramètres de votre compte</p>
            </div>

            {/* Company Info */}
            <Card className="glass-card border-border/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Informations entreprise
                    </CardTitle>
                    <CardDescription>Ces informations ne peuvent être modifiées que par l'administrateur</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nom de l'entreprise</Label>
                            <Input value={user.companyName || "-"} disabled className="bg-secondary/30" />
                        </div>
                        <div className="space-y-2">
                            <Label>Secteur d'activité</Label>
                            <Input value={sectorInfo ? `${sectorInfo.icon} ${sectorInfo.label}` : user.sector || "-"} disabled className="bg-secondary/30" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 text-sm text-muted-foreground">
                        <Lock className="w-4 h-4" />
                        Pour modifier ces informations, contactez votre administrateur
                    </div>
                </CardContent>
            </Card>

            {/* Account Info */}
            <Card className="glass-card border-border/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5" />
                        Compte
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nom</Label>
                            <Input value={user.name} disabled className="bg-secondary/30" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={user.email} disabled className="bg-secondary/30" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Date de création</Label>
                        <Input value={new Date(user.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })} disabled className="bg-secondary/30" />
                    </div>
                </CardContent>
            </Card>

            {/* Plan */}
            <Card className="glass-card border-border/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Abonnement
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                        <div>
                            <div className="font-semibold text-foreground flex items-center gap-2">
                                Plan actuel: {getPlanBadge()}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {planInfo?.price === 0 ? "Gratuit" : `${planInfo?.price}€ (paiement unique)`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        Pour changer de plan, contactez-nous au +33 6 12 34 56 78
                    </div>
                </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="glass-card border-border/30">
                <CardHeader>
                    <CardTitle>Besoin d'aide ?</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Notre équipe est disponible pour vous accompagner dans l'utilisation de la plateforme.
                    </p>
                    <div className="flex gap-3">
                        <Button variant="outline" asChild>
                            <a href="mailto:support@receptionai.fr">Envoyer un email</a>
                        </Button>
                        <Button asChild>
                            <a href="tel:+33612345678">Appeler le support</a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

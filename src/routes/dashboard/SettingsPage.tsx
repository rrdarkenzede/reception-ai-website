import { useMemo, useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/store"
import type { User } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Settings, Building2, User as UserIcon, Phone, Lock, Shield, Trash2, Plus } from "lucide-react"
import { SECTORS, PLANS } from "@/lib/types"

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

type BusinessHoursDay = {
    open: string
    close: string
    active: boolean
}

type BusinessHours = Record<DayKey, BusinessHoursDay>

type KnowledgeNode = {
    id: string
    trigger: string
    response: string
}

const dayOrder: Array<{ key: DayKey; label: string }> = [
    { key: 'mon', label: 'Monday' },
    { key: 'tue', label: 'Tuesday' },
    { key: 'wed', label: 'Wednesday' },
    { key: 'thu', label: 'Thursday' },
    { key: 'fri', label: 'Friday' },
    { key: 'sat', label: 'Saturday' },
    { key: 'sun', label: 'Sunday' },
]

const defaultHours: BusinessHours = {
    mon: { open: '09:00', close: '18:00', active: true },
    tue: { open: '09:00', close: '18:00', active: true },
    wed: { open: '09:00', close: '18:00', active: true },
    thu: { open: '09:00', close: '18:00', active: true },
    fri: { open: '09:00', close: '18:00', active: true },
    sat: { open: '09:00', close: '18:00', active: false },
    sun: { open: '09:00', close: '18:00', active: false },
}

export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [businessHours, setBusinessHours] = useState<BusinessHours>(defaultHours)
    const [aiKnowledge, setAiKnowledge] = useState<KnowledgeNode[]>([])

    useEffect(() => {
        let mounted = true

        const isRecord = (v: unknown): v is Record<string, unknown> =>
            typeof v === 'object' && v !== null && !Array.isArray(v)

        async function load() {
            try {
                const u = await getCurrentUser()
                if (!mounted) return
                setUser(u)

                const settingsRaw = u?.settings
                const settings = isRecord(settingsRaw) ? settingsRaw : {}

                const bhRaw = settings.business_hours
                if (isRecord(bhRaw)) {
                    const next: BusinessHours = { ...defaultHours }
                    for (const { key } of dayOrder) {
                        const dayRaw = bhRaw[key]
                        if (!isRecord(dayRaw)) continue
                        const open = typeof dayRaw.open === 'string' ? dayRaw.open : next[key].open
                        const close = typeof dayRaw.close === 'string' ? dayRaw.close : next[key].close
                        const active = typeof dayRaw.active === 'boolean' ? dayRaw.active : next[key].active
                        next[key] = { open, close, active }
                    }
                    setBusinessHours(next)
                }

                const knowledgeRaw = settings.ai_knowledge
                if (Array.isArray(knowledgeRaw)) {
                    setAiKnowledge(
                        knowledgeRaw
                            .map((n) => (isRecord(n) ? n : {}))
                            .map((n) => ({
                                id: typeof n.id === 'string' ? n.id : String(Date.now() + Math.random()),
                                trigger: typeof n.trigger === 'string' ? n.trigger : '',
                                response: typeof n.response === 'string' ? n.response : '',
                            }))
                    )
                }
            } finally {
                if (mounted) setLoading(false)
            }
        }

        load()
        return () => {
            mounted = false
        }
    }, [])

    if (loading)
        return (
            <div className="space-y-6 max-w-5xl">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-44" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-10 w-72 rounded-lg" />
                <div className="grid grid-cols-1 gap-6">
                    <div className="glass-card border-border/30 rounded-xl p-6">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="mt-4 h-10 w-full" />
                        <Skeleton className="mt-3 h-10 w-full" />
                    </div>
                    <div className="glass-card border-border/30 rounded-xl p-6">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="mt-4 h-10 w-full" />
                        <Skeleton className="mt-3 h-10 w-full" />
                    </div>
                </div>
            </div>
        )

    if (!user) return null

    const sectorInfo = SECTORS.find((s) => s.value === user.sector)
    const planInfo = PLANS.find((p) => p.value === user.plan)

    const newSettings = useMemo(() => {
        const base = (user.settings || {}) as Record<string, unknown>
        return {
            ...base,
            business_hours: businessHours,
            ai_knowledge: aiKnowledge,
        }
    }, [aiKnowledge, businessHours, user.settings])

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

    const handleSave = async () => {
        setSaving(true)
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ settings: newSettings })
                .eq('id', user.id)

            if (error) throw error

            toast.success('Brain Updated')
        } catch (error) {
            console.error('Error saving settings:', error)
            toast.error('Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const addKnowledge = () => {
        const newNode: KnowledgeNode = {
            id: Date.now().toString(),
            trigger: '',
            response: ''
        }
        setAiKnowledge(prev => [...prev, newNode])
    }

    return (
        <Tabs defaultValue="general" className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Settings className="w-6 h-6" />
                        Paramètres
                    </h1>
                    <p className="text-muted-foreground mt-1">Configurez le système IA et vos horaires</p>
                </div>

                <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <TabsList className="glass-card border border-white/10 bg-white/3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
                <TabsTrigger value="brain">Neural Engine</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">

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
            </TabsContent>

            <TabsContent value="scheduler" className="space-y-6">
                <Card className="glass-strong border-border/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Business Hours
                        </CardTitle>
                        <CardDescription>Configure when the system is allowed to accept calls & bookings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {dayOrder.map(({ key, label }) => {
                            const day = businessHours[key]
                            const closed = !day.active

                            return (
                                <div
                                    key={key}
                                    className={
                                        `grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-white/3 p-3 md:grid-cols-4 md:items-center ${
                                            closed ? 'opacity-60 grayscale' : ''
                                        }`
                                    }
                                >
                                    <div className="text-sm font-medium text-foreground">{label}</div>

                                    <div className="flex items-center gap-2">
                                        <Label className="text-xs text-muted-foreground">Open</Label>
                                        <Input
                                            type="time"
                                            value={day.open}
                                            disabled={closed}
                                            onChange={(e) =>
                                                setBusinessHours((prev) => ({
                                                    ...prev,
                                                    [key]: { ...prev[key], open: e.target.value },
                                                }))
                                            }
                                            className="h-10 bg-white/5 border-white/10"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Label className="text-xs text-muted-foreground">Close</Label>
                                        <Input
                                            type="time"
                                            value={day.close}
                                            disabled={closed}
                                            onChange={(e) =>
                                                setBusinessHours((prev) => ({
                                                    ...prev,
                                                    [key]: { ...prev[key], close: e.target.value },
                                                }))
                                            }
                                            className="h-10 bg-white/5 border-white/10"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-3">
                                        <div className="text-xs text-muted-foreground">Closed</div>
                                        <Switch
                                            checked={closed}
                                            onCheckedChange={(v) =>
                                                setBusinessHours((prev) => ({
                                                    ...prev,
                                                    [key]: { ...prev[key], active: !v },
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="brain" className="space-y-6">
                <Card className="glass-strong border-border/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="w-5 h-5" />
                            Neural Engine
                        </CardTitle>
                        <CardDescription>Teach the agent your custom answers (Q&A bank).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {aiKnowledge.map((node, idx) => (
                            <div key={node.id} className="glass-card rounded-2xl border border-white/10 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-xs text-muted-foreground">Node {idx + 1}</div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => setAiKnowledge((prev) => prev.filter((n) => n.id !== node.id))}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="mt-3 space-y-2">
                                    <Label className="text-xs text-muted-foreground">Trigger / User Question</Label>
                                    <Input
                                        value={node.trigger}
                                        onChange={(e) =>
                                            setAiKnowledge((prev) =>
                                                prev.map((n) => (n.id === node.id ? { ...n, trigger: e.target.value } : n))
                                            )
                                        }
                                        placeholder="Do you have parking?"
                                        className="h-11 bg-white/5 border-white/10"
                                    />
                                </div>

                                <div className="mt-3 space-y-2">
                                    <Label className="text-xs text-muted-foreground">AI Response</Label>
                                    <Textarea
                                        value={node.response}
                                        onChange={(e) =>
                                            setAiKnowledge((prev) =>
                                                prev.map((n) => (n.id === node.id ? { ...n, response: e.target.value } : n))
                                            )
                                        }
                                        placeholder="Yes, we have a private lot at the back."
                                        className="min-h-[120px] bg-white/5 border-white/10"
                                    />
                                </div>
                            </div>
                        ))}

                        <Button
                            variant="outline"
                            onClick={addKnowledge}
                            className="w-full border-dashed border-white/15 bg-white/2 py-6 text-muted-foreground hover:text-foreground"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Knowledge Node
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}

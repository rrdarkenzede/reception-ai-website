import { useState, useEffect, useCallback } from "react"
import { getCurrentUser } from "@/lib/store"
import type { User } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Settings, Building2, User as UserIcon, Trash2, Plus, BrainCircuit, Clock, Zap, Armchair, Headphones, MessageSquare } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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

type TableConfig = {
    id: string
    name: string
    seats: number
    is_online_reservable: boolean
}

const dayOrder: Array<{ key: DayKey; label: string }> = [
    { key: 'mon', label: 'Lundi' },
    { key: 'tue', label: 'Mardi' },
    { key: 'wed', label: 'Mercredi' },
    { key: 'thu', label: 'Jeudi' },
    { key: 'fri', label: 'Vendredi' },
    { key: 'sat', label: 'Samedi' },
    { key: 'sun', label: 'Dimanche' },
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

// Extracted sub-components to fix React re-rendering issues
interface BusinessHoursDayProps {
    day: { key: DayKey; label: string }
    hours: BusinessHoursDay
    onChange: (key: DayKey, hours: BusinessHoursDay) => void
}

function BusinessHoursDay({ day, hours, onChange }: BusinessHoursDayProps) {
    return (
        <div className="flex items-center gap-4 p-3 border border-border/30 rounded-lg">
            <div className="flex items-center gap-2 min-w-[100px]">
                <Switch
                    checked={hours.active}
                    onCheckedChange={(checked) => onChange(day.key, { ...hours, active: checked })}
                />
                <Label className="font-medium">{day.label}</Label>
            </div>
            {hours.active && (
                <div className="flex items-center gap-2">
                    <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => onChange(day.key, { ...hours, open: e.target.value })}
                        className="w-24"
                    />
                    <span className="text-muted-foreground">à</span>
                    <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => onChange(day.key, { ...hours, close: e.target.value })}
                        className="w-24"
                    />
                </div>
            )}
        </div>
    )
}

interface KnowledgeNodeItemProps {
    node: KnowledgeNode
    index: number
    onChange: (id: string, node: KnowledgeNode) => void
    onDelete: (id: string) => void
}

function KnowledgeNodeItem({ node, index, onChange, onDelete }: KnowledgeNodeItemProps) {
    return (
        <div className="space-y-3 p-4 border border-border/30 rounded-lg bg-muted/20">
            <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Connaissance #{index + 1}</h4>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(node.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
            <div className="space-y-2">
                <Label htmlFor={`trigger-${node.id}`}>Question (mot-clé déclencheur)</Label>
                <Input
                    id={`trigger-${node.id}`}
                    value={node.trigger}
                    onChange={(e) => onChange(node.id, { ...node, trigger: e.target.value })}
                    placeholder="Ex: Parking, Halal, Wifi..."
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor={`response-${node.id}`}>Réponse</Label>
                <Textarea
                    id={`response-${node.id}`}
                    value={node.response}
                    onChange={(e) => onChange(node.id, { ...node, response: e.target.value })}
                    placeholder="Réponse que l'IA donnera..."
                    rows={3}
                />
            </div>
        </div>
    )
}

interface TableItemProps {
    table: TableConfig
    onUpdate: (id: string, updates: Partial<TableConfig>) => void
    onDelete: (id: string) => void
}

function TableItem({ table, onUpdate, onDelete }: TableItemProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 border border-border/30 rounded-lg bg-muted/20">
            <div className="flex-1 grid grid-cols-2 sm:flex items-center gap-3">
                <Input 
                    value={table.name} 
                    onChange={(e) => onUpdate(table.id, { name: e.target.value })}
                    className="h-9 min-w-[120px] font-medium"
                    placeholder="Nom de la table"
                />
                <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                    <UserIcon className="w-4 h-4" />
                    <Input 
                        type="number" 
                        min={1}
                        value={table.seats} 
                        onChange={(e) => onUpdate(table.id, { seats: parseInt(e.target.value) || 1 })}
                        className="h-9 w-16 text-center"
                    />
                    <span className="hidden sm:inline">couverts</span>
                </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 mt-2 sm:mt-0">
                <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground mr-1">Réservable IA</Label>
                    <Switch 
                        checked={table.is_online_reservable}
                        onCheckedChange={(checked) => onUpdate(table.id, { is_online_reservable: checked })}
                    />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(table.id)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Form States
    const [businessHours, setBusinessHours] = useState<BusinessHours>(defaultHours)
    const [aiKnowledge, setAiKnowledge] = useState<KnowledgeNode[]>([])
    
    // New Fields
    const [restaurantName, setRestaurantName] = useState("")
    const [phoneForwarding, setPhoneForwarding] = useState("")
    const [welcomeMessage, setWelcomeMessage] = useState("")
    const [maxCapacity, setMaxCapacity] = useState(50)
    const [rushThreshold, setRushThreshold] = useState(20)

    // Room & Tables State
    const [tables, setTables] = useState<TableConfig[]>([])
    const [quotaIA, setQuotaIA] = useState(10)
    const [quotaMessage, setQuotaMessage] = useState("Nous sommes complets sur les réservations, mais nous gardons toujours des tables pour les clients de passage. Venez nous voir !")

    // Debounced settings update
    useEffect(() => {
        if (!user) return
        
        // Skip initial render
        if (loading) return

        const timer = setTimeout(async () => {
            setSaving(true)
            try {
                // Construct new settings object deeply merging to avoid data loss
                const base = (user.settings || {}) as Record<string, unknown>
                const restaurant_config = (base.restaurant_config || {}) as Record<string, unknown>;
                
                const settingsToSave = {
                    ...base,
                    business_hours: businessHours,
                    ai_knowledge: aiKnowledge,
                    restaurant_name: restaurantName,
                    phone_forwarding: phoneForwarding,
                    restaurant_config: {
                        ...restaurant_config,
                        welcome_message: welcomeMessage,
                        max_capacity: maxCapacity,
                        rush_threshold: rushThreshold,
                        tables: tables,
                        quota_ia: quotaIA,
                        quota_message: quotaMessage
                    }
                }

                const { error } = await supabase
                    .from('profiles')
                    .update({ 
                        company_name: restaurantName,
                        settings: settingsToSave 
                    })
                    .eq('id', user.id)

                if (error) throw error
                
                // Update local user object to keep it in sync for next potential update
                user.settings = settingsToSave
                user.companyName = restaurantName

            } catch (error) {
                console.error("Auto-save failed:", error)
                toast.error("Échec de la sauvegarde automatique", { id: 'autosave-error' })
            } finally {
                setSaving(false)
            }
        }, 1000) // 1s debounce

        return () => clearTimeout(timer)
    }, [
        businessHours, 
        aiKnowledge, 
        restaurantName, 
        phoneForwarding, 
        welcomeMessage, 
        maxCapacity, 
        rushThreshold, 
        tables, 
        quotaIA, 
        quotaMessage,
        user, // Dependency on user is tricky if user object mutates, but we update it in the effect
        loading
    ])



    const handleAddTable = useCallback(() => {
        const newTable: TableConfig = {
            id: `table_${Date.now()}`,
            name: `Table ${tables.length + 1}`,
            seats: 2,
            is_online_reservable: true
        }
        setTables(prev => [...prev, newTable])
    }, [tables.length])

    const handleUpdateTable = useCallback((id: string, updates: Partial<TableConfig>) => {
        setTables(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    }, [])

    const handleDeleteTable = useCallback((id: string) => {
        setTables(prev => prev.filter(t => t.id !== id))
    }, [])

    // Removed manual handleSave in favor of Auto-Save effect

    const addKnowledge = useCallback(() => {
        const newNode: KnowledgeNode = {
            id: Date.now().toString(),
            trigger: '',
            response: ''
        }
        setAiKnowledge(prev => [...prev, newNode])
    }, [])

    useEffect(() => {
        let mounted = true

        const isRecord = (v: unknown): v is Record<string, unknown> =>
            typeof v === 'object' && v !== null && !Array.isArray(v)

        async function load() {
            try {
                const u = await getCurrentUser()
                if (!mounted) return
                setUser(u)

                if (u) {
                    setRestaurantName(u.companyName || "")
                    
                    // Also fetch restaurant settings if user has a restaurantId
                    let restaurantSettings: Record<string, unknown> = {}
                    if (u.restaurantId) {
                        const { data: restData } = await supabase
                            .from('restaurants')
                            .select('settings')
                            .eq('id', u.restaurantId)
                            .single()
                        
                        if (restData?.settings && isRecord(restData.settings)) {
                            restaurantSettings = restData.settings
                        }
                    }
                    
                    const settingsRaw = u.settings || {}
                    const settings = isRecord(settingsRaw) ? settingsRaw : {}
                    
                    // Load basic fields
                    if (typeof settings.phone_forwarding === 'string') setPhoneForwarding(settings.phone_forwarding)
                    
                    // Load Restaurant Config - prioritize restaurant settings over profile settings
                    const rConfigFromRest = isRecord(restaurantSettings.restaurant_config) ? restaurantSettings.restaurant_config : {}
                    const rConfig = isRecord(settings.restaurant_config) ? { ...settings.restaurant_config, ...rConfigFromRest } : rConfigFromRest
                    
                    // Welcome message: prioritize restaurant.settings -> profile.settings
                    const welcomeMsg = typeof rConfigFromRest.welcome_message === 'string' 
                        ? rConfigFromRest.welcome_message 
                        : (typeof rConfig.welcome_message === 'string' ? rConfig.welcome_message : '')
                    setWelcomeMessage(welcomeMsg)
                    if (typeof rConfig.max_capacity === 'number') setMaxCapacity(rConfig.max_capacity)
                    if (typeof rConfig.max_capacity === 'number') setMaxCapacity(rConfig.max_capacity)
                    if (typeof rConfig.rush_threshold === 'number') setRushThreshold(rConfig.rush_threshold)
                    
                    // Load Room Config
                    if (Array.isArray(rConfig.tables)) setTables(rConfig.tables)
                    if (typeof rConfig.quota_ia === 'number') setQuotaIA(rConfig.quota_ia)
                    if (typeof rConfig.quota_message === 'string') setQuotaMessage(rConfig.quota_message)

                    // Safe business hours parsing
                    const bhRaw = settings.business_hours
                    if (isRecord(bhRaw)) {
                        const next: BusinessHours = { ...defaultHours }
                        for (const { key } of dayOrder) {
                            const dayRaw = bhRaw[key]
                            if (!isRecord(dayRaw)) continue
                            
                            const open = typeof dayRaw.open === 'string' && dayRaw.open ? dayRaw.open : next[key].open
                            const close = typeof dayRaw.close === 'string' && dayRaw.close ? dayRaw.close : next[key].close
                            const active = typeof dayRaw.active === 'boolean' ? dayRaw.active : next[key].active
                            
                            next[key] = { open, close, active }
                        }
                        setBusinessHours(next)
                    }

                    // Safe AI knowledge parsing
                    const knowledgeRaw = settings.ai_knowledge
                    if (Array.isArray(knowledgeRaw) && knowledgeRaw.length > 0) {
                        setAiKnowledge(
                            knowledgeRaw
                                .filter((n): n is Record<string, unknown> => isRecord(n))
                                .map((n, index) => ({
                                    id: typeof n.id === 'string' && n.id ? n.id : `knowledge-${index}`,
                                    trigger: typeof n.trigger === 'string' && n.trigger ? n.trigger : '',
                                    response: typeof n.response === 'string' && n.response ? n.response : '',
                                }))
                                .filter((n) => n.trigger || n.response)
                        )
                    }
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

    if (loading) {
        return (
            <div className="space-y-6 max-w-5xl">
                <Skeleton className="h-10 w-48" />
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        )
    }

    if (!user) return null

    return (
        <Tabs defaultValue="general" className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Settings className="w-6 h-6" />
                        Paramètres
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-muted-foreground">Configuration générale de votre restaurant et de l'IA</p>
                        {saving ? (
                           <Badge variant="outline" className="text-xs border-yellow-500/50 text-yellow-500 animate-pulse bg-yellow-500/10">
                               <Zap className="w-3 h-3 mr-1" />
                               Sauvegarde...
                           </Badge>
                        ) : (
                            <Badge variant="outline" className="text-xs border-green-500/50 text-green-500 bg-green-500/10 transition-all duration-500">
                                <Zap className="w-3 h-3 mr-1" />
                                Sauvegardé
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            <TabsList className="bg-zinc-900/50 p-1 rounded-xl border border-white/5 h-auto grid grid-cols-3 w-full md:w-auto gap-2">
                <TabsTrigger value="general" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-3">
                    <Building2 className="w-4 h-4" />
                    Général & Identité
                </TabsTrigger>
                <TabsTrigger value="scheduler" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-3">
                    <Clock className="w-4 h-4" />
                    Horaires & Services
                </TabsTrigger>
                <TabsTrigger value="brain" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-3">
                    <BrainCircuit className="w-4 h-4" />
                    Cerveau IA
                </TabsTrigger>
                <TabsTrigger value="room" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary py-3">
                    <Armchair className="w-4 h-4" />
                    Salle & Tables
                </TabsTrigger>
            </TabsList>

            {/* TAB 1: GENERAL & IDENTITY */}
            <TabsContent value="general" className="space-y-6 animate-in slide-in-from-left-2 duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Identity Card */}
                    <Card className="glass-card border-border/30 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Building2 className="w-5 h-5 text-blue-400" />
                                Identité
                            </CardTitle>
                            <CardDescription>Informations de base de l'établissement</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nom du Restaurant</Label>
                                <Input 
                                    value={restaurantName} 
                                    onChange={(e) => setRestaurantName(e.target.value)}
                                    placeholder="Ex: Chez Mario" 
                                    className="bg-black/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Numéro de Renvoi (Panic Button)</Label>
                                <Input 
                                    value={phoneForwarding} 
                                    onChange={(e) => setPhoneForwarding(e.target.value)}
                                    placeholder="+33 6..." 
                                    type="tel"
                                    className="bg-black/20"
                                />
                                <p className="text-xs text-muted-foreground">Numéro vers lequel l'IA transfère en cas d'urgence.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Capacité Max (Couverts)</Label>
                                <Input 
                                    value={maxCapacity} 
                                    onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 0)}
                                    type="number"
                                    className="bg-black/20"
                                />
                                <p className="text-xs text-muted-foreground">Si dépassé, l'IA dira "Nous sommes complets".</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Personality Card */}
                    <Card className="glass-card border-border/30 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <UserIcon className="w-5 h-5 text-purple-400" />
                                Personnalité IA
                            </CardTitle>
                            <CardDescription>Ce que l'IA dit en décrochant</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Message d'Accueil</Label>
                                <Textarea 
                                    value={welcomeMessage} 
                                    onChange={(e) => setWelcomeMessage(e.target.value)}
                                    placeholder="Bonjour, bienvenue chez Mario ! Comment puis-je vous aider ?" 
                                    rows={5}
                                    className="bg-black/20 resize-none"
                                />
                                <p className="text-xs text-muted-foreground">L'IA lira ce texte exact au début de chaque appel.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            {/* TAB 2: SCHEDULER & SERVICES */}
            <TabsContent value="scheduler" className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                
                {/* Rush Threshold Slider */}
                <Card className="glass-strong border-border/30 bg-orange-900/10 border-orange-500/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-400">
                            <Zap className="w-5 h-5" />
                            Seuil d'Alerte "Rush"
                        </CardTitle>
                        <CardDescription>Définit quand l'écran Cuisine passe en mode Alerte Rouge.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-2xl">{rushThreshold} Réservations</span>
                            <span className="text-sm text-muted-foreground">Seuil actuel</span>
                        </div>
                        <Slider 
                            value={[rushThreshold]} 
                            max={100} 
                            step={1} 
                            onValueChange={(vals) => setRushThreshold(vals[0])}
                            className="py-4"
                        />
                        <p className="text-sm text-muted-foreground">
                            Si le nombre de réservations actives dépasse ce nombre, l'interface cuisine changera de couleur pour alerter le chef.
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass-strong border-border/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            Heures d'ouverture
                        </CardTitle>
                        <CardDescription>Configurez quand le système est autorisé à accepter les appels.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {dayOrder.map((day) => (
                            <BusinessHoursDay
                                key={day.key}
                                day={day}
                                hours={businessHours[day.key]}
                                onChange={(key, hours) => setBusinessHours(prev => ({ ...prev, [key]: hours }))}
                            />
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* TAB 3: AI BRAIN */}
            <TabsContent value="brain" className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                <Card className="glass-strong border-border/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-cyan-400" />
                            Base de Connaissance
                        </CardTitle>
                        <CardDescription>Ajoutez des questions/réponses personnalisées pour entraîner votre IA.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col">
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {aiKnowledge.map((node, index) => (
                                <KnowledgeNodeItem
                                    key={node.id}
                                    node={node}
                                    index={index}
                                    onChange={(id, updatedNode) =>
                                        setAiKnowledge(prev => prev.map(n => n.id === id ? updatedNode : n))
                                    }
                                    onDelete={(id) => setAiKnowledge(prev => prev.filter(n => n.id !== id))}
                                />
                            ))}
                            {aiKnowledge.length === 0 && (
                                <div className="text-center py-10 text-muted-foreground">
                                    Aucune connaissance ajoutée. L'IA utilisera ses connaissances générales.
                                </div>
                            )}
                        </div>

                        <Button
                            variant="outline"
                            onClick={addKnowledge}
                            className="w-full border-dashed border-white/15 bg-white/2 py-8 text-muted-foreground hover:text-foreground mt-4 flex-shrink-0"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter une nouvelle règle Q&A
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* TAB 4: ROOM & TABLES */}
            <TabsContent value="room" className="space-y-6 animate-in slide-in-from-right-2 duration-300">
                {/* Global Control */}
                <Card className="glass-strong border-border/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            Contrôle Global du Service
                        </CardTitle>
                        <CardDescription>Définissez les limites de réservation pour l'IA.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Quota Tables IA (Max Réservations/Service)</Label>
                                <Input 
                                    type="number" 
                                    min={0}
                                    value={quotaIA} 
                                    onChange={(e) => setQuotaIA(parseInt(e.target.value) || 0)}
                                    className="bg-black/20"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Si atteint, l'IA refusera les nouvelles réservations même s'il reste des tables.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label>Message de Repli (Si complet)</Label>
                                <Textarea 
                                    value={quotaMessage} 
                                    onChange={(e) => setQuotaMessage(e.target.value)}
                                    placeholder="Nous sommes complets..." 
                                    rows={3}
                                    className="bg-black/20 resize-none"
                                />
                                <p className="text-xs text-muted-foreground">L'IA dira ceci quand le quota est atteint.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tables List */}
                <Card className="glass-strong border-border/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Armchair className="w-5 h-5 text-blue-400" />
                            Configuration de la Salle
                        </CardTitle>
                        <CardDescription>Gérez votre plan de salle et les tables réservables.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            {tables.map((table) => (
                                <TableItem
                                    key={table.id}
                                    table={table}
                                    onUpdate={handleUpdateTable}
                                    onDelete={handleDeleteTable}
                                />
                            ))}
                            {tables.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground border border-dashed border-zinc-800 rounded-lg">
                                    Aucune table configurée. Ajoutez-en une pour commencer.
                                </div>
                            )}
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleAddTable}
                            className="w-full border-dashed border-white/15 bg-white/2 py-8 text-muted-foreground hover:text-foreground mt-4"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter une Table
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* SUPPORT BUTTON - Fixed at bottom */}
            <SupportButton user={user} />
        </Tabs>
    )
}

// Support Button Component
function SupportButton({ user }: { user: User }) {
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

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

            toast.success('Demande envoyée ! Notre équipe vous recontactera rapidement.')
            setOpen(false)
            setCategory('')
            setSubject('')
            setMessage('')
        } catch (error) {
            console.error('Error:', error)
            toast.error('Erreur lors de l\'envoi')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full mt-8 py-6 border-dashed border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-500/50 text-cyan-400 gap-3 text-base"
                >
                    <Headphones className="w-5 h-5" />
                    🛠️ Demander une modification / Support
                </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong border-white/10 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-cyan-400" />
                        Contacter le Support
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                        <div className="text-sm font-medium text-foreground">{user.companyName}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>

                    <div className="space-y-2">
                        <Label>Type de demande</Label>
                        <Select value={category} onValueChange={setCategory} required>
                            <SelectTrigger className="bg-secondary/50">
                                <SelectValue placeholder="Sélectionnez..." />
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

                    <div className="space-y-2">
                        <Label>Sujet</Label>
                        <Input
                            placeholder="Ex: Changer le prix du Burger à 21€"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            className="bg-secondary/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea
                            placeholder="Décrivez votre demande en détail..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={4}
                            className="bg-secondary/50 resize-none"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Envoi...' : 'Envoyer ma demande'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

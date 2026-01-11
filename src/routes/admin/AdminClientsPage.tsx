import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Users, Search } from "lucide-react"
import { getUsers, updateUser, deleteUser, createUser } from "@/lib/store"
import { SECTORS, PLANS } from "@/lib/types"
import type { User } from "@/lib/types"
import { toast } from "sonner"

export default function AdminClientsPage() {
    const [users, setUsers] = useState<User[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)

    // Form state
    const [formName, setFormName] = useState("")
    const [formEmail, setFormEmail] = useState("")
    const [formPassword, setFormPassword] = useState("")
    const [formCompany, setFormCompany] = useState("")
    const [formSector, setFormSector] = useState("")
    const [formPlan, setFormPlan] = useState<"starter" | "pro" | "elite">("starter")
    const [formWebhookUrl, setFormWebhookUrl] = useState("")

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        setUsers(await getUsers())
    }

    const resetForm = () => {
        setFormName("")
        setFormEmail("")
        setFormPassword("")
        setFormCompany("")
        setFormSector("")
        setFormPlan("starter")
        setFormWebhookUrl("")
    }

    const handleCreate = async () => {
        if (!formName || !formEmail || !formPassword || !formSector) {
            toast.error("Veuillez remplir tous les champs obligatoires")
            return
        }

        await createUser({
            email: formEmail,
            password: formPassword,
            name: formName,
            companyName: formCompany,
            role: "client",
            sector: formSector as any,
            plan: formPlan,
            webhookUrl: formWebhookUrl,
            createdAt: new Date().toISOString(),
        })

        toast.success(`Client "${formName}" créé avec succès`)
        setIsCreateOpen(false)
        resetForm()
        loadUsers()
    }

    const handleEdit = (user: User) => {
        setEditingUser(user)
        setFormName(user.name)
        setFormEmail(user.email)
        setFormPassword(user.password || "")
        setFormCompany(user.companyName || "")
        setFormSector(user.sector || "")
        setFormPlan((user.plan as any) || "starter")
        setFormWebhookUrl(user.webhookUrl || "")
    }

    const handleUpdate = async () => {
        if (!editingUser) return

        await updateUser(editingUser.id, {
            name: formName,
            email: formEmail,
            password: formPassword || undefined,
            companyName: formCompany,
            sector: formSector as any,
            plan: formPlan,
            webhookUrl: formWebhookUrl,
        })

        toast.success(`Client "${formName}" mis à jour`)
        setEditingUser(null)
        resetForm()
        loadUsers()
    }

    const handleDelete = async (user: User) => {
        if (confirm(`Supprimer le client "${user.name}" ?`)) {
            await deleteUser(user.id)
            toast.success(`Client "${user.name}" supprimé`)
            loadUsers()
        }
    }

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getPlanBadge = (plan?: string) => {
        switch (plan) {
            case "elite":
                return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Elite</Badge>
            case "pro":
                return <Badge className="bg-primary/20 text-primary border-primary/30">Pro</Badge>
            default:
                return <Badge variant="secondary">Starter</Badge>
        }
    }

    const getSectorLabel = (sector?: string) => {
        const found = SECTORS.find((s) => s.value === sector)
        return found ? `${found.icon} ${found.label}` : sector || "-"
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Users className="w-6 h-6" />
                        Gestion des Clients
                    </h1>
                    <p className="text-muted-foreground mt-1">{users.length} clients enregistrés</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Nouveau Client
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer un nouveau client</DialogTitle>
                            <DialogDescription>
                                Remplissez les informations du client. Il pourra se connecter avec ces identifiants.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nom *</Label>
                                    <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Jean Dupont" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Entreprise</Label>
                                    <Input value={formCompany} onChange={(e) => setFormCompany(e.target.value)} placeholder="Restaurant XYZ" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email *</Label>
                                <Input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="email@exemple.com" />
                            </div>
                            <div className="space-y-2">
                                <Label>Mot de passe *</Label>
                                <Input type="text" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="Mot de passe initial" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Secteur *</Label>
                                    <Select value={formSector} onValueChange={setFormSector}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SECTORS.map((sector) => (
                                                <SelectItem key={sector.value} value={sector.value}>
                                                    {sector.icon} {sector.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Plan</Label>
                                    <Select value={formPlan} onValueChange={(v) => setFormPlan(v as any)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PLANS.map((plan) => (
                                                <SelectItem key={plan.value} value={plan.value}>
                                                    {plan.label} ({plan.price}€)
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>URL Webhook de l'IA</Label>
                                <Input value={formWebhookUrl} onChange={(e) => setFormWebhookUrl(e.target.value)} placeholder="https://api.vapi.ai/..." />
                                <p className="text-xs text-muted-foreground">Lien de connexion vers l'agent IA (Superagent, Vapi, Retell...)</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Annuler</Button>
                            <Button onClick={handleCreate}>Créer le client</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    className="pl-10 max-w-sm"
                    placeholder="Rechercher un client..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="glass-card rounded-xl border-border/30 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Secteur</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Créé le</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Aucun client trouvé
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium text-foreground">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                            {user.companyName && (
                                                <div className="text-xs text-muted-foreground">{user.companyName}</div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getSectorLabel(user.sector)}</TableCell>
                                    <TableCell>{getPlanBadge(user.plan)}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Modifier le client</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label>Nom</Label>
                                                                <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Entreprise</Label>
                                                                <Input value={formCompany} onChange={(e) => setFormCompany(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Email</Label>
                                                            <Input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Nouveau mot de passe (laisser vide pour conserver)</Label>
                                                            <Input type="text" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label>Secteur</Label>
                                                                <Select value={formSector} onValueChange={setFormSector}>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {SECTORS.map((sector) => (
                                                                            <SelectItem key={sector.value} value={sector.value}>
                                                                                {sector.icon} {sector.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Plan</Label>
                                                                <Select value={formPlan} onValueChange={(v) => setFormPlan(v as any)}>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {PLANS.map((plan) => (
                                                                            <SelectItem key={plan.value} value={plan.value}>
                                                                                {plan.label} ({plan.price}€)
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>URL Webhook de l'IA</Label>
                                                            <Input value={formWebhookUrl} onChange={(e) => setFormWebhookUrl(e.target.value)} placeholder="https://api.vapi.ai/..." />
                                                            <p className="text-xs text-muted-foreground">Lien de connexion vers l'agent IA</p>
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setEditingUser(null)}>Annuler</Button>
                                                        <Button onClick={handleUpdate}>Enregistrer</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(user)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table >
            </div >
        </div >
    )
}

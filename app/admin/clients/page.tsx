"use client"

import { useEffect, useState } from "react"
import { getUsers, updateUser, deleteUser, addUser, getRDVs } from "@/lib/store"
import type { User, Plan, Sector } from "@/lib/types"
import { SECTORS, PLANS } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Eye, Pencil, Trash2, Phone, Search, Filter, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminClientsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [planFilter, setPlanFilter] = useState<string>("all")
  const [sectorFilter, setSectorFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formCompany, setFormCompany] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formPassword, setFormPassword] = useState("")
  const [formSector, setFormSector] = useState<Sector>("restaurant")
  const [formPlan, setFormPlan] = useState<Plan>("starter")

  const loadUsers = () => {
    const allUsers = getUsers()
    setUsers(allUsers)
    filterUsers(allUsers, searchQuery, planFilter, sectorFilter)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filterUsers = (userList: User[], search: string, plan: string, sector: string) => {
    let filtered = userList

    if (search) {
      const query = search.toLowerCase()
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.companyName?.toLowerCase().includes(query),
      )
    }

    if (plan !== "all") {
      filtered = filtered.filter((u) => u.plan === plan)
    }

    if (sector !== "all") {
      filtered = filtered.filter((u) => u.sector === sector)
    }

    setFilteredUsers(filtered)
  }

  useEffect(() => {
    filterUsers(users, searchQuery, planFilter, sectorFilter)
  }, [searchQuery, planFilter, sectorFilter, users])

  const handleAddUser = () => {
    addUser({
      name: formName,
      companyName: formCompany,
      email: formEmail,
      password: formPassword,
      sector: formSector,
      plan: formPlan,
      role: "client",
    })
    toast.success("Client ajouté avec succès")
    setIsAddDialogOpen(false)
    resetForm()
    loadUsers()
  }

  const handleEditUser = () => {
    if (!selectedUser) return
    updateUser(selectedUser.id, {
      name: formName,
      companyName: formCompany,
      email: formEmail,
      sector: formSector,
      plan: formPlan,
    })
    toast.success("Client modifié avec succès")
    setIsEditDialogOpen(false)
    resetForm()
    loadUsers()
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return
    deleteUser(selectedUser.id)
    toast.success("Client supprimé")
    setIsDeleteDialogOpen(false)
    setSelectedUser(null)
    loadUsers()
  }

  const handleSectorChange = (userId: string, newSector: Sector) => {
    updateUser(userId, { sector: newSector })
    toast.success("Secteur mis à jour")
    loadUsers()
  }

  const handlePlanChange = (userId: string, newPlan: Plan) => {
    updateUser(userId, { plan: newPlan })
    toast.success("Plan mis à jour")
    loadUsers()
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setFormName(user.name)
    setFormCompany(user.companyName || "")
    setFormEmail(user.email)
    setFormSector(user.sector || "restaurant")
    setFormPlan(user.plan || "starter")
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const resetForm = () => {
    setFormName("")
    setFormCompany("")
    setFormEmail("")
    setFormPassword("")
    setFormSector("restaurant")
    setFormPlan("starter")
    setSelectedUser(null)
  }

  const getSectorIcon = (sector?: Sector) => {
    const s = SECTORS.find((sec) => sec.value === sector)
    return s ? `${s.icon} ${s.label}` : "-"
  }

  const getPlanBadge = (plan?: Plan) => {
    const colors: Record<Plan, string> = {
      starter: "bg-secondary text-muted-foreground",
      pro: "bg-primary/10 text-primary",
      elite: "bg-warning/10 text-warning",
    }
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[plan || "starter"]}`}>
        {plan?.toUpperCase()}
      </span>
    )
  }

  const getUserRDVCount = (userId: string) => {
    return getRDVs(userId).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion Clients</h1>
          <p className="text-muted-foreground">Gérez les comptes et abonnements de vos clients</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          Ajouter Client
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Chercher par nom/email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-40 bg-secondary/50 border-border/50">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les plans</SelectItem>
            {PLANS.map((plan) => (
              <SelectItem key={plan.value} value={plan.value}>
                {plan.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-48 bg-secondary/50 border-border/50">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Secteur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les secteurs</SelectItem>
            {SECTORS.map((sector) => (
              <SelectItem key={sector.value} value={sector.value}>
                {sector.icon} {sector.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl border-border/30 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Nom</TableHead>
              <TableHead className="text-muted-foreground">Secteur</TableHead>
              <TableHead className="text-muted-foreground">Plan</TableHead>
              <TableHead className="text-muted-foreground">Email</TableHead>
              <TableHead className="text-muted-foreground">RDV</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-border/30">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{user.companyName || user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.name}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Select value={user.sector} onValueChange={(value) => handleSectorChange(user.id, value as Sector)}>
                    <SelectTrigger className="w-40 h-8 text-xs bg-secondary/30 border-border/30">
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
                </TableCell>
                <TableCell>
                  <Select value={user.plan} onValueChange={(value) => handlePlanChange(user.id, value as Plan)}>
                    <SelectTrigger className="w-28 h-8 text-xs bg-secondary/30 border-border/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLANS.map((plan) => (
                        <SelectItem key={plan.value} value={plan.value}>
                          {plan.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                <TableCell className="text-foreground">{getUserRDVCount(user.id)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/clients/${user.id}`} className="flex items-center gap-2">
                          <Eye className="w-4 h-4" /> Preview
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(user)} className="gap-2">
                        <Pencil className="w-4 h-4" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/clients/${user.id}/calls`} className="flex items-center gap-2">
                          <Phone className="w-4 h-4" /> Appels
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(user)}
                        className="gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="glass-card border-border/50">
          <DialogHeader>
            <DialogTitle>Ajouter un Client</DialogTitle>
            <DialogDescription>Créez un nouveau compte client</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom complet</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Nom de l&apos;entreprise</Label>
              <Input
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Mot de passe</Label>
              <Input
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Secteur</Label>
                <Select value={formSector} onValueChange={(v) => setFormSector(v as Sector)}>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.icon} {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select value={formPlan} onValueChange={(v) => setFormPlan(v as Plan)}>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLANS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button onClick={handleAddUser} className="bg-primary hover:bg-primary/90">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-card border-border/50">
          <DialogHeader>
            <DialogTitle>Modifier Client</DialogTitle>
            <DialogDescription>Modifiez les informations du client</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nom complet</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Nom de l&apos;entreprise</Label>
              <Input
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Secteur</Label>
                <Select value={formSector} onValueChange={(v) => setFormSector(v as Sector)}>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.icon} {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select value={formPlan} onValueChange={(v) => setFormPlan(v as Plan)}>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLANS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button onClick={handleEditUser} className="bg-primary hover:bg-primary/90">
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass-card border-border/50">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le client &quot;{selectedUser?.companyName || selectedUser?.name}
              &quot;? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

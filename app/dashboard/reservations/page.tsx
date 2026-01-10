"use client"

import { useEffect, useState } from "react"
import { getCurrentUser, getRDVs, addRDV, updateRDV, deleteRDV } from "@/lib/store"
import type { User, RDV } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Filter, MoreHorizontal, Clock, Trash2, Phone, Lock } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "En Attente", color: "bg-muted-foreground/20 text-muted-foreground" },
  confirmed: { label: "Confirmé", color: "bg-primary/20 text-primary" },
  in_progress: { label: "En Cours", color: "bg-warning/20 text-warning" },
  completed: { label: "Terminé", color: "bg-success/20 text-success" },
  cancelled: { label: "Annulé", color: "bg-destructive/20 text-destructive" },
}

export default function ReservationsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [rdvs, setRdvs] = useState<RDV[]>([])
  const [filteredRdvs, setFilteredRdvs] = useState<RDV[]>([])
  const [selectedRdv, setSelectedRdv] = useState<RDV | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Form state for new/edit RDV
  const [formClientName, setFormClientName] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formDate, setFormDate] = useState("")
  const [formTime, setFormTime] = useState("")
  const [formStatus, setFormStatus] = useState<RDV["status"]>("pending")
  const [formNotes, setFormNotes] = useState("")
  // Restaurant specific
  const [formGuests, setFormGuests] = useState("2")
  const [formTableId, setFormTableId] = useState("")
  // Dentiste specific
  const [formServiceType, setFormServiceType] = useState("")
  const [formRoomId, setFormRoomId] = useState("")
  const [formMedicalNotes, setFormMedicalNotes] = useState("")
  // Garage specific
  const [formVehicleBrand, setFormVehicleBrand] = useState("")
  const [formVehicleModel, setFormVehicleModel] = useState("")
  const [formLicensePlate, setFormLicensePlate] = useState("")
  const [formRepairType, setFormRepairType] = useState("")
  const [formEstimatedCost, setFormEstimatedCost] = useState("")

  const loadData = () => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      const userRdvs = getRDVs(currentUser.id)
      setRdvs(userRdvs)
      applyFilters(userRdvs, statusFilter, dateFilter)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const applyFilters = (rdvList: RDV[], status: string, date: string) => {
    let filtered = rdvList

    if (status !== "all") {
      filtered = filtered.filter((r) => r.status === status)
    }

    if (date) {
      filtered = filtered.filter((r) => r.date === date)
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.time.localeCompare(b.time)
    })

    setFilteredRdvs(filtered)
  }

  useEffect(() => {
    applyFilters(rdvs, statusFilter, dateFilter)
  }, [statusFilter, dateFilter, rdvs])

  const isPro = user?.plan === "pro" || user?.plan === "elite"
  const isElite = user?.plan === "elite"

  const resetForm = () => {
    setFormClientName("")
    setFormPhone("")
    setFormEmail("")
    setFormDate("")
    setFormTime("")
    setFormStatus("pending")
    setFormNotes("")
    setFormGuests("2")
    setFormTableId("")
    setFormServiceType("")
    setFormRoomId("")
    setFormMedicalNotes("")
    setFormVehicleBrand("")
    setFormVehicleModel("")
    setFormLicensePlate("")
    setFormRepairType("")
    setFormEstimatedCost("")
  }

  const populateForm = (rdv: RDV) => {
    setFormClientName(rdv.clientName)
    setFormPhone(rdv.phone || "")
    setFormEmail(rdv.email || "")
    setFormDate(rdv.date)
    setFormTime(rdv.time)
    setFormStatus(rdv.status)
    setFormNotes(rdv.notes || "")
    setFormGuests(rdv.guests?.toString() || "2")
    setFormTableId(rdv.tableId || "")
    setFormServiceType(rdv.serviceType || "")
    setFormRoomId(rdv.roomId || "")
    setFormMedicalNotes(rdv.medicalNotes || "")
    setFormVehicleBrand(rdv.vehicleBrand || "")
    setFormVehicleModel(rdv.vehicleModel || "")
    setFormLicensePlate(rdv.licensePlate || "")
    setFormRepairType(rdv.repairType || "")
    setFormEstimatedCost(rdv.estimatedCost?.toString() || "")
  }

  const handleSelectRdv = (rdv: RDV) => {
    setSelectedRdv(rdv)
    populateForm(rdv)
  }

  const handleAddRdv = () => {
    if (!user) return

    const newRdv: Omit<RDV, "id"> = {
      userId: user.id,
      clientName: formClientName,
      phone: formPhone,
      email: formEmail,
      date: formDate,
      time: formTime,
      status: formStatus,
      notes: formNotes,
      ...(user.sector === "restaurant" && {
        guests: Number.parseInt(formGuests),
        tableId: formTableId,
      }),
      ...(user.sector === "dentiste" && {
        patientName: formClientName,
        serviceType: formServiceType,
        roomId: formRoomId,
        medicalNotes: formMedicalNotes,
      }),
      ...(user.sector === "garage" && {
        vehicleBrand: formVehicleBrand,
        vehicleModel: formVehicleModel,
        licensePlate: formLicensePlate,
        repairType: formRepairType,
        estimatedCost: Number.parseFloat(formEstimatedCost) || 0,
      }),
    }

    addRDV(newRdv)
    toast.success("RDV créé avec succès")
    setIsAddDialogOpen(false)
    resetForm()
    loadData()
  }

  const handleUpdateRdv = () => {
    if (!selectedRdv || !isPro) return

    const updates: Partial<RDV> = {
      clientName: formClientName,
      phone: formPhone,
      email: formEmail,
      date: formDate,
      time: formTime,
      status: formStatus,
      notes: formNotes,
      ...(user?.sector === "restaurant" && {
        guests: Number.parseInt(formGuests),
        tableId: formTableId,
      }),
      ...(user?.sector === "dentiste" && {
        patientName: formClientName,
        serviceType: formServiceType,
        roomId: formRoomId,
        medicalNotes: formMedicalNotes,
      }),
      ...(user?.sector === "garage" && {
        vehicleBrand: formVehicleBrand,
        vehicleModel: formVehicleModel,
        licensePlate: formLicensePlate,
        repairType: formRepairType,
        estimatedCost: Number.parseFloat(formEstimatedCost) || 0,
      }),
    }

    updateRDV(selectedRdv.id, updates)
    toast.success("RDV modifié avec succès")
    loadData()
    // Update selected RDV
    setSelectedRdv({ ...selectedRdv, ...updates })
  }

  const handleDeleteRdv = () => {
    if (!selectedRdv) return
    deleteRDV(selectedRdv.id)
    toast.success("RDV supprimé")
    setIsDeleteDialogOpen(false)
    setSelectedRdv(null)
    resetForm()
    loadData()
  }

  const handleStatusChange = (rdvId: string, newStatus: RDV["status"]) => {
    if (!isPro) return
    updateRDV(rdvId, { status: newStatus })
    toast.success("Statut mis à jour")
    loadData()
    if (selectedRdv?.id === rdvId) {
      setSelectedRdv({ ...selectedRdv, status: newStatus })
      setFormStatus(newStatus)
    }
  }

  const getPageTitle = () => {
    switch (user?.sector) {
      case "restaurant":
        return "Réservations"
      case "dentiste":
        return "Patients"
      case "garage":
        return "Réparations"
      default:
        return "Réservations"
    }
  }

  const getItemSubtitle = (rdv: RDV) => {
    switch (user?.sector) {
      case "restaurant":
        return `👤 ${rdv.guests || 0} pers. | 🪑 ${rdv.tableId || "Non assigné"}`
      case "dentiste":
        return `🦷 ${rdv.serviceType || "Consultation"} | 🚪 ${rdv.roomId || "Non assigné"}`
      case "garage":
        return `🚗 ${rdv.vehicleBrand || ""} ${rdv.vehicleModel || ""} | 🔧 ${rdv.repairType || ""}`
      default:
        return ""
    }
  }

  if (!user) return null

  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)]">
      {/* Left Panel - List */}
      <div className="w-96 flex flex-col glass-card rounded-xl border-border/30">
        {/* Header */}
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{getPageTitle()}</h2>
            {isPro && (
              <Button
                size="sm"
                onClick={() => {
                  resetForm()
                  setIsAddDialogOpen(true)
                }}
                className="gap-1 bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1 h-8 text-xs bg-secondary/30 border-border/30">
                <Filter className="w-3 h-3 mr-1" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(statusLabels).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-36 h-8 text-xs bg-secondary/30 border-border/30"
            />
          </div>
        </div>

        {/* List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredRdvs.map((rdv) => (
              <button
                key={rdv.id}
                onClick={() => handleSelectRdv(rdv)}
                className={cn(
                  "w-full p-3 rounded-lg text-left transition-all",
                  selectedRdv?.id === rdv.id
                    ? "bg-primary/10 border-l-2 border-primary"
                    : "hover:bg-secondary/50 border-l-2 border-transparent",
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-foreground">{rdv.clientName}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", statusLabels[rdv.status].color)}>
                    {statusLabels[rdv.status].label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{getItemSubtitle(rdv)}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {rdv.date} à {rdv.time}
                </div>
                {rdv.notes && <p className="text-xs text-muted-foreground/70 mt-1 truncate">{rdv.notes}</p>}
              </button>
            ))}
            {filteredRdvs.length === 0 && <p className="text-center text-muted-foreground py-8">Aucun RDV trouvé</p>}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Detail/Form */}
      <div className="flex-1 glass-card rounded-xl border-border/30 p-6 overflow-auto">
        {!selectedRdv ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Sélectionnez un RDV pour voir les détails
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Détails du RDV</h3>
              <div className="flex items-center gap-2">
                {isPro && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isElite && (
                        <DropdownMenuItem className="gap-2">
                          <Phone className="w-4 h-4" /> Rappeler
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Starter: Read Only Message */}
            {!isPro && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 text-warning text-sm">
                <Lock className="w-4 h-4" />
                Mode lecture seule. Passez au plan Pro pour modifier les RDV.
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom du client</Label>
                <Input
                  value={formClientName}
                  onChange={(e) => setFormClientName(e.target.value)}
                  disabled={!isPro}
                  className="bg-secondary/30 border-border/30 disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  disabled={!isPro}
                  className="bg-secondary/30 border-border/30 disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  disabled={!isPro}
                  className="bg-secondary/30 border-border/30 disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                  value={formStatus}
                  onValueChange={(v) => handleStatusChange(selectedRdv.id, v as RDV["status"])}
                  disabled={!isPro}
                >
                  <SelectTrigger className="bg-secondary/30 border-border/30 disabled:opacity-60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  disabled={!isPro}
                  className="bg-secondary/30 border-border/30 disabled:opacity-60"
                />
              </div>
              <div className="space-y-2">
                <Label>Heure</Label>
                <Input
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  disabled={!isPro}
                  className="bg-secondary/30 border-border/30 disabled:opacity-60"
                />
              </div>

              {/* Sector-specific fields */}
              {user.sector === "restaurant" && (
                <>
                  <div className="space-y-2">
                    <Label>Nombre de personnes</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formGuests}
                      onChange={(e) => setFormGuests(e.target.value)}
                      disabled={!isPro}
                      className="bg-secondary/30 border-border/30 disabled:opacity-60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Table</Label>
                    <Select value={formTableId} onValueChange={setFormTableId} disabled={!isPro}>
                      <SelectTrigger className="bg-secondary/30 border-border/30 disabled:opacity-60">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <SelectItem key={n} value={`table-${n}`}>
                            Table {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {user.sector === "dentiste" && (
                <>
                  <div className="space-y-2">
                    <Label>Type de soin</Label>
                    <Select value={formServiceType} onValueChange={setFormServiceType} disabled={!isPro}>
                      <SelectTrigger className="bg-secondary/30 border-border/30 disabled:opacity-60">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                        <SelectItem value="Détartrage">Détartrage</SelectItem>
                        <SelectItem value="Extraction">Extraction</SelectItem>
                        <SelectItem value="Plombage">Plombage</SelectItem>
                        <SelectItem value="Blanchiment">Blanchiment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Salle</Label>
                    <Select value={formRoomId} onValueChange={setFormRoomId} disabled={!isPro}>
                      <SelectTrigger className="bg-secondary/30 border-border/30 disabled:opacity-60">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salle-1">Salle 1</SelectItem>
                        <SelectItem value="salle-2">Salle 2</SelectItem>
                        <SelectItem value="salle-3">Salle 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Notes médicales</Label>
                    <Textarea
                      value={formMedicalNotes}
                      onChange={(e) => setFormMedicalNotes(e.target.value)}
                      disabled={!isPro}
                      className="bg-secondary/30 border-border/30 disabled:opacity-60 min-h-20"
                    />
                  </div>
                </>
              )}

              {user.sector === "garage" && (
                <>
                  <div className="space-y-2">
                    <Label>Marque</Label>
                    <Input
                      value={formVehicleBrand}
                      onChange={(e) => setFormVehicleBrand(e.target.value)}
                      disabled={!isPro}
                      className="bg-secondary/30 border-border/30 disabled:opacity-60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Modèle</Label>
                    <Input
                      value={formVehicleModel}
                      onChange={(e) => setFormVehicleModel(e.target.value)}
                      disabled={!isPro}
                      className="bg-secondary/30 border-border/30 disabled:opacity-60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Immatriculation</Label>
                    <Input
                      value={formLicensePlate}
                      onChange={(e) => setFormLicensePlate(e.target.value)}
                      disabled={!isPro}
                      className="bg-secondary/30 border-border/30 disabled:opacity-60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type de réparation</Label>
                    <Select value={formRepairType} onValueChange={setFormRepairType} disabled={!isPro}>
                      <SelectTrigger className="bg-secondary/30 border-border/30 disabled:opacity-60">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vidange">Vidange</SelectItem>
                        <SelectItem value="Révision complète">Révision complète</SelectItem>
                        <SelectItem value="Changement pneus">Changement pneus</SelectItem>
                        <SelectItem value="Freins">Freins</SelectItem>
                        <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                        <SelectItem value="Embrayage">Embrayage</SelectItem>
                        <SelectItem value="Climatisation">Climatisation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Devis estimé (€)</Label>
                    <Input
                      type="number"
                      value={formEstimatedCost}
                      onChange={(e) => setFormEstimatedCost(e.target.value)}
                      disabled={!isPro}
                      className="bg-secondary/30 border-border/30 disabled:opacity-60"
                    />
                  </div>
                </>
              )}

              <div className="col-span-2 space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  disabled={!isPro}
                  className="bg-secondary/30 border-border/30 disabled:opacity-60 min-h-20"
                />
              </div>
            </div>

            {/* Actions */}
            {isPro && (
              <div className="flex gap-3 pt-4 border-t border-border/30">
                <Button onClick={handleUpdateRdv} className="bg-primary hover:bg-primary/90">
                  Enregistrer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive hover:text-destructive bg-transparent"
                >
                  Supprimer
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="glass-card border-border/50 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau RDV</DialogTitle>
            <DialogDescription>Créez un nouveau rendez-vous</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Nom du client *</Label>
              <Input
                value={formClientName}
                onChange={(e) => setFormClientName(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Heure *</Label>
              <Input
                type="time"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>

            {user?.sector === "restaurant" && (
              <>
                <div className="space-y-2">
                  <Label>Nombre de personnes</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formGuests}
                    onChange={(e) => setFormGuests(e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Table</Label>
                  <Select value={formTableId} onValueChange={setFormTableId}>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <SelectItem key={n} value={`table-${n}`}>
                          Table {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {user?.sector === "dentiste" && (
              <>
                <div className="space-y-2">
                  <Label>Type de soin</Label>
                  <Select value={formServiceType} onValueChange={setFormServiceType}>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Détartrage">Détartrage</SelectItem>
                      <SelectItem value="Extraction">Extraction</SelectItem>
                      <SelectItem value="Plombage">Plombage</SelectItem>
                      <SelectItem value="Blanchiment">Blanchiment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Salle</Label>
                  <Select value={formRoomId} onValueChange={setFormRoomId}>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salle-1">Salle 1</SelectItem>
                      <SelectItem value="salle-2">Salle 2</SelectItem>
                      <SelectItem value="salle-3">Salle 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {user?.sector === "garage" && (
              <>
                <div className="space-y-2">
                  <Label>Marque</Label>
                  <Input
                    value={formVehicleBrand}
                    onChange={(e) => setFormVehicleBrand(e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Modèle</Label>
                  <Input
                    value={formVehicleModel}
                    onChange={(e) => setFormVehicleModel(e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Immatriculation</Label>
                  <Input
                    value={formLicensePlate}
                    onChange={(e) => setFormLicensePlate(e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type de réparation</Label>
                  <Select value={formRepairType} onValueChange={setFormRepairType}>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vidange">Vidange</SelectItem>
                      <SelectItem value="Révision complète">Révision complète</SelectItem>
                      <SelectItem value="Changement pneus">Changement pneus</SelectItem>
                      <SelectItem value="Freins">Freins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Devis estimé (€)</Label>
                  <Input
                    type="number"
                    value={formEstimatedCost}
                    onChange={(e) => setFormEstimatedCost(e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
              </>
            )}

            <div className="col-span-2 space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button onClick={handleAddRdv} className="bg-primary hover:bg-primary/90">
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass-card border-border/50">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce RDV ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteRdv}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

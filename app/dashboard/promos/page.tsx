"use client"

import { useEffect, useState } from "react"
import { getCurrentUser, getPromos, addPromo, updatePromo, deletePromo } from "@/lib/store"
import type { User, Promo } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Lock, Copy, Clock, Tag, Megaphone } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function PromosPage() {
  const [user, setUser] = useState<User | null>(null)
  const [promos, setPromos] = useState<Promo[]>([])
  const [activeTab, setActiveTab] = useState("promos")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null)

  // Form state
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formCode, setFormCode] = useState("")
  const [formDiscount, setFormDiscount] = useState("")
  const [formDiscountType, setFormDiscountType] = useState<"percent" | "fixed">("percent")
  const [formStartDate, setFormStartDate] = useState("")
  const [formEndDate, setFormEndDate] = useState("")

  const loadData = () => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setPromos(getPromos(currentUser.id))
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const isPro = user?.plan === "pro" || user?.plan === "elite"

  const resetForm = () => {
    setFormTitle("")
    setFormDescription("")
    setFormCode("")
    setFormDiscount("")
    setFormDiscountType("percent")
    setFormStartDate("")
    setFormEndDate("")
    setSelectedPromo(null)
  }

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = ""
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormCode(code)
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Code copié!")
  }

  const handleToggleActive = (promo: Promo) => {
    updatePromo(promo.id, { isActive: !promo.isActive })
    toast.success(promo.isActive ? "Promo désactivée" : "Promo activée")
    loadData()
  }

  const handleAddPromo = () => {
    if (!user) return
    addPromo({
      userId: user.id,
      title: formTitle,
      description: formDescription,
      code: formCode,
      discount: Number.parseFloat(formDiscount),
      discountType: formDiscountType,
      startDate: formStartDate,
      endDate: formEndDate || undefined,
      isActive: true,
    })
    toast.success("Promo créée")
    setIsAddDialogOpen(false)
    resetForm()
    loadData()
  }

  const handleEditPromo = () => {
    if (!selectedPromo) return
    updatePromo(selectedPromo.id, {
      title: formTitle,
      description: formDescription,
      code: formCode,
      discount: Number.parseFloat(formDiscount),
      discountType: formDiscountType,
      startDate: formStartDate,
      endDate: formEndDate || undefined,
    })
    toast.success("Promo modifiée")
    setIsEditDialogOpen(false)
    resetForm()
    loadData()
  }

  const handleDeletePromo = () => {
    if (!selectedPromo) return
    deletePromo(selectedPromo.id)
    toast.success("Promo supprimée")
    setIsDeleteDialogOpen(false)
    resetForm()
    loadData()
  }

  const openEditDialog = (promo: Promo) => {
    setSelectedPromo(promo)
    setFormTitle(promo.title)
    setFormDescription(promo.description || "")
    setFormCode(promo.code)
    setFormDiscount(promo.discount.toString())
    setFormDiscountType(promo.discountType)
    setFormStartDate(promo.startDate)
    setFormEndDate(promo.endDate || "")
    setIsEditDialogOpen(true)
  }

  const getTimeRemaining = (endDate?: string) => {
    if (!endDate) return null
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    if (diff <= 0) return "Expirée"
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days}j restants`
    return `${hours}h restantes`
  }

  if (!user) return null

  if (!isPro) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Card className="glass-card border-border/30 max-w-md">
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Fonctionnalité Pro</h3>
            <p className="text-muted-foreground mb-4">
              La gestion des promos et annonces nécessite le plan Pro ou Elite.
            </p>
            <Button className="bg-primary hover:bg-primary/90">Upgrade to Pro</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Promos & Annonces</h1>
          <p className="text-muted-foreground">Gérez vos promotions et communications</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            generateCode()
            setIsAddDialogOpen(true)
          }}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Créer
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="promos" className="gap-2">
            <Tag className="w-4 h-4" />
            Promos Flash
          </TabsTrigger>
          <TabsTrigger value="announcements" className="gap-2">
            <Megaphone className="w-4 h-4" />
            Annonces
          </TabsTrigger>
        </TabsList>

        <TabsContent value="promos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promos.map((promo) => {
              const timeRemaining = getTimeRemaining(promo.endDate)
              const isExpired = timeRemaining === "Expirée"

              return (
                <Card
                  key={promo.id}
                  className={cn(
                    "glass-card border-border/30 overflow-hidden transition-all",
                    !promo.isActive || isExpired ? "opacity-60" : "hover:border-primary/30",
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">🎉</span>
                          <h3 className="font-semibold text-foreground">{promo.title}</h3>
                        </div>
                        {promo.isActive && !isExpired && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">ACTIVE</span>
                        )}
                      </div>
                      <Switch
                        checked={promo.isActive && !isExpired}
                        onCheckedChange={() => handleToggleActive(promo)}
                        disabled={isExpired}
                      />
                    </div>

                    {promo.description && <p className="text-sm text-muted-foreground mb-3">{promo.description}</p>}

                    {/* Discount */}
                    <div className="text-2xl font-bold text-primary mb-3">
                      {promo.discountType === "percent" ? `-${promo.discount}%` : `-${promo.discount}€`}
                    </div>

                    {/* Code */}
                    <div className="flex items-center gap-2 mb-3">
                      <code className="flex-1 px-3 py-2 rounded bg-secondary/50 text-sm font-mono text-primary">
                        {promo.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopyCode(promo.code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Timer */}
                    {timeRemaining && (
                      <div
                        className={cn(
                          "flex items-center gap-1 text-xs mb-3",
                          isExpired ? "text-destructive" : "text-warning",
                        )}
                      >
                        <Clock className="w-3 h-3" />
                        {timeRemaining}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(promo)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          setSelectedPromo(promo)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {promos.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Aucune promo. Créez votre première promotion flash.
            </div>
          )}
        </TabsContent>

        <TabsContent value="announcements" className="mt-6">
          <div className="text-center py-12 text-muted-foreground">
            Les annonces utilisent le même système que les promos. Créez une promo sans code pour faire une annonce.
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false)
            setIsEditDialogOpen(false)
          }
        }}
      >
        <DialogContent className="glass-card border-border/50">
          <DialogHeader>
            <DialogTitle>{isEditDialogOpen ? "Modifier la promo" : "Nouvelle promo"}</DialogTitle>
            <DialogDescription>
              {isEditDialogOpen ? "Modifiez les détails de la promotion" : "Créez une nouvelle promotion flash"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ex: 25% sur les Pizzas"
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Ex: Samedi soir uniquement"
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Réduction *</Label>
                <Input
                  type="number"
                  value={formDiscount}
                  onChange={(e) => setFormDiscount(e.target.value)}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formDiscountType} onValueChange={(v: "percent" | "fixed") => setFormDiscountType(v)}>
                  <SelectTrigger className="bg-secondary/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Pourcentage (%)</SelectItem>
                    <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Code promo *</Label>
              <div className="flex gap-2">
                <Input
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className="bg-secondary/50 border-border/50 font-mono"
                />
                <Button type="button" variant="outline" onClick={generateCode} className="bg-transparent">
                  Générer
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de début *</Label>
                <Input
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Date de fin (optionnel)</Label>
                <Input
                  type="date"
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false)
                setIsEditDialogOpen(false)
              }}
              className="bg-transparent"
            >
              Annuler
            </Button>
            <Button
              onClick={isEditDialogOpen ? handleEditPromo : handleAddPromo}
              className="bg-primary hover:bg-primary/90"
            >
              {isEditDialogOpen ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass-card border-border/50">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la promo &quot;{selectedPromo?.title}&quot; ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeletePromo}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

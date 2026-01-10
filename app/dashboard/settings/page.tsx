"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/lib/store"
import type { User } from "@/lib/types"
import { SECTORS, PLANS } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState(true)
  const [smsReminders, setSmsReminders] = useState(true)
  const [emailDigest, setEmailDigest] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  if (!user) return null

  const sector = SECTORS.find((s) => s.value === user.sector)
  const plan = PLANS.find((p) => p.value === user.plan)

  const handleSave = () => {
    toast.success("Paramètres enregistrés")
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground">Gérez votre compte et vos préférences</p>
      </div>

      {/* Profile */}
      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Informations de votre compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input defaultValue={user.name} className="bg-secondary/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label>Entreprise</Label>
              <Input defaultValue={user.companyName} className="bg-secondary/50 border-border/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={user.email} className="bg-secondary/50 border-border/50" />
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle>Abonnement</CardTitle>
          <CardDescription>Votre plan actuel et ses fonctionnalités</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{plan?.label}</p>
              <p className="text-sm text-muted-foreground">{plan?.price}€/mois</p>
            </div>
            <span
              className={`text-sm px-3 py-1.5 rounded-full font-medium ${
                user.plan === "elite"
                  ? "bg-warning/10 text-warning"
                  : user.plan === "pro"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {user.plan?.toUpperCase()}
            </span>
          </div>
          <Separator className="bg-border/50" />
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Fonctionnalités incluses:</p>
            <ul className="space-y-1">
              {plan?.features.map((feature, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          {user.plan !== "elite" && (
            <Button className="w-full bg-primary hover:bg-primary/90">
              Upgrade vers {user.plan === "starter" ? "Pro" : "Elite"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Gérez vos préférences de notification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Notifications Push</p>
              <p className="text-sm text-muted-foreground">Recevoir des alertes pour les nouveaux RDV</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Rappels SMS</p>
              <p className="text-sm text-muted-foreground">Envoyer des rappels SMS aux clients</p>
            </div>
            <Switch checked={smsReminders} onCheckedChange={setSmsReminders} />
          </div>
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Digest Email</p>
              <p className="text-sm text-muted-foreground">Résumé quotidien par email</p>
            </div>
            <Switch checked={emailDigest} onCheckedChange={setEmailDigest} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
        Enregistrer les modifications
      </Button>
    </div>
  )
}

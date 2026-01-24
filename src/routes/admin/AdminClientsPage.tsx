import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Search, Building2, Ghost, Trash2, Plus, Loader2, Check, X } from "lucide-react"
import { 
    getAllRestaurants, 
    updateRestaurantStatus, 
    updateRestaurantTier,
    updateRetellAgentId,
    deleteRestaurant,
    createRestaurantWithOwner
} from "@/lib/store"
import { toast } from "sonner"

interface RestaurantData {
    id: string
    name: string
    subscription_tier: string
    retell_agent_id: string | null
    created_at: string
    is_active: boolean
    profiles: { id: string, email: string, role: string }[] | null
}

const PLAN_OPTIONS = [
    { value: "free", label: "Free", color: "text-muted-foreground" },
    { value: "pro", label: "Pro", color: "text-purple-500" },
    { value: "enterprise", label: "Enterprise", color: "text-yellow-500" },
]

// ...

// Inside component render
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <Building2 className="w-6 h-6" />
                            Gestion des Restaurants
                        </h1>
// ...
                        <TableRow className="bg-muted/30">
                            <TableHead>Restaurant</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead>ID Agent Vocal</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
// ...
                                                {/* Ghost Login */}
                                                <Button 
                                                    size="sm" 
                                                    variant="secondary"
                                                    className="gap-1"
                                                    onClick={() => handleGhostLogin(r)}
                                                >
                                                    <Ghost className="w-3 h-3" />
                                                    Accéder au Compte
                                                </Button>
                                                
                                                {/* Delete */}
                                                <AlertDialog 
                                                    open={deleteTarget?.id === r.id}
                                                    onOpenChange={(open) => {
                                                        if (!open) {
                                                            setDeleteTarget(null)
                                                            setDeleteConfirmText("")
                                                        }
                                                    }}
                                                >
                                                    <AlertDialogTrigger asChild>
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost"
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() => setDeleteTarget(r)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-destructive">
                                                                ⚠️ Supprimer définitivement
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="space-y-2" asChild>
                                                                <div className="text-sm text-muted-foreground">
                                                                    <p>
                                                                        Vous êtes sur le point de supprimer <strong>{r.name}</strong>.
                                                                    </p>
                                                                    <p className="text-destructive font-medium mt-2">
                                                                        Cette action supprimera TOUTES les données associées:
                                                                    </p>
                                                                    <ul className="list-disc list-inside mt-1 ml-1">
                                                                        <li>Réservations</li>
                                                                        <li>Menu / Stock</li>
                                                                        <li>Promotions</li>
                                                                        <li>Historique des appels</li>
                                                                    </ul>
                                                                    <div className="pt-4">
                                                                        <Label>Tapez <strong>DELETE</strong> pour confirmer:</Label>
                                                                        <Input 
                                                                            className="mt-2"
                                                                            placeholder="DELETE"
                                                                            value={deleteConfirmText}
                                                                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                disabled={deleteConfirmText !== "DELETE" || deleting}
                                                                onClick={handleDelete}
                                                            >
                                                                {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                                Supprimer
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

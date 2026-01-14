import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Clock, CheckCircle, XCircle, Ban, Hourglass, Phone, PhoneOff, PhoneMissed } from "lucide-react"
import type { ReactNode } from "react"

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'noshow' | 'waitlist' | 'completed'
export type CallStatus = 'completed' | 'missed' | 'in_progress' | 'cancelled'

// Shared badge configuration for booking statuses
const BOOKING_STATUS_CONFIG: Record<BookingStatus, { label: string; className: string; icon?: ReactNode }> = {
    pending: {
        label: "En attente",
        className: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
        icon: <Clock className="w-3 h-3" />,
    },
    confirmed: {
        label: "Confirmé",
        className: "bg-green-500/20 text-green-500 border-green-500/30",
        icon: <CheckCircle className="w-3 h-3" />,
    },
    cancelled: {
        label: "Annulé",
        className: "bg-red-500/20 text-red-500 border-red-500/30",
        icon: <XCircle className="w-3 h-3" />,
    },
    noshow: {
        label: "No-show",
        className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
        icon: <Ban className="w-3 h-3" />,
    },
    waitlist: {
        label: "Liste d'attente",
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        icon: <Hourglass className="w-3 h-3" />,
    },
    completed: {
        label: "Terminé",
        className: "bg-primary/20 text-primary border-primary/30",
        icon: <CheckCircle className="w-3 h-3" />,
    },
}

// Shared badge configuration for call statuses
const CALL_STATUS_CONFIG: Record<CallStatus, { label: string; className: string; icon?: ReactNode }> = {
    completed: {
        label: "Terminé",
        className: "bg-success/10 text-success",
        icon: <Phone className="w-3 h-3" />,
    },
    missed: {
        label: "Manqué",
        className: "bg-destructive/10 text-destructive",
        icon: <PhoneMissed className="w-3 h-3" />,
    },
    in_progress: {
        label: "En cours",
        className: "bg-warning/10 text-warning",
        icon: <Phone className="w-3 h-3 animate-pulse" />,
    },
    cancelled: {
        label: "Annulé",
        className: "bg-muted text-muted-foreground",
        icon: <PhoneOff className="w-3 h-3" />,
    },
}

/**
 * Get a styled badge for booking status
 */
export function getBookingStatusBadge(status: string | undefined): ReactNode {
    const normalizedStatus = (status || 'pending') as BookingStatus
    const config = BOOKING_STATUS_CONFIG[normalizedStatus] || BOOKING_STATUS_CONFIG.pending

    return (
        <Badge className={cn("gap-1 text-xs", config.className)}>
            {config.icon}
            {config.label}
        </Badge>
    )
}

/**
 * Get a styled badge for call status
 */
export function getCallStatusBadge(status: string | undefined): ReactNode {
    const normalizedStatus = (status || 'completed') as CallStatus
    const config = CALL_STATUS_CONFIG[normalizedStatus] || CALL_STATUS_CONFIG.completed

    return (
        <Badge variant="outline" className={cn("gap-1 text-xs", config.className)}>
            {config.icon}
            {config.label}
        </Badge>
    )
}

/**
 * Get simple styled span for call status (lighter weight)
 */
export function getCallStatusSpan(status: string | undefined): ReactNode {
    const normalizedStatus = (status || 'completed') as CallStatus
    const config = CALL_STATUS_CONFIG[normalizedStatus] || CALL_STATUS_CONFIG.completed

    return (
        <span className={cn("text-xs px-2 py-1 rounded-full", config.className)}>
            {config.label}
        </span>
    )
}

/**
 * Format call duration in a human-readable format
 */
export function formatDuration(seconds: number | null | undefined): string {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(dateString: string, locale = 'fr-FR'): string {
    return new Date(dateString).toLocaleString(locale)
}

/**
 * Format relative time (e.g., "il y a 5 minutes")
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "À l'instant"
    if (diffMins < 60) return `Il y a ${diffMins}min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    return `Il y a ${diffDays}j`
}

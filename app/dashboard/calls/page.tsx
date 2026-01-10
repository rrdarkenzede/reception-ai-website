"use client"

import { useEffect, useState } from "react"
import { getCurrentUser, getCallLogs } from "@/lib/store"
import type { User, CallLog } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Search,
  Filter,
  Calendar,
  Clock,
  Download,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function CallsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [calls, setCalls] = useState<CallLog[]>([])
  const [filteredCalls, setFilteredCalls] = useState<CallLog[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null)

  const loadData = () => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      const userCalls = getCallLogs(currentUser.id)
      // Sort by timestamp descending
      userCalls.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setCalls(userCalls)
      applyFilters(userCalls, searchQuery, typeFilter, statusFilter, dateFilter)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const applyFilters = (callList: CallLog[], search: string, type: string, status: string, date: string) => {
    let filtered = callList

    if (search) {
      const query = search.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.clientName.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          c.summary?.toLowerCase().includes(query),
      )
    }

    if (type !== "all") {
      filtered = filtered.filter((c) => c.type === type)
    }

    if (status !== "all") {
      filtered = filtered.filter((c) => c.status === status)
    }

    if (date) {
      filtered = filtered.filter((c) => c.timestamp.startsWith(date))
    }

    setFilteredCalls(filtered)
  }

  useEffect(() => {
    applyFilters(calls, searchQuery, typeFilter, statusFilter, dateFilter)
  }, [searchQuery, typeFilter, statusFilter, dateFilter, calls])

  const isElite = user?.plan === "elite"

  const getCallIcon = (call: CallLog) => {
    if (call.status === "missed") {
      return <PhoneMissed className="w-5 h-5 text-destructive" />
    }
    if (call.type === "incoming") {
      return <PhoneIncoming className="w-5 h-5 text-success" />
    }
    return <PhoneOutgoing className="w-5 h-5 text-primary" />
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "-"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      time: date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      date: date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    }
  }

  const handleExport = () => {
    // Create CSV content
    const headers = ["Date", "Heure", "Client", "Téléphone", "Type", "Statut", "Durée", "Résumé"]
    const rows = filteredCalls.map((call) => {
      const { time, date } = formatTimestamp(call.timestamp)
      return [
        date,
        time,
        call.clientName,
        call.phone,
        call.type === "incoming" ? "Entrant" : "Sortant",
        call.status === "completed" ? "Complété" : call.status === "missed" ? "Manqué" : "En cours",
        formatDuration(call.duration),
        call.summary || "",
      ]
    })

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `appels-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    toast.success("Export CSV téléchargé")
  }

  const handleRetrigger = (call: CallLog) => {
    toast.success("Smart Trigger relancé pour " + call.clientName)
  }

  if (!user) return null

  // Stats
  const totalCalls = calls.length
  const completedCalls = calls.filter((c) => c.status === "completed").length
  const missedCalls = calls.filter((c) => c.status === "missed").length
  const avgDuration =
    calls.filter((c) => c.duration).reduce((acc, c) => acc + (c.duration || 0), 0) / completedCalls || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Historique Appels</h1>
          <p className="text-muted-foreground">Consultez et gérez vos appels téléphoniques</p>
        </div>
        {isElite && (
          <Button onClick={handleExport} variant="outline" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalCalls}</p>
                <p className="text-xs text-muted-foreground">Total appels</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <PhoneIncoming className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedCalls}</p>
                <p className="text-xs text-muted-foreground">Complétés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <PhoneMissed className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{missedCalls}</p>
                <p className="text-xs text-muted-foreground">Manqués</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatDuration(Math.round(avgDuration))}</p>
                <p className="text-xs text-muted-foreground">Durée moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Chercher par nom/téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/50"
          />
        </div>
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-40 bg-secondary/50 border-border/50"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36 bg-secondary/50 border-border/50">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="incoming">Entrants</SelectItem>
            <SelectItem value="outgoing">Sortants</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 bg-secondary/50 border-border/50">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="completed">Complétés</SelectItem>
            <SelectItem value="missed">Manqués</SelectItem>
            <SelectItem value="in_progress">En cours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Call Timeline */}
      <Card className="glass-card border-border/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {filteredCalls.map((call) => {
                const { time, date } = formatTimestamp(call.timestamp)
                return (
                  <div
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        call.status === "completed"
                          ? "bg-success/10"
                          : call.status === "missed"
                            ? "bg-destructive/10"
                            : "bg-secondary",
                      )}
                    >
                      {getCallIcon(call)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{call.clientName}</span>
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              call.status === "completed"
                                ? "bg-success/10 text-success"
                                : call.status === "missed"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-secondary text-muted-foreground",
                            )}
                          >
                            {call.status === "completed"
                              ? "Complété"
                              : call.status === "missed"
                                ? "Manqué"
                                : "En cours"}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDuration(call.duration)}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>{call.phone}</span>
                        <span>{call.type === "incoming" ? "Entrant" : "Sortant"}</span>
                      </div>

                      {call.summary && (
                        <p className="text-sm text-muted-foreground/80 bg-secondary/50 rounded-lg px-3 py-2 mb-2">
                          {call.summary}
                        </p>
                      )}

                      <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                        <Calendar className="w-3 h-3" />
                        {time} • {date}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Phone className="w-4 h-4" />
                      </Button>
                      {isElite && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRetrigger(call)
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}

              {filteredCalls.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">Aucun appel trouvé</div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Call Details Dialog */}
      <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
        <DialogContent className="glass-card border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCall && getCallIcon(selectedCall)}
              Détails de l&apos;appel
            </DialogTitle>
            <DialogDescription>Informations complètes sur cet appel</DialogDescription>
          </DialogHeader>
          {selectedCall && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium text-foreground">{selectedCall.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium text-foreground">{selectedCall.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium text-foreground">
                    {selectedCall.type === "incoming" ? "Appel entrant" : "Appel sortant"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Durée</p>
                  <p className="font-medium text-foreground">{formatDuration(selectedCall.duration)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      selectedCall.status === "completed"
                        ? "bg-success/10 text-success"
                        : selectedCall.status === "missed"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {selectedCall.status === "completed"
                      ? "Complété"
                      : selectedCall.status === "missed"
                        ? "Manqué"
                        : "En cours"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date/Heure</p>
                  <p className="font-medium text-foreground">
                    {formatTimestamp(selectedCall.timestamp).time} • {formatTimestamp(selectedCall.timestamp).date}
                  </p>
                </div>
              </div>
              {selectedCall.summary && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Résumé</p>
                  <p className="text-foreground bg-secondary/50 rounded-lg p-3">{selectedCall.summary}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedCall(null)} className="bg-transparent">
              Fermer
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Phone className="w-4 h-4" />
              Rappeler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { CalendarClock, CheckCircle2, MessageSquare, Phone, UserRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCallCenterStore, statusLabel } from "@/lib/callcenter-store"
import { todayISO } from "@/lib/money"

export default function CallCenterQueuePage() {
  const { state, ready, registerInteraction, updateCase } = useCallCenterStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [result, setResult] = useState("Contactado")
  const [notes, setNotes] = useState("")
  const [nextFollowUp, setNextFollowUp] = useState("")
  if (!ready) return <p className="text-sm text-muted-foreground">Cargando cola...</p>
  const cases = state.cases.filter((item) => item.status !== "resuelto").sort((a, b) => Number(b.priority === "alta") - Number(a.priority === "alta"))
  const selected = cases.find((item) => item.id === selectedId)
  function saveInteraction() { if (!selected) return; registerInteraction({ caseId: selected.id, result, notes, nextFollowUp }); setSelectedId(null); setNotes(""); setNextFollowUp("") }
  return <div className="space-y-6"><div className="border-b pb-4"><p className="text-sm text-muted-foreground">Cola del {todayISO()}</p><h1 className="text-2xl font-bold">Cola de atención multiservicios</h1><p className="text-sm text-muted-foreground">Prioriza, llama y deja trazabilidad de cada atención.</p></div><div className="grid gap-4">{cases.map((item) => { const client = state.clients.find((clientItem) => clientItem.id === item.clientId); return <Card key={item.id}><CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><CardTitle>{client?.name}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{item.subject} · {client?.phone}</p></div><div className="flex flex-wrap gap-2"><Badge variant={item.priority === "alta" ? "destructive" : item.priority === "media" ? "default" : "outline"}>{item.priority}</Badge><Badge variant="outline">{statusLabel(item.status)}</Badge></div></CardHeader><CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="space-y-1 text-xs text-muted-foreground"><p className="flex items-center gap-1"><UserRound className="size-3" />Agente: {item.assignedTo}</p><p className="flex items-center gap-1"><CalendarClock className="size-3" />Próximo seguimiento: {item.nextFollowUp || "Sin programar"}</p><p>{item.notes}</p></div><div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => updateCase(item.id, { status: "en_llamada" })}><Phone className="mr-1 size-3.5" />Iniciar llamada</Button><Button size="sm" onClick={() => { setSelectedId(item.id); setResult("Contactado") }}><MessageSquare className="mr-1 size-3.5" />Registrar resultado</Button></div></CardContent></Card> })}</div><Dialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}><DialogContent><DialogHeader><DialogTitle>Registrar atención</DialogTitle></DialogHeader><div className="space-y-4"><div><Label>Resultado</Label><select value={result} onChange={(event) => setResult(event.target.value)} className="mt-1 h-9 w-full rounded-lg border bg-background px-3 text-sm"><option>Contactado</option><option>No contesta</option><option>Resuelto</option><option>Seguimiento</option></select></div><div><Label htmlFor="call-notes">Notas de la llamada</Label><Input id="call-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Acuerdo, solicitud o motivo..." className="mt-1" /></div><div><Label htmlFor="next-follow-up">Próximo seguimiento</Label><Input id="next-follow-up" type="date" value={nextFollowUp} onChange={(event) => setNextFollowUp(event.target.value)} className="mt-1" /></div></div><DialogFooter><Button variant="outline" onClick={() => setSelectedId(null)}>Cancelar</Button><Button onClick={saveInteraction}><CheckCircle2 className="mr-1 size-4" />Guardar atención</Button></DialogFooter></DialogContent></Dialog></div>
}

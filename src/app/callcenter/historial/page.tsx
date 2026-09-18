"use client"

import { History } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCallCenterStore } from "@/lib/callcenter-store"

export default function CallCenterHistoryPage() { const { state, ready } = useCallCenterStore(); if (!ready) return <p>Cargando historial...</p>; return <div className="space-y-6"><div className="border-b pb-4"><h1 className="text-2xl font-bold">Historial de interacciones</h1><p className="text-sm text-muted-foreground">Registro de llamadas, acuerdos y próximos pasos.</p></div><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><History className="size-4 text-cyan-700" />Actividad reciente ({state.interactions.length})</CardTitle></CardHeader><CardContent className="space-y-2">{state.interactions.map((interaction) => { const client = state.clients.find((item) => item.id === interaction.clientId); return <div key={interaction.id} className="flex flex-wrap items-center gap-3 rounded-lg border p-3 text-sm"><div className="min-w-0 flex-1"><p className="font-semibold">{client?.name}</p><p className="text-xs text-muted-foreground">{interaction.notes || "Sin notas"}</p></div><Badge variant="outline">{interaction.result}</Badge><span className="text-xs text-muted-foreground">{interaction.agent} · {interaction.createdAt}</span></div> })}</CardContent></Card></div> }

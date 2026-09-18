"use client"

import { Mail, Phone, ShieldAlert, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSpaStore } from "@/lib/spa-store"

export default function SpaClientsPage() { const { state, ready } = useSpaStore(); if (!ready) return <p>Cargando clientes...</p>; return <div className="space-y-6"><div className="border-b pb-4"><h1 className="text-2xl font-bold">Clientes y ficha clínica</h1><p className="text-sm text-muted-foreground">Consulta preferencias, alergias y antecedentes antes de atender.</p></div><div className="grid gap-4 md:grid-cols-2">{state.clients.map((client) => <Card key={client.id}><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="size-4 text-rose-600" />{client.name}</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" />{client.phone}</p><p className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" />{client.email}</p><p className="flex items-center gap-2 text-amber-700"><ShieldAlert className="size-4" />Alergias: {client.allergies}</p><Badge variant="outline">Ficha activa</Badge><p className="rounded-lg bg-muted/50 p-2 text-xs">{client.notes}</p></CardContent></Card>)}</div></div> }

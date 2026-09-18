"use client"

import { Clock3, DoorOpen, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSpaStore, serviceCategoryLabel } from "@/lib/spa-store"
import { formatMoney } from "@/lib/money"

export default function SpaServicesPage() { const { state, ready } = useSpaStore(); if (!ready) return <p>Cargando tratamientos...</p>; return <div className="space-y-6"><div className="border-b pb-4"><h1 className="text-2xl font-bold">Tratamientos y servicios</h1><p className="text-sm text-muted-foreground">Duración, precio, cabina y profesional asignado.</p></div><div className="grid gap-4 md:grid-cols-2">{state.services.map((service) => <Card key={service.id}><CardHeader><div className="flex items-start justify-between gap-3"><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="size-4 text-rose-600" />{service.name}</CardTitle><Badge variant="outline">{serviceCategoryLabel(service.category)}</Badge></div></CardHeader><CardContent className="grid grid-cols-2 gap-3 text-sm"><p className="flex items-center gap-2"><Clock3 className="size-4 text-muted-foreground" />{service.durationMinutes} minutos</p><p className="text-right text-lg font-black text-rose-600">{formatMoney(service.price)}</p><p className="flex items-center gap-2 text-muted-foreground"><DoorOpen className="size-4" />{service.room}</p><p className="text-right text-xs text-muted-foreground">{service.professional}</p></CardContent></Card>)}</div></div> }

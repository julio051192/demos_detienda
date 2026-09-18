"use client"

import { History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBoticaStore } from "@/lib/botica-store"
import { formatMoney } from "@/lib/money"

export default function BoticaVentasPage() { const { state, ready } = useBoticaStore(); if (!ready) return <p>Cargando ventas...</p>; return <div className="space-y-6"><div className="border-b pb-4"><h1 className="text-2xl font-bold">Ventas de la botica</h1><p className="text-sm text-muted-foreground">Historial de tickets registrados en esta caja.</p></div><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><History className="size-4 text-emerald-600" />Tickets recientes ({state.sales.length})</CardTitle></CardHeader><CardContent className="space-y-2">{state.sales.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">Todavía no hay ventas registradas.</p> : state.sales.map((sale) => <div key={sale.id} className="flex flex-wrap items-center gap-3 rounded-lg border p-3 text-sm"><span className="font-mono font-bold text-emerald-700">{sale.ticketCode}</span><span>{sale.date} {sale.time}</span><Badge variant="secondary">{sale.gateway || sale.paymentMethod}</Badge><span className="ml-auto font-black">{formatMoney(sale.total || sale.amountPaid)}</span></div>)}</CardContent></Card></div> }

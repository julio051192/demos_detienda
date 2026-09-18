"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLicoreriaStore } from "@/lib/licoreria-store"
import { formatMoney, todayISO } from "@/lib/money"
import { History } from "lucide-react"

const paymentLabels = {
  efectivo: "Efectivo",
  yape_plin: "Yape / Plin",
  tarjeta: "Tarjeta",
} as const

export default function VentasLicoreriaPage() {
  const { state, ready, stats } = useLicoreriaStore()

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando ventas…</p>

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="size-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Ventas del Día</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Resumen de operaciones registradas el {todayISO()}.</p>
        </div>
        <Badge variant="secondary">{stats.totalTransactions} transacciones</Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm"><CardHeader><p className="text-xs font-medium text-muted-foreground">Total vendido</p><CardTitle className="text-2xl tabular-nums text-emerald-600">{formatMoney(stats.totalToday)}</CardTitle></CardHeader></Card>
        <Card size="sm"><CardHeader><p className="text-xs font-medium text-muted-foreground">Efectivo</p><CardTitle className="text-2xl tabular-nums">{formatMoney(stats.efectivo)}</CardTitle></CardHeader></Card>
        <Card size="sm"><CardHeader><p className="text-xs font-medium text-muted-foreground">Pagos digitales</p><CardTitle className="text-2xl tabular-nums">{formatMoney(stats.digital)}</CardTitle></CardHeader></Card>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        {state.sales.length === 0 ? (
          <div className="border-dashed p-10 text-center">
            <p className="font-medium">No hay ventas registradas</p>
            <p className="mt-1 text-sm text-muted-foreground">Las ventas cobradas desde el POS aparecerán aquí.</p>
          </div>
        ) : (
          <Table>
            <TableHeader><TableRow><TableHead>Ticket</TableHead><TableHead>Hora</TableHead><TableHead>Productos</TableHead><TableHead>Pago</TableHead><TableHead>Cajero</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
            <TableBody>
              {state.sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono text-xs font-semibold">{sale.ticketCode}</TableCell>
                  <TableCell className="text-sm">{sale.date} · {sale.time}</TableCell>
                  <TableCell className="text-sm">{sale.items.reduce((sum, item) => sum + item.qty, 0)} u.</TableCell>
                  <TableCell><Badge variant="secondary">{paymentLabels[sale.paymentMethod]}</Badge></TableCell>
                  <TableCell className="text-sm">{sale.cashierName || "Sin asignar"}</TableCell>
                  <TableCell className="text-right font-bold tabular-nums">{formatMoney(sale.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
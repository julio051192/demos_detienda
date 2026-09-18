"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCafeteriaStore } from "@/lib/cafeteria-store"
import { formatMoney } from "@/lib/money"
import type { CoffeeOrder } from "@/lib/cafeteria-types"
import {
  Receipt,
  Printer,
  DollarSign,
  Coffee,
  CheckCircle2,
  FileText,
  CreditCard,
  Smartphone,
} from "lucide-react"

export default function CajaCafeteriaPage() {
  const { state, ready, stats } = useCafeteriaStore()
  const mx = (n: number) => formatMoney(n)

  const [selectedTicket, setSelectedTicket] = useState<CoffeeOrder | null>(null)

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando caja…</p>

  const yapeTotal = state.orders
    .filter((o) => o.paymentMethod === "yape_plin")
    .reduce((sum, o) => sum + o.total, 0)

  const efectivoTotal = state.orders
    .filter((o) => o.paymentMethod === "efectivo")
    .reduce((sum, o) => sum + o.total, 0)

  const tarjetaTotal = state.orders
    .filter((o) => o.paymentMethod === "tarjeta")
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Caja Chica & Emisión de Comprobantes</h1>
          <p className="text-sm text-muted-foreground">
            Arqueo de ventas diarias por medio de pago (Yape, Efectivo, Tarjeta) e impresión de tickets térmicos de cafetería.
          </p>
        </div>
      </div>

      {/* Tarjetas de Arqueo */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card size="sm" className="border-amber-300 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/10">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Ventas Totales Hoy</p>
            <CardTitle className="text-2xl font-black tabular-nums text-amber-900 dark:text-amber-300">
              {mx(stats.totalSalesToday)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{state.orders.length} pedidos atendidos</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Smartphone className="size-3.5 text-purple-600" />
              Yape / Plin Digital
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums text-purple-600">
              {mx(yapeTotal)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Sin contacto en mostrador</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <DollarSign className="size-3.5 text-emerald-600" />
              Efectivo en Gaveta
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600">
              {mx(efectivoTotal)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Billetes y monedas</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <CreditCard className="size-3.5 text-blue-600" />
              Tarjeta / POS
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums text-blue-600">
              {mx(tarjetaTotal)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
          </CardHeader>
        </Card>
      </div>

      {/* Historial de Comprobantes */}
      <div className="space-y-3">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Receipt className="size-4 text-amber-800" />
          Tickets Emitidos en el Turno ({state.orders.length})
        </h2>

        <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo / Ubicación</TableHead>
                <TableHead>Detalle de Bebidas</TableHead>
                <TableHead>Medio de Pago</TableHead>
                <TableHead>Total (S/)</TableHead>
                <TableHead className="text-right">Ticket Térmico</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.orders.map((ord) => (
                <TableRow key={ord.id}>
                  <TableCell className="font-mono font-bold text-xs text-amber-900 dark:text-amber-400">
                    {ord.ticketCode}
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-xs text-foreground">{ord.customerName}</p>
                    {ord.customerPhone && (
                      <p className="text-[11px] text-muted-foreground">{ord.customerPhone}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {ord.orderType === "para_mesa" ? `🍽️ ${ord.tableNumber || "Mesa"}` : "🛍️ Para Llevar"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {ord.lines.map((l) => `${l.qty}x ${l.name}`).join(", ")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono uppercase">
                      {ord.paymentMethod.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-black text-sm tabular-nums text-foreground">
                    {mx(ord.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="xs"
                      variant="outline"
                      className="border-amber-700/40 text-amber-900 dark:text-amber-200 font-bold"
                      onClick={() => setSelectedTicket(ord)}
                    >
                      <Printer className="size-3.5 mr-1" />
                      Imprimir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal: Ticket Térmico de Cafetería (80mm) */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-xs font-mono text-xs">
            <div className="border border-dashed p-4 rounded-lg bg-card space-y-3">
              <div className="text-center border-b pb-2">
                <Coffee className="size-7 mx-auto text-amber-800 mb-1" />
                <h3 className="font-black text-sm tracking-wider">CAFETERÍA DE ESPECIALIDAD</h3>
                <p className="text-[10px] text-muted-foreground">VILLA RICA COFFEE SHOP</p>
                <p className="text-[10px] text-muted-foreground">RUC: 20608945123</p>
                <p className="text-[12px] font-bold text-amber-900 dark:text-amber-300 mt-1">
                  BOLETA ELECTRÓNICA: {selectedTicket.ticketCode}
                </p>
                <p className="text-[10px] text-muted-foreground">{selectedTicket.createdAt}</p>
              </div>

              <div className="space-y-1 text-[11px]">
                <p><strong>Cliente:</strong> {selectedTicket.customerName}</p>
                <p><strong>Tipo:</strong> {selectedTicket.orderType === "para_mesa" ? selectedTicket.tableNumber : "Para Llevar"}</p>
              </div>

              <div className="border-t border-b py-2 space-y-1">
                {selectedTicket.lines.map((l, i) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <span className="truncate max-w-[65%]">{l.qty}x {l.name}</span>
                    <span className="tabular-nums font-bold">{mx(l.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-black text-sm">
                  <span>TOTAL COBRADO:</span>
                  <span>{mx(selectedTicket.total)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Medio de pago:</span>
                  <span className="uppercase">{selectedTicket.paymentMethod}</span>
                </div>
              </div>

              <p className="text-[9px] text-center text-muted-foreground pt-2">
                ¡Gracias por apoyar el café peruano de origen!
              </p>
            </div>

            <DialogFooter>
              <Button className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold" onClick={() => window.print()}>
                <Printer className="size-4 mr-2" />
                Imprimir en Ticketera 80mm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

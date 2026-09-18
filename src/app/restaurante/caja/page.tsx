"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { useRestauranteStore } from "@/lib/restaurante-store"
import { formatMoney } from "@/lib/money"
import { Receipt, Coins, Printer, Users, CheckCircle2, Split } from "lucide-react"

export default function CajaRestaurantePage() {
  const { state, ready, stats, payAndReleaseTable } = useRestauranteStore()
  const mx = (n: number) => formatMoney(n)

  const activeOrders = state.orders.filter((o) => o.status !== "pagada")
  const [selectedOrder, setSelectedOrder] = useState<typeof state.orders[0] | null>(null)

  // Divisor de pago
  const [splitPersons, setSplitPersons] = useState(2)
  const [showPrecuentaModal, setShowPrecuentaModal] = useState<typeof state.orders[0] | null>(null)

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando caja…</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pre-Cuenta, División de Cuenta & Caja</h1>
          <p className="text-sm text-muted-foreground">
            Impresión de pre-cuentas por mesa, cálculo de cuenta dividida entre comensales y cobranza.
          </p>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Ventas Cobradas Hoy</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600">
              {mx(stats.totalSalesToday)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Ingreso efectivo + digital en caja</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Comandas Activas Pendientes</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-amber-600">
              {stats.activeOrdersCount} cuentas
            </CardTitle>
            <p className="text-xs text-muted-foreground">Mesas en consumo o pre-cuenta</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Ticket Promedio Estimado</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-violet-600">
              {mx(stats.activeOrdersCount > 0 ? stats.totalSalesToday / Math.max(1, stats.activeOrdersCount) : 48)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Consumo por mesa</p>
          </CardHeader>
        </Card>
      </div>

      {/* Tabla de Cuentas por Cobrar */}
      <div className="space-y-3">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Receipt className="size-4 text-primary" />
          Cuentas y Comandas en Taller ({activeOrders.length})
        </h2>

        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comanda</TableHead>
                <TableHead>Mesa / Zona</TableHead>
                <TableHead>Mozo</TableHead>
                <TableHead>Platos Consumidos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Total a Pagar</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-bold text-xs text-primary">
                    {order.ticketCode}
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-foreground">
                    {order.tableName} ({order.zone.replace("_", " ")})
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {order.waiterName}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {order.lines.reduce((sum, l) => sum + l.qty, 0)} ítems
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={order.status === "precuenta" ? "outline" : "secondary"}
                      className={
                        order.status === "precuenta"
                          ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                          : "text-xs"
                      }
                    >
                      {order.status === "precuenta" ? "🟡 Pre-Cuenta Emitida" : "En Consumo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-black text-sm tabular-nums text-emerald-600">
                    {mx(order.total)}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setShowPrecuentaModal(order)}
                    >
                      <Printer className="size-3.5 mr-1" />
                      Pre-Cuenta
                    </Button>
                    <Button
                      size="xs"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      onClick={() => {
                        payAndReleaseTable(order.id)
                        setSelectedOrder(order)
                      }}
                    >
                      <Coins className="size-3.5 mr-1" />
                      Cobrar Mesa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal: Impresión de Pre-Cuenta y Divisor de Pago */}
      {showPrecuentaModal && (
        <Dialog open={!!showPrecuentaModal} onOpenChange={() => setShowPrecuentaModal(null)}>
          <DialogContent className="sm:max-w-xs font-mono text-xs">
            <div className="border border-dashed p-4 rounded-lg bg-card space-y-3">
              <div className="text-center border-b pb-2">
                <h3 className="font-black text-sm tracking-wider">RESTAURANTE & POLLERÍA</h3>
                <p className="text-[10px] text-muted-foreground">PRE-CUENTA DE MESA</p>
                <p className="text-[12px] font-bold text-primary mt-0.5">
                  {showPrecuentaModal.tableName} — {showPrecuentaModal.ticketCode}
                </p>
                <p className="text-[10px] text-muted-foreground">Mozo: {showPrecuentaModal.waiterName} · {showPrecuentaModal.createdAt}</p>
              </div>

              <div className="space-y-1">
                {showPrecuentaModal.lines.map((line, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate max-w-[60%]">{line.qty}x {line.name}</span>
                    <span>{mx(line.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between font-bold text-sm">
                  <span>TOTAL A PAGAR:</span>
                  <span>{mx(showPrecuentaModal.total)}</span>
                </div>
              </div>

              {/* Herramienta Divisor de Cuenta */}
              <div className="border-t pt-2 space-y-2 bg-muted/40 p-2 rounded">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1 text-[11px]">
                    <Split className="size-3.5 text-primary" />
                    Dividir entre personas:
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      className="size-5 rounded border bg-background font-bold text-xs"
                      onClick={() => setSplitPersons((p) => Math.max(2, p - 1))}
                    >
                      -
                    </button>
                    <span className="font-bold w-4 text-center">{splitPersons}</span>
                    <button
                      className="size-5 rounded border bg-background font-bold text-xs"
                      onClick={() => setSplitPersons((p) => p + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <span>Cada persona paga:</span>
                  <span>{mx(showPrecuentaModal.total / splitPersons)} c/u</span>
                </div>
              </div>

              <p className="text-[9px] text-center text-muted-foreground pt-1">
                Gracias por su preferencia. Propina no incluida.
              </p>
            </div>

            <DialogFooter>
              <Button className="w-full" onClick={() => setShowPrecuentaModal(null)}>
                Cerrar Pre-Cuenta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

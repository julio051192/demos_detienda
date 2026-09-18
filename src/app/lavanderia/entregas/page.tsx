"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  statusBadgeColor,
  statusLabel,
  useLavanderiaStore,
} from "@/lib/lavanderia-store"
import { formatMoney } from "@/lib/money"
import type { LaundryOrder } from "@/lib/lavanderia-types"
import { CheckCircle2, Search, PackageCheck, AlertCircle } from "lucide-react"

export default function EntregasPage() {
  const { state, ready, deliverOrder } = useLavanderiaStore()
  const mx = (n: number) => formatMoney(n)

  const [search, setSearch] = useState("")
  const [orderToDeliver, setOrderToDeliver] = useState<LaundryOrder | null>(null)

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando entregas…</p>
  }

  const readyOrders = state.orders.filter((o) => o.status === "ready")
  const otherActiveOrders = state.orders.filter(
    (o) => o.status === "washing" || o.status === "received",
  )
  const deliveredOrders = state.orders.filter((o) => o.status === "delivered")

  const filteredReady = readyOrders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.ticketCode.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search),
  )

  function confirmDelivery() {
    if (!orderToDeliver) return
    deliverOrder(orderToDeliver.id)
    setOrderToDeliver(null)
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Entregas & Cobro de Saldo</h1>
        <p className="text-sm text-muted-foreground">
          Búsqueda de ticket, cobro del saldo pendiente y entrega final de prendas al cliente.
        </p>
      </div>

      {/* Buscador de Ticket */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input
          placeholder="Escanear ticket (#T-1037) o buscar cliente…"
          className="pl-9 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Sección 1: Prendas listas para entregar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-emerald-600" />
          <h2 className="text-base font-semibold">
            Prendas Listas en Estantería ({filteredReady.length})
          </h2>
        </div>

        {filteredReady.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center bg-card">
            <p className="font-medium text-sm">No hay prendas listas para entrega</p>
            <p className="text-xs text-muted-foreground mt-1">
              Las prendas aparecerán aquí cuando en el tablero se marquen como "Listo para Entrega".
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReady.map((order) => (
              <Card key={order.id} className="shadow-xs border-emerald-300 dark:border-emerald-800">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-primary">{order.ticketCode}</span>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs">
                      Lista para entrega
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-1">{order.customerName}</CardTitle>
                  <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="rounded bg-muted/40 p-2.5 text-xs space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{it.serviceName} ({it.qty})</span>
                        <span className="font-medium">{mx(it.qty * it.unitPrice)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs border-t pt-2">
                    <div>
                      <span className="text-muted-foreground">Total: </span>
                      <span className="font-semibold">{mx(order.total)}</span>
                    </div>
                    <div>
                      {order.balance > 0 ? (
                        <span className="text-amber-600 font-bold">
                          Cobrar Saldo: {mx(order.balance)}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold">Pagado al 100%</span>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => setOrderToDeliver(order)}
                  >
                    <PackageCheck className="size-4 mr-1.5" />
                    {order.balance > 0 ? `Cobrar ${mx(order.balance)} y Entregar` : "Entregar Prendas"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Historial de Entregados Hoy */}
      <div className="space-y-3 border-t pt-6">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Entregados Hoy / Historial ({deliveredOrders.length})
        </h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {deliveredOrders.slice(0, 6).map((order) => (
            <div key={order.id} className="rounded-lg border p-3 bg-muted/20 text-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-muted-foreground">{order.ticketCode}</span>
                <p className="font-medium text-foreground">{order.customerName}</p>
                <p className="text-[11px] text-muted-foreground">{order.items.length} servicio(s)</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-foreground">{mx(order.total)}</span>
                <p className="text-emerald-600 font-semibold text-[11px]">Entregado ✓</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Confirmación de Cobro y Entrega */}
      {orderToDeliver && (
        <Dialog open={!!orderToDeliver} onOpenChange={() => setOrderToDeliver(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar Entrega de Ropa</DialogTitle>
              <DialogDescription>
                Ticket {orderToDeliver.ticketCode} a nombre de <strong>{orderToDeliver.customerName}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 text-sm border rounded-lg p-3 bg-muted/30">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monto Total:</span>
                <span className="font-semibold">{mx(orderToDeliver.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adelanto ya cancelado:</span>
                <span>{mx(orderToDeliver.advance)}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-2 text-primary">
                <span>Monto a Cobrar en Caja:</span>
                <span className="text-amber-600">{mx(orderToDeliver.balance)}</span>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setOrderToDeliver(null)}>
                Cancelar
              </Button>
              <Button onClick={confirmDelivery}>
                Confirmar Cobro & Entrega
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

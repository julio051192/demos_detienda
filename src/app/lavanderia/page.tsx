"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  statusBadgeColor,
  statusLabel,
  useLavanderiaStore,
} from "@/lib/lavanderia-store"
import { formatMoney, todayISO } from "@/lib/money"
import type { OrderStatus } from "@/lib/lavanderia-types"
import {
  Sparkles,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Coins,
  Scale,
  Shirt,
  Search,
} from "lucide-react"

export default function LavanderiaDashboardPage() {
  const { state, ready, stats, updateOrderStatus, reset } =
    useLavanderiaStore()
  const mx = (n: number) => formatMoney(n)

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Iniciando sistema de lavandería…</p>
  }

  const activeOrders = state.orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled",
  )

  return (
    <div className="space-y-6">
      {/* Header principal */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="size-3 text-primary" />
              Demo Lavandería & Tintorería
            </Badge>
            <span className="text-xs text-muted-foreground">{todayISO()}</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
            Control de Recepción & Planta
          </h1>
          <p className="text-sm text-muted-foreground">
            Recepción por kilo o prenda, seguimiento de estados en planta y cobro de saldos al entregar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Restaurar datos
          </Button>
          <Button render={<Link href="/lavanderia/ordenes" />}>
            <PlusCircle className="mr-1.5 size-4" />
            Nueva Recepción
          </Button>
          <Button variant="secondary" render={<Link href="/lavanderia/entregas" />}>
            <Search className="mr-1.5 size-4" />
            Entregar Prendas
          </Button>
        </div>
      </div>

      {/* Tarjetas KPI de Caja y Rendimiento */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Caja del Día</p>
              <Coins className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {mx(stats.revenueToday)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Adelantos y saldos cobrados hoy</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Ropa por Kilo Hoy</p>
              <Scale className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {stats.kgToday.toFixed(1)} kg
            </CardTitle>
            <p className="text-xs text-muted-foreground">Procesados en el turno</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Listas para Recojo</p>
              <CheckCircle2 className="size-4 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {stats.pendingReady} tickets
            </CardTitle>
            <p className="text-xs text-muted-foreground">Prendas embolsadas en estantería</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Saldos por Cobrar</p>
              <AlertCircle className="size-4 text-amber-600" />
            </div>
            <CardTitle className="text-2xl font-bold tabular-nums text-amber-600">
              {mx(stats.pendingBalancesTotal)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">En prendas aún no entregadas</p>
          </CardHeader>
        </Card>
      </div>

      {/* Tablero Kanban de Estados de Órdenes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Tablero de Órdenes en Proceso ({activeOrders.length})</h2>
          <span className="text-xs text-muted-foreground">Haz clic en los botones para avanzar el estado</span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Columna: Recibido */}
          <div className="rounded-xl border bg-muted/20 p-3 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <span>📥</span> Recibidas en Caja
              </span>
              <Badge variant="outline">
                {activeOrders.filter((o) => o.status === "received").length}
              </Badge>
            </div>

            {activeOrders.filter((o) => o.status === "received").length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No hay prendas pendientes de lavar.</p>
            ) : (
              activeOrders
                .filter((o) => o.status === "received")
                .map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    mx={mx}
                    onAdvance={() => updateOrderStatus(order.id, "washing")}
                    nextLabel="Mandar a Lavar 🧼"
                  />
                ))
            )}
          </div>

          {/* Columna: En Lavado */}
          <div className="rounded-xl border bg-muted/20 p-3 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <span>🧼</span> En Lavado / Secado
              </span>
              <Badge variant="outline">
                {activeOrders.filter((o) => o.status === "washing").length}
              </Badge>
            </div>

            {activeOrders.filter((o) => o.status === "washing").length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">Ninguna máquina en proceso actualmente.</p>
            ) : (
              activeOrders
                .filter((o) => o.status === "washing")
                .map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    mx={mx}
                    onAdvance={() => updateOrderStatus(order.id, "ready")}
                    nextLabel="Marcar Listo ✅"
                  />
                ))
            )}
          </div>

          {/* Columna: Listo para entrega */}
          <div className="rounded-xl border bg-muted/20 p-3 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <span>✅</span> Listas para Entrega
              </span>
              <Badge variant="outline">
                {activeOrders.filter((o) => o.status === "ready").length}
              </Badge>
            </div>

            {activeOrders.filter((o) => o.status === "ready").length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No hay paquetes esperando retiro.</p>
            ) : (
              activeOrders
                .filter((o) => o.status === "ready")
                .map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    mx={mx}
                    onAdvance={() => updateOrderStatus(order.id, "delivered")}
                    nextLabel="Entregar al Cliente 📦"
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderCard({
  order,
  mx,
  onAdvance,
  nextLabel,
}: {
  order: any
  mx: (n: number) => string
  onAdvance: () => void
  nextLabel: string
}) {
  return (
    <Card className="shadow-xs hover:border-primary/50 transition-colors">
      <CardHeader className="p-3 pb-1">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-primary">{order.ticketCode}</span>
          <span className="text-xs text-muted-foreground">{order.deliveryDate}</span>
        </div>
        <CardTitle className="text-sm font-semibold mt-0.5">{order.customerName}</CardTitle>
        <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
      </CardHeader>
      <CardContent className="p-3 pt-1 space-y-2">
        <div className="bg-muted/40 rounded-md p-2 text-xs space-y-1">
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between">
              <span>
                {item.serviceName} {item.qty > 1 || item.serviceName.includes("Kilo") ? `(${item.qty})` : ""}
              </span>
              <span className="font-medium">{mx(item.qty * item.unitPrice)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t">
          <div>
            <span className="text-muted-foreground">Total: </span>
            <span className="font-bold">{mx(order.total)}</span>
          </div>
          <div>
            {order.balance > 0 ? (
              <span className="text-amber-600 font-semibold">Debe: {mx(order.balance)}</span>
            ) : (
              <span className="text-emerald-600 font-semibold">Pagado ✓</span>
            )}
          </div>
        </div>

        {order.notes && (
          <p className="text-[11px] text-muted-foreground italic line-clamp-1">
            "{order.notes}"
          </p>
        )}

        <Button size="xs" className="w-full mt-2" onClick={onAdvance}>
          {nextLabel}
        </Button>
      </CardContent>
    </Card>
  )
}

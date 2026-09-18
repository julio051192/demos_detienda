"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  tableStatusBadge,
  tableStatusLabel,
  useRestauranteStore,
} from "@/lib/restaurante-store"
import { formatMoney, todayISO } from "@/lib/money"
import type { TableZone } from "@/lib/restaurante-types"
import {
  UtensilsCrossed,
  ChefHat,
  Receipt,
  Users,
  PlusCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

const zones: { key: TableZone; label: string }[] = [
  { key: "salon_principal", label: "🍽️ Salón Principal" },
  { key: "terraza", label: "🌿 Terraza & Vista" },
  { key: "barra", label: "🍸 Barra & Coctelería" },
]

export default function RestauranteDashboardPage() {
  const { state, ready, stats, requestPreCuenta, payAndReleaseTable, reset } = useRestauranteStore()
  const mx = (n: number) => formatMoney(n)

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando restaurante…</p>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200">
              <UtensilsCrossed className="size-3 text-amber-600" />
              Demo Restaurante & Pollería
            </Badge>
            <span className="text-xs text-muted-foreground">{todayISO()}</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
            Mapa de Mesas & Estado del Salón
          </h1>
          <p className="text-sm text-muted-foreground">
            Control de mesas en tiempo real por zonas, atención de comensales y emisión de pre-cuentas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Restaurar datos
          </Button>
          <Button render={<Link href="/restaurante/comanda" />}>
            <UtensilsCrossed className="mr-1.5 size-4" />
            Tomar Comanda Visual
          </Button>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Ocupación de Mesas</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-rose-600">
              {stats.occupiedTablesCount} / {stats.totalTablesCount} ocupadas
            </CardTitle>
            <p className="text-xs text-muted-foreground">{stats.freeTablesCount} mesas libres en salón</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Platos en Cocina</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-amber-600">
              {stats.pendingKitchenLinesCount} pedidos
            </CardTitle>
            <p className="text-xs text-muted-foreground">Marchando en fogones y wok</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Ventas Cobradas Hoy</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600">
              {mx(stats.totalSalesToday)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Total ingresado en caja</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Órdenes Abiertas</p>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {stats.activeOrdersCount} comandas
            </CardTitle>
            <p className="text-xs text-muted-foreground">Cuentas pendientes por cobrar</p>
          </CardHeader>
        </Card>
      </div>

      {/* Mapa de Mesas por Zonas */}
      <div className="space-y-6">
        {zones.map((z) => {
          const zoneTables = state.tables.filter((t) => t.zone === z.key)

          return (
            <div key={z.key} className="space-y-3 border-t pt-4">
              <h2 className="text-base font-bold text-foreground flex items-center justify-between">
                <span>{z.label}</span>
                <span className="text-xs text-muted-foreground font-normal">
                  {zoneTables.filter((t) => t.status === "libre").length} libres de {zoneTables.length}
                </span>
              </h2>

              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {zoneTables.map((table) => {
                  const currentOrder = state.orders.find((o) => o.id === table.currentOrderId)

                  return (
                    <Card
                      key={table.id}
                      className={`shadow-xs border-2 transition-all hover:shadow-md ${
                        table.status === "libre"
                          ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10"
                          : table.status === "ocupada"
                            ? "border-rose-300 dark:border-rose-800 bg-rose-50/20 dark:bg-rose-950/10"
                            : table.status === "precuenta"
                              ? "border-amber-300 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/10"
                              : "border-blue-300 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/10"
                      }`}
                    >
                      <CardHeader className="p-3 pb-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-base text-foreground">
                            {table.code}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${tableStatusBadge(table.status)}`}
                          >
                            {tableStatusLabel(table.status)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Capacidad: {table.capacity} personas</p>
                      </CardHeader>

                      <CardContent className="p-3 pt-1 space-y-2 text-xs">
                        {currentOrder && (
                          <div className="space-y-1 bg-background/80 rounded p-2 border">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="font-bold text-primary">{currentOrder.ticketCode}</span>
                              <span className="text-muted-foreground">{table.waiterName || "Mozo"}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold pt-1 border-t">
                              <span>Total consumo:</span>
                              <span className="text-emerald-600">{mx(currentOrder.total)}</span>
                            </div>
                          </div>
                        )}

                        {/* Botones de acción rápida por estado */}
                        <div className="pt-1 flex flex-col gap-1">
                          {table.status === "libre" && (
                            <Button
                              size="xs"
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                              render={<Link href={`/restaurante/comanda?tableId=${table.id}`} />}
                            >
                              <PlusCircle className="size-3 mr-1" />
                              Tomar Comanda
                            </Button>
                          )}

                          {table.status === "ocupada" && (
                            <Button
                              size="xs"
                              variant="outline"
                              className="w-full border-amber-400 text-amber-900 dark:text-amber-200"
                              onClick={() => requestPreCuenta(table.id)}
                            >
                              <Receipt className="size-3 mr-1" />
                              Emitir Pre-Cuenta
                            </Button>
                          )}

                          {table.status === "precuenta" && currentOrder && (
                            <Button
                              size="xs"
                              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold"
                              onClick={() => payAndReleaseTable(currentOrder.id)}
                            >
                              <CheckCircle2 className="size-3 mr-1" />
                              Cobrar & Liberar ({mx(currentOrder.total)})
                            </Button>
                          )}

                          {table.status === "limpieza" && (
                            <Button
                              size="xs"
                              variant="secondary"
                              className="w-full text-[11px]"
                              onClick={() => payAndReleaseTable("none")}
                            >
                              ✓ Habilitar Mesa Libre
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

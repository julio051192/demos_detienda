"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRestauranteStore } from "@/lib/restaurante-store"
import { ChefHat, Clock, CheckCircle2, AlertTriangle, UtensilsCrossed } from "lucide-react"

export default function CocinaKDSPage() {
  const { state, ready, updateLineStatus } = useRestauranteStore()

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando monitor de cocina…</p>

  const activeOrders = state.orders.filter((o) => o.status !== "pagada")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-amber-100 text-amber-900 border-amber-300">
              <ChefHat className="size-3 text-amber-600 mr-1" />
              Monitor KDS de Fogones & Bar
            </Badge>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight">Pantalla Digital de Cocina & Bar</h1>
          <p className="text-sm text-muted-foreground">
            Control de comandeo en tiempo real con cronómetro por tiempo de preparación.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeOrders.length === 0 ? (
          <div className="lg:col-span-3 rounded-xl border border-dashed p-12 text-center text-muted-foreground space-y-2">
            <ChefHat className="size-10 mx-auto text-muted-foreground/40" />
            <p className="font-bold text-base">Sin comandas pendientes en marcha</p>
            <p className="text-xs">Los pedidos enviados desde los mozos aparecerán en esta pantalla inmediatamente.</p>
          </div>
        ) : (
          activeOrders.map((order) => {
            const isLate = (order.kitchenTimeMinutes || 0) > 20
            const isWarning = (order.kitchenTimeMinutes || 0) > 10 && !isLate

            return (
              <Card
                key={order.id}
                className={`shadow-xs border-2 ${
                  isLate
                    ? "border-rose-400 bg-rose-50/20 dark:bg-rose-950/20"
                    : isWarning
                      ? "border-amber-400 bg-amber-50/20 dark:bg-amber-950/20"
                      : "border-emerald-300 bg-emerald-50/20 dark:bg-emerald-950/20"
                }`}
              >
                <CardHeader className="p-3 pb-2 border-b">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-foreground flex items-center gap-1.5">
                      <UtensilsCrossed className="size-4 text-primary" />
                      {order.tableName}
                    </span>
                    <Badge
                      variant="outline"
                      className={`font-mono text-xs font-bold ${
                        isLate
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : isWarning
                            ? "bg-amber-100 text-amber-800 border-amber-300"
                            : "bg-emerald-100 text-emerald-800 border-emerald-300"
                      }`}
                    >
                      <Clock className="size-3 mr-1" />
                      {order.kitchenTimeMinutes || 5} min.
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-0.5">
                    <span className="font-mono font-bold text-primary">{order.ticketCode}</span>
                    <span>Mozo: {order.waiterName}</span>
                  </div>
                </CardHeader>

                <CardContent className="p-3 space-y-2.5">
                  <div className="divide-y text-xs">
                    {order.lines.map((line) => (
                      <div key={line.dishId} className="py-2 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-foreground">
                            {line.qty}x {line.name}
                          </span>
                          <Badge
                            variant={line.status === "listo" ? "secondary" : "outline"}
                            className="text-[10px]"
                          >
                            {line.status === "listo" ? "✓ Listo" : "En marcha"}
                          </Badge>
                        </div>

                        {line.notes && (
                          <p className="text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-1 rounded border border-rose-200">
                            Obs: {line.notes}
                          </p>
                        )}

                        <div className="pt-1 flex justify-end">
                          {line.status !== "listo" ? (
                            <Button
                              size="xs"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-7 text-[11px]"
                              onClick={() => updateLineStatus(order.id, line.dishId, "listo")}
                            >
                              <CheckCircle2 className="size-3 mr-1" />
                              Marcar Listo
                            </Button>
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-bold">
                              ✓ Notificado a Mozo
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

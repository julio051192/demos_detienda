"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCafeteriaStore } from "@/lib/cafeteria-store"
import { formatMoney } from "@/lib/money"
import {
  ChefHat,
  Coffee,
  Clock,
  CheckCircle2,
  Bell,
  Play,
  Flame,
  ArrowRight,
} from "lucide-react"

export default function BaristaScreenPage() {
  const { state, ready, stats, updateOrderStatus } = useCafeteriaStore()
  const mx = (n: number) => formatMoney(n)

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando pantalla del barista…</p>

  const pendingOrders = state.orders.filter((o) => o.status !== "entregado")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-800 text-amber-100 border-amber-600">
              <ChefHat className="size-3.5 mr-1" />
              Barista KDS en Vivo
            </Badge>
            <span className="text-xs text-muted-foreground">Estación de Máquina de Espresso & Barra Fría</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight">Pantalla de Preparación del Barista</h1>
          <p className="text-sm text-muted-foreground">
            Control visual de pedidos en marcha, tiempos de extracción y notificación de vaso listo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono font-bold">
            {stats.activeOrdersCount} pedidos en barra
          </Badge>
        </div>
      </div>

      {/* Grid de Pedidos para el Barista */}
      {pendingOrders.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground space-y-2">
          <Coffee className="size-10 mx-auto text-muted-foreground/40" />
          <h3 className="font-bold text-base">¡Barra limpia y al día!</h3>
          <p className="text-xs">No hay bebidas pendientes por preparar en este momento.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pendingOrders.map((order) => {
            const isReady = order.status === "listo"
            const isPreparing = order.status === "preparando"

            return (
              <Card
                key={order.id}
                className={`border-2 shadow-xs transition-all ${
                  isReady
                    ? "border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20"
                    : isPreparing
                      ? "border-amber-500 bg-amber-50/20 dark:bg-amber-950/20"
                      : "border-border bg-card"
                }`}
              >
                <CardHeader className="p-3.5 pb-2 border-b">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-foreground flex items-center gap-1.5">
                      <Coffee className="size-4 text-amber-800" />
                      {order.ticketCode}
                    </span>
                    <Badge
                      className={`text-[10px] font-bold ${
                        isReady
                          ? "bg-emerald-600 text-white"
                          : isPreparing
                            ? "bg-amber-600 text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isReady ? "✓ ¡LISTO!" : isPreparing ? "🔥 Preparando" : "⏳ En cola"}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="font-bold text-foreground truncate">{order.customerName}</span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {order.orderType === "para_mesa" ? order.tableNumber || "Mesa" : "Para Llevar"}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-3.5 space-y-3">
                  {/* Lista de Bebidas y Alimentos */}
                  <div className="divide-y text-xs">
                    {order.lines.map((line) => (
                      <div key={line.id} className="py-2 space-y-1">
                        <div className="flex items-start justify-between">
                          <span className="font-black text-sm text-foreground">
                            {line.qty}x {line.name}
                          </span>
                        </div>

                        {/* Notas y Personalización para el Barista */}
                        {line.customization && (
                          <div className="bg-amber-900/10 p-2 rounded-lg text-[11px] font-mono space-y-0.5 border border-amber-800/20">
                            {line.customization.size && (
                              <p className="font-bold text-amber-900 dark:text-amber-200">
                                🥤 Vaso: {line.customization.size}
                              </p>
                            )}
                            {line.customization.milk && (
                              <p className="font-semibold text-foreground">
                                🥛 Leche: {line.customization.milk.toUpperCase()}
                              </p>
                            )}
                            {line.customization.syrup && (
                              <p className="text-amber-800 font-semibold">
                                🍯 Jarabe: {line.customization.syrup}
                              </p>
                            )}
                            {line.customization.sugarLevel && (
                              <p className="text-muted-foreground">
                                🍬 Azúcar: {line.customization.sugarLevel}
                              </p>
                            )}
                            {line.customization.extraShotEspresso && (
                              <p className="text-rose-600 font-bold">
                                ⚡ +1 SHOT EXTRA DE ESPRESSO
                              </p>
                            )}
                          </div>
                        )}

                        {line.notes && (
                          <p className="text-[10px] text-rose-600 font-bold bg-rose-50 dark:bg-rose-950 p-1 rounded">
                            Nota: {line.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Acciones del Barista */}
                  <div className="pt-2 border-t flex flex-col gap-1.5">
                    {order.status === "en_cola" && (
                      <Button
                        size="sm"
                        className="w-full bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs"
                        onClick={() => updateOrderStatus(order.id, "preparando")}
                      >
                        <Play className="size-3.5 mr-1.5" />
                        Empezar Extracción / Vaporizado
                      </Button>
                    )}

                    {order.status === "preparando" && (
                      <Button
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        onClick={() => updateOrderStatus(order.id, "listo")}
                      >
                        <CheckCircle2 className="size-3.5 mr-1.5" />
                        Marcar Listo para Retiro
                      </Button>
                    )}

                    {order.status === "listo" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold text-xs"
                        onClick={() => updateOrderStatus(order.id, "entregado")}
                      >
                        ✓ Entregado al Cliente / Mozo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

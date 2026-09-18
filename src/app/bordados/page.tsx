"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  garmentLabel,
  locationLabel,
  stageBadge,
  stageLabel,
  useBordadosStore,
} from "@/lib/bordados-store"
import { formatMoney, formatNumber, todayISO } from "@/lib/money"
import type { OrderStage } from "@/lib/bordados-types"
import {
  Scissors,
  PlusCircle,
  Calculator,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileCode,
} from "lucide-react"

const stages: { key: OrderStage; label: string; icon: any }[] = [
  { key: "matrizado", label: "🟡 Diseñando Matriz", icon: FileCode },
  { key: "muestra", label: "🔵 Muestra de Prueba", icon: Layers },
  { key: "en_maquina", label: "🟠 En Máquina", icon: Cpu },
  { key: "limpieza", label: "✂️ Limpieza & Control", icon: Scissors },
  { key: "listo", label: "✨ Listo para Entrega", icon: CheckCircle2 },
]

export default function BordadosDashboardPage() {
  const { state, ready, stats, advanceStage, reset } = useBordadosStore()
  const mx = (n: number) => formatMoney(n)

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando taller de bordados…</p>

  return (
    <div className="space-y-6">
      {/* Header Superior */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 bg-violet-100 text-violet-900 border-violet-300 dark:bg-violet-950 dark:text-violet-200">
              <Scissors className="size-3 text-violet-600" />
              Demo Bordados Computarizados
            </Badge>
            <span className="text-xs text-muted-foreground">{todayISO()}</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
            Tablero de Producción del Taller
          </h1>
          <p className="text-sm text-muted-foreground">
            Control de órdenes por etapas: matrizado, visto bueno de muestra, cabezales en producción y entrega.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Restaurar datos
          </Button>
          <Button render={<Link href="/bordados/ordenes" />}>
            <PlusCircle className="mr-1.5 size-4" />
            Nueva Orden
          </Button>
          <Button variant="secondary" render={<Link href="/bordados/cotizador" />}>
            <Calculator className="mr-1.5 size-4" />
            Cotizador Express
          </Button>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Órdenes en Taller</p>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {stats.activeOrdersCount} pedidos
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {stats.totalGarmentsPending} prendas totales en cola
            </p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Puntadas en Producción</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-violet-600">
              {(stats.totalStitchesPending / 1000).toFixed(0)}k puntadas
            </CardTitle>
            <p className="text-xs text-muted-foreground">Carga total para bordadoras</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Adelantos Recibidos Hoy</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600">
              {mx(stats.totalAdvancesToday)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Cobrado al registrar pedidos</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Máquinas Bordadoras</p>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {stats.activeMachinesCount} / {stats.totalMachinesCount} activas
            </CardTitle>
            <p className="text-xs text-muted-foreground">Cabezales operando en taller</p>
          </CardHeader>
        </Card>
      </div>

      {/* Tablero Kanban por Columnas de Etapa */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 overflow-x-auto pb-2">
        {stages.map((stg) => {
          const colOrders = state.orders.filter((o) => o.stage === stg.key)
          const Icon = stg.icon

          return (
            <div key={stg.key} className="space-y-3 min-w-[220px]">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <Icon className="size-3.5 text-primary" />
                  {stg.label}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  {colOrders.length}
                </Badge>
              </div>

              <div className="space-y-2.5">
                {colOrders.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                    Sin órdenes en esta fase
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const machine = state.machines.find((m) => m.id === order.assignedMachineId)
                    return (
                      <Card key={order.id} className="shadow-xs border hover:border-primary/50 transition-colors">
                        <CardHeader className="p-3 pb-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs text-primary">
                              {order.ticketCode}
                            </span>
                            <span className="text-[11px] font-bold">
                              {order.qty} u.
                            </span>
                          </div>
                          <CardTitle className="text-xs font-bold mt-0.5 line-clamp-1">
                            {order.clientName}
                          </CardTitle>
                          <p className="text-[11px] text-muted-foreground">
                            {garmentLabel(order.garmentType)} · {locationLabel(order.location)}
                          </p>
                        </CardHeader>

                        <CardContent className="p-3 pt-1 space-y-2 text-[11px]">
                          <div className="bg-muted/40 rounded p-1.5 space-y-0.5 font-mono text-[10px]">
                            <div className="flex justify-between">
                              <span>Puntadas:</span>
                              <span className="font-bold text-violet-700 dark:text-violet-300">
                                {formatNumber(order.stitchCount)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Medida:</span>
                              <span>{order.widthCm}x{order.heightCm} cm</span>
                            </div>
                            {order.needsNewMatrix && (
                              <div className="flex justify-between text-amber-700 dark:text-amber-300 font-semibold">
                                <span>Matriz:</span>
                                <span>Nueva (+{mx(order.matrixCost)})</span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-0.5">
                            <p className="text-[10px] text-muted-foreground">Colores de hilo:</p>
                            <div className="flex flex-wrap gap-1">
                              {order.threadColors.map((color, i) => (
                                <span
                                  key={i}
                                  className="px-1.5 py-0.2 rounded text-[9px] bg-background border font-medium"
                                >
                                  {color}
                                </span>
                              ))}
                            </div>
                          </div>

                          {machine && (
                            <p className="text-[10px] text-primary font-semibold">
                              ⚙️ {machine.name} ({machine.heads} cab.)
                            </p>
                          )}

                          <div className="pt-1 flex items-center justify-between border-t text-[10px]">
                            <span className="font-bold text-rose-600">
                              {order.balance > 0 ? `Debe ${mx(order.balance)}` : "Saldado"}
                            </span>
                            <Button
                              size="xs"
                              variant="secondary"
                              className="h-6 text-[10px] px-2"
                              onClick={() => advanceStage(order.id)}
                            >
                              <span>Avanzar</span>
                              <ArrowRight className="size-3 ml-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

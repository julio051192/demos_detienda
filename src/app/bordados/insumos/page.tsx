"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useBordadosStore } from "@/lib/bordados-store"
import { Cpu, Scissors, AlertTriangle, CheckCircle2, Wrench } from "lucide-react"

export default function InsumosBordadosPage() {
  const { state, ready, updateSupplyStock } = useBordadosStore()

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando insumos…</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Máquinas Bordadoras & Insumos de Taller</h1>
          <p className="text-sm text-muted-foreground">
            Estado de cabezales de bordadoras e inventario de conos de hilo, pelón, agujas y bobinas.
          </p>
        </div>
      </div>

      {/* Sección 1: Máquinas Bordadoras */}
      <div className="space-y-3">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Cpu className="size-4 text-violet-600" />
          Estado de Máquinas Bordadoras del Taller ({state.machines.length})
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {state.machines.map((m) => (
            <Card
              key={m.id}
              className={`shadow-xs border-2 ${
                m.status === "active"
                  ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/10"
                  : m.status === "idle"
                    ? "border-blue-300 dark:border-blue-800"
                    : "border-amber-300 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/10"
              }`}
            >
              <CardHeader className="p-3 pb-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{m.name}</span>
                  <Badge
                    variant="outline"
                    className={
                      m.status === "active"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : m.status === "idle"
                          ? "bg-blue-100 text-blue-800 border-blue-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                    }
                  >
                    {m.status === "active" ? "Operando" : m.status === "idle" ? "Disponible" : "Mantenimiento"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{m.brand} · {m.heads} cabezal(es)</p>
              </CardHeader>
              <CardContent className="p-3 pt-1">
                {m.status === "active" && m.currentOrderId && (
                  <p className="text-[11px] text-violet-700 dark:text-violet-300 font-semibold pt-1">
                    ⚙️ Bordando Orden activa
                  </p>
                )}
                {m.status === "idle" && (
                  <p className="text-[11px] text-muted-foreground pt-1">
                    ✓ Cabezales limpios listos para cargar diseño.
                  </p>
                )}
                {m.status === "maintenance" && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold pt-1">
                    🛠️ En cambio de agujas / lubricación.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sección 2: Insumos de Taller */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Scissors className="size-4 text-violet-600" />
          Inventario de Hilos, Pelón y Agujas ({state.supplies.length})
        </h2>

        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Insumo de Taller</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Color / Especificación</TableHead>
                <TableHead>Stock Actual</TableHead>
                <TableHead>Stock Mínimo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ajuste Rápido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.supplies.map((sup) => {
                const isLow = sup.stock <= sup.minStock
                return (
                  <TableRow key={sup.id}>
                    <TableCell className="font-semibold text-foreground text-xs">
                      {sup.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs">
                        {sup.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {sup.color || "—"}
                    </TableCell>
                    <TableCell className="font-bold tabular-nums text-sm">
                      {sup.stock} {sup.unit}
                    </TableCell>
                    <TableCell className="tabular-nums text-xs text-muted-foreground">
                      {sup.minStock} {sup.unit}
                    </TableCell>
                    <TableCell>
                      {isLow ? (
                        <Badge variant="destructive" className="gap-1 text-xs">
                          <AlertTriangle className="size-3" />
                          Reponer Insumo
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Abastecido
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => updateSupplyStock(sup.id, -1)}
                        disabled={sup.stock <= 0}
                      >
                        -1 Usar
                      </Button>
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => updateSupplyStock(sup.id, 1)}
                      >
                        +1 Ingreso
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

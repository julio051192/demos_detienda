"use client"

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
import { useCafeteriaStore } from "@/lib/cafeteria-store"
import { formatNumber } from "@/lib/money"
import {
  Package,
  AlertTriangle,
  Plus,
  Minus,
  Sparkles,
  Coffee,
  CheckCircle2,
} from "lucide-react"

export default function InsumosCafeteriaPage() {
  const { state, ready, adjustSupplyStock } = useCafeteriaStore()

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando insumos…</p>

  const lowStockCount = state.supplies.filter((s) => s.currentStock <= s.minStock).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Granos de Especialidad & Stock de Barismo</h1>
          <p className="text-sm text-muted-foreground">
            Control de inventario de granos con denominación de origen, leches alternativas, descartables y jarabes.
          </p>
        </div>

        {lowStockCount > 0 && (
          <Badge variant="destructive" className="text-xs font-bold flex items-center gap-1">
            <AlertTriangle className="size-3.5" />
            {lowStockCount} insumos bajo el mínimo
          </Badge>
        )}
      </div>

      {/* Tabla de Insumos */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Insumo / Materia Prima</TableHead>
              <TableHead>Categoría & Origen</TableHead>
              <TableHead>Stock Actual</TableHead>
              <TableHead>Mínimo Requerido</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ajuste Rápido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.supplies.map((sup) => {
              const isLow = sup.currentStock <= sup.minStock

              return (
                <TableRow key={sup.id}>
                  <TableCell>
                    <p className="font-bold text-xs text-foreground">{sup.name}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[11px] capitalize">
                      {sup.category.replace("_", " ")}
                    </Badge>
                    {sup.origin && (
                      <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium mt-0.5">
                        📍 {sup.origin}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="font-bold font-mono text-sm tabular-nums">
                    {formatNumber(sup.currentStock)} {sup.unit}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {formatNumber(sup.minStock)} {sup.unit}
                  </TableCell>
                  <TableCell>
                    {isLow ? (
                      <Badge variant="destructive" className="text-[10px] font-bold">
                        ⚠️ Reponer Urgente
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-[10px]">
                        ✓ Stock Óptimo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => adjustSupplyStock(sup.id, -1)}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <Button
                        size="xs"
                        className="bg-amber-800 hover:bg-amber-900 text-white font-bold"
                        onClick={() => adjustSupplyStock(sup.id, 5)}
                      >
                        <Plus className="size-3 mr-0.5" />
                        +5 {sup.unit}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

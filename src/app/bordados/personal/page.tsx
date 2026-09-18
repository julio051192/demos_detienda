"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { formatMoney, formatNumber } from "@/lib/money"
import { Users, Calculator, Coins, CheckCircle2, ShieldCheck } from "lucide-react"

export default function PersonalBordadosPage() {
  const { state, ready, stats, addCashMovement } = useBordadosStore()
  const mx = (n: number) => formatMoney(n)

  const [paidOperators, setPaidOperators] = useState<Record<string, boolean>>({})

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando personal…</p>

  function handlePayDestajo(payId: string, operatorName: string, amount: number) {
    addCashMovement({
      type: "egreso",
      category: "pago_destajo",
      description: `Pago de Destajo Semanal — ${operatorName}`,
      amount,
      paymentMethod: "efectivo",
    })

    setPaidOperators((prev) => ({ ...prev, [payId]: true }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Planillas & Pagos por Destajo</h1>
          <p className="text-sm text-muted-foreground">
            Cálculo automático de liquidación para operarios por millar de puntadas bordadas y prendas terminadas.
          </p>
        </div>
      </div>

      {/* Tarjetas KPI Planilla */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Personal Registrado</p>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {state.payroll.length} colaboradores
            </CardTitle>
            <p className="text-xs text-muted-foreground">Operarios de máquinas y diseñadores</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Total Pendiente de Pago por Destajo</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-rose-600">
              {mx(stats.totalPayrollPending)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">A liquidar al final de la semana</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Tarifa Promedio Destajo</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-violet-600">
              S/ 0.15 / 1,000 puntadas
            </CardTitle>
            <p className="text-xs text-muted-foreground">+ S/ 0.40 por prenda completada</p>
          </CardHeader>
        </Card>
      </div>

      {/* Tabla de Liquidación por Destajo */}
      <div className="space-y-3">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Users className="size-4 text-violet-600" />
          Liquidación de Destajo de Personal ({state.payroll.length})
        </h2>

        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador / Operario</TableHead>
                <TableHead>Rol / Puesto</TableHead>
                <TableHead>Puntadas Procesadas</TableHead>
                <TableHead>Prendas Acabadas</TableHead>
                <TableHead>Sueldo Bruto</TableHead>
                <TableHead>Adelantos Recibidos</TableHead>
                <TableHead>Saldo Neto a Pagar</TableHead>
                <TableHead className="text-right">Liquidación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.payroll.map((pay) => {
                const isPaid = paidOperators[pay.id]
                return (
                  <TableRow key={pay.id}>
                    <TableCell className="font-bold text-foreground text-xs">
                      {pay.operatorName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {pay.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs tabular-nums text-violet-700 dark:text-violet-300 font-bold">
                      {formatNumber(pay.totalStitchesWorked)} puntadas
                    </TableCell>
                    <TableCell className="font-bold text-xs tabular-nums">
                      {pay.totalGarmentsFinished} prendas
                    </TableCell>
                    <TableCell className="tabular-nums text-xs font-semibold">
                      {mx(pay.grossEarned)}
                    </TableCell>
                    <TableCell className="tabular-nums text-xs text-muted-foreground">
                      - {mx(pay.advancesPaid)}
                    </TableCell>
                    <TableCell className="font-bold text-sm tabular-nums text-rose-600">
                      {mx(pay.netPayable)}
                    </TableCell>
                    <TableCell className="text-right">
                      {isPaid ? (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs">
                          ✓ Liquidado en Caja
                        </Badge>
                      ) : (
                        <Button
                          size="xs"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                          onClick={() => handlePayDestajo(pay.id, pay.operatorName, pay.netPayable)}
                        >
                          <Coins className="size-3.5 mr-1" />
                          Pagar Destajo
                        </Button>
                      )}
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

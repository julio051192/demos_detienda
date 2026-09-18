"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { useVeterinariaStore } from "@/lib/veterinaria-store"
import { formatMoney } from "@/lib/money"
import type { VeterinariaSale } from "@/lib/veterinaria-types"
import {
  Receipt,
  Printer,
  DollarSign,
  Stethoscope,
  Scissors,
  ShoppingBag,
  CreditCard,
  Smartphone,
} from "lucide-react"

export default function CajaVeterinariaPage() {
  const { state, ready, stats } = useVeterinariaStore()
  const mx = (n: number) => formatMoney(n)

  const [selectedTicket, setSelectedTicket] = useState<VeterinariaSale | null>(null)

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando caja veterinaria…</p>

  const yapeTotal = state.sales
    .filter((s) => s.paymentMethod === "yape_plin")
    .reduce((sum, s) => sum + s.total, 0)

  const efectivoTotal = state.sales
    .filter((s) => s.paymentMethod === "efectivo")
    .reduce((sum, s) => sum + s.total, 0)

  const tarjetaTotal = state.sales
    .filter((s) => s.paymentMethod === "tarjeta")
    .reduce((sum, s) => sum + s.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Caja & Facturación Unificada</h1>
          <p className="text-sm text-muted-foreground">
            Control integrado de ingresos por consultas médicas, cirugías, servicios de grooming y ventas del pet shop.
          </p>
        </div>
      </div>

      {/* Métricas de Caja */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card size="sm" className="border-teal-300 dark:border-teal-800 bg-teal-50/20 dark:bg-teal-950/10">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Ingresos Totales Hoy</p>
            <CardTitle className="text-2xl font-black tabular-nums text-teal-800 dark:text-teal-300">
              {mx(stats.totalSalesToday)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{state.sales.length} transacciones</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Smartphone className="size-3.5 text-purple-600" />
              Yape / Plin Digital
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums text-purple-600">
              {mx(yapeTotal)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Transferencias inmediatas</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <DollarSign className="size-3.5 text-emerald-600" />
              Efectivo en Caja
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600">
              {mx(efectivoTotal)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Cobro en recepción</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <CreditCard className="size-3.5 text-blue-600" />
              Tarjeta / POS
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums text-blue-600">
              {mx(tarjetaTotal)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Débito y crédito</p>
          </CardHeader>
        </Card>
      </div>

      {/* Historial de Ventas y Comprobantes */}
      <div className="space-y-3">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Receipt className="size-4 text-teal-700" />
          Comprobantes Emitidos ({state.sales.length})
        </h2>

        <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Tutor / Mascota</TableHead>
                <TableHead>Línea de Servicio</TableHead>
                <TableHead>Detalle de Consumos</TableHead>
                <TableHead>Medio de Pago</TableHead>
                <TableHead>Monto (S/)</TableHead>
                <TableHead className="text-right">Comprobante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-mono font-bold text-xs text-teal-800 dark:text-teal-300">
                    {sale.ticketCode}
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-xs text-foreground">{sale.clientName}</p>
                    <p className="text-[11px] text-muted-foreground">Paciente: {sale.petName}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-[10px]">
                      {sale.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[220px] truncate">
                    {sale.itemsSummary}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                      {sale.paymentMethod.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-sm tabular-nums text-foreground">
                    {mx(sale.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="xs"
                      variant="outline"
                      className="border-teal-600/40 text-teal-800 dark:text-teal-200 font-bold"
                      onClick={() => setSelectedTicket(sale)}
                    >
                      <Printer className="size-3.5 mr-1" />
                      Boleta
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal: Boleta de Venta Veterinaria */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-xs font-mono text-xs">
            <div className="border border-dashed p-4 rounded-lg bg-card space-y-3">
              <div className="text-center border-b pb-2">
                <Stethoscope className="size-7 mx-auto text-teal-700 mb-1" />
                <h3 className="font-black text-sm tracking-wider">CLÍNICA VETERINARIA & PET SHOP</h3>
                <p className="text-[10px] text-muted-foreground">SAN MARTÍN VET S.A.C.</p>
                <p className="text-[10px] text-muted-foreground">RUC: 20554189120</p>
                <p className="text-[12px] font-bold text-teal-800 dark:text-teal-300 mt-1">
                  BOLETA ELECTRÓNICA: {selectedTicket.ticketCode}
                </p>
                <p className="text-[10px] text-muted-foreground">{selectedTicket.createdAt}</p>
              </div>

              <div className="space-y-0.5 text-[11px]">
                <p><strong>Cliente:</strong> {selectedTicket.clientName}</p>
                <p><strong>Mascota:</strong> {selectedTicket.petName}</p>
                <p><strong>Servicio:</strong> {selectedTicket.type.toUpperCase()}</p>
              </div>

              <div className="border-t border-b py-2 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="truncate max-w-[70%]">{selectedTicket.itemsSummary}</span>
                  <span className="tabular-nums font-bold">{mx(selectedTicket.total)}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-black text-sm">
                  <span>TOTAL COBRADO:</span>
                  <span>{mx(selectedTicket.total)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Medio de pago:</span>
                  <span className="uppercase">{selectedTicket.paymentMethod}</span>
                </div>
              </div>

              <p className="text-[9px] text-center text-muted-foreground pt-2">
                ¡Gracias por confiar la salud de tu mascota con nosotros!
              </p>
            </div>

            <DialogFooter>
              <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold" onClick={() => window.print()}>
                <Printer className="size-4 mr-2" />
                Imprimir Boleta Térmica
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

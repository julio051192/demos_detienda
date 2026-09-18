"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { useBordadosStore } from "@/lib/bordados-store"
import { formatMoney, todayISO } from "@/lib/money"
import type { CashMovement, PaymentMethod } from "@/lib/bordados-types"
import { Wallet, PlusCircle, ArrowUpRight, ArrowDownRight, FileText, Printer, CheckCircle2 } from "lucide-react"

export default function CajaBordadosPage() {
  const { state, ready, stats, addCashMovement, issueInvoice } = useBordadosStore()
  const mx = (n: number) => formatMoney(n)

  const [openModal, setOpenModal] = useState(false)
  const [type, setType] = useState<"ingreso" | "egreso">("egreso")
  const [category, setCategory] = useState<CashMovement["category"]>("compra_insumos")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("50")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo")

  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<typeof state.orders[0] | null>(null)

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando caja…</p>

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) return

    addCashMovement({
      type,
      category,
      description: description.trim(),
      amount: Math.max(1, Number(amount) || 0),
      paymentMethod,
    })

    setDescription("")
    setOpenModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recepción & Caja Chica del Taller</h1>
          <p className="text-sm text-muted-foreground">
            Control diario de ingresos por adelantos/saldos, egresos por compras e impuestos, y emisión de comprobantes.
          </p>
        </div>
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle className="mr-1.5 size-4" />
          Registrar Movimiento de Caja
        </Button>
      </div>

      {/* Métricas de Caja */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Ingresos del Día</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600 flex items-center gap-1">
              <ArrowUpRight className="size-5" />
              {mx(stats.totalIngresosToday)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Adelantos y cobros realizados</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Egresos / Compras del Día</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-rose-600 flex items-center gap-1">
              <ArrowDownRight className="size-5" />
              {mx(stats.totalEgresosToday)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Gastos e insumos de taller</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Balance Neto de Caja</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-violet-700 dark:text-violet-300">
              {mx(stats.cashNetBalance)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Saldo disponible en caja hoy</p>
          </CardHeader>
        </Card>
      </div>

      {/* Historial de Movimientos de Caja */}
      <div className="space-y-3">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Wallet className="size-4 text-violet-600" />
          Movimientos Registrados Hoy ({state.cashMovements.length})
        </h2>

        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Descripción / Concepto</TableHead>
                <TableHead>Medio de Pago</TableHead>
                <TableHead>Registrado por</TableHead>
                <TableHead className="text-right">Monto (S/)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.cashMovements.map((mov) => (
                <TableRow key={mov.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {mov.time}
                  </TableCell>
                  <TableCell>
                    {mov.type === "ingreso" ? (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-300">
                        + Ingreso
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        - Egreso
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs capitalize font-medium">
                    {mov.category.replace("_", " ")}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-foreground">
                    {mov.description}
                  </TableCell>
                  <TableCell className="text-xs uppercase font-mono">
                    {mov.paymentMethod}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {mov.registeredBy}
                  </TableCell>
                  <TableCell
                    className={`text-right font-bold tabular-nums text-sm ${
                      mov.type === "ingreso" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {mov.type === "ingreso" ? "+" : "-"}{mx(mov.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Emisión de Comprobantes para Órdenes */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-bold flex items-center gap-2">
          <FileText className="size-4 text-violet-600" />
          Emisión de Comprobantes de Venta (Boleta / Factura Electrónica)
        </h2>

        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Documento Cliente</TableHead>
                <TableHead>Total Orden</TableHead>
                <TableHead>Comprobante Emitido</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.orders.map((ord) => (
                <TableRow key={ord.id}>
                  <TableCell className="font-mono font-bold text-violet-600 text-xs">
                    {ord.ticketCode}
                  </TableCell>
                  <TableCell className="font-semibold text-xs">{ord.clientName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {ord.clientDoc || "Sin RUC/DNI"}
                  </TableCell>
                  <TableCell className="font-bold tabular-nums text-xs">{mx(ord.total)}</TableCell>
                  <TableCell>
                    {ord.invoiceNumber ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 font-mono text-xs">
                        {ord.invoiceType?.toUpperCase()}: {ord.invoiceNumber}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Pendiente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        issueInvoice(ord.id, "boleta")
                        setSelectedInvoiceOrder(ord)
                      }}
                    >
                      Boleta
                    </Button>
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => {
                        issueInvoice(ord.id, "factura")
                        setSelectedInvoiceOrder(ord)
                      }}
                    >
                      Factura
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal: Registrar Movimiento */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Movimiento de Caja Chica</DialogTitle>
              <DialogDescription>
                Registra ingresos extraordinarios o gastos/egresos del taller.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="mtype">Tipo de Movimiento</Label>
                  <select
                    id="mtype"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                  >
                    <option value="egreso">🔴 Egreso / Gasto</option>
                    <option value="ingreso">🟢 Ingreso Adicional</option>
                  </select>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="mcat">Categoría</Label>
                  <select
                    id="mcat"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                  >
                    <option value="compra_insumos">Compra de Hilos / Pelón</option>
                    <option value="pago_destajo">Pago de Destajo a Operario</option>
                    <option value="servicios_taller">Luz / Mantenimiento / Pasajes</option>
                    <option value="varios">Varios</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="mdesc">Descripción / Concepto *</Label>
                <Input
                  id="mdesc"
                  required
                  placeholder="Ej. Compra de 2 conos hilo dorado + lubricante de máquina"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="mamt">Monto (S/)</Label>
                  <Input
                    id="mamt"
                    type="number"
                    min="1"
                    step="0.5"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="mpaym">Medio de Pago</Label>
                  <select
                    id="mpaym"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                  >
                    <option value="efectivo">💵 Efectivo</option>
                    <option value="yape_plin">📱 Yape / Plin</option>
                    <option value="niubiz">💳 Tarjeta / Pasarela</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Guardar Movimiento</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

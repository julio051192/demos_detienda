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
import type { PaymentGatewayTransaction } from "@/lib/bordados-types"
import { CreditCard, QrCode, CheckCircle2, ShieldCheck, Zap, RefreshCw } from "lucide-react"

export default function PasarelaPagosBordadosPage() {
  const { state, ready, processGatewayPayment } = useBordadosStore()
  const mx = (n: number) => formatMoney(n)

  const activeOrders = state.orders.filter((o) => o.balance > 0)

  const [selectedOrderId, setSelectedOrderId] = useState(activeOrders[0]?.id || "")
  const [gateway, setGateway] = useState<PaymentGatewayTransaction["gateway"]>("mercadopago")
  const [payAmount, setPayAmount] = useState("")
  const [cardBrand, setCardBrand] = useState("VISA **** 4242")

  const [processing, setProcessing] = useState(false)
  const [successTx, setSuccessTx] = useState<PaymentGatewayTransaction | null>(null)

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando pasarela…</p>

  const currentOrder = state.orders.find((o) => o.id === selectedOrderId) ?? activeOrders[0]
  const amountToCharge = Number(payAmount) || (currentOrder ? currentOrder.balance : 50)

  function handleProcessPayment(e: React.FormEvent) {
    e.preventDefault()
    if (!currentOrder) return

    setProcessing(true)
    setTimeout(() => {
      processGatewayPayment({
        orderId: currentOrder.id,
        gateway,
        amount: amountToCharge,
        cardBrand,
      })

      const tx: PaymentGatewayTransaction = {
        id: "tmp",
        orderId: currentOrder.id,
        gateway,
        amount: amountToCharge,
        currency: "PEN",
        status: "approved",
        transactionRef: `${gateway.substring(0, 3).toUpperCase()}-${Math.floor(1000000 + Math.random() * 9000000)}`,
        cardBrand,
        createdAt: `${todayISO()} ${new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}`,
      }

      setProcessing(false)
      setSuccessTx(tx)
    }, 1200)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pasarela de Pagos & API POS Integrada</h1>
          <p className="text-sm text-muted-foreground">
            Integración interactiva con Niubiz, Culqi, Mercado Pago (QR Yape/Plin) y Stripe para cobros inmediatos.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Panel Izquierdo: Formularios de Pago API */}
        <Card className="lg:col-span-1 shadow-xs border-primary/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="size-4 text-primary" />
              Cobrar con Pasarela API / POS
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeOrders.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-6 text-center">
                No hay órdenes con saldo pendiente por cobrar.
              </p>
            ) : (
              <form onSubmit={handleProcessPayment} className="space-y-4">
                <div className="grid gap-1">
                  <Label htmlFor="gord">Seleccionar Orden de Bordado</Label>
                  <select
                    id="gord"
                    className="h-9 rounded-lg border border-input bg-background px-2 text-xs font-semibold"
                    value={currentOrder?.id}
                    onChange={(e) => {
                      setSelectedOrderId(e.target.value)
                      const ord = state.orders.find((o) => o.id === e.target.value)
                      if (ord) setPayAmount(ord.balance.toString())
                    }}
                  >
                    {activeOrders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.ticketCode} — {o.clientName} (Debe: {mx(o.balance)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selector de Pasarela API */}
                <div className="grid gap-1.5">
                  <Label className="text-xs">Seleccionar Pasarela / Servicio API</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setGateway("niubiz")
                        setCardBrand("VISA **** 4242")
                      }}
                      className={`rounded-lg border p-2 text-left text-xs transition-colors ${
                        gateway === "niubiz"
                          ? "bg-rose-100 text-rose-900 border-rose-400 font-bold dark:bg-rose-950 dark:text-rose-200"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      <p className="font-bold">🔴 Niubiz</p>
                      <p className="text-[10px] opacity-80">Visa Direct / POS</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setGateway("mercadopago")
                        setCardBrand("YAPE QR Dynamic")
                      }}
                      className={`rounded-lg border p-2 text-left text-xs transition-colors ${
                        gateway === "mercadopago"
                          ? "bg-amber-100 text-amber-900 border-amber-400 font-bold dark:bg-amber-950 dark:text-amber-200"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      <p className="font-bold">🟡 Mercado Pago</p>
                      <p className="text-[10px] opacity-80">QR Yape & Plin</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setGateway("culqi")
                        setCardBrand("Mastercard **** 8810")
                      }}
                      className={`rounded-lg border p-2 text-left text-xs transition-colors ${
                        gateway === "culqi"
                          ? "bg-blue-100 text-blue-900 border-blue-400 font-bold dark:bg-blue-950 dark:text-blue-200"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      <p className="font-bold">🔵 Culqi</p>
                      <p className="text-[10px] opacity-80">Pago en Soles API</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setGateway("stripe")
                        setCardBrand("Amex **** 1004")
                      }}
                      className={`rounded-lg border p-2 text-left text-xs transition-colors ${
                        gateway === "stripe"
                          ? "bg-purple-100 text-purple-900 border-purple-400 font-bold dark:bg-purple-950 dark:text-purple-200"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      <p className="font-bold">🟣 Stripe</p>
                      <p className="text-[10px] opacity-80">Internacional USD</p>
                    </button>
                  </div>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="gamt">Monto a Procesar (S/)</Label>
                  <Input
                    id="gamt"
                    type="number"
                    min="1"
                    max={currentOrder?.balance}
                    value={payAmount || currentOrder?.balance}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="font-bold"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold"
                >
                  {processing ? (
                    <>
                      <RefreshCw className="size-4 mr-2 animate-spin" />
                      Procesando con {gateway.toUpperCase()}…
                    </>
                  ) : (
                    <>
                      <Zap className="size-4 mr-2" />
                      Simular Cobro con {gateway.toUpperCase()}
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Panel Derecho: Vista del QR Dinámico y Log de Transacciones */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tarjeta de Código QR Yape / Plin / Pasarela */}
          <Card className="border-amber-300 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/10">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <QrCode className="size-4 text-amber-600" />
                  Código QR Dinámico Mercado Pago / Yape / Plin
                </CardTitle>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  Respuesta Inmediata API
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <div className="size-28 border-2 border-dashed border-amber-400 rounded-xl flex flex-col items-center justify-center bg-background p-2 text-center">
                <QrCode className="size-16 text-foreground" />
                <span className="text-[9px] font-mono font-bold text-muted-foreground mt-1">SCAN ME</span>
              </div>
              <div className="space-y-1 text-xs text-center sm:text-left">
                <p className="font-bold text-foreground">Escanea el QR desde la App de Yape o Plin</p>
                <p className="text-muted-foreground">
                  Monto dinámico asignado: <strong className="text-foreground">{mx(amountToCharge)}</strong>
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                  ✓ Token de webhook webhook_mp_live_8910 listo.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Historial de Transacciones de Pasarela */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="size-4 text-violet-600" />
              Historial de Transacciones Aprobadas ({state.gatewayTransactions.length})
            </h2>

            <div className="rounded-xl border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referencia API</TableHead>
                    <TableHead>Pasarela</TableHead>
                    <TableHead>Tarjeta / Método</TableHead>
                    <TableHead>Fecha / Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Monto (S/)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.gatewayTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs font-bold text-primary">
                        {tx.transactionRef}
                      </TableCell>
                      <TableCell className="font-bold text-xs uppercase">
                        {tx.gateway}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {tx.cardBrand}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {tx.createdAt}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-[10px]">
                          ✓ Approved
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold tabular-nums text-emerald-600">
                        {mx(tx.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Confirmación de Pago Exitoso */}
      {successTx && (
        <Dialog open={!!successTx} onOpenChange={() => setSuccessTx(null)}>
          <DialogContent className="sm:max-w-xs text-center font-mono text-xs">
            <DialogHeader>
              <div className="flex justify-center mb-1">
                <span className="size-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl">
                  ✓
                </span>
              </div>
              <DialogTitle className="text-center text-emerald-700">
                ¡Pago Aprobado por {successTx.gateway.toUpperCase()}!
              </DialogTitle>
              <DialogDescription className="text-center text-xs">
                Ref: {successTx.transactionRef}
              </DialogDescription>
            </DialogHeader>

            <div className="bg-muted/50 p-3 rounded-lg border text-left space-y-1 my-2">
              <p><strong>Monto Procesado:</strong> {mx(successTx.amount)}</p>
              <p><strong>Método:</strong> {successTx.cardBrand}</p>
              <p><strong>Fecha/Hora:</strong> {successTx.createdAt}</p>
              <p className="text-[10px] text-emerald-700 font-semibold pt-1 border-t">
                ✓ Saldo de orden actualizado e ingreso en caja chica registrado.
              </p>
            </div>

            <DialogFooter>
              <Button className="w-full" onClick={() => setSuccessTx(null)}>
                Aceptar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

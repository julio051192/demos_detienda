"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useLicoreriaStore } from "@/lib/licoreria-store"
import { formatMoney, todayISO } from "@/lib/money"
import type { SaleItem, LiquorProduct } from "@/lib/licoreria-types"
import {
  Scan,
  Trash2,
  Plus,
  Minus,
  Coins,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3,
  WifiOff,
  ShoppingCart,
  Search,
} from "lucide-react"

export default function LicoreriaPOSPage() {
  const { state, ready, stats, findByBarcode, registerSale, reset } = useLicoreriaStore()
  const mx = (n: number) => formatMoney(n)

  // --- Carrito de venta ---
  const [cart, setCart] = useState<SaleItem[]>([])
  const [barcodeInput, setBarcodeInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [lastScanned, setLastScanned] = useState<{ name: string; ok: boolean } | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "yape_plin" | "tarjeta">("efectivo")
  const [amountPaid, setAmountPaid] = useState("")
  const [showTicket, setShowTicket] = useState<typeof state.sales[0] | null>(null)
  const [showPayModal, setShowPayModal] = useState(false)

  const barcodeRef = useRef<HTMLInputElement>(null)

  // Mantener el foco en el campo de código de barras
  useEffect(() => {
    barcodeRef.current?.focus()
  }, [cart])

  const total = cart.reduce((sum, i) => sum + i.subtotal, 0)
  const change = Math.max(0, (Number(amountPaid) || 0) - total)

  const addToCart = useCallback((product: LiquorProduct, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, qty: i.qty + qty, subtotal: (i.qty + qty) * i.unitPrice }
            : i,
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          barcode: product.barcode,
          name: `${product.name}`,
          presentation: product.presentation,
          qty,
          unitPrice: product.salePrice,
          subtotal: qty * product.salePrice,
        },
      ]
    })
  }, [])

  function handleBarcodeEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return
    const code = barcodeInput.trim()
    if (!code) return

    const product = findByBarcode(code)
    if (product) {
      addToCart(product)
      setLastScanned({ name: `${product.name} (${product.presentation})`, ok: true })
    } else {
      setLastScanned({ name: code, ok: false })
    }

    setBarcodeInput("")
    setTimeout(() => setLastScanned(null), 2500)
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.productId !== productId) return i
          const newQty = i.qty + delta
          if (newQty <= 0) return null as unknown as SaleItem
          return { ...i, qty: newQty, subtotal: newQty * i.unitPrice }
        })
        .filter(Boolean),
    )
  }

  function removeItem(productId: string) {
    setCart((prev) => prev.filter((i) => i.productId !== productId))
  }

  function handleConfirmSale() {
    if (cart.length === 0) return
    const paid = paymentMethod === "efectivo" ? Number(amountPaid) || total : total
    registerSale({ items: cart, amountPaid: paid, paymentMethod })
    // Mostrar último ticket
    const latest = {
      id: "tmp",
      ticketCode: `#LC-${1000 + state.sales.length + 1}`,
      date: todayISO(),
      time: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
      items: cart,
      subtotal: total,
      total,
      amountPaid: paid,
      change: Math.max(0, paid - total),
      paymentMethod,
      cashierName: state.cashierName,
    }
    setShowTicket(latest as any)
    setCart([])
    setAmountPaid("")
    setShowPayModal(false)
    setTimeout(() => barcodeRef.current?.focus(), 100)
  }

  // Búsqueda de productos por nombre (para agregar sin escáner)
  const filteredProducts =
    searchQuery.length >= 2
      ? state.products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.barcode.includes(searchQuery),
        )
      : []

  if (!ready) return <p className="text-sm text-muted-foreground">Iniciando caja…</p>

  return (
    <div className="space-y-5">
      {/* Header POS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-200">
              <Scan className="size-3 text-purple-600" />
              POS — Caja Principal
            </Badge>
            <span className="text-xs text-muted-foreground">{todayISO()}</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight">Escáner de Código de Barras</h1>
          <p className="text-sm text-muted-foreground">
            Apunta el escáner al campo de código abajo o busca el producto por nombre.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={reset}>Restaurar datos</Button>
      </div>

      {/* KPIs del Día */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Ventas de Hoy</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600">
              {mx(stats.totalToday)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{stats.totalTransactions} transacciones · Efectivo: {mx(stats.efectivo)} · Digital: {mx(stats.digital)}</p>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Productos en Catálogo</p>
            <CardTitle className="text-2xl font-bold tabular-nums">{stats.totalProducts}</CardTitle>
            <p className="text-xs text-muted-foreground">Ítems registrados con código de barras</p>
          </CardHeader>
        </Card>
        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Alertas de Stock Bajo</p>
            <CardTitle className={`text-2xl font-bold tabular-nums ${stats.lowStock.length > 0 ? "text-rose-600" : "text-emerald-600"}`}>
              {stats.lowStock.length} productos
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {stats.lowStock.length > 0 ? stats.lowStock.map((p) => p.name).join(", ") : "Todo el stock es suficiente"}
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Área Principal: Escáner + Carrito */}
      <div className="grid gap-6 lg:grid-cols-5">

        {/* Izquierda: Escáner y búsqueda */}
        <div className="lg:col-span-2 space-y-4">
          {/* Campo Escáner */}
          <div className="rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/20">
                <Scan className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Campo de Escáner</p>
                <p className="text-xs text-muted-foreground">Apunta el lector o escribe el código y presiona Enter</p>
              </div>
            </div>

            <div className="relative">
              <Scan className="absolute left-3 top-2.5 size-4 text-primary" />
              <Input
                ref={barcodeRef}
                placeholder="Escanea o escribe el código de barras…"
                className="pl-10 font-mono text-sm border-primary/50 focus-visible:ring-primary"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeEnter}
                autoComplete="off"
              />
            </div>

            {/* Feedback del escáner */}
            {lastScanned && (
              <div
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${
                  lastScanned.ok
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                }`}
              >
                {lastScanned.ok ? (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                ) : (
                  <XCircle className="size-4 text-rose-600" />
                )}
                <span>
                  {lastScanned.ok
                    ? `✓ Agregado: ${lastScanned.name}`
                    : `✗ Código no encontrado: ${lastScanned.name}`}
                </span>
              </div>
            )}
          </div>

          {/* Búsqueda por nombre */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              O busca por nombre / marca
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Ej. Cristal, Whisky, Pisco..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredProducts.length > 0 && (
              <div className="rounded-xl border bg-card overflow-hidden divide-y max-h-72 overflow-y-auto">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-3 py-2 hover:bg-muted/40 cursor-pointer"
                    onClick={() => {
                      addToCart(p)
                      setSearchQuery("")
                      barcodeRef.current?.focus()
                    }}
                  >
                    <div>
                      <p className="text-xs font-semibold text-foreground">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {p.presentation} · Stock: {p.stock}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{mx(p.salePrice)}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{p.barcode}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Accesos rápidos a productos populares */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              Acceso Rápido (más vendidos)
            </Label>
            <div className="grid grid-cols-2 gap-1.5">
              {state.products.slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="rounded-lg border bg-card px-2.5 py-2 text-left text-xs hover:bg-muted/60 transition-colors"
                >
                  <p className="font-semibold text-foreground truncate">{p.name}</p>
                  <p className="text-muted-foreground">{p.presentation}</p>
                  <p className="font-bold text-primary mt-0.5">{mx(p.salePrice)}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Derecha: Carrito y pago */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base flex items-center gap-2">
              <ShoppingCart className="size-4 text-primary" />
              Ticket de Venta Actual
              {cart.length > 0 && (
                <Badge>{cart.length} ítem(s)</Badge>
              )}
            </h2>
            {cart.length > 0 && (
              <Button variant="ghost" size="xs" className="text-rose-600" onClick={() => setCart([])}>
                <Trash2 className="size-3.5 mr-1" />
                Vaciar
              </Button>
            )}
          </div>

          {/* Lista del carrito */}
          <div className="rounded-xl border bg-card overflow-hidden min-h-[200px]">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-14 text-muted-foreground">
                <Scan className="size-10 text-muted-foreground/40" />
                <p className="text-sm font-medium">El ticket está vacío</p>
                <p className="text-xs">Escanea un código de barras o haz clic en un producto de acceso rápido</p>
              </div>
            ) : (
              <div className="divide-y">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.presentation} · {mx(item.unitPrice)} c/u</p>
                      <p className="font-mono text-[10px] text-muted-foreground/60">{item.barcode}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        className="size-6 rounded-md border flex items-center justify-center hover:bg-muted"
                        onClick={() => updateQty(item.productId, -1)}
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        className="size-6 rounded-md border flex items-center justify-center hover:bg-muted"
                        onClick={() => updateQty(item.productId, 1)}
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>

                    <span className="w-16 text-right font-bold tabular-nums text-sm">
                      {mx(item.subtotal)}
                    </span>

                    <button
                      className="text-muted-foreground hover:text-rose-600 transition-colors"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total y botón de pago */}
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-muted-foreground">TOTAL A COBRAR:</span>
              <span className="text-3xl font-black tabular-nums text-foreground">
                {mx(total)}
              </span>
            </div>

            <Button
              className="w-full text-base font-bold h-12 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={cart.length === 0}
              onClick={() => setShowPayModal(true)}
            >
              <Coins className="size-5 mr-2" />
              Cobrar Venta
            </Button>
          </div>
        </div>
      </div>

      {/* Modal: Cobrar Venta */}
      <Dialog open={showPayModal} onOpenChange={setShowPayModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-700">
              <Coins className="size-5" />
              Cobrar Venta — {mx(total)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Forma de pago */}
            <div className="grid gap-1">
              <Label>Forma de Pago</Label>
              <div className="grid grid-cols-3 gap-2">
                {(["efectivo", "yape_plin", "tarjeta"] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`rounded-lg border p-2 text-xs font-semibold transition-colors ${
                      paymentMethod === method
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted"
                    }`}
                  >
                    {method === "efectivo" ? "💵 Efectivo" : method === "yape_plin" ? "📱 Yape/Plin" : "💳 Tarjeta"}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === "efectivo" && (
              <div className="space-y-2">
                <div className="grid gap-1">
                  <Label htmlFor="paid">Monto Recibido (S/)</Label>
                  <Input
                    id="paid"
                    type="number"
                    min={total}
                    step="5"
                    placeholder={`Mínimo ${mx(total)}`}
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="text-lg font-bold"
                    autoFocus
                  />
                </div>

                {Number(amountPaid) > 0 && (
                  <div className={`flex items-center justify-between rounded-lg border p-3 ${change > 0 ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-300"}`}>
                    <span className="text-sm font-medium">
                      {change >= 0 ? "💰 Vuelto / Cambio:" : "⚠️ Falta:"}
                    </span>
                    <span className={`font-black text-xl tabular-nums ${change >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      {mx(Math.abs(change))}
                    </span>
                  </div>
                )}
              </div>
            )}

            {paymentMethod !== "efectivo" && (
              <div className="rounded-lg border bg-muted/30 p-3 text-center text-sm text-muted-foreground">
                El cliente paga exacto por {paymentMethod === "yape_plin" ? "Yape / Plin" : "Tarjeta"}.
              </div>
            )}

            {/* Resumen */}
            <div className="rounded-lg border divide-y text-xs">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between px-3 py-1.5">
                  <span className="text-muted-foreground">{item.qty}x {item.name}</span>
                  <span className="font-medium">{mx(item.subtotal)}</span>
                </div>
              ))}
              <div className="flex justify-between px-3 py-2 font-bold text-sm">
                <span>TOTAL:</span>
                <span>{mx(total)}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayModal(false)}>Cancelar</Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              disabled={paymentMethod === "efectivo" && Number(amountPaid) < total}
              onClick={handleConfirmSale}
            >
              Confirmar Cobro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket de Venta */}
      {showTicket && (
        <Dialog open={!!showTicket} onOpenChange={() => setShowTicket(null)}>
          <DialogContent className="sm:max-w-xs font-mono text-xs">
            <div className="border border-dashed p-4 rounded-lg bg-card space-y-3">
              <div className="text-center border-b pb-2">
                <h3 className="font-black text-sm tracking-widest">🍾 LICORERÍA</h3>
                <p className="text-[10px] text-muted-foreground">RUC: 20567891234 · Jr. Unión 540</p>
                <p className="text-[11px] font-bold mt-0.5 text-primary">{showTicket.ticketCode}</p>
                <p className="text-[10px] text-muted-foreground">{showTicket.date} {showTicket.time} · Caj: {showTicket.cashierName}</p>
              </div>

              <div className="space-y-1">
                {showTicket.items.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="truncate max-w-[55%]">{item.qty}x {item.name}</span>
                    <span>{mx(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between font-bold text-sm">
                  <span>TOTAL:</span>
                  <span>{mx(showTicket.total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Pagado ({showTicket.paymentMethod === "efectivo" ? "Efectivo" : showTicket.paymentMethod === "yape_plin" ? "Yape/Plin" : "Tarjeta"}):</span>
                  <span>{mx(showTicket.amountPaid)}</span>
                </div>
                {showTicket.change > 0 && (
                  <div className="flex justify-between font-bold text-emerald-600">
                    <span>VUELTO:</span>
                    <span>{mx(showTicket.change)}</span>
                  </div>
                )}
              </div>

              <p className="text-[9px] text-center text-muted-foreground border-t pt-2">
                ¡Gracias por su compra! Prohibida la venta de bebidas alcohólicas a menores de 18 años.
              </p>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={() => setShowTicket(null)}>
                Nueva Venta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

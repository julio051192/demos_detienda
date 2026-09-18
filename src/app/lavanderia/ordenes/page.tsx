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
import {
  statusBadgeColor,
  statusLabel,
  useLavanderiaStore,
} from "@/lib/lavanderia-store"
import { formatMoney, todayISO } from "@/lib/money"
import type { LaundryOrder, OrderItem } from "@/lib/lavanderia-types"
import { PlusCircle, Printer, Search, Trash2 } from "lucide-react"

export default function OrdenesPage() {
  const { state, ready, createOrder } = useLavanderiaStore()
  const mx = (n: number) => formatMoney(n)

  const [openModal, setOpenModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<LaundryOrder | null>(null)
  const [search, setSearch] = useState("")

  // Form states
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [deliveryDate, setDeliveryDate] = useState(`${todayISO()} 19:00`)
  const [selectedServiceId, setSelectedServiceId] = useState(
    state.services[0]?.id ?? "",
  )
  const [itemQty, setItemQty] = useState("1")
  const [items, setItems] = useState<OrderItem[]>([])
  const [advance, setAdvance] = useState("0")
  const [notes, setNotes] = useState("")

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando órdenes…</p>
  }

  const currentService = state.services.find((s) => s.id === selectedServiceId)

  function addItem() {
    if (!currentService) return
    const q = Math.max(0.1, Number(itemQty) || 1)
    setItems((prev) => [
      ...prev,
      {
        serviceId: currentService.id,
        serviceName: currentService.name,
        qty: q,
        unitPrice: currentService.price,
      },
    ])
    setItemQty("1")
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const orderTotal = items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0)
  const advNum = Math.min(orderTotal, Math.max(0, Number(advance) || 0))
  const balanceNum = Math.max(0, orderTotal - advNum)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!customerName.trim() || items.length === 0) return

    createOrder({
      customerName,
      customerPhone,
      deliveryDate,
      items,
      advance: advNum,
      notes,
    })

    // Reset form
    setCustomerName("")
    setCustomerPhone("")
    setItems([])
    setAdvance("0")
    setNotes("")
    setOpenModal(false)
  }

  const filteredOrders = state.orders.filter(
    (o) =>
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.ticketCode.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search),
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recepción & Tickets</h1>
          <p className="text-sm text-muted-foreground">
            Ingreso de prendas por kilo o prenda, fecha prometida y adelantos.
          </p>
        </div>
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle className="mr-1.5 size-4" />
          Nueva Recepción (Ticket)
        </Button>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ticket, cliente o teléfono…"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de Órdenes */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha Recepción</TableHead>
              <TableHead>Entrega Estimada</TableHead>
              <TableHead>Ítems</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Saldo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ticket</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                  No se encontraron órdenes registradas.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-bold text-primary">{order.ticketCode}</TableCell>
                  <TableCell>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.deliveryDate}</TableCell>
                  <TableCell>
                    <span className="text-xs font-medium">
                      {order.items.length} servicio(s)
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold tabular-nums">{mx(order.total)}</TableCell>
                  <TableCell className="tabular-nums">
                    {order.balance > 0 ? (
                      <span className="text-amber-600 font-semibold">{mx(order.balance)}</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">Pagado</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusBadgeColor(
                        order.status,
                      )}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Printer className="size-3.5 mr-1" />
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal: Nueva Recepción */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Nueva Recepción de Ropa</DialogTitle>
              <DialogDescription>
                Registra los datos del cliente, servicios por kilo/unidad y adelanto.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="cname">Cliente *</Label>
                  <Input
                    id="cname"
                    required
                    placeholder="Ej. María Elena Quispe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="cphone">Teléfono / WhatsApp</Label>
                  <Input
                    id="cphone"
                    placeholder="Ej. 987 654 321"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="ddate">Fecha & Hora Estimada de Entrega</Label>
                <Input
                  id="ddate"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  placeholder="AAAA-MM-DD HH:MM"
                />
              </div>

              {/* Agregar ítems */}
              <div className="rounded-lg border p-3 bg-muted/20 space-y-2">
                <Label className="text-xs font-semibold text-foreground">
                  Agregar Servicio / Prenda
                </Label>
                <div className="grid grid-cols-[1fr_80px_auto] gap-2">
                  <select
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                  >
                    {state.services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({mx(s.price)} / {s.unitType})
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="Cant/Kg"
                    value={itemQty}
                    onChange={(e) => setItemQty(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Button type="button" size="sm" variant="secondary" onClick={addItem}>
                    + Añadir
                  </Button>
                </div>

                {/* Lista de ítems añadidos */}
                {items.length > 0 ? (
                  <div className="mt-2 space-y-1.5 border-t pt-2">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs bg-background p-1.5 rounded border"
                      >
                        <div>
                          <span className="font-medium">{item.serviceName}</span>
                          <span className="text-muted-foreground ml-1.5">
                            ({item.qty} × {mx(item.unitPrice)})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{mx(item.qty * item.unitPrice)}</span>
                          <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-destructive hover:opacity-80"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    Añade al menos un servicio por kilo o prenda.
                  </p>
                )}
              </div>

              {/* Totales y Adelanto */}
              <div className="rounded-lg border p-3 bg-muted/40 space-y-2 text-xs">
                <div className="flex justify-between font-semibold text-sm">
                  <span>Total Servicio:</span>
                  <span className="text-primary font-bold">{mx(orderTotal)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 items-center pt-1 border-t">
                  <div>
                    <Label htmlFor="adv" className="text-xs">
                      Adelanto recibido (S/)
                    </Label>
                    <Input
                      id="adv"
                      type="number"
                      min="0"
                      max={orderTotal}
                      step="0.5"
                      value={advance}
                      onChange={(e) => setAdvance(e.target.value)}
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Saldo pendiente:</p>
                    <p className="text-sm font-bold text-amber-600">{mx(balanceNum)}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="notes">Observaciones (manchas, prendas delicadas, etc.)</Label>
                <Input
                  id="notes"
                  placeholder="Ej. Blusa de seda separar, aroma lavanda..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={items.length === 0 || !customerName.trim()}>
                Emitir Ticket y Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Vista de Ticket Térmico Imprimible */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-sm font-mono text-xs">
            <div className="border border-dashed p-4 rounded-lg bg-card space-y-3">
              <div className="text-center border-b pb-2">
                <h3 className="font-bold text-sm tracking-wider">LAVANDERÍA & TINTORERÍA</h3>
                <p className="text-[10px] text-muted-foreground">RUC: 20601234567 · Av. Principal 450</p>
                <p className="text-[11px] font-bold mt-1 text-primary">
                  TICKET: {selectedOrder.ticketCode}
                </p>
              </div>

              <div className="space-y-0.5 text-[11px]">
                <p><strong>Cliente:</strong> {selectedOrder.customerName}</p>
                <p><strong>Teléfono:</strong> {selectedOrder.customerPhone || "—"}</p>
                <p><strong>Fecha Ingreso:</strong> {selectedOrder.date}</p>
                <p className="text-primary font-semibold">
                  <strong>Entrega:</strong> {selectedOrder.deliveryDate}
                </p>
              </div>

              <div className="border-t border-b py-2 space-y-1">
                <p className="font-bold text-[10px] uppercase text-muted-foreground">Detalle:</p>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {it.serviceName} ({it.qty})
                    </span>
                    <span className="font-semibold">{mx(it.qty * it.unitPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between font-bold text-xs">
                  <span>TOTAL:</span>
                  <span>{mx(selectedOrder.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Adelanto (a cuenta):</span>
                  <span>{mx(selectedOrder.advance)}</span>
                </div>
                <div className="flex justify-between font-bold text-amber-600">
                  <span>SALDO A PAGAR:</span>
                  <span>{mx(selectedOrder.balance)}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <p className="text-[10px] italic border-t pt-1 text-muted-foreground">
                  Obs: {selectedOrder.notes}
                </p>
              )}

              <p className="text-[9px] text-center text-muted-foreground pt-1 border-t">
                Presentar este ticket para el recojo de sus prendas. Gracias por su preferencia.
              </p>
            </div>
            <DialogFooter>
              <Button size="sm" className="w-full" onClick={() => setSelectedOrder(null)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

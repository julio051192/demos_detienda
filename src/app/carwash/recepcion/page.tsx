"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
  carWashStatusBadge,
  carWashStatusLabel,
  useCarWashStore,
  vehicleTypeLabel,
} from "@/lib/carwash-store"
import { formatMoney } from "@/lib/money"
import type {
  PaymentMethod,
  VehicleTicket,
  VehicleType,
} from "@/lib/carwash-types"
import { PlusCircle, Printer, Search, Car } from "lucide-react"

export default function RecepcionPage() {
  const { state, ready, createTicket, updateTicketStatus, markTicketPaid } =
    useCarWashStore()
  const mx = (n: number) => formatMoney(n)

  const [openModal, setOpenModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<VehicleTicket | null>(null)
  const [search, setSearch] = useState("")

  // Form states
  const [plate, setPlate] = useState("")
  const [vehicleType, setVehicleType] = useState<VehicleType>("auto")
  const [brandModel, setBrandModel] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [bay, setBay] = useState("Bahía 1")
  const [washerId, setWasherId] = useState(state.washers[0]?.id ?? "")
  const [selectedServiceId, setSelectedServiceId] = useState(
    state.services[0]?.id ?? "",
  )
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo")
  const [isPaid, setIsPaid] = useState(true)
  const [notes, setNotes] = useState("")

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando recepción…</p>
  }

  // Filter services by vehicle type if possible, or all
  const filteredServices = state.services.filter(
    (s) => s.vehicleType === vehicleType,
  )
  const availableServices =
    filteredServices.length > 0 ? filteredServices : state.services

  const currentService =
    state.services.find((s) => s.id === selectedServiceId) ??
    availableServices[0]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!plate.trim() || !brandModel.trim()) return

    createTicket({
      plate: plate.trim().toUpperCase(),
      vehicleType,
      brandModel: brandModel.trim(),
      customerName: customerName.trim() || "Cliente Mostrador",
      customerPhone: customerPhone.trim(),
      bay,
      washerId: washerId || state.washers[0]?.id,
      serviceId: currentService ? currentService.id : state.services[0].id,
      paymentMethod,
      isPaid,
      notes: notes.trim(),
    })

    // Reset
    setPlate("")
    setBrandModel("")
    setCustomerName("")
    setCustomerPhone("")
    setNotes("")
    setOpenModal(false)
  }

  const filteredTickets = state.tickets.filter(
    (t) =>
      t.plate.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketCode.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      t.brandModel.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Recepción & Ingreso de Vehículos</h1>
          <p className="text-sm text-muted-foreground">
            Registro rápido por número de placa, asignación de bahía y emisión de ticket.
          </p>
        </div>
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle className="mr-1.5 size-4" />
          Ingresar Vehículo (Ticket)
        </Button>
      </div>

      {/* Buscador de placa */}
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por placa (ej. ABC-123) o ticket…"
            className="pl-8 uppercase"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de Tickets de Pista */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Placa & Vehículo</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Bahía / Box</TableHead>
              <TableHead>Lavador Asignado</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                  No se encontraron vehículos registrados en la pista.
                </TableCell>
              </TableRow>
            ) : (
              filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-bold text-primary">{ticket.ticketCode}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs bg-amber-300 text-slate-950 px-1.5 py-0.5 rounded border border-amber-400">
                        {ticket.plate}
                      </span>
                      <div>
                        <p className="font-medium text-xs">{ticket.brandModel}</p>
                        <p className="text-[11px] text-muted-foreground">{vehicleTypeLabel(ticket.vehicleType)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-xs">{ticket.serviceName}</p>
                    <p className="text-[11px] text-muted-foreground">Hora: {ticket.entryTime}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{ticket.bay}</Badge>
                  </TableCell>
                  <TableCell className="text-xs font-semibold">{ticket.washerName}</TableCell>
                  <TableCell className="font-bold tabular-nums text-sm">{mx(ticket.price)}</TableCell>
                  <TableCell>
                    {ticket.isPaid ? (
                      <span className="text-xs font-semibold text-emerald-600">
                        Pagado ({ticket.paymentMethod === "yape_plin" ? "Yape" : ticket.paymentMethod})
                      </span>
                    ) : (
                      <Button
                        size="xs"
                        variant="destructive"
                        onClick={() => markTicketPaid(ticket.id, "efectivo")}
                      >
                        Cobrar {mx(ticket.price)}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${carWashStatusBadge(
                        ticket.status,
                      )}`}
                    >
                      {carWashStatusLabel(ticket.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <Printer className="size-3.5 mr-1" />
                      Ticket
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal: Ingreso de Vehículo */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Car className="size-5 text-primary" />
                Ingreso Rápido de Vehículo
              </DialogTitle>
              <DialogDescription>
                Ingresa la placa, tipo de vehículo y asigna bahía y lavador.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="cplate">Placa del Vehículo *</Label>
                  <Input
                    id="cplate"
                    required
                    placeholder="Ej. B8M-492 o 4512-4C"
                    className="uppercase font-mono font-bold text-sm tracking-wider"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="ctype">Tipo de Vehículo</Label>
                  <select
                    id="ctype"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={vehicleType}
                    onChange={(e) => {
                      const newType = e.target.value as VehicleType
                      setVehicleType(newType)
                      const match = state.services.find((s) => s.vehicleType === newType)
                      if (match) setSelectedServiceId(match.id)
                    }}
                  >
                    <option value="auto">🚗 Auto / Sedán</option>
                    <option value="suv">🚙 SUV / Camioneta</option>
                    <option value="moto">🏍️ Moto / Lineal</option>
                    <option value="minivan">🚐 Minivan / Combi</option>
                    <option value="camion">🚚 Camión / Furgón</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="cbrand">Marca y Modelo *</Label>
                  <Input
                    id="cbrand"
                    required
                    placeholder="Ej. Toyota Yaris (Gris)"
                    value={brandModel}
                    onChange={(e) => setBrandModel(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="cphone">Teléfono / WhatsApp</Label>
                  <Input
                    id="cphone"
                    placeholder="Ej. 987 120 445"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Selección de Servicio */}
              <div className="rounded-lg border p-3 bg-muted/20 space-y-2">
                <Label className="text-xs font-semibold text-foreground">
                  Servicio de Lavado
                </Label>
                <select
                  className="w-full h-8 rounded-lg border border-input bg-background px-2 text-xs"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                >
                  {availableServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {mx(s.price)} ({s.estimatedMinutes} min)
                    </option>
                  ))}
                </select>
              </div>

              {/* Asignación de Bahía y Lavador */}
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="cbay">Bahía / Box Asignado</Label>
                  <select
                    id="cbay"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={bay}
                    onChange={(e) => setBay(e.target.value)}
                  >
                    <option value="Bahía 1">Bahía 1 (Lavado)</option>
                    <option value="Bahía 2">Bahía 2 (Lavado)</option>
                    <option value="Bahía 3">Bahía 3 (Lavado)</option>
                    <option value="Zona Secado">Zona Secado & Aspirado</option>
                    <option value="Pista Express">Pista Express</option>
                  </select>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="cwasher">Lavador / Operario</Label>
                  <select
                    id="cwasher"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={washerId}
                    onChange={(e) => setWasherId(e.target.value)}
                  >
                    {state.washers.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Método de Pago */}
              <div className="grid grid-cols-2 gap-3 rounded-lg border p-3 bg-muted/40 items-center">
                <div className="grid gap-1">
                  <Label htmlFor="cpay">Método de Pago</Label>
                  <select
                    id="cpay"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  >
                    <option value="efectivo">💵 Efectivo</option>
                    <option value="yape_plin">📱 Yape / Plin</option>
                    <option value="tarjeta">💳 Tarjeta (POS)</option>
                  </select>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total a Cobrar:</p>
                  <p className="text-lg font-bold text-primary">
                    {mx(currentService?.price || 20.0)}
                  </p>
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="cnotes">Observaciones (rayaduras previas, objetos de valor, etc.)</Label>
                <Input
                  id="cnotes"
                  placeholder="Ej. Raspones en parachoques delantero..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={!plate.trim() || !brandModel.trim()}>
                Ingresar a Pista y Emitir Ticket
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Ticket Térmico Imprimible */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-sm font-mono text-xs">
            <div className="border border-dashed p-4 rounded-lg bg-card space-y-3">
              <div className="text-center border-b pb-2">
                <h3 className="font-bold text-sm tracking-wider">CAR WASH & AUTOLAVADO</h3>
                <p className="text-[10px] text-muted-foreground">Av. Los Próceres 890 · RUC: 20609876543</p>
                <p className="text-[11px] font-bold mt-1 text-primary">
                  TICKET: {selectedTicket.ticketCode}
                </p>
              </div>

              <div className="text-center py-1 bg-amber-100 dark:bg-amber-950 rounded border">
                <span className="font-mono font-black text-lg tracking-widest text-slate-950 dark:text-amber-200">
                  {selectedTicket.plate}
                </span>
                <p className="text-[10px] text-muted-foreground">{selectedTicket.brandModel}</p>
              </div>

              <div className="space-y-0.5 text-[11px]">
                <p><strong>Hora Ingreso:</strong> {selectedTicket.entryTime}</p>
                <p><strong>Bahía:</strong> {selectedTicket.bay}</p>
                <p><strong>Lavador:</strong> {selectedTicket.washerName}</p>
                <p><strong>Cliente:</strong> {selectedTicket.customerName || "Mostrador"}</p>
              </div>

              <div className="border-t border-b py-2 space-y-1">
                <p className="font-bold text-[10px] uppercase text-muted-foreground">Servicio Contratado:</p>
                <div className="flex justify-between font-semibold">
                  <span>{selectedTicket.serviceName}</span>
                  <span>{mx(selectedTicket.price)}</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between font-bold text-xs">
                  <span>TOTAL COBRADO:</span>
                  <span className="text-emerald-600">{mx(selectedTicket.price)}</span>
                </div>
                <div className="flex justify-between capitalize">
                  <span>Forma de Pago:</span>
                  <span>{selectedTicket.paymentMethod === "yape_plin" ? "Yape / Plin" : selectedTicket.paymentMethod}</span>
                </div>
              </div>

              {selectedTicket.notes && (
                <p className="text-[10px] italic border-t pt-1 text-muted-foreground">
                  Obs: {selectedTicket.notes}
                </p>
              )}

              <p className="text-[9px] text-center text-muted-foreground pt-1 border-t">
                No nos responsabilizamos por objetos de valor no declarados. Gracias por su visita.
              </p>
            </div>
            <DialogFooter>
              <Button size="sm" className="w-full" onClick={() => setSelectedTicket(null)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
import { useHotelStore, roomTypeLabel } from "@/lib/hotel-store"
import { formatMoney, todayISO, addDays } from "@/lib/money"
import type { GuestStay, PaymentMethod, StayMode } from "@/lib/hotel-types"
import { PlusCircle, Printer, Search, LogIn, UserCheck } from "lucide-react"

export default function CheckinPage() {
  const { state, ready, checkInGuest } = useHotelStore()
  const searchParams = useSearchParams()
  const mx = (n: number) => formatMoney(n)

  const [openModal, setOpenModal] = useState(false)
  const [selectedStay, setSelectedStay] = useState<GuestStay | null>(null)
  const [search, setSearch] = useState("")

  // Available rooms for Check-in
  const availableRooms = state.rooms.filter((r) => r.status === "available")

  // Form states
  const [roomId, setRoomId] = useState(availableRooms[0]?.id ?? "")
  const [guestName, setGuestName] = useState("")
  const [docType, setDocType] = useState<"DNI" | "Pasaporte" | "CE">("DNI")
  const [docNumber, setDocNumber] = useState("")
  const [phone, setPhone] = useState("")
  const [originCity, setOriginCity] = useState("Lima")
  const [mode, setMode] = useState<StayMode>("night")
  const [duration, setDuration] = useState("1")
  const [advance, setAdvance] = useState("0")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("efectivo")
  const [notes, setNotes] = useState("")

  // Check if room preselected via query param (e.g. ?room=rm-102)
  useEffect(() => {
    const preselected = searchParams.get("room")
    if (preselected) {
      setRoomId(preselected)
      setOpenModal(true)
    }
  }, [searchParams])

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando check-in…</p>
  }

  const selectedRoom = state.rooms.find((r) => r.id === roomId) ?? availableRooms[0]
  const rate = mode === "night" ? selectedRoom?.priceNight || 60 : selectedRoom?.priceHour || 25
  const durNum = Math.max(1, Number(duration) || 1)
  const totalRoom = rate * durNum
  const advNum = Math.min(totalRoom, Math.max(0, Number(advance) || 0))
  const balanceNum = Math.max(0, totalRoom - advNum)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!guestName.trim() || !docNumber.trim() || !selectedRoom) return

    const today = todayISO()
    const checkOutExpected =
      mode === "night"
        ? `${addDays(today, durNum)} 12:00`
        : `${today} ${new Date(Date.now() + durNum * 3600000).getHours().toString().padStart(2, "0")}:00`

    checkInGuest({
      roomId: selectedRoom.id,
      guestName: guestName.trim(),
      docType,
      docNumber: docNumber.trim(),
      phone: phone.trim(),
      originCity: originCity.trim(),
      checkOutExpected,
      mode,
      duration: durNum,
      rate,
      advance: advNum,
      paymentMethod,
      notes: notes.trim(),
    })

    // Reset
    setGuestName("")
    setDocNumber("")
    setPhone("")
    setNotes("")
    setOpenModal(false)
  }

  const activeStays = state.stays.filter((st) => st.status === "active")
  const filteredStays = activeStays.filter(
    (st) =>
      st.guestName.toLowerCase().includes(search.toLowerCase()) ||
      st.docNumber.includes(search) ||
      st.roomNumber.includes(search) ||
      st.ticketCode.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Check-in (Registro de Huéspedes)</h1>
          <p className="text-sm text-muted-foreground">
            Ingreso con DNI, asignación de habitación, modalidad por noche o por horas.
          </p>
        </div>
        <Button onClick={() => setOpenModal(true)} disabled={availableRooms.length === 0}>
          <PlusCircle className="mr-1.5 size-4" />
          Registrar Check-in
        </Button>
      </div>

      {/* Buscador de Huésped */}
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por DNI, nombre o habitación…"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de Estancias Activas */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ficha</TableHead>
              <TableHead>Habitación</TableHead>
              <TableHead>Huésped / Titular</TableHead>
              <TableHead>Doc. Identidad</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Salida Prevista</TableHead>
              <TableHead>Total Estancia</TableHead>
              <TableHead>Saldo Pendiente</TableHead>
              <TableHead className="text-right">Ticket</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStays.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                  No hay huéspedes activos en este momento.
                </TableCell>
              </TableRow>
            ) : (
              filteredStays.map((stay) => (
                <TableRow key={stay.id}>
                  <TableCell className="font-bold text-primary">{stay.ticketCode}</TableCell>
                  <TableCell>
                    <span className="font-mono font-black text-sm bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Hab. {stay.roomNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-xs text-foreground">{stay.guestName}</p>
                    <p className="text-[11px] text-muted-foreground">{stay.phone || "Sin tel."} · {stay.originCity}</p>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {stay.docType}: {stay.docNumber}
                  </TableCell>
                  <TableCell className="text-xs">{stay.checkIn}</TableCell>
                  <TableCell className="text-xs font-medium text-primary">{stay.checkOutExpected}</TableCell>
                  <TableCell className="font-bold tabular-nums text-xs">{mx(stay.total)}</TableCell>
                  <TableCell className="tabular-nums">
                    {stay.balance > 0 ? (
                      <span className="text-rose-600 font-bold text-xs">{mx(stay.balance)}</span>
                    ) : (
                      <span className="text-emerald-600 font-bold text-xs">Pagado</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setSelectedStay(stay)}
                    >
                      <Printer className="size-3.5 mr-1" />
                      Ficha
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal: Nuevo Check-in */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="size-5 text-primary" />
                Ficha de Registro / Check-in
              </DialogTitle>
              <DialogDescription>
                Ingresa los datos del huésped y selecciona la habitación disponible.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="hname">Nombre del Huésped *</Label>
                  <Input
                    id="hname"
                    required
                    placeholder="Ej. Carlos Benites Mendoza"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="hdocT">Tipo</Label>
                    <select
                      id="hdocT"
                      className="h-8 rounded-lg border border-input bg-background px-1.5 text-xs"
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                    >
                      <option value="DNI">DNI</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="CE">C. Extranjería</option>
                    </select>
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="hdocN">N° Doc *</Label>
                    <Input
                      id="hdocN"
                      required
                      placeholder="8 dígitos"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="hphone">Teléfono / Celular</Label>
                  <Input
                    id="hphone"
                    placeholder="Ej. 987 654 321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="hcity">Ciudad de Origen</Label>
                  <Input
                    id="hcity"
                    placeholder="Ej. Arequipa, Lima, Cusco..."
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                  />
                </div>
              </div>

              {/* Selección de Habitación y Modalidad */}
              <div className="rounded-lg border p-3 bg-muted/20 space-y-3">
                <div className="grid gap-1">
                  <Label htmlFor="hroom">Habitación Disponible</Label>
                  <select
                    id="hroom"
                    className="w-full h-8 rounded-lg border border-input bg-background px-2 text-xs font-semibold"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                  >
                    {availableRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Hab. {r.number} — {roomTypeLabel(r.type)} (Noche: {mx(r.priceNight)} | Rato: {mx(r.priceHour)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1">
                    <Label htmlFor="hmode">Modalidad de Alquiler</Label>
                    <select
                      id="hmode"
                      className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                      value={mode}
                      onChange={(e) => setMode(e.target.value as StayMode)}
                    >
                      <option value="night">🌙 Por Noche(s)</option>
                      <option value="hours">⏱️ Por Horas / Rato</option>
                    </select>
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="hdur">
                      {mode === "night" ? "N° de Noches" : "N° de Horas"}
                    </Label>
                    <Input
                      id="hdur"
                      type="number"
                      min="1"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Pago y Adelanto */}
              <div className="grid grid-cols-2 gap-3 rounded-lg border p-3 bg-muted/40 items-center">
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="hpaym">Forma de Pago</Label>
                    <select
                      id="hpaym"
                      className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    >
                      <option value="efectivo">💵 Efectivo</option>
                      <option value="yape_plin">📱 Yape / Plin</option>
                      <option value="tarjeta">💳 Tarjeta</option>
                    </select>
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="hadv">Adelanto Recibido (S/)</Label>
                    <Input
                      id="hadv"
                      type="number"
                      min="0"
                      max={totalRoom}
                      step="5"
                      value={advance}
                      onChange={(e) => setAdvance(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-xs text-muted-foreground">Total Habitación:</p>
                  <p className="text-base font-bold">{mx(totalRoom)}</p>
                  <p className="text-xs text-muted-foreground">Saldo Pendiente:</p>
                  <p className="text-sm font-bold text-rose-600">{mx(balanceNum)}</p>
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="hnotes">Observaciones / Pedidos especiales</Label>
                <Input
                  id="hnotes"
                  placeholder="Ej. Cama adicional, no molestar por la mañana..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={!guestName.trim() || !docNumber.trim() || !selectedRoom}>
                Realizar Check-in y Abrir Habitación
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Ficha de Registro Imprimible */}
      {selectedStay && (
        <Dialog open={!!selectedStay} onOpenChange={() => setSelectedStay(null)}>
          <DialogContent className="sm:max-w-sm font-mono text-xs">
            <div className="border border-dashed p-4 rounded-lg bg-card space-y-3">
              <div className="text-center border-b pb-2">
                <h3 className="font-bold text-sm tracking-wider">HOTEL & HOSPEDAJE</h3>
                <p className="text-[10px] text-muted-foreground">RUC: 20556677889 · Calle El Sol 320</p>
                <p className="text-[11px] font-bold mt-1 text-primary">
                  FICHA DE HOSPEDAJE: {selectedStay.ticketCode}
                </p>
              </div>

              <div className="text-center py-1.5 bg-primary/10 rounded border">
                <span className="font-mono font-black text-xl text-primary">
                  HABITACIÓN {selectedStay.roomNumber}
                </span>
                <p className="text-[10px] text-muted-foreground capitalize">
                  Modalidad: {selectedStay.mode === "night" ? `${selectedStay.duration} Noche(s)` : `${selectedStay.duration} Horas`}
                </p>
              </div>

              <div className="space-y-0.5 text-[11px]">
                <p><strong>Huésped:</strong> {selectedStay.guestName}</p>
                <p><strong>Documento:</strong> {selectedStay.docType} {selectedStay.docNumber}</p>
                <p><strong>Origen:</strong> {selectedStay.originCity || "—"}</p>
                <p><strong>Ingreso:</strong> {selectedStay.checkIn}</p>
                <p className="text-primary font-semibold">
                  <strong>Salida Prevista:</strong> {selectedStay.checkOutExpected}
                </p>
              </div>

              <div className="border-t border-b py-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Hospedaje:</span>
                  <span>{mx(selectedStay.totalRoom)}</span>
                </div>
                {selectedStay.charges.length > 0 && (
                  <div className="flex justify-between">
                    <span>Consumos frigobar:</span>
                    <span>{mx(selectedStay.totalCharges)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xs pt-1 border-t">
                  <span>TOTAL CUENTA:</span>
                  <span>{mx(selectedStay.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Adelanto pagado:</span>
                  <span>{mx(selectedStay.advance)}</span>
                </div>
                <div className="flex justify-between font-bold text-rose-600">
                  <span>SALDO A PAGAR AL SALIR:</span>
                  <span>{mx(selectedStay.balance)}</span>
                </div>
              </div>

              {selectedStay.notes && (
                <p className="text-[10px] italic text-muted-foreground">
                  Obs: {selectedStay.notes}
                </p>
              )}

              <p className="text-[9px] text-center text-muted-foreground pt-1 border-t">
                Hora límite de Check-out: 12:00 PM. Entregar llave en recepción al salir.
              </p>
            </div>
            <DialogFooter>
              <Button size="sm" className="w-full" onClick={() => setSelectedStay(null)}>
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

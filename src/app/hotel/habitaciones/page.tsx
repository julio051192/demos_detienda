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
import { useHotelStore, roomTypeLabel, roomStatusLabel, roomStatusBadge } from "@/lib/hotel-store"
import { formatMoney } from "@/lib/money"
import type { RoomType } from "@/lib/hotel-types"
import { PlusCircle, BedDouble, Wrench, Sparkles } from "lucide-react"

export default function HabitacionesPage() {
  const { state, ready, addRoom, setRoomStatus } = useHotelStore()
  const mx = (n: number) => formatMoney(n)

  const [openModal, setOpenModal] = useState(false)
  const [number, setNumber] = useState("")
  const [floor, setFloor] = useState("1")
  const [type, setType] = useState<RoomType>("matrimonial")
  const [priceNight, setPriceNight] = useState("80")
  const [priceHour, setPriceHour] = useState("30")

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando habitaciones…</p>
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!number.trim()) return

    addRoom({
      number: number.trim(),
      floor: Number(floor) || 1,
      type,
      priceNight: Number(priceNight) || 60,
      priceHour: Number(priceHour) || 25,
    })

    setNumber("")
    setOpenModal(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tarifario & Gestión de Habitaciones</h1>
          <p className="text-sm text-muted-foreground">
            Precios por noche y por horas para cada tipo de habitación. Cambia el estado de cuartos directamente.
          </p>
        </div>
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle className="mr-1.5 size-4" />
          Nueva Habitación
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Habitación</TableHead>
              <TableHead>Piso</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio x Noche</TableHead>
              <TableHead>Precio x Horas / Rato</TableHead>
              <TableHead>Estado Actual</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>
                  <span className="font-mono font-black text-base text-foreground">
                    Hab. {room.number}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  Piso {room.floor}
                </TableCell>
                <TableCell>{roomTypeLabel(room.type)}</TableCell>
                <TableCell className="font-bold tabular-nums text-emerald-600">
                  {mx(room.priceNight)}
                </TableCell>
                <TableCell className="font-bold tabular-nums text-primary">
                  {mx(room.priceHour)}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${roomStatusBadge(room.status)}`}
                  >
                    {roomStatusLabel(room.status)}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-1.5">
                  {room.status === "cleaning" && (
                    <Button
                      variant="secondary"
                      size="xs"
                      className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      onClick={() => setRoomStatus(room.id, "available")}
                    >
                      <Sparkles className="size-3 mr-1" />
                      Liberar
                    </Button>
                  )}
                  {room.status === "available" && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setRoomStatus(room.id, "maintenance")}
                    >
                      <Wrench className="size-3 mr-1" />
                      Mantenimiento
                    </Button>
                  )}
                  {room.status === "maintenance" && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setRoomStatus(room.id, "available")}
                    >
                      Habilitar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal: Crear Habitación */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BedDouble className="size-5 text-primary" />
                Registrar Nueva Habitación
              </DialogTitle>
              <DialogDescription>
                Añade el número, piso, categoría y tarifas de la nueva habitación.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="rnum">Número de Habitación *</Label>
                  <Input
                    id="rnum"
                    required
                    placeholder="Ej. 204, 305..."
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="rfloor">Piso</Label>
                  <Input
                    id="rfloor"
                    type="number"
                    min="1"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="rtype">Categoría de Habitación</Label>
                <select
                  id="rtype"
                  className="h-8 w-full rounded-lg border border-input bg-background px-2 text-xs"
                  value={type}
                  onChange={(e) => setType(e.target.value as RoomType)}
                >
                  <option value="simple">🛏️ Simple (1 Plaza)</option>
                  <option value="matrimonial">🛏️ Matrimonial (2 Plazas)</option>
                  <option value="doble">🛏️ Doble Twin (2 Camas)</option>
                  <option value="suite">👑 Suite Ejecutiva</option>
                  <option value="jacuzzi">🛁 Suite con Jacuzzi</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="rpnight">Precio x Noche (S/)</Label>
                  <Input
                    id="rpnight"
                    type="number"
                    min="0"
                    step="5"
                    value={priceNight}
                    onChange={(e) => setPriceNight(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="rphour">Precio x Horas (S/)</Label>
                  <Input
                    id="rphour"
                    type="number"
                    min="0"
                    step="5"
                    value={priceHour}
                    onChange={(e) => setPriceHour(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Guardar Habitación</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

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
import { useCarWashStore, vehicleTypeLabel } from "@/lib/carwash-store"
import { formatMoney } from "@/lib/money"
import type { VehicleType } from "@/lib/carwash-types"
import { PlusCircle, Tag, Clock, Coins } from "lucide-react"

export default function CarWashServiciosPage() {
  const { state, ready, addService } = useCarWashStore()
  const mx = (n: number) => formatMoney(n)

  const [openModal, setOpenModal] = useState(false)
  const [name, setName] = useState("")
  const [vehicleType, setVehicleType] = useState<VehicleType>("auto")
  const [price, setPrice] = useState("25")
  const [estimatedMinutes, setEstimatedMinutes] = useState("35")
  const [commission, setCommission] = useState("8")

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando tarifario…</p>
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    addService({
      name: name.trim(),
      vehicleType,
      price: Number(price) || 0,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      commission: Number(commission) || 0,
    })

    setName("")
    setPrice("25")
    setEstimatedMinutes("35")
    setCommission("8")
    setOpenModal(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tarifario de Car Wash</h1>
          <p className="text-sm text-muted-foreground">
            Precios configurados por tipo de vehículo (Autos, SUVs, Motos) y comisiones de lavado.
          </p>
        </div>
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle className="mr-1.5 size-4" />
          Nuevo Servicio de Lavado
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Servicio</TableHead>
              <TableHead>Tipo de Vehículo</TableHead>
              <TableHead>Tiempo Estimado</TableHead>
              <TableHead>Comisión Operario</TableHead>
              <TableHead className="text-right">Precio al Público</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.services.map((srv) => (
              <TableRow key={srv.id}>
                <TableCell className="font-semibold text-foreground">
                  <div className="flex items-center gap-2">
                    <Tag className="size-4 text-primary" />
                    <span>{srv.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{vehicleTypeLabel(srv.vehicleType)}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    <span>{srv.estimatedMinutes} min</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold tabular-nums text-purple-600">
                  {mx(srv.commission)}
                </TableCell>
                <TableCell className="text-right font-bold text-base tabular-nums text-emerald-600">
                  {mx(srv.price)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal: Crear Servicio */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Añadir Servicio de Lavado</DialogTitle>
              <DialogDescription>
                Ingresa el nombre, el tipo de vehículo, precio y la comisión para el lavador.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label htmlFor="srvname">Nombre del Servicio *</Label>
                <Input
                  id="srvname"
                  required
                  placeholder="Ej. Lavado de Chasis y Pulverizado con Grafito"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="srvtype">Tipo de Vehículo</Label>
                <select
                  id="srvtype"
                  className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                >
                  <option value="auto">🚗 Auto / Sedán</option>
                  <option value="suv">🚙 SUV / Camioneta</option>
                  <option value="moto">🏍️ Moto / Lineal</option>
                  <option value="minivan">🚐 Minivan / Combi</option>
                  <option value="camion">🚚 Camión / Furgón</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="srvprice">Precio (S/)</Label>
                  <Input
                    id="srvprice"
                    type="number"
                    step="1"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="srvmins">Minutos</Label>
                  <Input
                    id="srvmins"
                    type="number"
                    min="5"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="srvcomm">Comisión (S/)</Label>
                  <Input
                    id="srvcomm"
                    type="number"
                    min="0"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Guardar Servicio</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

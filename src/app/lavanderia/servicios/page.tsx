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
import { useLavanderiaStore } from "@/lib/lavanderia-store"
import { formatMoney } from "@/lib/money"
import type { ServiceCategory, UnitType } from "@/lib/lavanderia-types"
import { PlusCircle, Tag } from "lucide-react"

export default function ServiciosPage() {
  const { state, ready, addService } = useLavanderiaStore()
  const mx = (n: number) => formatMoney(n)

  const [openModal, setOpenModal] = useState(false)
  const [name, setName] = useState("")
  const [category, setCategory] = useState<ServiceCategory>("lavado_kilo")
  const [unitType, setUnitType] = useState<UnitType>("kg")
  const [price, setPrice] = useState("10")
  const [estimatedHours, setEstimatedHours] = useState("24")

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando tarifario…</p>
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    addService({
      name: name.trim(),
      category,
      unitType,
      price: Number(price) || 0,
      estimatedHours: Number(estimatedHours) || 24,
    })

    setName("")
    setPrice("10")
    setEstimatedHours("24")
    setOpenModal(false)
  }

  function categoryLabel(cat: ServiceCategory) {
    switch (cat) {
      case "lavado_kilo":
        return "Lavado por Kilo"
      case "prendas_pesadas":
        return "Edredones / Frazadas"
      case "tintoreria_seco":
        return "Lavado al Seco"
      case "planchado":
        return "Planchado y Vapor"
      case "calzado":
        return "Calzado y Zapatillas"
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tarifario de Servicios</h1>
          <p className="text-sm text-muted-foreground">
            Precios configurados para cobro por peso (kilos) o por tipo de prenda.
          </p>
        </div>
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle className="mr-1.5 size-4" />
          Nuevo Servicio
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Servicio / Prenda</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Unidad de Cobro</TableHead>
              <TableHead>Tiempo Estimado</TableHead>
              <TableHead className="text-right">Precio</TableHead>
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
                  <Badge variant="outline">{categoryLabel(srv.category)}</Badge>
                </TableCell>
                <TableCell className="capitalize">{srv.unitType}</TableCell>
                <TableCell>{srv.estimatedHours} horas</TableCell>
                <TableCell className="text-right font-bold text-base tabular-nums">
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
              <DialogTitle>Añadir Nuevo Servicio</DialogTitle>
              <DialogDescription>
                Define el nombre del servicio, cómo se cobra y la tarifa en soles.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label htmlFor="sname">Nombre del Servicio *</Label>
                <Input
                  id="sname"
                  required
                  placeholder="Ej. Lavado de Cortinas por paño"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="scat">Categoría</Label>
                  <select
                    id="scat"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  >
                    <option value="lavado_kilo">Lavado por Kilo</option>
                    <option value="prendas_pesadas">Edredones / Frazadas</option>
                    <option value="tintoreria_seco">Lavado al Seco</option>
                    <option value="planchado">Planchado</option>
                    <option value="calzado">Calzado / Zapatillas</option>
                  </select>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="sunit">Unidad de Cobro</Label>
                  <select
                    id="sunit"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={unitType}
                    onChange={(e) => setUnitType(e.target.value as UnitType)}
                  >
                    <option value="kg">Por Kilo (kg)</option>
                    <option value="unidad">Por Unidad</option>
                    <option value="par">Por Par (calzado)</option>
                    <option value="juego">Por Juego / Terno</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="sprice">Precio (S/)</Label>
                  <Input
                    id="sprice"
                    type="number"
                    step="0.5"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="shours">Tiempo estimado (Horas)</Label>
                  <Input
                    id="shours"
                    type="number"
                    min="1"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(e.target.value)}
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

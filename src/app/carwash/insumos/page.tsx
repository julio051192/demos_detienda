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
import { useCarWashStore } from "@/lib/carwash-store"
import { formatMoney } from "@/lib/money"
import { PlusCircle, Droplets, AlertTriangle } from "lucide-react"

export default function CarWashInsumosPage() {
  const { state, ready, addSupply, updateSupplyStock } = useCarWashStore()
  const mx = (n: number) => formatMoney(n)

  const [openModal, setOpenModal] = useState(false)
  const [name, setName] = useState("")
  const [unit, setUnit] = useState("bidón 20 L")
  const [stock, setStock] = useState("5")
  const [minStock, setMinStock] = useState("2")
  const [cost, setCost] = useState("80")

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando insumos…</p>
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    addSupply({
      name: name.trim(),
      unit: unit.trim() || "unidad",
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 0,
      cost: Number(cost) || 0,
    })

    setName("")
    setStock("5")
    setMinStock("2")
    setCost("80")
    setOpenModal(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Insumos & Químicos de Car Wash</h1>
          <p className="text-sm text-muted-foreground">
            Control de stock para shampoos espumantes, siliconas de llantas, desengrasantes y microfibras.
          </p>
        </div>
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle className="mr-1.5 size-4" />
          Nuevo Insumo
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Insumo Automotriz</TableHead>
              <TableHead>Presentación / Envase</TableHead>
              <TableHead>Stock Actual</TableHead>
              <TableHead>Stock Mínimo</TableHead>
              <TableHead>Costo Unitario</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ajuste Rápido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.supplies.map((sup) => {
              const isLow = sup.stock <= sup.minStock
              return (
                <TableRow key={sup.id}>
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <Droplets className="size-4 text-cyan-600" />
                      <span>{sup.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{sup.unit}</TableCell>
                  <TableCell className="font-bold tabular-nums text-base">
                    {sup.stock}
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {sup.minStock}
                  </TableCell>
                  <TableCell className="tabular-nums">{mx(sup.cost)}</TableCell>
                  <TableCell>
                    {isLow ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="size-3" />
                        Comprar Insumo
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Abastecido</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => updateSupplyStock(sup.id, -1)}
                      disabled={sup.stock <= 0}
                    >
                      -1 Usar
                    </Button>
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => updateSupplyStock(sup.id, 1)}
                    >
                      +1 Ingreso
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Modal: Crear Insumo */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Añadir Insumo de Car Wash</DialogTitle>
              <DialogDescription>
                Registra el producto químico o material para control de inventario.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label htmlFor="cwname">Nombre del Insumo *</Label>
                <Input
                  id="cwname"
                  required
                  placeholder="Ej. Cera Rápida Líquida en Spray"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="cwunit">Presentación / Envase</Label>
                <Input
                  id="cwunit"
                  placeholder="Ej. Bidón 20 L, Galón, Frasco 1L, Pack 12u..."
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="cwstock">Stock Inicial</Label>
                  <Input
                    id="cwstock"
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="cwmin">Mínimo Alerta</Label>
                  <Input
                    id="cwmin"
                    type="number"
                    min="1"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="cwcost">Costo (S/)</Label>
                  <Input
                    id="cwcost"
                    type="number"
                    min="0"
                    step="0.5"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Guardar Insumo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

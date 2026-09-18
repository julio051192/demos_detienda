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
import { useErpStore } from "@/lib/erp-store"
import { formatMoney } from "@/lib/money"

export default function InventariosPage() {
  const { state, ready, addProduct } = useErpStore()
  const [open, setOpen] = useState(false)
  const [sku, setSku] = useState("")
  const [name, setName] = useState("")
  const [unit, setUnit] = useState("unidad")
  const [stock, setStock] = useState("0")
  const [cost, setCost] = useState("0")
  const [price, setPrice] = useState("0")
  const [minStock, setMinStock] = useState("5")
  const mx = (n: number) => formatMoney(n)

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando inventario…</p>
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addProduct({
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-5)}`,
      name: name.trim(),
      unit: unit.trim() || "unidad",
      stock: Number(stock) || 0,
      cost: Number(cost) || 0,
      price: Number(price) || 0,
      minStock: Number(minStock) || 0,
    })
    setSku("")
    setName("")
    setStock("0")
    setCost("0")
    setPrice("0")
    setOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventarios</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Un solo stock para los tres puestos. Ventas restan, compras suman.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Nuevo producto</Button>
      </div>

      {state.products.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">Almacén vacío</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Carga el primer SKU para poder vender y comprar.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.sku} · {p.unit}
                    </p>
                  </TableCell>
                  <TableCell className="tabular-nums">{p.stock}</TableCell>
                  <TableCell>{mx(p.cost)}</TableCell>
                  <TableCell>{mx(p.price)}</TableCell>
                  <TableCell>
                    {p.stock <= p.minStock ? (
                      <Badge variant="destructive">Bajo mínimo</Badge>
                    ) : (
                      <Badge variant="secondary">OK</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={submit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Nuevo producto</DialogTitle>
              <DialogDescription>
                SKU, stock inicial, costo y precio de venta.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="unit">Unidad</Label>
                  <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="pname">Nombre</Label>
                <Input
                  id="pname"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    inputMode="numeric"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="min">Mínimo</Label>
                  <Input
                    id="min"
                    inputMode="numeric"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="cost">Costo</Label>
                  <Input
                    id="cost"
                    inputMode="decimal"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    inputMode="decimal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar en almacén</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

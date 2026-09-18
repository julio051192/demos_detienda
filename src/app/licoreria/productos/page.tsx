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
import { useLicoreriaStore, categoryLabel } from "@/lib/licoreria-store"
import { formatMoney } from "@/lib/money"
import type { LiquorCategory } from "@/lib/licoreria-types"
import { PlusCircle, Barcode, Search } from "lucide-react"

export default function ProductosPage() {
  const { state, ready, addProduct } = useLicoreriaStore()
  const mx = (n: number) => formatMoney(n)

  const [openModal, setOpenModal] = useState(false)
  const [search, setSearch] = useState("")

  // Form
  const [barcode, setBarcode] = useState("")
  const [name, setName] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState<LiquorCategory>("cerveza")
  const [presentation, setPresentation] = useState("Botella 620ml")
  const [purchasePrice, setPurchasePrice] = useState("10")
  const [salePrice, setSalePrice] = useState("15")
  const [stock, setStock] = useState("24")
  const [minStock, setMinStock] = useState("6")
  const [alcoholPercent, setAlcoholPercent] = useState("")

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando productos…</p>

  const filtered = state.products.filter(
    (p) =>
      search.length < 2 ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search),
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!barcode.trim() || !name.trim()) return

    addProduct({
      barcode: barcode.trim(),
      name: name.trim(),
      brand: brand.trim(),
      category,
      presentation: presentation.trim(),
      purchasePrice: Number(purchasePrice) || 0,
      salePrice: Number(salePrice) || 0,
      stock: Number(stock) || 0,
      minStock: Number(minStock) || 0,
      alcoholPercent: alcoholPercent ? Number(alcoholPercent) : undefined,
    })

    setBarcode("")
    setName("")
    setBrand("")
    setOpenModal(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catálogo de Productos & Códigos de Barras</h1>
          <p className="text-sm text-muted-foreground">
            Registra cervezas, piscos, vinos y licores con su código EAN/UPC para el escáner POS.
          </p>
        </div>
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle className="mr-1.5 size-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, marca o código…"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código de Barras (EAN/UPC)</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Presentación</TableHead>
              <TableHead>% Alc.</TableHead>
              <TableHead>Precio Compra</TableHead>
              <TableHead>Precio Venta</TableHead>
              <TableHead className="text-right">Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => {
              const isLow = p.stock <= p.minStock
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Barcode className="size-3.5 text-muted-foreground" />
                      <span className="font-mono text-xs text-muted-foreground">{p.barcode}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-sm text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.brand}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{categoryLabel(p.category)}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.presentation}</TableCell>
                  <TableCell className="text-xs font-medium">
                    {p.alcoholPercent ? `${p.alcoholPercent}°` : "—"}
                  </TableCell>
                  <TableCell className="tabular-nums text-xs">{mx(p.purchasePrice)}</TableCell>
                  <TableCell className="font-bold tabular-nums text-emerald-600">{mx(p.salePrice)}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={isLow ? "destructive" : "secondary"}
                      className="font-bold tabular-nums"
                    >
                      {p.stock} u.
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Modal: Nuevo Producto */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Barcode className="size-5 text-primary" />
                Registrar Producto con Código de Barras
              </DialogTitle>
              <DialogDescription>
                Ingresa el código EAN-13 o UPC del producto tal como aparece en la etiqueta.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="grid gap-1">
                <Label htmlFor="lbc">Código de Barras (EAN-13 / UPC) *</Label>
                <div className="relative">
                  <Barcode className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    id="lbc"
                    required
                    className="pl-9 font-mono"
                    placeholder="Ej. 7751144000011"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="lname">Nombre del Producto *</Label>
                  <Input
                    id="lname"
                    required
                    placeholder="Ej. Cristal Botella"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="lbrand">Marca / Destilería</Label>
                  <Input
                    id="lbrand"
                    placeholder="Ej. Backus, Tabernero..."
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="lcat">Categoría</Label>
                  <select
                    id="lcat"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as LiquorCategory)}
                  >
                    <option value="cerveza">🍺 Cerveza</option>
                    <option value="vino">🍷 Vino</option>
                    <option value="pisco">🥃 Pisco</option>
                    <option value="whisky">🥃 Whisky</option>
                    <option value="ron">🍾 Ron</option>
                    <option value="vodka">🍸 Vodka</option>
                    <option value="cocteles">🍹 Cocteles</option>
                    <option value="gaseosa">🥤 Gaseosa / Agua</option>
                    <option value="otros">📦 Otros</option>
                  </select>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="lpres">Presentación</Label>
                  <Input
                    id="lpres"
                    placeholder="Ej. Botella 750ml, Lata 355ml"
                    value={presentation}
                    onChange={(e) => setPresentation(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="lpp">Precio Compra (S/)</Label>
                  <Input
                    id="lpp"
                    type="number"
                    step="0.5"
                    min="0"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="lsp">Precio Venta (S/)</Label>
                  <Input
                    id="lsp"
                    type="number"
                    step="0.5"
                    min="0"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="lalc">% Alcohol</Label>
                  <Input
                    id="lalc"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="Ej. 5.0"
                    value={alcoholPercent}
                    onChange={(e) => setAlcoholPercent(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="lstk">Stock Inicial</Label>
                  <Input
                    id="lstk"
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="lmin">Stock Mínimo (Alerta)</Label>
                  <Input
                    id="lmin"
                    type="number"
                    min="0"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Guardar Producto</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

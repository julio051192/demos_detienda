"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { categoryLabel, useLicoreriaStore } from "@/lib/licoreria-store"
import { formatMoney } from "@/lib/money"
import { Minus, PackageSearch, Plus } from "lucide-react"

export default function InventarioLicoreriaPage() {
  const { state, ready, stats, updateStock } = useLicoreriaStore()
  const [quantities, setQuantities] = useState<Record<string, string>>({})

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando inventario…</p>

  function adjustStock(productId: string, direction: 1 | -1) {
    const quantity = Math.max(1, Number(quantities[productId]) || 1)
    updateStock(productId, direction * quantity)
    setQuantities((current) => ({ ...current, [productId]: "" }))
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PackageSearch className="size-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Inventario y Stock</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Actualiza entradas y salidas de productos para mantener la caja al día.
          </p>
        </div>
        <Badge variant={stats.lowStock.length > 0 ? "destructive" : "secondary"}>
          {stats.lowStock.length} alertas de stock
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Productos registrados</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{stats.totalProducts}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Unidades disponibles</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{state.products.reduce((sum, product) => sum + product.stock, 0)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Valor de compra</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{formatMoney(state.products.reduce((sum, product) => sum + product.stock * product.purchasePrice, 0))}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Stock actual</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Ajustar unidades</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.products.map((product) => {
              const lowStock = product.stock <= product.minStock
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.brand} · {product.presentation}</p>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{categoryLabel(product.category)}</Badge></TableCell>
                  <TableCell className="font-bold tabular-nums">{product.stock} u.</TableCell>
                  <TableCell>
                    <Badge variant={lowStock ? "destructive" : "secondary"}>
                      {lowStock ? "Bajo mínimo" : "Disponible"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Input
                        aria-label={`Cantidad para ${product.name}`}
                        className="h-8 w-16 text-center tabular-nums"
                        inputMode="numeric"
                        min="1"
                        type="number"
                        value={quantities[product.id] ?? ""}
                        onChange={(event) => setQuantities((current) => ({ ...current, [product.id]: event.target.value }))}
                        placeholder="1"
                      />
                      <Button aria-label={`Retirar stock de ${product.name}`} size="icon-sm" variant="outline" onClick={() => adjustStock(product.id, -1)}>
                        <Minus className="size-4" />
                      </Button>
                      <Button aria-label={`Agregar stock a ${product.name}`} size="icon-sm" onClick={() => adjustStock(product.id, 1)}>
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useVeterinariaStore } from "@/lib/veterinaria-store"
import { formatMoney, formatNumber } from "@/lib/money"
import type { PetShopProduct } from "@/lib/veterinaria-types"
import {
  ShoppingBag,
  Plus,
  Minus,
  AlertTriangle,
  Search,
  CheckCircle2,
  Package,
} from "lucide-react"

export default function PetShopVeterinariaPage() {
  const { state, ready, adjustProductStock, registerSale } = useVeterinariaStore()
  const mx = (n: number) => formatMoney(n)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCat, setSelectedCat] = useState<string>("todos")
  const [soldMessage, setSoldMessage] = useState<string | null>(null)

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando Pet Shop…</p>

  const filteredProducts = state.products.filter((p) => {
    const matchCat = selectedCat === "todos" || p.category === selectedCat
    const matchSearch =
      searchQuery.length < 2 ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  function handleQuickSell(prod: PetShopProduct) {
    if (prod.currentStock <= 0) return

    adjustProductStock(prod.id, -1)
    registerSale({
      clientName: "Cliente Mostrador",
      petName: "Mascota",
      type: "petshop",
      itemsSummary: `1x ${prod.name} (${prod.brand})`,
      total: prod.price,
      paymentMethod: "yape_plin",
    })

    setSoldMessage(`✓ Venta registrada: 1x ${prod.name} (${mx(prod.price)})`)
    setTimeout(() => setSoldMessage(null), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-teal-700 text-teal-100 border-teal-600">
              <ShoppingBag className="size-3.5 mr-1" />
              Pet Shop & Farmacia Veterinaria
            </Badge>
            <span className="text-xs text-muted-foreground">Alimentos Super Premium y Antipulgas</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight">Catálogo de Productos & Farmacia</h1>
          <p className="text-sm text-muted-foreground">
            Control de inventario de medicamentos veterinarios, alimentos balanceados y venta en mostrador.
          </p>
        </div>
      </div>

      {soldMessage && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-100/90 dark:bg-emerald-950 p-3.5 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{soldMessage}</span>
        </div>
      )}

      {/* Buscador & Filtros */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por producto, marca (Bravecto, Pro Plan)..."
              className="pl-8 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            Mostrando {filteredProducts.length} productos
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {["todos", "antipulgas", "alimentos", "farmacia", "higiene_accesorios"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedCat === cat
                  ? "bg-teal-700 text-white border-teal-800"
                  : "bg-card hover:bg-muted text-muted-foreground"
              }`}
            >
              {cat === "todos"
                ? "🛍️ Todos los Productos"
                : cat === "antipulgas"
                  ? "💊 Antipulgas & Garrapatas"
                  : cat === "alimentos"
                    ? "🥣 Alimentos Premium"
                    : cat === "farmacia"
                      ? "💉 Farmacia & Gotas"
                      : "🧴 Higiene & Champús"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Productos de Pet Shop */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((p) => {
          const isLow = p.currentStock <= p.minStock

          return (
            <Card
              key={p.id}
              className="overflow-hidden border hover:border-teal-600/50 transition-all hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 left-2 bg-stone-900/90 text-white font-bold text-[10px]">
                    {p.brand}
                  </Badge>
                  {isLow && (
                    <Badge variant="destructive" className="absolute bottom-2 left-2 text-[10px] font-bold">
                      ⚠️ Bajo Stock
                    </Badge>
                  )}
                  <div className="absolute bottom-2 right-2 rounded-lg bg-background/90 backdrop-blur-md px-2 py-0.5 font-bold text-xs shadow">
                    Stock: {formatNumber(p.currentStock)} {p.unit}
                  </div>
                </div>

                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-bold text-xs text-foreground line-clamp-2">{p.name}</h3>
                    <span className="font-black text-sm text-teal-800 dark:text-teal-300 tabular-nums shrink-0">
                      {mx(p.price)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground capitalize">
                    Categoría: {p.category.replace("_", " ")}
                  </p>
                </div>
              </div>

              <div className="p-3.5 pt-0 space-y-2">
                <div className="flex items-center justify-between border-t pt-2 text-xs">
                  <span className="text-[11px] text-muted-foreground">Ajustar inventario:</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => adjustProductStock(p.id, -1)}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="font-bold w-6 text-center">{p.currentStock}</span>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => adjustProductStock(p.id, 1)}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs h-8"
                  disabled={p.currentStock <= 0}
                  onClick={() => handleQuickSell(p)}
                >
                  <ShoppingBag className="size-3.5 mr-1.5" />
                  Vender en Mostrador ({mx(p.price)})
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

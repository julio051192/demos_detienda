"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  categoryLabel,
  useRestauranteStore,
} from "@/lib/restaurante-store"
import { formatMoney } from "@/lib/money"
import type { DishCategory, DishItem, OrderDishLine } from "@/lib/restaurante-types"
import {
  UtensilsCrossed,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ChefHat,
  Search,
  CheckCircle2,
  Sparkles,
  Flame,
} from "lucide-react"

export default function ComandaVisualPage() {
  const { state, ready, createOrderForTable } = useRestauranteStore()
  const searchParams = useSearchParams()
  const tableIdFromQuery = searchParams.get("tableId")

  const mx = (n: number) => formatMoney(n)

  const [selectedTableId, setSelectedTableId] = useState(tableIdFromQuery || state.tables[0]?.id || "")
  const [waiterName, setWaiterName] = useState("Carlos Mozo")
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | "todas">("todas")
  const [searchQuery, setSearchQuery] = useState("")

  // Carrito de comanda
  const [cartLines, setCartLines] = useState<OrderDishLine[]>([])
  const [activeDishNote, setActiveDishNote] = useState<{ id: string; note: string } | null>(null)
  const [orderSent, setOrderSent] = useState(false)

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando menú visual…</p>

  const availableTables = state.tables

  // Filtrado de platos
  const filteredDishes = state.dishes.filter((dish) => {
    const matchCategory = selectedCategory === "todas" || dish.category === selectedCategory
    const matchSearch =
      searchQuery.length < 2 ||
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  function addToCart(dish: DishItem) {
    setCartLines((prev) => {
      const existing = prev.find((l) => l.dishId === dish.id)
      if (existing) {
        return prev.map((l) =>
          l.dishId === dish.id
            ? { ...l, qty: l.qty + 1, subtotal: (l.qty + 1) * l.unitPrice }
            : l,
        )
      }
      return [
        ...prev,
        {
          dishId: dish.id,
          name: dish.name,
          unitPrice: dish.price,
          qty: 1,
          subtotal: dish.price,
          status: "pendiente",
        },
      ]
    })
  }

  function updateQty(dishId: string, delta: number) {
    setCartLines((prev) =>
      prev
        .map((l) => {
          if (l.dishId !== dishId) return l
          const newQty = l.qty + delta
          if (newQty <= 0) return null as unknown as OrderDishLine
          return { ...l, qty: newQty, subtotal: newQty * l.unitPrice }
        })
        .filter(Boolean),
    )
  }

  function updateNotes(dishId: string, notes: string) {
    setCartLines((prev) =>
      prev.map((l) => (l.dishId === dishId ? { ...l, notes } : l)),
    )
  }

  function handleSendToKitchen() {
    if (cartLines.length === 0 || !selectedTableId) return

    createOrderForTable({
      tableId: selectedTableId,
      waiterName,
      lines: cartLines,
    })

    setCartLines([])
    setOrderSent(true)
    setTimeout(() => setOrderSent(false), 3000)
  }

  const totalComanda = cartLines.reduce((sum, l) => sum + l.subtotal, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catálogo Visual de Platos & Comandero</h1>
          <p className="text-sm text-muted-foreground">
            Fotografías en alta calidad, precios, modificadores e ingreso directo a la comanda de mesa.
          </p>
        </div>

        {/* Selección de Mesa y Mozo */}
        <div className="flex flex-wrap items-center gap-2 bg-card border rounded-xl p-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Label className="text-xs font-bold">Mesa:</Label>
            <select
              className="h-8 rounded-md border border-input bg-background px-2 font-bold text-primary"
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
            >
              {availableTables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.code} ({t.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 border-l pl-2">
            <Label className="text-xs font-bold">Mozo:</Label>
            <Input
              className="h-8 w-28 text-xs font-medium"
              value={waiterName}
              onChange={(e) => setWaiterName(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Alerta de Envío a Cocina */}
      {orderSent && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-100/80 dark:bg-emerald-950 p-3 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600" />
          ¡Comanda enviada con éxito a la pantalla KDS de Cocina y Bar!
        </div>
      )}

      {/* Buscador & Filtro de Categorías Táctiles */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por plato, ingrediente o especialidad…"
              className="pl-8 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            Mostrando {filteredDishes.length} platos disponibles
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory("todas")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedCategory === "todas"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card hover:bg-muted text-muted-foreground"
            }`}
          >
            🍽️ Todos los Platos
          </button>
          {(
            [
              "ceviches",
              "pollos",
              "criollos",
              "entradas",
              "bebidas",
              "licoreria",
              "postres",
            ] as DishCategory[]
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:bg-muted text-muted-foreground"
              }`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Principal: Platos Visuales (Izquierda) + Comanda (Derecha) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Izquierda: Cuadrícula Visual de Platos */}
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          {filteredDishes.map((dish) => (
            <Card
              key={dish.id}
              className="overflow-hidden border hover:border-primary/50 transition-all hover:shadow-md group flex flex-col justify-between"
            >
              <div>
                {/* Imagen del Plato */}
                <div className="relative h-40 w-full overflow-hidden bg-muted">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {dish.isPopular && (
                      <Badge className="bg-amber-500 text-white font-bold text-[10px]">
                        ⭐ Más Vendido
                      </Badge>
                    )}
                    {dish.isSpicy && (
                      <Badge className="bg-rose-600 text-white font-bold text-[10px]">
                        🌶️ Picante
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 rounded-lg bg-background/90 backdrop-blur-md px-2 py-1 font-bold text-xs shadow">
                    {dish.prepTimeMinutes} min.
                  </div>
                </div>

                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-foreground line-clamp-1">
                      {dish.name}
                    </h3>
                    <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {mx(dish.price)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>

              <div className="p-3.5 pt-0">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-9"
                  onClick={() => addToCart(dish)}
                >
                  <Plus className="size-3.5 mr-1" />
                  Agregar a Comanda
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Derecha: Panel de Comanda Ticket */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-xs border-primary/30">
            <div className="p-3 border-b flex items-center justify-between bg-primary/5">
              <span className="font-bold text-sm flex items-center gap-1.5">
                <ShoppingCart className="size-4 text-primary" />
                Comanda de Mesa
              </span>
              <Badge variant="outline" className="font-mono text-xs">
                {cartLines.length} platos
              </Badge>
            </div>

            <CardContent className="p-3 space-y-3">
              {cartLines.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
                  <UtensilsCrossed className="size-8 mx-auto text-muted-foreground/40" />
                  <p className="font-medium">No hay platos agregados</p>
                  <p className="text-[11px]">Haz clic en cualquier foto de plato a la izquierda para armar el pedido</p>
                </div>
              ) : (
                <div className="divide-y max-h-[380px] overflow-y-auto pr-1">
                  {cartLines.map((line) => (
                    <div key={line.dishId} className="py-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-foreground line-clamp-1">{line.name}</span>
                        <span className="font-bold tabular-nums">{mx(line.subtotal)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            className="size-6 rounded border flex items-center justify-center hover:bg-muted"
                            onClick={() => updateQty(line.dishId, -1)}
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-xs tabular-nums">
                            {line.qty}
                          </span>
                          <button
                            className="size-6 rounded border flex items-center justify-center hover:bg-muted"
                            onClick={() => updateQty(line.dishId, 1)}
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>

                        <div className="flex max-w-[190px] flex-wrap justify-end gap-1">
                          {["Sin cebolla", "Picante medio", "Término medio", "Para llevar"].map((modifier) => (
                            <button
                              key={modifier}
                              type="button"
                              className={`rounded border px-1.5 py-0.5 text-[9px] transition-colors ${line.notes?.includes(modifier) ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                              onClick={() => updateNotes(line.dishId, line.notes?.includes(modifier) ? line.notes.replace(`${modifier}, `, "").replace(modifier, "") : `${line.notes ? `${line.notes}, ` : ""}${modifier}`)}
                            >
                              {modifier}
                            </button>
                          ))}
                          <Input
                            placeholder="Otra nota..."
                            className="h-6 w-full text-[10px]"
                            value={line.notes || ""}
                            onChange={(e) => updateNotes(line.dishId, e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total y Botón de Envío */}
              <div className="border-t pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-semibold">TOTAL COMANDA:</span>
                  <span className="text-2xl font-black text-foreground tabular-nums">
                    {mx(totalComanda)}
                  </span>
                </div>

                <Button
                  className="w-full h-11 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={cartLines.length === 0}
                  onClick={handleSendToKitchen}
                >
                  <ChefHat className="size-4 mr-2" />
                  Enviar a Cocina / KDS
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

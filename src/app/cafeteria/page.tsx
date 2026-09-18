"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  categoryLabel,
  useCafeteriaStore,
} from "@/lib/cafeteria-store"
import { formatMoney } from "@/lib/money"
import type {
  CoffeeCategory,
  CoffeeOrderLine,
  CoffeeProduct,
  CupSize,
  MilkOption,
  OrderLineCustomization,
} from "@/lib/cafeteria-types"
import {
  Coffee,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  CheckCircle2,
  Sparkles,
  CupSoda,
  Utensils,
  Award,
  Search,
} from "lucide-react"

export default function CafeteriaPosPage() {
  const { state, ready, createOrder, reset } = useCafeteriaStore()
  const mx = (n: number) => formatMoney(n)

  const [selectedCategory, setSelectedCategory] = useState<CoffeeCategory | "todas">("todas")
  const [searchQuery, setSearchQuery] = useState("")

  // Carrito de comanda
  const [cartLines, setCartLines] = useState<CoffeeOrderLine[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [orderType, setOrderType] = useState<"para_mesa" | "para_llevar">("para_mesa")
  const [tableNumber, setTableNumber] = useState("Mesa 01")
  const [paymentMethod, setPaymentMethod] = useState<"yape_plin" | "efectivo" | "tarjeta">("yape_plin")
  const [orderSuccessTicket, setOrderSuccessTicket] = useState<string | null>(null)

  // Modal de Personalización de Café
  const [customizingProduct, setCustomizingProduct] = useState<CoffeeProduct | null>(null)
  const [selectedSize, setSelectedSize] = useState<CupSize>("12oz")
  const [selectedMilk, setSelectedMilk] = useState<MilkOption>("entera")
  const [selectedSyrup, setSelectedSyrup] = useState("Ninguno")
  const [selectedSugar, setSelectedSugar] = useState("Normal")
  const [extraShot, setExtraShot] = useState(false)

  if (!ready) return <p className="text-sm text-muted-foreground">Iniciando POS de Cafetería…</p>

  const filteredProducts = state.products.filter((prod) => {
    const matchCat = selectedCategory === "todas" || prod.category === selectedCategory
    const matchSearch =
      searchQuery.length < 2 ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  function handleProductClick(prod: CoffeeProduct) {
    if (prod.allowsMilkCustomization || prod.allowsSizeCustomization) {
      setCustomizingProduct(prod)
      setSelectedSize("12oz")
      setSelectedMilk("entera")
      setSelectedSyrup("Ninguno")
      setSelectedSugar("Normal")
      setExtraShot(false)
    } else {
      // Agregar directo
      addLineToCart(prod, prod.basePrice)
    }
  }

  function addLineToCart(
    prod: CoffeeProduct,
    finalUnitPrice: number,
    customization?: OrderLineCustomization,
  ) {
    const lineId = `${prod.id}_${Math.random().toString(36).slice(2, 6)}`
    setCartLines((prev) => [
      ...prev,
      {
        id: lineId,
        productId: prod.id,
        name: prod.name,
        unitPrice: finalUnitPrice,
        qty: 1,
        subtotal: finalUnitPrice,
        customization,
      },
    ])
  }

  function confirmCustomization() {
    if (!customizingProduct) return

    let price = customizingProduct.basePrice
    if (selectedSize === "16oz") price += 2.5
    if (selectedSize === "8oz") price -= 1.5
    if (selectedMilk === "almendras" || selectedMilk === "avena") price += 3.0
    if (selectedSyrup !== "Ninguno") price += 2.0
    if (extraShot) price += 3.0

    const customization: OrderLineCustomization = {
      size: selectedSize,
      milk: selectedMilk,
      syrup: selectedSyrup !== "Ninguno" ? selectedSyrup : undefined,
      sugarLevel: selectedSugar,
      extraShotEspresso: extraShot,
    }

    addLineToCart(customizingProduct, price, customization)
    setCustomizingProduct(null)
  }

  function updateQty(lineId: string, delta: number) {
    setCartLines((prev) =>
      prev
        .map((l) => {
          if (l.id !== lineId) return l
          const newQty = l.qty + delta
          if (newQty <= 0) return null as unknown as CoffeeOrderLine
          return { ...l, qty: newQty, subtotal: newQty * l.unitPrice }
        })
        .filter(Boolean),
    )
  }

  function removeLine(lineId: string) {
    setCartLines((prev) => prev.filter((l) => l.id !== lineId))
  }

  function handleSendOrder() {
    if (cartLines.length === 0) return

    const ticket = `#CAF-${100 + state.orders.length + 1}`
    createOrder({
      customerName: customerName.trim() || "Cliente Bar",
      customerPhone: customerPhone.trim() || undefined,
      orderType,
      tableNumber: orderType === "para_mesa" ? tableNumber : undefined,
      lines: cartLines,
      paymentMethod,
    })

    setCartLines([])
    setCustomerName("")
    setCustomerPhone("")
    setOrderSuccessTicket(ticket)
  }

  const totalCart = cartLines.reduce((sum, l) => sum + l.subtotal, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-800 text-amber-100 border-amber-600">
              <Coffee className="size-3.5 mr-1" />
              Cafetería & Barra de Especialidad
            </Badge>
            <span className="text-xs text-muted-foreground">Origen: Villa Rica & Chanchamayo</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight">POS Táctil & Registro de Pedidos</h1>
          <p className="text-sm text-muted-foreground">
            Personalización de bebidas (leches vegetales, tamaño, siropes), tickets para cocina/barista y sellos de lealtad.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={reset}>
          Restaurar datos demo
        </Button>
      </div>

      {/* Alerta de Cita Creada con Éxito */}
      {orderSuccessTicket && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-100/80 dark:bg-emerald-950 p-4 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-emerald-600" />
            <span>
              ¡Pedido {orderSuccessTicket} enviado a la pantalla del Barista y cobrado con éxito!
              {customerPhone && " Se sumó +1 sello de fidelización al cliente."}
            </span>
          </div>
          <Button size="xs" variant="outline" onClick={() => setOrderSuccessTicket(null)}>
            Cerrar
          </Button>
        </div>
      )}

      {/* Buscador & Categorías */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar café, postre o sandwich..."
              className="pl-8 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            Mostrando {filteredProducts.length} variedades
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory("todas")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedCategory === "todas"
                ? "bg-amber-800 text-white border-amber-900"
                : "bg-card hover:bg-muted text-muted-foreground"
            }`}
          >
            ☕ Todos los Productos
          </button>
          {(["calientes", "frios", "pasteleria", "sandwiches", "combos"] as CoffeeCategory[]).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedCategory === cat
                    ? "bg-amber-800 text-white border-amber-900"
                    : "bg-card hover:bg-muted text-muted-foreground"
                }`}
              >
                {categoryLabel(cat)}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Grid: Menú Visual (Izquierda 7 cols) + Comanda Táctil (Derecha 5 cols) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Catálogo Visual con Fotos */}
        <div className="lg:col-span-7 grid gap-3 sm:grid-cols-2">
          {filteredProducts.map((prod) => (
            <Card
              key={prod.id}
              className="overflow-hidden border hover:border-amber-600/60 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between group"
              onClick={() => handleProductClick(prod)}
            >
              <div>
                <div className="relative h-36 w-full overflow-hidden bg-muted">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {prod.isPopular && (
                    <Badge className="absolute top-2 left-2 bg-amber-600 text-white font-bold text-[10px]">
                      ⭐ Especialidad
                    </Badge>
                  )}
                  <div className="absolute bottom-2 right-2 rounded-lg bg-background/90 backdrop-blur-md px-2 py-0.5 font-mono font-bold text-[11px] shadow">
                    {prod.prepTimeMinutes} min
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-bold text-xs text-foreground line-clamp-1">{prod.name}</h3>
                    <span className="font-black text-xs text-amber-800 dark:text-amber-400 tabular-nums">
                      {mx(prod.basePrice)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="p-3 pt-0">
                <Button
                  size="xs"
                  className="w-full bg-amber-800 hover:bg-amber-900 text-white text-[11px] font-bold h-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleProductClick(prod)
                  }}
                >
                  <Plus className="size-3 mr-1" />
                  {prod.allowsMilkCustomization ? "Personalizar & Agregar" : "Agregar a Comanda"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Panel Derecho: Ticket de Comanda & Cobro Inmediato */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="shadow-xs border-amber-700/30">
            <div className="p-3 border-b flex items-center justify-between bg-amber-900/5">
              <span className="font-bold text-sm flex items-center gap-1.5 text-foreground">
                <ShoppingCart className="size-4 text-amber-800" />
                Ticket de Barra
              </span>
              <Badge variant="outline" className="font-mono text-xs">
                {cartLines.length} ítems
              </Badge>
            </div>

            <CardContent className="p-3.5 space-y-3.5 text-xs">
              {/* Opciones de Pedido (Mesa vs Llevar) */}
              <div className="grid grid-cols-2 gap-2 bg-muted/40 p-1 rounded-lg">
                <button
                  type="button"
                  className={`py-1.5 rounded-md font-bold text-xs transition-colors ${
                    orderType === "para_mesa"
                      ? "bg-background shadow-xs text-amber-900 dark:text-amber-200"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setOrderType("para_mesa")}
                >
                  🍽️ Para Mesa
                </button>
                <button
                  type="button"
                  className={`py-1.5 rounded-md font-bold text-xs transition-colors ${
                    orderType === "para_llevar"
                      ? "bg-background shadow-xs text-amber-900 dark:text-amber-200"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setOrderType("para_llevar")}
                >
                  🛍️ Para Llevar
                </button>
              </div>

              {/* Datos del Cliente y Mesa */}
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="cname" className="text-[11px]">Nombre Cliente</Label>
                  <Input
                    id="cname"
                    placeholder="Ej. Mariana"
                    className="h-7 text-xs"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                {orderType === "para_mesa" ? (
                  <div className="grid gap-1">
                    <Label htmlFor="ctable" className="text-[11px]">N° Mesa</Label>
                    <select
                      id="ctable"
                      className="h-7 rounded-lg border border-input bg-background px-2 text-xs font-semibold"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                    >
                      <option value="Mesa 01">Mesa 01</option>
                      <option value="Mesa 02">Mesa 02</option>
                      <option value="Mesa 03">Mesa 03</option>
                      <option value="Mesa 04">Mesa 04</option>
                      <option value="Barra 01">Barra 01</option>
                      <option value="Terraza T1">Terraza T1</option>
                    </select>
                  </div>
                ) : (
                  <div className="grid gap-1">
                    <Label htmlFor="cphone" className="text-[11px]">WhatsApp (Sello Club)</Label>
                    <Input
                      id="cphone"
                      placeholder="987 112 233"
                      className="h-7 text-xs"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Lista de Ítems en la comanda */}
              {cartLines.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
                  <Coffee className="size-8 mx-auto text-muted-foreground/40" />
                  <p className="font-semibold">La comanda está vacía</p>
                  <p className="text-[11px]">Haz clic en cualquier café o pastel a la izquierda</p>
                </div>
              ) : (
                <div className="divide-y max-h-[260px] overflow-y-auto pr-1">
                  {cartLines.map((line) => (
                    <div key={line.id} className="py-2 space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span className="line-clamp-1">{line.name}</span>
                        <span className="tabular-nums text-amber-900 dark:text-amber-300">
                          {mx(line.subtotal)}
                        </span>
                      </div>

                      {/* Resumen de personalización */}
                      {line.customization && (
                        <p className="text-[10px] text-muted-foreground italic">
                          {line.customization.size && `• Vaso: ${line.customization.size} `}
                          {line.customization.milk && `• Leche: ${line.customization.milk} `}
                          {line.customization.syrup && `• Sirope: ${line.customization.syrup} `}
                          {line.customization.extraShotEspresso && `• +1 Shot Extra`}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-0.5">
                        <div className="flex items-center gap-1">
                          <button
                            className="size-5 rounded border flex items-center justify-center hover:bg-muted"
                            onClick={() => updateQty(line.id, -1)}
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-5 text-center font-bold">{line.qty}</span>
                          <button
                            className="size-5 rounded border flex items-center justify-center hover:bg-muted"
                            onClick={() => updateQty(line.id, 1)}
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>

                        <button
                          className="text-rose-500 hover:text-rose-700 text-[10px]"
                          onClick={() => removeLine(line.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Medio de Pago & Total */}
              <div className="border-t pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">TOTAL A COBRAR:</span>
                  <span className="text-2xl font-black text-amber-900 dark:text-amber-300 tabular-nums">
                    {mx(totalCart)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    className={`py-1 rounded text-[11px] font-bold border transition-colors ${
                      paymentMethod === "yape_plin"
                        ? "bg-purple-100 text-purple-900 border-purple-400 dark:bg-purple-950 dark:text-purple-300"
                        : "bg-background hover:bg-muted"
                    }`}
                    onClick={() => setPaymentMethod("yape_plin")}
                  >
                    📱 Yape / Plin
                  </button>
                  <button
                    type="button"
                    className={`py-1 rounded text-[11px] font-bold border transition-colors ${
                      paymentMethod === "efectivo"
                        ? "bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-background hover:bg-muted"
                    }`}
                    onClick={() => setPaymentMethod("efectivo")}
                  >
                    💵 Efectivo
                  </button>
                  <button
                    type="button"
                    className={`py-1 rounded text-[11px] font-bold border transition-colors ${
                      paymentMethod === "tarjeta"
                        ? "bg-blue-100 text-blue-900 border-blue-400 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-background hover:bg-muted"
                    }`}
                    onClick={() => setPaymentMethod("tarjeta")}
                  >
                    💳 Tarjeta POS
                  </button>
                </div>

                <Button
                  className="w-full h-11 text-sm font-bold bg-amber-800 hover:bg-amber-900 text-white"
                  disabled={cartLines.length === 0}
                  onClick={handleSendOrder}
                >
                  <Coffee className="size-4 mr-2" />
                  Enviar al Barista & Cobrar ({mx(totalCart)})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal: Personalización de Café */}
      {customizingProduct && (
        <Dialog open={!!customizingProduct} onOpenChange={() => setCustomizingProduct(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Coffee className="size-5 text-amber-800" />
                Personalizar: {customizingProduct.name}
              </DialogTitle>
              <DialogDescription>
                Ajusta el tamaño del vaso, tipo de leche y sirope a gusto del comensal.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs py-2">
              {/* Tamaño de Vaso */}
              {customizingProduct.allowsSizeCustomization && (
                <div className="space-y-1.5">
                  <Label className="font-bold">Tamaño de Vaso</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      className={`p-2 rounded-lg border text-center font-bold ${
                        selectedSize === "8oz" ? "bg-amber-100 border-amber-800 text-amber-900" : "bg-background"
                      }`}
                      onClick={() => setSelectedSize("8oz")}
                    >
                      <p>8 oz (Chico)</p>
                      <span className="text-[10px] text-muted-foreground">- S/ 1.50</span>
                    </button>
                    <button
                      type="button"
                      className={`p-2 rounded-lg border text-center font-bold ${
                        selectedSize === "12oz" ? "bg-amber-100 border-amber-800 text-amber-900" : "bg-background"
                      }`}
                      onClick={() => setSelectedSize("12oz")}
                    >
                      <p>12 oz (Regular)</p>
                      <span className="text-[10px] text-muted-foreground">Estándar</span>
                    </button>
                    <button
                      type="button"
                      className={`p-2 rounded-lg border text-center font-bold ${
                        selectedSize === "16oz" ? "bg-amber-100 border-amber-800 text-amber-900" : "bg-background"
                      }`}
                      onClick={() => setSelectedSize("16oz")}
                    >
                      <p>16 oz (Grande)</p>
                      <span className="text-[10px] text-muted-foreground">+ S/ 2.50</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tipo de Leche */}
              {customizingProduct.allowsMilkCustomization && (
                <div className="space-y-1.5">
                  <Label className="font-bold">Tipo de Leche / Bebida</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className={`p-2 rounded-lg border text-left font-bold ${
                        selectedMilk === "entera" ? "bg-amber-100 border-amber-800 text-amber-900" : "bg-background"
                      }`}
                      onClick={() => setSelectedMilk("entera")}
                    >
                      🥛 Leche Entera
                      <p className="text-[10px] text-muted-foreground font-normal">Tradicional cremosa</p>
                    </button>
                    <button
                      type="button"
                      className={`p-2 rounded-lg border text-left font-bold ${
                        selectedMilk === "descremada" ? "bg-amber-100 border-amber-800 text-amber-900" : "bg-background"
                      }`}
                      onClick={() => setSelectedMilk("descremada")}
                    >
                      🥛 Descremada (Light)
                      <p className="text-[10px] text-muted-foreground font-normal">Baja en grasa</p>
                    </button>
                    <button
                      type="button"
                      className={`p-2 rounded-lg border text-left font-bold ${
                        selectedMilk === "almendras" ? "bg-amber-100 border-amber-800 text-amber-900" : "bg-background"
                      }`}
                      onClick={() => setSelectedMilk("almendras")}
                    >
                      🌱 Leche de Almendras
                      <p className="text-[10px] text-amber-800 font-semibold">+ S/ 3.00</p>
                    </button>
                    <button
                      type="button"
                      className={`p-2 rounded-lg border text-left font-bold ${
                        selectedMilk === "avena" ? "bg-amber-100 border-amber-800 text-amber-900" : "bg-background"
                      }`}
                      onClick={() => setSelectedMilk("avena")}
                    >
                      🌾 Leche de Avena Barista
                      <p className="text-[10px] text-amber-800 font-semibold">+ S/ 3.00</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Siropes y Adicionales */}
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label className="font-bold">Sirope / Saborizante (+S/ 2)</Label>
                  <select
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs font-semibold"
                    value={selectedSyrup}
                    onChange={(e) => setSelectedSyrup(e.target.value)}
                  >
                    <option value="Ninguno">Sin sirope</option>
                    <option value="Vainilla Francesa">Vainilla Francesa (+S/ 2)</option>
                    <option value="Caramelo Salado">Caramelo Salado (+S/ 2)</option>
                    <option value="Avellana Tostada">Avellana Tostada (+S/ 2)</option>
                  </select>
                </div>

                <div className="grid gap-1">
                  <Label className="font-bold">Nivel de Endulzante</Label>
                  <select
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={selectedSugar}
                    onChange={(e) => setSelectedSugar(e.target.value)}
                  >
                    <option value="Normal">Normal (Panela)</option>
                    <option value="Sin azúcar">Sin azúcar (Amargo)</option>
                    <option value="Stevia">Con Stevia natural</option>
                  </select>
                </div>
              </div>

              {/* Shot Extra de Espresso */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border bg-muted/20">
                <div>
                  <p className="font-bold">Shot Extra de Espresso</p>
                  <p className="text-[10px] text-muted-foreground">Mayor intensidad de cafeína (+30ml)</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-800">+ S/ 3.00</span>
                  <input
                    type="checkbox"
                    checked={extraShot}
                    onChange={(e) => setExtraShot(e.target.checked)}
                    className="size-4 accent-amber-800 rounded"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCustomizingProduct(null)}>
                Cancelar
              </Button>
              <Button className="bg-amber-800 hover:bg-amber-900 text-white font-bold" onClick={confirmCustomization}>
                Confirmar & Agregar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

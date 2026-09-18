"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
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
import { useHotelStore } from "@/lib/hotel-store"
import { formatMoney } from "@/lib/money"
import type { FrigobarProduct } from "@/lib/hotel-types"
import { PlusCircle, ShoppingBag, Beer, Coffee, Sparkles } from "lucide-react"

export default function ConsumosPage() {
  const { state, ready, addChargeToStay, addFrigobarProduct } = useHotelStore()
  const searchParams = useSearchParams()
  const mx = (n: number) => formatMoney(n)

  const activeStays = state.stays.filter((st) => st.status === "active")

  const [selectedStayId, setSelectedStayId] = useState(
    searchParams.get("stay") || activeStays[0]?.id || "",
  )
  const [selectedProductId, setSelectedProductId] = useState(
    state.frigobar[0]?.id || "",
  )
  const [qty, setQty] = useState("1")
  const [openNewProdModal, setOpenNewProdModal] = useState(false)

  // New product form
  const [newProdName, setNewProdName] = useState("")
  const [newProdCategory, setNewProdCategory] = useState<"bebida" | "snack" | "amenity">("bebida")
  const [newProdPrice, setNewProdPrice] = useState("5")

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando consumos…</p>
  }

  const currentStay = activeStays.find((st) => st.id === selectedStayId) ?? activeStays[0]
  const currentProd = state.frigobar.find((p) => p.id === selectedProductId)

  function handleAddCharge(e: React.FormEvent) {
    e.preventDefault()
    if (!currentStay || !currentProd) return

    const q = Math.max(1, Number(qty) || 1)
    addChargeToStay(currentStay.id, {
      description: currentProd.name,
      qty: q,
      unitPrice: currentProd.price,
    })

    setQty("1")
  }

  function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!newProdName.trim()) return

    addFrigobarProduct({
      name: newProdName.trim(),
      category: newProdCategory,
      price: Number(newProdPrice) || 0,
      stock: 20,
    })

    setNewProdName("")
    setOpenNewProdModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Consumos & Frigobar</h1>
          <p className="text-sm text-muted-foreground">
            Carga de bebidas, snacks y servicios a la cuenta de la habitación del huésped.
          </p>
        </div>
        <Button variant="outline" onClick={() => setOpenNewProdModal(true)}>
          <PlusCircle className="mr-1.5 size-4" />
          Añadir Producto a Catálogo
        </Button>
      </div>

      {activeStays.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center bg-card">
          <p className="font-semibold text-base">No hay habitaciones ocupadas en este momento</p>
          <p className="text-xs text-muted-foreground mt-1">
            Realiza un Check-in en el Rack de habitaciones para poder cargar consumos.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Panel Izquierdo: Formulario de Carga */}
          <Card className="lg:col-span-1 shadow-xs">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingBag className="size-4 text-primary" />
                Cargar a Habitación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCharge} className="space-y-4">
                <div className="grid gap-1">
                  <Label htmlFor="cstay">Habitación / Huésped</Label>
                  <select
                    id="cstay"
                    className="h-9 rounded-lg border border-input bg-background px-2 text-xs font-semibold"
                    value={currentStay?.id}
                    onChange={(e) => setSelectedStayId(e.target.value)}
                  >
                    {activeStays.map((st) => (
                      <option key={st.id} value={st.id}>
                        Hab. {st.roomNumber} — {st.guestName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="cprod">Producto de Frigobar / Snack</Label>
                  <select
                    id="cprod"
                    className="h-9 rounded-lg border border-input bg-background px-2 text-xs"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                  >
                    {state.frigobar.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {mx(p.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div className="grid gap-1">
                    <Label htmlFor="cqty">Cantidad</Label>
                    <Input
                      id="cqty"
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Subtotal a Cargar:</p>
                    <p className="text-base font-bold text-primary">
                      {mx((currentProd?.price || 0) * (Number(qty) || 1))}
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  + Cargar a la Cuenta
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Panel Derecho: Estado de Cuenta y Consumos de la Habitación Seleccionada */}
          <div className="lg:col-span-2 space-y-4">
            {currentStay && (
              <Card>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-base text-primary">
                        Habitación {currentStay.roomNumber}
                      </span>
                      <CardTitle className="text-lg mt-0.5">{currentStay.guestName}</CardTitle>
                      <p className="text-xs text-muted-foreground">Check-in: {currentStay.checkIn}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Saldo Pendiente Actual:</p>
                      <p className="text-xl font-bold text-rose-600 tabular-nums">
                        {mx(currentStay.balance)}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                      Consumos Cargados a la Habitación ({currentStay.charges.length})
                    </h4>

                    {currentStay.charges.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic py-3">
                        No hay consumos de frigobar cargados a esta habitación aún.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {currentStay.charges.map((ch) => (
                          <div
                            key={ch.id}
                            className="flex items-center justify-between bg-muted/30 p-2 rounded text-xs border"
                          >
                            <div>
                              <span className="font-medium text-foreground">{ch.description}</span>
                              <span className="text-muted-foreground ml-2">
                                ({ch.qty} × {mx(ch.unitPrice)})
                              </span>
                            </div>
                            <span className="font-bold tabular-nums">
                              {mx(ch.qty * ch.unitPrice)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Resumen Total de la Cuenta */}
                  <div className="bg-muted/40 p-3 rounded-lg text-xs space-y-1.5 border">
                    <div className="flex justify-between">
                      <span>Tarifa Hospedaje ({currentStay.duration} {currentStay.mode === "night" ? "noche(s)" : "horas"}):</span>
                      <span className="font-medium">{mx(currentStay.totalRoom)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Consumos Frigobar:</span>
                      <span className="font-medium">{mx(currentStay.totalCharges)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Adelanto Pagado al ingresar:</span>
                      <span>- {mx(currentStay.advance)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-1.5 border-t text-foreground">
                      <span>Total a Liquidar en Check-out:</span>
                      <span className="text-rose-600">{mx(currentStay.balance)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Modal: Crear Producto de Frigobar */}
      <Dialog open={openNewProdModal} onOpenChange={setOpenNewProdModal}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreateProduct} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Nuevo Producto de Frigobar / Bar</DialogTitle>
              <DialogDescription>
                Añade aguas, bebidas, golosinas o amenidades al catálogo del hotel.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label htmlFor="fgname">Nombre del Producto *</Label>
                <Input
                  id="fgname"
                  required
                  placeholder="Ej. Red Bull Energizante 250ml"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="fgcat">Categoría</Label>
                  <select
                    id="fgcat"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as any)}
                  >
                    <option value="bebida">Bebida / Gaseosa / Cerveza</option>
                    <option value="snack">Snack / Golosina</option>
                    <option value="amenity">Amenidad / Kit Personal</option>
                  </select>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="fgprice">Precio de Venta (S/)</Label>
                  <Input
                    id="fgprice"
                    type="number"
                    step="0.5"
                    min="0"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
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

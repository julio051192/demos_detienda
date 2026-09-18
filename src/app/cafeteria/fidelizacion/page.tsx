"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCafeteriaStore } from "@/lib/cafeteria-store"
import {
  Award,
  Coffee,
  PlusCircle,
  Search,
  CheckCircle2,
  Gift,
  Phone,
  Sparkles,
  Users,
} from "lucide-react"

export default function FidelizacionCafeteriaPage() {
  const { state, ready, addLoyaltyStamp, redeemFreeCoffee } = useCafeteriaStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [newCustomerName, setNewCustomerName] = useState("")
  const [newCustomerPhone, setNewCustomerPhone] = useState("9")
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando fidelización…</p>

  const filteredCards = state.loyaltyCards.filter(
    (c) =>
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm),
  )

  function handleCreateCard(e: React.FormEvent) {
    e.preventDefault()
    if (!newCustomerPhone.trim() || newCustomerPhone.length < 8) return

    addLoyaltyStamp(newCustomerPhone.trim(), newCustomerName.trim() || "Cliente")
    setNewCustomerName("")
    setNewCustomerPhone("9")
    setSuccessMsg("¡Tarjeta de sellos creada exitosamente con su primer sello!")
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  function handleRedeem(cardId: string, name: string) {
    redeemFreeCoffee(cardId)
    setSuccessMsg(`🎉 ¡Felicidades! Se ha canjeado 1 café de cortesía para ${name}.`)
    setTimeout(() => setSuccessMsg(null), 3500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-800 text-amber-100 border-amber-600">
              <Award className="size-3.5 mr-1" />
              Club del Café & Fidelización
            </Badge>
            <span className="text-xs text-muted-foreground">Regla: ¡El 6to Café es Gratis!</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight">Tarjetas Virtuales de Sellos</h1>
          <p className="text-sm text-muted-foreground">
            Incentiva la recompra de café de tus clientes habituales mediante acumulación de sellos automáticos por cada visita.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-100/90 dark:bg-emerald-950 p-3.5 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: Registro de Miembro (Izquierda) + Tarjetas Activas (Derecha) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Formulario de Registro Rápido */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="shadow-xs border-amber-800/20">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <PlusCircle className="size-4 text-amber-800" />
                Registrar Nuevo Miembro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCard} className="space-y-3 text-xs">
                <div className="grid gap-1">
                  <Label htmlFor="lphone">Número de WhatsApp (Identificador) *</Label>
                  <Input
                    id="lphone"
                    required
                    placeholder="Ej. 987 654 321"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                  />
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="lname">Nombre del Cliente *</Label>
                  <Input
                    id="lname"
                    required
                    placeholder="Ej. Valeria Mendoza"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full bg-amber-800 hover:bg-amber-900 text-white font-bold h-9">
                  <Award className="size-3.5 mr-1.5" />
                  Crear Tarjeta & Sumar Sello
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Banner Promocional */}
          <div className="rounded-xl border-2 border-dashed border-amber-400 p-4 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs">
              <Gift className="size-4 text-amber-600" />
              ¿Cómo funciona la promoción?
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              El cliente acumula 1 sello por cada bebida caliente o fría comprada. Al llegar al <strong>6to sello</strong>, el sistema habilita el botón dorado para canjear un Cappuccino o Americano gratis.
            </p>
          </div>
        </div>

        {/* Lista de Tarjetas de Sellos */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por teléfono o nombre..."
                className="pl-8 text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Badge variant="outline" className="text-xs">
              {filteredCards.length} clientes en el club
            </Badge>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {filteredCards.map((card) => {
              const canRedeem = card.stampsCount >= 6

              return (
                <Card
                  key={card.id}
                  className={`border-2 transition-all p-4 space-y-3 ${
                    canRedeem
                      ? "border-amber-500 bg-amber-50/30 dark:bg-amber-950/20 shadow-md"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{card.customerName}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                        <Phone className="size-3" />
                        {card.phone}
                      </p>
                    </div>
                    {canRedeem ? (
                      <Badge className="bg-amber-600 text-white font-bold text-[10px] animate-bounce">
                        🎉 ¡CANJE LISTO!
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        {card.stampsCount} / 6 sellos
                      </Badge>
                    )}
                  </div>

                  {/* Visual de los 6 Sellos */}
                  <div className="grid grid-cols-6 gap-1.5 py-1">
                    {[1, 2, 3, 4, 5, 6].map((num) => {
                      const isStamped = card.stampsCount >= num
                      const isFreeOne = num === 6

                      return (
                        <div
                          key={num}
                          className={`size-10 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                            isStamped
                              ? "border-amber-800 bg-amber-800 text-amber-100 font-bold shadow-xs scale-105"
                              : isFreeOne
                                ? "border-dashed border-amber-400 bg-amber-100/50 dark:bg-amber-950/40 text-amber-700"
                                : "border-border bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          {isStamped ? (
                            <Coffee className="size-4" />
                          ) : isFreeOne ? (
                            <Gift className="size-4" />
                          ) : (
                            <span className="text-[10px] font-mono">{num}</span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t">
                    <span>Canjeados: <strong>{card.freeCoffeesRedeemed}</strong></span>
                    <span>Última visita: {card.lastVisit}</span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {canRedeem ? (
                      <Button
                        size="xs"
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold h-8 text-xs"
                        onClick={() => handleRedeem(card.id, card.customerName)}
                      >
                        <Gift className="size-3.5 mr-1" />
                        Canjear Café Gratis Ahora
                      </Button>
                    ) : (
                      <Button
                        size="xs"
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => addLoyaltyStamp(card.phone, card.customerName)}
                      >
                        <PlusCircle className="size-3.5 mr-1" />
                        +1 Sello por Consumo
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

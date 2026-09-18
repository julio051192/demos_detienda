"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calculator, Check, Factory, Package, Scissors, Shirt } from "lucide-react"

const fabrics = [
  { name: "Gabardina", color: "Azul marino", stock: 42, price: 18 },
  { name: "Drill", color: "Beige", stock: 8, price: 16 },
  { name: "Jean", color: "Índigo", stock: 26, price: 22 },
  { name: "Pima", color: "Blanco", stock: 15, price: 28 },
]

export default function TextilPage() {
  const [length, setLength] = useState("10")
  const [width, setWidth] = useState("1.5")
  const [price, setPrice] = useState("18")
  const [orders, setOrders] = useState(["TX-2001 · Uniformes Clínica Norte", "TX-2002 · Polos corporativos"])
  const [customer, setCustomer] = useState("")
  const total = useMemo(() => Math.max(0, Number(length) || 0) * Math.max(0, Number(width) || 0) * Math.max(0, Number(price) || 0), [length, width, price])
  function addOrder() { if (customer.trim()) { setOrders((current) => [`TX-${2001 + current.length} · ${customer.trim()}`, ...current]); setCustomer("") } }
  return <div className="space-y-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><Badge className="mb-2 gap-1 bg-sky-100 text-sky-900 hover:bg-sky-100"><Scissors className="size-3.5" />Demo interna</Badge><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Textil & Confecciones</h1><p className="text-sm text-muted-foreground">Pedidos personalizados, telas, tallas, producción y despacho.</p></div><Button onClick={addOrder}><Factory className="mr-1.5 size-4" />Nueva orden</Button></div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Kpi label="Órdenes en producción" value="8" /><Kpi label="Metros en almacén" value="91 m" /><Kpi label="Alertas de tela" value="1" /><Kpi label="Caja pendiente" value="S/ 2,460" /></div>
    <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Factory className="size-5 text-sky-600" />Producción & Pedidos</CardTitle></CardHeader><CardContent className="space-y-3"><div className="grid gap-2 sm:grid-cols-[1fr_auto]"><Input value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Cliente o pedido nuevo" /><Button onClick={addOrder}>Agregar</Button></div>{orders.map((order, index) => <div key={order} className="flex items-center justify-between border-b pb-3 last:border-0"><div><p className="font-medium">{order}</p><p className="text-xs text-muted-foreground">{index === 0 ? "En producción" : "Presupuesto"} · Tallas S a XL</p></div><Button size="sm" variant="outline">{index === 0 ? "Listo" : "Confirmar"}<Check className="ml-1.5 size-3.5" /></Button></div>)}</CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="size-5 text-sky-600" />Cotizador por metros</CardTitle></CardHeader><CardContent className="space-y-3"><div className="grid gap-3 sm:grid-cols-3"><Input type="number" aria-label="Largo" placeholder="Largo" value={length} onChange={(event) => setLength(event.target.value)} /><Input type="number" aria-label="Ancho" placeholder="Ancho" value={width} onChange={(event) => setWidth(event.target.value)} /><Input type="number" aria-label="Precio por metro" placeholder="S/ por m" value={price} onChange={(event) => setPrice(event.target.value)} /></div><div className="rounded-lg bg-sky-50 p-4 text-sky-950 dark:bg-sky-950/30 dark:text-sky-100"><p className="text-xs opacity-70">Largo × ancho × precio/metro</p><p className="text-2xl font-bold">S/ {total.toFixed(2)}</p><p className="text-xs">Copia para WhatsApp: Tela {length} m × {width} m · Total S/ {total.toFixed(2)}</p></div><Button className="w-full" variant="outline" onClick={() => navigator.clipboard.writeText(`Cotización textil: ${length} m × ${width} m · S/ ${total.toFixed(2)}`)}>Copiar para WhatsApp</Button></CardContent></Card></div>
    <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Package className="size-5 text-sky-600" />Inventario de telas</CardTitle></CardHeader><CardContent className="space-y-3">{fabrics.map((fabric) => <div key={fabric.name} className="flex items-center justify-between border-b pb-3 last:border-0"><div><p className="font-medium">{fabric.name} · {fabric.color}</p><p className="text-xs text-muted-foreground">S/ {fabric.price} por metro</p></div><Badge variant={fabric.stock < 10 ? "destructive" : "secondary"}>{fabric.stock} m {fabric.stock < 10 ? "· Reponer" : ""}</Badge></div>)}</CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><Shirt className="size-5 text-sky-600" />Catálogo de prendas</CardTitle></CardHeader><CardContent className="grid gap-2"><div className="rounded-lg border p-3"><p className="font-medium">Polo corporativo</p><p className="text-xs text-muted-foreground">Tallas S–XXL · 6 colores</p></div><div className="rounded-lg border p-3"><p className="font-medium">Uniforme industrial</p><p className="text-xs text-muted-foreground">Gabardina · bordado incluido</p></div><div className="rounded-lg border p-3"><p className="font-medium">Mandil personalizado</p><p className="text-xs text-muted-foreground">Drill · logo frontal</p></div></CardContent></Card></div>
  </div>
}

function Kpi({ label, value }: { label: string; value: string }) { return <Card size="sm"><CardHeader><p className="text-xs text-muted-foreground">{label}</p><CardTitle className="text-2xl">{value}</CardTitle></CardHeader></Card> }
"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CalendarDays, Check, Flower2, MapPin, Plus, Truck } from "lucide-react"

const flowers = [
  { name: "Ramo de Rosas Rojas", category: "Rosas", price: 89, color: "bg-rose-100", popular: true },
  { name: "Girasoles Alegres", category: "Girasoles", price: 69, color: "bg-yellow-100", popular: true },
  { name: "Orquídea Blanca", category: "Orquídeas", price: 119, color: "bg-violet-100", popular: false },
  { name: "Arreglo Lirios", category: "Lirios", price: 99, color: "bg-pink-100", popular: false },
]

const initialOrders = [
  { id: "FL-1001", customer: "Ana Torres", detail: "Rosas rojas x 12", status: "Preparando", delivery: "Av. Lima 245" },
  { id: "FL-1002", customer: "Carlos Ruiz", detail: "Arreglo para cumpleaños", status: "Pendiente", delivery: "Jr. Los Pinos 80" },
  { id: "FL-1003", customer: "Hotel Central", detail: "Centros de mesa", status: "Listo", delivery: "Entrega en tienda" },
]

export default function FloreriaPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [customer, setCustomer] = useState("")
  const [selected, setSelected] = useState(flowers[0].name)
  const [event, setEvent] = useState("Boda")
  const [date, setDate] = useState("")
  const [message, setMessage] = useState("")
  function advance(id: string) {
    const statuses = ["Pendiente", "Preparando", "Listo", "Entregado"]
    setOrders((current) => current.map((order) => {
      if (order.id !== id) return order
      const next = statuses[(statuses.indexOf(order.status) + 1) % statuses.length]
      return { ...order, status: next }
    }))
  }
  function addOrder() {
    if (!customer.trim()) return
    setOrders((current) => [{ id: `FL-${1001 + current.length}`, customer: customer.trim(), detail: selected, status: "Pendiente", delivery: "Por coordinar" }, ...current])
    setCustomer("")
  }
  return <div className="space-y-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><Badge className="mb-2 gap-1 bg-rose-100 text-rose-900 hover:bg-rose-100"><Flower2 className="size-3.5" />Demo interna</Badge><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Florería & Eventos</h1><p className="text-sm text-muted-foreground">Pedidos, catálogo, agenda, delivery y caja diaria.</p></div><Button onClick={addOrder}><Plus className="mr-1.5 size-4" />Nuevo pedido</Button></div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Kpi label="Pedidos activos" value={String(orders.filter((order) => order.status !== "Entregado").length)} /><Kpi label="Listos para entregar" value={String(orders.filter((order) => order.status === "Listo").length)} /><Kpi label="Delivery hoy" value="6" /><Kpi label="Caja del día" value="S/ 1,248" /></div>
    <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]"><Card><CardHeader><CardTitle>Pedidos & Taller</CardTitle></CardHeader><CardContent className="space-y-3">{orders.map((order) => <div key={order.id} className="flex flex-col gap-2 border-b pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{order.id} · {order.customer}</p><p className="text-sm text-muted-foreground">{order.detail} · {order.delivery}</p></div><Button size="sm" variant="outline" onClick={() => advance(order.id)}>{order.status}<Check className="ml-1.5 size-3.5" /></Button></div>)}</CardContent></Card><Card><CardHeader><CardTitle>Registrar pedido</CardTitle></CardHeader><CardContent className="space-y-3"><Input value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Nombre del cliente" /><select className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm" value={selected} onChange={(event) => setSelected(event.target.value)}>{flowers.map((flower) => <option key={flower.name}>{flower.name}</option>)}</select><Button className="w-full" onClick={addOrder}>Guardar pedido</Button></CardContent></Card></div>
    <div className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="size-5 text-rose-600" />Agenda de eventos</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-3"><Input placeholder="Cliente / evento" value={message} onChange={(event) => setMessage(event.target.value)} /><select className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm" value={event} onChange={(event) => setEvent(event.target.value)}>{["Boda", "Cumpleaños", "Sepelio", "Corporativo"].map((item) => <option key={item}>{item}</option>)}</select><Input type="date" value={date} onChange={(event) => setDate(event.target.value)} /><p className="text-sm text-muted-foreground sm:col-span-3">{message ? `${event} · ${message} · ${date || "fecha pendiente"}` : "Registra aquí la próxima decoración o evento."}</p></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><Truck className="size-5 text-rose-600" />Delivery en ruta</CardTitle></CardHeader><CardContent className="space-y-3"><p className="text-sm"><MapPin className="mr-1 inline size-4" />FL-1002 · Jr. Los Pinos 80</p><p className="text-sm text-muted-foreground">Motorizado: Luis · Estado: preparando salida</p><Button variant="outline" size="sm">Actualizar seguimiento</Button></CardContent></Card></div>
  </div>
}

function Kpi({ label, value }: { label: string; value: string }) { return <Card size="sm"><CardHeader><p className="text-xs text-muted-foreground">{label}</p><CardTitle className="text-2xl">{value}</CardTitle></CardHeader></Card> }
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRestauranteStore } from "@/lib/restaurante-store"
import { formatMoney, todayISO } from "@/lib/money"
import { Bike, Phone, MapPin, Clock, PlusCircle, CheckCircle2 } from "lucide-react"

type DeliveryOrder = {
  id: string
  ticketCode: string
  clientName: string
  clientPhone: string
  address: string
  itemsSummary: string
  total: number
  driverName: string
  status: "preparando" | "en_camino" | "entregado"
  createdAt: string
}

export default function DeliveryRestaurantePage() {
  const mx = (n: number) => formatMoney(n)
  const today = todayISO()

  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([
    {
      id: "del-1",
      ticketCode: "#DEL-8001",
      clientName: "Juan Pérez",
      clientPhone: "987 123 456",
      address: "Av. Larco 450, Dpto 302, Miraflores",
      itemsSummary: "1/2 Pollo a la Brasa + 1 Jarra Chicha 1L",
      total: 59.0,
      driverName: "Rider Pedro (Motorizado 01)",
      status: "en_camino",
      createdAt: `${today} 13:05`,
    },
    {
      id: "del-2",
      ticketCode: "#DEL-8002",
      clientName: "Valeria Gómez",
      clientPhone: "912 987 654",
      address: "Calle Los Pinos 120, San Isidro",
      itemsSummary: "Ceviche Mixto + Arroz con Mariscos",
      total: 74.0,
      driverName: "Rider Luis (Motorizado 02)",
      status: "preparando",
      createdAt: `${today} 13:20`,
    },
    {
      id: "del-3",
      ticketCode: "#DEL-8003",
      clientName: "Esteban Quispe",
      clientPhone: "944 556 677",
      address: "Jr. Unión 890, Cercado",
      itemsSummary: "2x Lomo Saltado + 2x Inca Kola 500ml",
      total: 96.0,
      driverName: "Rider Pedro (Motorizado 01)",
      status: "entregado",
      createdAt: `${today} 12:30`,
    },
  ])

  function updateStatus(id: string, newStatus: DeliveryOrder["status"]) {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d)),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Delivery & Motorizados Repartidores</h1>
          <p className="text-sm text-muted-foreground">
            Gestión de pedidos telefónicos, WhatsApp y despacho con seguimiento en camino.
          </p>
        </div>
      </div>

      {/* Tarjetas KPI Delivery */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Pedidos en Preparación</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-amber-600">
              {deliveries.filter((d) => d.status === "preparando").length} pedidos
            </CardTitle>
            <p className="text-xs text-muted-foreground">En empaque y despacho</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Motorizados en Camino</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-blue-600">
              {deliveries.filter((d) => d.status === "en_camino").length} repartos
            </CardTitle>
            <p className="text-xs text-muted-foreground">Repartidores activos</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Entregados Hoy</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600">
              {deliveries.filter((d) => d.status === "entregado").length} entregados
            </CardTitle>
            <p className="text-xs text-muted-foreground">Cobrados satisfactoriamente</p>
          </CardHeader>
        </Card>
      </div>

      {/* Tabla de Repartos */}
      <div className="space-y-3">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Bike className="size-4 text-primary" />
          Monitoreo de Envíos a Domicilio ({deliveries.length})
        </h2>

        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente / Teléfono</TableHead>
                <TableHead>Dirección de Entrega</TableHead>
                <TableHead>Detalle Pedido</TableHead>
                <TableHead>Repartidor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((del) => (
                <TableRow key={del.id}>
                  <TableCell className="font-mono font-bold text-xs text-primary">
                    {del.ticketCode}
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-xs text-foreground">{del.clientName}</p>
                    <p className="text-[11px] text-muted-foreground">{del.clientPhone}</p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {del.address}
                  </TableCell>
                  <TableCell className="text-xs font-medium max-w-[180px] truncate">
                    {del.itemsSummary}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {del.driverName}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        del.status === "preparando"
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : del.status === "en_camino"
                            ? "bg-blue-100 text-blue-900 border-blue-300"
                            : "bg-emerald-100 text-emerald-900 border-emerald-300"
                      }
                    >
                      {del.status === "preparando"
                        ? "👨‍🍳 Preparando"
                        : del.status === "en_camino"
                          ? "🛵 En Camino"
                          : "✅ Entregado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-xs tabular-nums text-emerald-600">
                    {mx(del.total)}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {del.status === "preparando" && (
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => updateStatus(del.id, "en_camino")}
                      >
                        🛵 Enviar Moto
                      </Button>
                    )}
                    {del.status === "en_camino" && (
                      <Button
                        size="xs"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        onClick={() => updateStatus(del.id, "entregado")}
                      >
                        ✓ Entregado
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

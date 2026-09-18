"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  carWashStatusBadge,
  carWashStatusLabel,
  useCarWashStore,
  vehicleTypeLabel,
} from "@/lib/carwash-store"
import { formatMoney, todayISO } from "@/lib/money"
import type { CarWashStatus } from "@/lib/carwash-types"
import {
  Car,
  PlusCircle,
  Coins,
  QrCode,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Droplets,
  Search,
} from "lucide-react"

export default function CarWashDashboardPage() {
  const { state, ready, stats, updateTicketStatus, reset } = useCarWashStore()
  const mx = (n: number) => formatMoney(n)

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Iniciando sistema de Car Wash…</p>
  }

  const activeTickets = state.tickets.filter((t) => t.status !== "delivered")

  return (
    <div className="space-y-6">
      {/* Header superior */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 bg-cyan-100 text-cyan-900 border-cyan-300 dark:bg-cyan-950 dark:text-cyan-200">
              <Car className="size-3 text-cyan-600" />
              Demo Car Wash & Autolavado
            </Badge>
            <span className="text-xs text-muted-foreground">{todayISO()}</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
            Control de Pista & Bahías en Vivo
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingreso por placa, tiempos en bahía de lavado, secado y comisiones de operarios.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Restaurar datos
          </Button>
          <Button render={<Link href="/carwash/recepcion" />}>
            <PlusCircle className="mr-1.5 size-4" />
            Ingresar Vehículo (Placa)
          </Button>
          <Button variant="secondary" render={<Link href="/carwash/lavadores" />}>
            <Users className="mr-1.5 size-4" />
            Ver Comisiones
          </Button>
        </div>
      </div>

      {/* Tarjetas KPI de Caja y Rendimiento */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Caja Total Hoy</p>
              <Coins className="size-4 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {mx(stats.revenueToday)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Efectivo: {mx(stats.efectivoToday)} · Yape: {mx(stats.yapeToday)}
            </p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Vehículos Atendidos</p>
              <Car className="size-4 text-cyan-600" />
            </div>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {stats.vehiclesToday} unidades
            </CardTitle>
            <p className="text-xs text-muted-foreground">{stats.activeVehicles} actualmente en pista</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">En Bahías / Secado</p>
              <Droplets className="size-4 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold tabular-nums text-blue-600">
              {stats.washingCount + stats.dryingCount} en proceso
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {stats.washingCount} lavando · {stats.dryingCount} secando
            </p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Comisiones del Día</p>
              <Users className="size-4 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold tabular-nums text-purple-600">
              {mx(stats.totalCommissionsToday)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Para el equipo de lavadores</p>
          </CardHeader>
        </Card>
      </div>

      {/* Tablero Kanban de Pista en Vivo */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Estado de la Pista de Lavado ({activeTickets.length} vehículos)</h2>
          <span className="text-xs text-muted-foreground">Haz clic en el botón de la tarjeta para mover de bahía</span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Columna 1: En Lavado / Bahía */}
          <div className="rounded-xl border bg-muted/20 p-3 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <span>💦</span> En Bahía de Lavado
              </span>
              <Badge variant="outline">
                {activeTickets.filter((t) => t.status === "washing" || t.status === "waiting").length}
              </Badge>
            </div>

            {activeTickets.filter((t) => t.status === "washing" || t.status === "waiting").length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No hay vehículos lavándose ahora.</p>
            ) : (
              activeTickets
                .filter((t) => t.status === "washing" || t.status === "waiting")
                .map((ticket) => (
                  <CarCard
                    key={ticket.id}
                    ticket={ticket}
                    mx={mx}
                    onAdvance={() => updateTicketStatus(ticket.id, "drying")}
                    nextLabel="Mandar a Secado 🧽"
                  />
                ))
            )}
          </div>

          {/* Columna 2: En Secado & Aspirado */}
          <div className="rounded-xl border bg-muted/20 p-3 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <span>🧽</span> Secado & Aspirado
              </span>
              <Badge variant="outline">
                {activeTickets.filter((t) => t.status === "drying").length}
              </Badge>
            </div>

            {activeTickets.filter((t) => t.status === "drying").length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">Zona de secado despejada.</p>
            ) : (
              activeTickets
                .filter((t) => t.status === "drying")
                .map((ticket) => (
                  <CarCard
                    key={ticket.id}
                    ticket={ticket}
                    mx={mx}
                    onAdvance={() => updateTicketStatus(ticket.id, "ready")}
                    nextLabel="Marcar Terminado ✨"
                  />
                ))
            )}
          </div>

          {/* Columna 3: Listo para Salida */}
          <div className="rounded-xl border bg-muted/20 p-3 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <span>✨</span> Listo para Salida
              </span>
              <Badge variant="outline">
                {activeTickets.filter((t) => t.status === "ready").length}
              </Badge>
            </div>

            {activeTickets.filter((t) => t.status === "ready").length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">No hay vehículos esperando entrega.</p>
            ) : (
              activeTickets
                .filter((t) => t.status === "ready")
                .map((ticket) => (
                  <CarCard
                    key={ticket.id}
                    ticket={ticket}
                    mx={mx}
                    onAdvance={() => updateTicketStatus(ticket.id, "delivered")}
                    nextLabel="Entregar a Cliente ✅"
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CarCard({
  ticket,
  mx,
  onAdvance,
  nextLabel,
}: {
  ticket: any
  mx: (n: number) => string
  onAdvance: () => void
  nextLabel: string
}) {
  return (
    <Card className="shadow-xs hover:border-primary/50 transition-colors">
      <CardHeader className="p-3 pb-1">
        <div className="flex items-center justify-between">
          {/* Placa destacada tipo matrícula */}
          <span className="font-mono font-black text-sm bg-amber-300 text-slate-950 px-2 py-0.5 rounded border border-amber-400 tracking-wider">
            {ticket.plate}
          </span>
          <span className="text-xs text-muted-foreground font-medium">{ticket.entryTime}</span>
        </div>
        <CardTitle className="text-sm font-semibold mt-1.5 flex items-center justify-between">
          <span>{ticket.brandModel}</span>
          <span className="text-xs font-normal text-muted-foreground">
            {vehicleTypeLabel(ticket.vehicleType)}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 pt-1 space-y-2">
        <div className="bg-muted/40 rounded-md p-2 text-xs space-y-1">
          <div className="flex justify-between font-medium">
            <span>{ticket.serviceName}</span>
            <span className="text-primary font-bold">{mx(ticket.price)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground text-[11px]">
            <span>Lavador: <strong>{ticket.washerName}</strong></span>
            <span>{ticket.bay}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1 border-t">
          <div>
            <span className="text-muted-foreground">Pago: </span>
            <span className="capitalize font-medium">
              {ticket.paymentMethod === "yape_plin" ? "Yape / Plin" : ticket.paymentMethod}
            </span>
          </div>
          <div>
            {ticket.isPaid ? (
              <span className="text-emerald-600 font-semibold">Pagado ✓</span>
            ) : (
              <span className="text-amber-600 font-semibold">Pendiente ⚠️</span>
            )}
          </div>
        </div>

        {ticket.notes && (
          <p className="text-[11px] text-muted-foreground italic line-clamp-1">
            "{ticket.notes}"
          </p>
        )}

        <Button size="xs" className="w-full mt-2" onClick={onAdvance}>
          {nextLabel}
        </Button>
      </CardContent>
    </Card>
  )
}

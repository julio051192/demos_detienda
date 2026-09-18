"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  roomStatusBadge,
  roomStatusLabel,
  roomTypeLabel,
  useHotelStore,
} from "@/lib/hotel-store"
import { formatMoney, todayISO } from "@/lib/money"
import type { HotelRoom, RoomStatus } from "@/lib/hotel-types"
import {
  Building2,
  LogIn,
  LogOut,
  ShoppingBag,
  Coins,
  Percent,
  BedDouble,
  Sparkles,
  AlertCircle,
  PlusCircle,
} from "lucide-react"

export default function HotelDashboardPage() {
  const { state, ready, stats, setRoomStatus, checkOutGuest, reset } = useHotelStore()
  const mx = (n: number) => formatMoney(n)

  const [selectedRoomForAction, setSelectedRoomForAction] = useState<HotelRoom | null>(null)

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Iniciando sistema de hotel…</p>
  }

  // Group rooms by floor
  const floors = Array.from(new Set(state.rooms.map((r) => r.floor))).sort(
    (a, b) => a - b,
  )

  return (
    <div className="space-y-6">
      {/* Header superior */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200">
              <Building2 className="size-3 text-amber-600" />
              Demo Hotel & Hospedaje
            </Badge>
            <span className="text-xs text-muted-foreground">{todayISO()}</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
            Rack de Habitaciones en Vivo
          </h1>
          <p className="text-sm text-muted-foreground">
            Mapa interactivo de pisos, control de ocupación, check-in de huéspedes y cargos de frigobar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Restaurar datos
          </Button>
          <Button render={<Link href="/hotel/checkin" />}>
            <LogIn className="mr-1.5 size-4" />
            Nuevo Check-in
          </Button>
          <Button variant="secondary" render={<Link href="/hotel/consumos" />}>
            <ShoppingBag className="mr-1.5 size-4" />
            Cargar Frigobar
          </Button>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Ocupación Actual</p>
              <Percent className="size-4 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {stats.occupancyPercent}% Ocupado
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {stats.occupiedCount} de {stats.totalRooms} habitaciones en uso
            </p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Caja del Turno</p>
              <Coins className="size-4 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {mx(stats.revenueToday)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Hospedajes + Frigobar cobrados</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Disponibilidad</p>
              <BedDouble className="size-4 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600">
              {stats.availableCount} Libres
            </CardTitle>
            <p className="text-xs text-muted-foreground">{stats.cleaningCount} habitaciones en limpieza</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Saldos por Cobrar</p>
              <AlertCircle className="size-4 text-amber-600" />
            </div>
            <CardTitle className="text-2xl font-bold tabular-nums text-amber-600">
              {mx(stats.pendingBalancesTotal)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">En cuentas de huéspedes alojados</p>
          </CardHeader>
        </Card>
      </div>

      {/* Leyenda de Estados */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium bg-muted/40 p-3 rounded-lg border">
        <span className="text-muted-foreground">Leyenda del Rack:</span>
        <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
          <span className="size-2.5 rounded-full bg-emerald-500" /> Disponible
        </span>
        <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
          <span className="size-2.5 rounded-full bg-rose-500" /> Ocupada
        </span>
        <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
          <span className="size-2.5 rounded-full bg-amber-500" /> En Limpieza
        </span>
        <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <span className="size-2.5 rounded-full bg-slate-500" /> Mantenimiento
        </span>
      </div>

      {/* Rack de Habitaciones por Piso */}
      <div className="space-y-6">
        {floors.map((floorNum) => {
          const floorRooms = state.rooms.filter((r) => r.floor === floorNum)
          return (
            <div key={floorNum} className="space-y-3">
              <div className="flex items-center justify-between border-b pb-1.5">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  <span>Piso {floorNum}</span>
                </h2>
                <span className="text-xs text-muted-foreground">
                  {floorRooms.filter((r) => r.status === "available").length} libres · {floorRooms.filter((r) => r.status === "occupied").length} ocupadas
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {floorRooms.map((room) => {
                  const currentStay = state.stays.find(
                    (st) => st.id === room.currentStayId && st.status === "active",
                  )

                  return (
                    <Card
                      key={room.id}
                      className={`shadow-xs transition-all border-2 ${
                        room.status === "available"
                          ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20"
                          : room.status === "occupied"
                            ? "border-rose-300 dark:border-rose-800 bg-rose-50/30 dark:bg-rose-950/20"
                            : room.status === "cleaning"
                              ? "border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/20"
                              : "border-slate-300 dark:border-slate-800"
                      }`}
                    >
                      <CardHeader className="p-3 pb-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black tracking-tight text-foreground font-mono">
                              Hab. {room.number}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${roomStatusBadge(
                              room.status,
                            )}`}
                          >
                            {roomStatusLabel(room.status)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {roomTypeLabel(room.type)}
                        </p>
                      </CardHeader>

                      <CardContent className="p-3 pt-1 space-y-2">
                        {room.status === "available" && (
                          <div className="space-y-2 pt-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Noche: {mx(room.priceNight)}</span>
                              <span>Rato: {mx(room.priceHour)}</span>
                            </div>
                            <Button
                              size="xs"
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                              render={<Link href={`/hotel/checkin?room=${room.id}`} />}
                            >
                              <LogIn className="size-3.5 mr-1" />
                              Check-in Rápido
                            </Button>
                          </div>
                        )}

                        {room.status === "occupied" && currentStay && (
                          <div className="space-y-2 pt-1">
                            <div className="bg-background rounded-md p-2 border text-xs space-y-1">
                              <p className="font-semibold text-foreground truncate">
                                {currentStay.guestName}
                              </p>
                              <div className="flex justify-between text-[11px] text-muted-foreground">
                                <span>Salida: {currentStay.checkOutExpected}</span>
                                <span>DNI: {currentStay.docNumber}</span>
                              </div>
                              <div className="flex justify-between font-bold text-xs pt-1 border-t">
                                <span>Total: {mx(currentStay.total)}</span>
                                {currentStay.balance > 0 ? (
                                  <span className="text-rose-600">Debe: {mx(currentStay.balance)}</span>
                                ) : (
                                  <span className="text-emerald-600">Pagado</span>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                              <Button
                                size="xs"
                                variant="outline"
                                render={<Link href={`/hotel/consumos?stay=${currentStay.id}`} />}
                              >
                                + Frigobar
                              </Button>
                              <Button
                                size="xs"
                                variant="destructive"
                                render={<Link href={`/hotel/checkout?stay=${currentStay.id}`} />}
                              >
                                Check-out
                              </Button>
                            </div>
                          </div>
                        )}

                        {room.status === "cleaning" && (
                          <div className="space-y-2 pt-1 text-center">
                            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                              Camarera en limpieza y cambio de sábanas.
                            </p>
                            <Button
                              size="xs"
                              variant="secondary"
                              className="w-full bg-amber-200 text-amber-900 hover:bg-amber-300 dark:bg-amber-900 dark:text-amber-200"
                              onClick={() => setRoomStatus(room.id, "available")}
                            >
                              <Sparkles className="size-3.5 mr-1" />
                              Marcar Limpia y Liberar
                            </Button>
                          </div>
                        )}

                        {room.status === "maintenance" && (
                          <div className="space-y-2 pt-1 text-center">
                            <p className="text-xs text-muted-foreground">
                              Habitación bloqueada por mantenimiento.
                            </p>
                            <Button
                              size="xs"
                              variant="outline"
                              className="w-full"
                              onClick={() => setRoomStatus(room.id, "available")}
                            >
                              Habilitar Cuarto
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

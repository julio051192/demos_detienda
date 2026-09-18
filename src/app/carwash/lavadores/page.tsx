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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCarWashStore } from "@/lib/carwash-store"
import { formatMoney } from "@/lib/money"
import { PlusCircle, Users, Coins, CheckCircle2 } from "lucide-react"

export default function LavadoresPage() {
  const { state, ready, stats, addWasher } = useCarWashStore()
  const mx = (n: number) => formatMoney(n)

  const [openModal, setOpenModal] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando lavadores…</p>
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    addWasher({
      name: name.trim(),
      phone: phone.trim() || "Sin teléfono",
      active: true,
    })

    setName("")
    setPhone("")
    setOpenModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lavadores & Comisiones del Día</h1>
          <p className="text-sm text-muted-foreground">
            Control de productividad por operario y cálculo automático de comisiones ganadas hoy.
          </p>
        </div>
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle className="mr-1.5 size-4" />
          Nuevo Lavador
        </Button>
      </div>

      {/* KPI de comisiones */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <p className="text-xs text-muted-foreground font-medium">Total Comisiones Hoy</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-purple-600">
              {mx(stats.totalCommissionsToday)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Monto total a liquidar hoy</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs text-muted-foreground font-medium">Lavadores Activos</p>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {state.washers.length} operarios
            </CardTitle>
            <p className="text-xs text-muted-foreground">En turno de pista</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs text-muted-foreground font-medium">Vehículos Entregados Hoy</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600">
              {state.tickets.filter((t) => t.status === "delivered").length} autos/motos
            </CardTitle>
            <p className="text-xs text-muted-foreground">Lavados finalizados con comisión</p>
          </CardHeader>
        </Card>
      </div>

      {/* Tabla de liquidación por lavador */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lavador / Operario</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Vehículos Lavados Hoy</TableHead>
              <TableHead>Estado de Turno</TableHead>
              <TableHead className="text-right">Comisión Ganada Hoy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.washerCommissions.map((w) => {
              const washerInfo = state.washers.find((item) => item.id === w.washerId)
              return (
                <TableRow key={w.washerId}>
                  <TableCell className="font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-primary" />
                      <span>{w.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {washerInfo?.phone || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-bold">
                      {w.count} vehículo(s)
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">
                      Activo en Pista
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-base tabular-nums text-purple-600 dark:text-purple-400">
                    {mx(w.totalCommission)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Modal: Registrar Lavador */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Lavador / Operario</DialogTitle>
              <DialogDescription>
                Añade un miembro al equipo para asignarle vehículos y calcular sus comisiones.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3">
              <div className="grid gap-1">
                <Label htmlFor="wname">Nombre y Apellidos *</Label>
                <Input
                  id="wname"
                  required
                  placeholder="Ej. Christian Paucar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="wphone">Teléfono / WhatsApp</Label>
                <Input
                  id="wphone"
                  placeholder="Ej. 912 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Guardar Operario</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

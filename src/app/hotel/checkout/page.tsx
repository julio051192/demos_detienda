"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
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
import { useHotelStore } from "@/lib/hotel-store"
import { formatMoney } from "@/lib/money"
import type { GuestStay } from "@/lib/hotel-types"
import { LogOut, Receipt, CheckCircle2, Coins, Clock } from "lucide-react"

export default function CheckoutPage() {
  const { state, ready, checkOutGuest } = useHotelStore()
  const searchParams = useSearchParams()
  const mx = (n: number) => formatMoney(n)

  const activeStays = state.stays.filter((st) => st.status === "active")
  const preselected = searchParams.get("stay") || ""

  const [selectedStay, setSelectedStay] = useState<GuestStay | null>(
    activeStays.find((st) => st.id === preselected) ?? null,
  )
  const [confirmDone, setConfirmDone] = useState<GuestStay | null>(null)

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando módulo de salidas…</p>
  }

  function handleCheckout(stay: GuestStay) {
    checkOutGuest(stay.id)
    setConfirmDone(stay)
    setSelectedStay(null)
  }

  const todayCheckouts = state.stays.filter((st) => st.status === "checked_out")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Check-out (Salidas y Liquidación)</h1>
          <p className="text-sm text-muted-foreground">
            Liquidación de cuenta: hospedaje + consumos – adelanto = saldo a cobrar.
          </p>
        </div>
      </div>

      {/* Habitaciones con Check-out Pendiente */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <LogOut className="size-4 text-rose-600" />
          Huéspedes con Check-out Pendiente ({activeStays.length})
        </h2>

        {activeStays.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center bg-card">
            <CheckCircle2 className="size-8 mx-auto text-emerald-500 mb-2" />
            <p className="font-semibold text-base">No hay salidas pendientes</p>
            <p className="text-xs text-muted-foreground mt-1">
              Todos los huéspedes han realizado su Check-out.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeStays.map((stay) => (
              <Card
                key={stay.id}
                className="shadow-xs border-rose-200 dark:border-rose-900 bg-rose-50/30 dark:bg-rose-950/20"
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-lg text-primary">
                      Hab. {stay.roomNumber}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      {stay.balance > 0 ? `Debe ${mx(stay.balance)}` : "Pagado"}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold mt-0.5">{stay.guestName}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    DNI: {stay.docNumber} · {stay.ticketCode}
                  </p>
                </CardHeader>

                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 font-medium">
                    <Clock className="size-3.5" />
                    <span>Salida prevista: {stay.checkOutExpected}</span>
                  </div>

                  {/* Resumen de Cuenta */}
                  <div className="bg-background p-2.5 rounded-md border text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hospedaje:</span>
                      <span>{mx(stay.totalRoom)}</span>
                    </div>
                    {stay.totalCharges > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frigobar/Consumos:</span>
                        <span>{mx(stay.totalCharges)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Adelanto:</span>
                      <span className="text-emerald-600">- {mx(stay.advance)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t text-sm">
                      <span>TOTAL CUENTA:</span>
                      <span>{mx(stay.total)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-rose-600">
                      <span>SALDO A COBRAR:</span>
                      <span>{mx(stay.balance)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                    onClick={() => setSelectedStay(stay)}
                  >
                    <LogOut className="size-4 mr-1.5" />
                    Realizar Check-out
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Historial de Checkouts del Día */}
      {todayCheckouts.length > 0 && (
        <div className="space-y-3 pt-2">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600" />
            Salidas Registradas Hoy ({todayCheckouts.length})
          </h2>

          <div className="rounded-xl border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ficha</TableHead>
                  <TableHead>Habitación</TableHead>
                  <TableHead>Huésped</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Salida Real</TableHead>
                  <TableHead className="text-right">Total Cobrado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayCheckouts.map((st) => (
                  <TableRow key={st.id}>
                    <TableCell className="font-bold text-primary text-xs">{st.ticketCode}</TableCell>
                    <TableCell>
                      <span className="font-mono font-bold bg-muted px-1.5 py-0.5 rounded text-xs">
                        Hab. {st.roomNumber}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-xs">{st.guestName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{st.checkIn}</TableCell>
                    <TableCell className="text-xs text-emerald-600 font-medium">
                      {st.checkedOutAt || "—"}
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums text-emerald-600">
                      {mx(st.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Confirmación de Check-out */}
      <Dialog open={!!selectedStay} onOpenChange={() => setSelectedStay(null)}>
        <DialogContent className="sm:max-w-sm">
          {selectedStay && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-rose-700">
                  <LogOut className="size-5" />
                  Confirmar Check-out — Hab. {selectedStay.roomNumber}
                </DialogTitle>
              </DialogHeader>

              <div className="rounded-lg bg-muted/50 p-4 border text-sm space-y-2">
                <p className="font-bold text-foreground">{selectedStay.guestName}</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Hospedaje:</span>
                    <span>{mx(selectedStay.totalRoom)}</span>
                  </div>
                  {selectedStay.totalCharges > 0 && (
                    <div className="flex justify-between">
                      <span>Consumos frigobar:</span>
                      <span>{mx(selectedStay.totalCharges)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Adelanto pagado:</span>
                    <span className="text-emerald-600">- {mx(selectedStay.advance)}</span>
                  </div>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-base">
                  <span>
                    {selectedStay.balance > 0 ? "COBRAR EN CAJA:" : "CUENTA SALDADA:"}
                  </span>
                  <span
                    className={selectedStay.balance > 0 ? "text-rose-600" : "text-emerald-600"}
                  >
                    {mx(selectedStay.balance > 0 ? selectedStay.balance : selectedStay.total)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                La habitación pasará a estado <strong>🧹 En Limpieza</strong> automáticamente.
              </p>

              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedStay(null)}>
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                  onClick={() => handleCheckout(selectedStay)}
                >
                  <Coins className="size-4 mr-1.5" />
                  Cobrar y Confirmar Salida
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Ticket de salida exitosa */}
      <Dialog open={!!confirmDone} onOpenChange={() => setConfirmDone(null)}>
        <DialogContent className="sm:max-w-xs text-center">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <span className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-3xl">
                ✅
              </span>
            </div>
            <DialogTitle className="text-center text-emerald-700">
              Check-out Completado
            </DialogTitle>
          </DialogHeader>
          {confirmDone && (
            <div className="text-xs text-muted-foreground space-y-1 pb-2">
              <p className="font-semibold text-foreground">{confirmDone.guestName}</p>
              <p>Habitación {confirmDone.roomNumber} — {confirmDone.ticketCode}</p>
              <p className="text-emerald-700 font-bold text-sm">Total: {mx(confirmDone.total)}</p>
              <p className="text-amber-600 font-medium">
                La habitación está en limpieza y será liberada en breve.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button className="w-full" onClick={() => setConfirmDone(null)}>
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

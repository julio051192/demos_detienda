"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  garmentLabel,
  locationLabel,
  stageBadge,
  stageLabel,
  useBordadosStore,
} from "@/lib/bordados-store"
import { formatMoney, formatNumber, todayISO, addDays } from "@/lib/money"
import type { EmbroideryLocation, EmbroideryOrder, GarmentType } from "@/lib/bordados-types"
import { PlusCircle, Printer, Search, Scissors, FileCode, CheckCircle2 } from "lucide-react"

export default function OrdenesBordadosPage() {
  const { state, ready, addOrder, advanceStage } = useBordadosStore()
  const mx = (n: number) => formatMoney(n)

  const [openModal, setOpenModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<EmbroideryOrder | null>(null)
  const [search, setSearch] = useState("")

  // Form states
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientDoc, setClientDoc] = useState("")
  const [garmentType, setGarmentType] = useState<GarmentType>("polo_pique")
  const [garmentColor, setGarmentColor] = useState("Blanco")
  const [location, setLocation] = useState<EmbroideryLocation>("pecho_izquierdo")
  const [widthCm, setWidthCm] = useState("8.5")
  const [heightCm, setHeightCm] = useState("6")
  const [stitchCount, setStitchCount] = useState("8500")
  const [needsNewMatrix, setNeedsNewMatrix] = useState(true)
  const [matrixCost, setMatrixCost] = useState("25")
  const [pricePerThousand, setPricePerThousand] = useState("0.90")
  const [qty, setQty] = useState("30")
  const [advance, setAdvance] = useState("100")
  const [threadColorsStr, setThreadColorsStr] = useState("Azul Marino, Blanco, Dorado")
  const [notes, setNotes] = useState("")

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando órdenes…</p>

  // Cálculos dinámicos
  const stitches = Math.max(100, Number(stitchCount) || 1000)
  const rate = Math.max(0.1, Number(pricePerThousand) || 0.9)
  const countQty = Math.max(1, Number(qty) || 1)
  const matCost = needsNewMatrix ? Math.max(0, Number(matrixCost) || 0) : 0
  const stitchTotalForOrder = (stitches / 1000) * rate * countQty
  const totalCalculated = stitchTotalForOrder + matCost
  const advCalculated = Math.min(totalCalculated, Math.max(0, Number(advance) || 0))
  const balanceCalculated = Math.max(0, totalCalculated - advCalculated)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientName.trim()) return

    const threadColors = threadColorsStr
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)

    const today = todayISO()
    const promisedDate = addDays(today, 2)

    addOrder({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || "Sin teléfono",
      clientDoc: clientDoc.trim() || undefined,
      garmentType,
      garmentColor: garmentColor.trim() || "Varios",
      location,
      widthCm: Number(widthCm) || 8,
      heightCm: Number(heightCm) || 6,
      stitchCount: stitches,
      needsNewMatrix,
      matrixCost: matCost,
      pricePerThousandStitches: rate,
      unitPrice: Math.round((totalCalculated / countQty) * 100) / 100,
      qty: countQty,
      advance: advCalculated,
      threadColors: threadColors.length > 0 ? threadColors : ["Blanco"],
      promisedDate,
      notes: notes.trim() || undefined,
    })

    // Reset
    setClientName("")
    setClientPhone("")
    setOpenModal(false)
  }

  const filteredOrders = state.orders.filter(
    (o) =>
      o.clientName.toLowerCase().includes(search.toLowerCase()) ||
      o.ticketCode.toLowerCase().includes(search.toLowerCase()) ||
      o.clientPhone.includes(search),
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Órdenes de Bordado & Ficha Técnica</h1>
          <p className="text-sm text-muted-foreground">
            Cotización basada en conteo de puntadas, costo de ponchado/matrizado y emisión de ticket técnico.
          </p>
        </div>
        <Button onClick={() => setOpenModal(true)}>
          <PlusCircle className="mr-1.5 size-4" />
          Nueva Orden de Bordado
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, orden o teléfono…"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de Órdenes */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ficha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Prenda & Ubicación</TableHead>
              <TableHead>Puntadas</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Total Orden</TableHead>
              <TableHead>Saldo Pendiente</TableHead>
              <TableHead>Estado Taller</TableHead>
              <TableHead className="text-right">Ficha Técnica</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono font-bold text-violet-600">
                  {order.ticketCode}
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-xs text-foreground">{order.clientName}</p>
                  <p className="text-[11px] text-muted-foreground">{order.clientPhone}</p>
                </TableCell>
                <TableCell>
                  <p className="text-xs font-medium">{garmentLabel(order.garmentType)}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {locationLabel(order.location)} ({order.widthCm}x{order.heightCm}cm)
                  </p>
                </TableCell>
                <TableCell className="font-mono text-xs tabular-nums font-semibold text-violet-700 dark:text-violet-300">
                  {formatNumber(order.stitchCount)} puntadas
                </TableCell>
                <TableCell className="font-bold tabular-nums text-xs">
                  {order.qty} prendas
                </TableCell>
                <TableCell className="font-bold tabular-nums text-xs">
                  {mx(order.total)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {order.balance > 0 ? (
                    <span className="text-rose-600 font-bold text-xs">{mx(order.balance)}</span>
                  ) : (
                    <span className="text-emerald-600 font-bold text-xs">Saldado</span>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${stageBadge(order.stage)}`}
                  >
                    {stageLabel(order.stage)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Printer className="size-3.5 mr-1" />
                    Ver Ficha
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal: Registrar Nueva Orden */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Scissors className="size-5 text-violet-600" />
                Registrar Orden de Bordado
              </DialogTitle>
              <DialogDescription>
                Ingresa el conteo de puntadas, prendas y si requiere ponchado/matriz nueva.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 max-h-[65vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="bclient">Cliente / Empresa *</Label>
                  <Input
                    id="bclient"
                    required
                    placeholder="Ej. Colegio San Agustín"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="bphone">Teléfono / WhatsApp</Label>
                  <Input
                    id="bphone"
                    placeholder="Ej. 987 654 321"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Prenda y Ubicación */}
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="bgarm">Tipo de Prenda</Label>
                  <select
                    id="bgarm"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={garmentType}
                    onChange={(e) => setGarmentType(e.target.value as GarmentType)}
                  >
                    <option value="polo_pique">👕 Polo Piqué</option>
                    <option value="polo_cotton">👕 Polo Algodón</option>
                    <option value="gorra">🧢 Gorra</option>
                    <option value="casaca">🧥 Casaca / Polerón</option>
                    <option value="mandil">🦺 Mandil / Delantal</option>
                    <option value="pechear">🦺 Pechera / Chaleco</option>
                    <option value="parche">🏷️ Parche Termoadhesivo</option>
                    <option value="otros">📦 Prenda Varia</option>
                  </select>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="bloc">Ubicación del Bordado</Label>
                  <select
                    id="bloc"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={location}
                    onChange={(e) => setLocation(e.target.value as EmbroideryLocation)}
                  >
                    <option value="pecho_izquierdo">Pecho Izquierdo</option>
                    <option value="pecho_derecho">Pecho Derecho</option>
                    <option value="espalda_grande">Espalda Grande</option>
                    <option value="manga_derecha">Manga Derecha</option>
                    <option value="frente_gorra">Frente de Gorra</option>
                    <option value="costado_gorra">Costado de Gorra</option>
                  </select>
                </div>
              </div>

              {/* Medidas y Conteo de Puntadas */}
              <div className="rounded-lg border p-3 bg-muted/20 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="grid gap-1">
                    <Label htmlFor="bstitches">Conteo Puntadas</Label>
                    <Input
                      id="bstitches"
                      type="number"
                      step="500"
                      value={stitchCount}
                      onChange={(e) => setStitchCount(e.target.value)}
                      className="font-mono font-bold text-violet-700"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="brate">Tarifa/1,000 (S/)</Label>
                    <Input
                      id="brate"
                      type="number"
                      step="0.05"
                      value={pricePerThousand}
                      onChange={(e) => setPricePerThousand(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="bqty">N° de Prendas</Label>
                    <Input
                      id="bqty"
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 items-center pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <input
                      id="bmat"
                      type="checkbox"
                      className="size-4 rounded border-input text-primary"
                      checked={needsNewMatrix}
                      onChange={(e) => setNeedsNewMatrix(e.target.checked)}
                    />
                    <Label htmlFor="bmat" className="text-xs font-semibold cursor-pointer">
                      ¿Requiere Ponchado / Matriz Nueva?
                    </Label>
                  </div>

                  {needsNewMatrix && (
                    <div className="grid gap-1">
                      <Label htmlFor="bmatc">Costo de Matriz (S/)</Label>
                      <Input
                        id="bmatc"
                        type="number"
                        min="0"
                        value={matrixCost}
                        onChange={(e) => setMatrixCost(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Colores de hilo y Observaciones */}
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="bcolors">Colores de Hilo (separados por coma)</Label>
                  <Input
                    id="bcolors"
                    placeholder="Ej. Blanco Optico, Azul Marino, Dorado Metal"
                    value={threadColorsStr}
                    onChange={(e) => setThreadColorsStr(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="bnotes">Observaciones / Especificaciones Técnicas</Label>
                  <Input
                    id="bnotes"
                    placeholder="Ej. Bordado 3D con espuma EVA, hilo metálico..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              {/* Resumen del Pago */}
              <div className="grid grid-cols-2 gap-3 rounded-lg border p-3 bg-violet-50/50 dark:bg-violet-950/20 items-center">
                <div className="grid gap-1">
                  <Label htmlFor="badv">Adelanto Recibido (S/)</Label>
                  <Input
                    id="badv"
                    type="number"
                    min="0"
                    max={totalCalculated}
                    value={advance}
                    onChange={(e) => setAdvance(e.target.value)}
                  />
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-xs text-muted-foreground">Total Calculado:</p>
                  <p className="text-xl font-bold text-foreground">{mx(totalCalculated)}</p>
                  <p className="text-xs text-rose-600 font-semibold">
                    Saldo Pendiente: {mx(balanceCalculated)}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Guardar Orden y Enviar a Taller</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Ficha Técnica de Bordado Imprimible */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-md font-mono text-xs">
            <div className="border border-dashed p-4 rounded-lg bg-card space-y-3">
              <div className="text-center border-b pb-2">
                <h3 className="font-bold text-sm tracking-wider">TALLER DE BORDADOS COMPUTARIZADOS</h3>
                <p className="text-[10px] text-muted-foreground">FICHA TÉCNICA DE OPERARIO</p>
                <p className="text-[12px] font-bold mt-1 text-violet-600">
                  ORDEN DE TRABAJO: {selectedOrder.ticketCode}
                </p>
              </div>

              <div className="space-y-1">
                <p><strong>Cliente:</strong> {selectedOrder.clientName}</p>
                <p><strong>Teléfono:</strong> {selectedOrder.clientPhone}</p>
                <p><strong>Prenda:</strong> {garmentLabel(selectedOrder.garmentType)} ({selectedOrder.garmentColor})</p>
                <p><strong>Ubicación:</strong> {locationLabel(selectedOrder.location)}</p>
                <p><strong>Medidas:</strong> {selectedOrder.widthCm} cm (Ancho) × {selectedOrder.heightCm} cm (Alto)</p>
                <p className="text-violet-700 font-bold">
                  <strong>Puntadas por prenda:</strong> {formatNumber(selectedOrder.stitchCount)} puntadas
                </p>
                <p><strong>Cantidad total:</strong> {selectedOrder.qty} prendas</p>
                <p>
                  <strong>Matriz / Ponchado:</strong> {selectedOrder.needsNewMatrix ? "NUEVA (Diseñar .DST)" : "EXISTENTE (En archivo)"}
                </p>
              </div>

              <div className="border-t border-b py-2 space-y-1">
                <p className="font-bold text-[11px]">🎨 COLORES DE HILO REQUERIDOS:</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedOrder.threadColors.map((color, idx) => (
                    <span key={idx} className="bg-muted border px-2 py-0.5 rounded text-[10px] font-semibold">
                      {idx + 1}. {color}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1 border-b pb-2">
                <div className="flex justify-between">
                  <span>Total Orden:</span>
                  <span className="font-bold">{mx(selectedOrder.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Adelanto pagado:</span>
                  <span>{mx(selectedOrder.advance)}</span>
                </div>
                <div className="flex justify-between font-bold text-rose-600">
                  <span>SALDO A COBRAR EN ENTREGA:</span>
                  <span>{mx(selectedOrder.balance)}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <p className="text-[10px] italic text-muted-foreground">
                  Obs: {selectedOrder.notes}
                </p>
              )}

              <p className="text-[9px] text-center text-muted-foreground pt-1">
                Verificar muestra en retazo antes de iniciar la producción en máquina bordadora.
              </p>
            </div>
            <DialogFooter>
              <Button size="sm" className="w-full" onClick={() => setSelectedOrder(null)}>
                Cerrar Ficha
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatMoney, formatNumber } from "@/lib/money"
import { Calculator, Copy, Check, Scissors, HelpCircle } from "lucide-react"

export default function CotizadorBordadosPage() {
  const mx = (n: number) => formatMoney(n)

  const [garmentName, setGarmentName] = useState("Polos Piqué")
  const [locationName, setLocationName] = useState("Pecho Izquierdo")
  const [stitchCount, setStitchCount] = useState(8500)
  const [qty, setQty] = useState(50)
  const [ratePerThousand, setRatePerThousand] = useState(0.9)
  const [needsMatrix, setNeedsMatrix] = useState(true)
  const [matrixPrice, setMatrixPrice] = useState(30)
  const [copied, setCopied] = useState(false)

  // Calculations
  const stitchCostPerGarment = (stitchCount / 1000) * ratePerThousand
  const matrixCostPerGarment = needsMatrix && qty > 0 ? matrixPrice / qty : 0
  const unitPrice = Math.round((stitchCostPerGarment + matrixCostPerGarment) * 100) / 100
  const totalOrder = unitPrice * qty

  function getWhatsAppQuoteText() {
    return `🧵 *COTIZACIÓN DE BORDADO COMPUTARIZADO*
— — — — — — — — — — — — — —
• *Prenda:* ${garmentName}
• *Ubicación:* ${locationName}
• *Puntadas estimadas:* ${formatNumber(stitchCount)} puntadas
• *Cantidad:* ${qty} prendas
• *Matriz / Ponchado:* ${needsMatrix ? `Nuevo (+${mx(matrixPrice)})` : "Incluido (Existente)"}
— — — — — — — — — — — — — —
💵 *Precio Unitario:* ${mx(unitPrice)} por prenda
💰 *TOTAL ESTIMADO:* ${mx(totalOrder)}
— — — — — — — — — — — — — —
*Tiempo estimado:* 24 a 48 horas tras aprobación de muestra.`
  }

  function handleCopy() {
    navigator.clipboard.writeText(getWhatsAppQuoteText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cotizador Express por Millar de Puntadas</h1>
          <p className="text-sm text-muted-foreground">
            Calculadora instantánea de bordados para presupuestos rápidos en mostrador o enviar por WhatsApp.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Panel de Parámetros */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="size-4 text-violet-600" />
              Parámetros de la Cotización
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label htmlFor="cgarm">Prenda / Producto</Label>
                <Input
                  id="cgarm"
                  value={garmentName}
                  onChange={(e) => setGarmentName(e.target.value)}
                  placeholder="Ej. Gorras, Polos, Casacas..."
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="cloc">Ubicación</Label>
                <Input
                  id="cloc"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Ej. Pecho, Espalda, Frente..."
                />
              </div>
            </div>

            {/* Slider / Input Puntadas */}
            <div className="space-y-2 rounded-lg border p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <Label htmlFor="cst">Conteo de Puntadas Estimado</Label>
                <span className="font-mono font-bold text-violet-700 dark:text-violet-300 text-sm">
                  {formatNumber(stitchCount)} puntadas
                </span>
              </div>
              <input
                id="cst-range"
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={stitchCount}
                onChange={(e) => setStitchCount(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Pequeño (3k)</span>
                <span>Pecho (9k)</span>
                <span>Mediano (18k)</span>
                <span>Espalda Grande (35k+)</span>
              </div>
            </div>

            {/* Slider / Input Cantidad */}
            <div className="space-y-2 rounded-lg border p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <Label htmlFor="cqty">Cantidad de Prendas</Label>
                <span className="font-bold text-foreground text-sm">
                  {qty} unidades
                </span>
              </div>
              <input
                id="cqty-range"
                type="range"
                min="1"
                max="500"
                step="5"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>

            {/* Tarifa y Matrizado */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div className="grid gap-1">
                <Label htmlFor="crate">Tarifa por 1,000 Puntadas (S/)</Label>
                <Input
                  id="crate"
                  type="number"
                  step="0.05"
                  value={ratePerThousand}
                  onChange={(e) => setRatePerThousand(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    id="cmat-chk"
                    type="checkbox"
                    checked={needsMatrix}
                    onChange={(e) => setNeedsMatrix(e.target.checked)}
                    className="size-4 rounded border-input text-violet-600"
                  />
                  <Label htmlFor="cmat-chk" className="text-xs font-medium cursor-pointer">
                    Diseñar Matriz Nueva
                  </Label>
                </div>
                {needsMatrix && (
                  <Input
                    type="number"
                    value={matrixPrice}
                    onChange={(e) => setMatrixPrice(Number(e.target.value))}
                    placeholder="Costo ponchado"
                    className="h-8 text-xs"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Resultado y Copiado WhatsApp */}
        <Card className="shadow-xs border-violet-300 dark:border-violet-800 bg-violet-50/20 dark:bg-violet-950/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Resultado del Presupuesto</span>
              <Badge variant="secondary" className="bg-violet-100 text-violet-800 border-violet-300">
                Resumen Express
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-background border p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Bordado ({formatNumber(stitchCount)} puntadas):</span>
                <span className="font-bold">{mx(stitchCostPerGarment)} / prenda</span>
              </div>

              {needsMatrix && (
                <div className="flex justify-between border-b pb-2 text-amber-700 dark:text-amber-300">
                  <span>Matriz / Ponchado ({mx(matrixPrice)} / {qty}u):</span>
                  <span className="font-bold">+{mx(matrixCostPerGarment)} / prenda</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm pt-1">
                <span className="font-bold">PRECIO UNITARIO:</span>
                <span className="font-black text-violet-700 dark:text-violet-300 text-lg">
                  {mx(unitPrice)}
                </span>
              </div>

              <div className="flex justify-between items-center text-base pt-2 border-t font-sans">
                <span className="font-bold">TOTAL ESTIMADO ({qty} prendas):</span>
                <span className="font-black text-2xl text-emerald-600 dark:text-emerald-400">
                  {mx(totalOrder)}
                </span>
              </div>
            </div>

            {/* Vista Previa del Texto de WhatsApp */}
            <div className="rounded-lg border bg-card p-3 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Texto Formateado para WhatsApp:
              </p>
              <pre className="text-[11px] font-mono whitespace-pre-wrap text-muted-foreground bg-muted/40 p-2.5 rounded border">
                {getWhatsAppQuoteText()}
              </pre>

              <Button
                onClick={handleCopy}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                {copied ? <Check className="size-4 mr-2" /> : <Copy className="size-4 mr-2" />}
                {copied ? "¡Copiado al Portapapeles!" : "Copiar Cotización para WhatsApp"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

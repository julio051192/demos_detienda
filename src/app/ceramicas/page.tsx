"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatMoney, todayISO } from "@/lib/money"
import { useCeramicasStore, type CeramicProduct } from "@/lib/ceramicas-store"
import { AlertTriangle, Calculator, FileText, Package, Printer, RotateCcw } from "lucide-react"

export default function CeramicasPage() {
  const { state, ready, stats, reset, addQuote, updateProduct, deleteProduct, deleteQuote } = useCeramicasStore()
  const [customer, setCustomer] = useState("")
  const [project, setProject] = useState("")
  const [area, setArea] = useState("20")
  const [waste, setWaste] = useState("10")
  const [productId, setProductId] = useState("c1")
  const [lastQuote, setLastQuote] = useState<typeof state.quotes[number] | null>(null)
  const product = state.products.find((item) => item.id === productId) ?? state.products[0]
  const calculation = useMemo(() => {
    const squareMeters = Math.max(0, Number(area) || 0) * (1 + Math.max(0, Number(waste) || 0) / 100)
    const quantity = product ? Math.ceil(squareMeters / product.coverage) : 0
    return { squareMeters, quantity, total: quantity * (product?.price ?? 0) }
  }, [area, waste, product])

  function createQuote() {
    if (!customer.trim() || !project.trim() || !product) return
    const quote = { customer: customer.trim(), project: project.trim(), area: Number(area) || 0, waste: Number(waste) || 0, total: calculation.total, lines: [{ productId: product.id, quantity: calculation.quantity, unitPrice: product.price }] }
    addQuote(quote)
    setLastQuote({ ...quote, id: "preview", number: `COT-${String(state.quotes.length + 1).padStart(4, "0")}`, date: todayISO() })
  }

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando sistema de cerámicas…</p>

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div><Badge className="mb-2 gap-1 bg-amber-100 text-amber-900 hover:bg-amber-100"><Package className="size-3.5" />Demo interna · Sin SUNAT</Badge><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Acabados & Cerámicas</h1><p className="text-sm text-muted-foreground">Cotiza materiales por m², controla cajas y entrega comprobantes internos en PDF.</p></div>
      <Button variant="outline" onClick={reset}><RotateCcw className="mr-1.5 size-4" />Restaurar datos</Button>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Kpi label="Productos" value={String(stats.products)} hint="Catálogo activo" /><Kpi label="Stock valorizado" value={formatMoney(stats.inventoryValue)} hint="Precio de venta" /><Kpi label="Bajo mínimo" value={String(stats.lowStock)} hint="Revisar reposición" alert={stats.lowStock > 0} /><Kpi label="Cotizaciones" value={String(stats.quotes)} hint="Comprobantes internos" /></div>

    <div id="cotizador" className="grid scroll-mt-24 gap-4 lg:grid-cols-[1.1fr_.9fr]">
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="size-5 text-amber-600" />Cotizador por m²</CardTitle><p className="text-sm text-muted-foreground">Calcula cajas completas incluyendo desperdicio.</p></CardHeader><CardContent className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2"><div className="grid gap-1.5"><Label>Cliente</Label><Input value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Nombre del cliente" /></div><div className="grid gap-1.5"><Label>Obra o ambiente</Label><Input value={project} onChange={(event) => setProject(event.target.value)} placeholder="Ej. Cocina y comedor" /></div></div>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1.5fr]"><div className="grid gap-1.5"><Label>Área (m²)</Label><Input type="number" min="0" value={area} onChange={(event) => setArea(event.target.value)} /></div><div className="grid gap-1.5"><Label>Desperdicio (%)</Label><Input type="number" min="0" value={waste} onChange={(event) => setWaste(event.target.value)} /></div><div className="grid gap-1.5"><Label>Material</Label><select className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm" value={product?.id} onChange={(event) => setProductId(event.target.value)}>{state.products.filter((item) => item.coverage > 1).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div></div>
        <div className="grid gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100 sm:grid-cols-3"><div><p className="text-xs opacity-70">Área con desperdicio</p><p className="text-xl font-bold">{calculation.squareMeters.toFixed(2)} m²</p></div><div><p className="text-xs opacity-70">Cantidad sugerida</p><p className="text-xl font-bold">{calculation.quantity} {product?.unit}s</p></div><div><p className="text-xs opacity-70">Total estimado</p><p className="text-xl font-bold">{formatMoney(calculation.total)}</p></div></div>
        <Button onClick={createQuote} disabled={!customer.trim() || !project.trim()}><FileText className="mr-1.5 size-4" />Guardar cotización</Button>
      </CardContent></Card>

      <Card id="inventario" className="scroll-mt-24"><CardHeader><CardTitle>Inventario rápido</CardTitle><p className="text-sm text-muted-foreground">Stock por caja, saco y unidad. Puedes modificar precio, stock y mínimo.</p></CardHeader><CardContent className="space-y-3">{state.products.map((item) => <InventoryRow key={item.id} product={item} onSave={updateProduct} onDelete={deleteProduct} />)}</CardContent></Card>
    </div>

    <Card id="cotizaciones" className="scroll-mt-24"><CardHeader><CardTitle>Últimas cotizaciones</CardTitle></CardHeader><CardContent>{state.quotes.length === 0 ? <p className="text-sm text-muted-foreground">Todavía no hay cotizaciones.</p> : <div className="space-y-3">{state.quotes.slice(0, 5).map((quote) => <div key={quote.id} className="flex flex-col gap-3 border-b pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium">{quote.number} · {quote.customer}</p><p className="text-sm text-muted-foreground">{quote.project} · {quote.area} m² · {quote.date}</p></div><div className="flex items-center justify-between gap-2"><strong>{formatMoney(quote.total)}</strong><Button size="sm" variant="outline" onClick={() => { setLastQuote(quote); setTimeout(() => window.print(), 0) }}><Printer className="mr-1.5 size-4" />PDF</Button><Button size="sm" variant="ghost" onClick={() => { if (window.confirm(`¿Borrar la cotización ${quote.number}?`)) deleteQuote(quote.id) }}>Borrar</Button></div></div>)}</div>}</CardContent></Card>

    {lastQuote && <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"><Card className="w-full max-w-md print:shadow-none"><CardHeader><CardTitle>Comprobante interno {lastQuote.number}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><div className="space-y-1"><p><strong>Acabados & Cerámicas</strong></p><p>Fecha: {lastQuote.date}</p><p>Cliente: {lastQuote.customer}</p><p>Obra: {lastQuote.project}</p></div><div className="border-y py-3"><p>{state.products.find((item) => item.id === lastQuote.lines[0]?.productId)?.name}</p><p>{lastQuote.lines[0]?.quantity} cajas · {lastQuote.area} m² + {lastQuote.waste}% desperdicio</p></div><p className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatMoney(lastQuote.total)}</span></p><p className="text-xs text-muted-foreground">Documento interno no tributario. Puedes elegir “Guardar como PDF” al imprimir.</p><div className="flex justify-end gap-2 print:hidden"><Button variant="outline" onClick={() => setLastQuote(null)}>Cerrar</Button><Button onClick={() => window.print()}><Printer className="mr-1.5 size-4" />Imprimir / PDF</Button></div></CardContent></Card></div>}
  </div>
}

function Kpi({ label, value, hint, alert = false }: { label: string; value: string; hint: string; alert?: boolean }) { return <Card size="sm"><CardHeader><p className="text-xs text-muted-foreground">{label}</p><CardTitle className={alert ? "text-2xl text-amber-600" : "text-2xl"}>{value}</CardTitle><p className="text-xs text-muted-foreground">{hint}</p></CardHeader></Card> }

function InventoryRow({ product, onSave, onDelete }: { product: CeramicProduct; onSave: (id: string, changes: Partial<Omit<CeramicProduct, "id">>) => void; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [price, setPrice] = useState(String(product.price))
  const [stock, setStock] = useState(String(product.stock))
  const [minStock, setMinStock] = useState(String(product.minStock))
  const low = product.stock <= product.minStock
  function save() {
    onSave(product.id, { price: Math.max(0, Number(price) || 0), stock: Math.max(0, Number(stock) || 0), minStock: Math.max(0, Number(minStock) || 0) })
    setEditing(false)
  }
  return <div className="border-b pb-2 last:border-0 last:pb-0"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{product.name}</p><p className="text-xs text-muted-foreground">{product.sku} · {formatMoney(product.price)} · {product.coverage} m²/{product.unit}</p></div><Badge variant={low ? "destructive" : "secondary"} className="shrink-0 gap-1">{low && <AlertTriangle className="size-3" />}{product.stock} {product.unit}s</Badge></div>{editing ? <div className="mt-3 grid gap-2 sm:grid-cols-4"><Input type="number" aria-label="Precio" value={price} onChange={(event) => setPrice(event.target.value)} /><Input type="number" aria-label="Stock" value={stock} onChange={(event) => setStock(event.target.value)} /><Input type="number" aria-label="Stock mínimo" value={minStock} onChange={(event) => setMinStock(event.target.value)} /><div className="flex gap-2"><Button size="sm" onClick={save}>Guardar</Button><Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancelar</Button></div></div> : <div className="mt-2 flex gap-2"><Button size="sm" variant="outline" onClick={() => setEditing(true)}>Editar</Button><Button size="sm" variant="ghost" onClick={() => { if (window.confirm(`¿Borrar ${product.name}?`)) onDelete(product.id) }}>Borrar</Button></div>}</div>
}
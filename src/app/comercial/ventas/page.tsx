"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { DocumentLines } from "@/components/document-lines"
import { lineTotal, useErpStore } from "@/lib/erp-store"
import { formatMoney } from "@/lib/money"

export default function VentasPage() {
  const { state, ready, registerSale } = useErpStore()
  const [open, setOpen] = useState(false)
  const mx = (n: number) => formatMoney(n)

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando ventas…</p>
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ventas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cada venta descuenta stock al instante. Sirve en caja local o desde
            un celular en la calle.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} disabled={state.products.length === 0}>
          Nueva venta
        </Button>
      </div>

      {state.sales.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">No hay ventas</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Registra la primera para ver el kardex moverse.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Ítems</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.sales.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.customer}</TableCell>
                  <TableCell>{s.date}</TableCell>
                  <TableCell>{s.lines.length}</TableCell>
                  <TableCell>{mx(lineTotal(s.lines))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar venta</DialogTitle>
            <DialogDescription>
              El precio sale del inventario. El stock baja al guardar.
            </DialogDescription>
          </DialogHeader>
          <DocumentLines
            products={state.products}
            priceKey="price"
            nameLabel="Cliente"
            namePlaceholder="Bodega, mostrador, RUC…"
            submitLabel="Cobrar y descontar stock"
            onSubmit={({ party, lines }) => {
              registerSale({ customer: party, lines })
              setOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

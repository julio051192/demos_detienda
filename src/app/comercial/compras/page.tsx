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

export default function ComprasPage() {
  const { state, ready, registerPurchase } = useErpStore()
  const [open, setOpen] = useState(false)
  const mx = (n: number) => formatMoney(n)

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando compras…</p>
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Compras</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            La compra entra al inventario y actualiza el costo. El almacén y la
            oficina ven lo mismo.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} disabled={state.products.length === 0}>
          Nueva compra
        </Button>
      </div>

      {state.purchases.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">No hay compras</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Registra un ingreso de mercadería para subir stock.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proveedor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Ítems</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.purchases.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.supplier}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>{p.lines.length}</TableCell>
                  <TableCell>{mx(lineTotal(p.lines))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar compra</DialogTitle>
            <DialogDescription>
              Entra al stock al costo que indiques en el producto.
            </DialogDescription>
          </DialogHeader>
          <DocumentLines
            products={state.products}
            priceKey="cost"
            nameLabel="Proveedor"
            namePlaceholder="Distribuidora, mayorista…"
            submitLabel="Ingresar a almacén"
            onSubmit={({ party, lines }) => {
              registerPurchase({ supplier: party, lines })
              setOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DocLine, Product } from "@/lib/erp-types"
import { formatMoney } from "@/lib/money"

export function DocumentLines({
  products,
  priceKey,
  onSubmit,
  submitLabel,
  nameLabel,
  namePlaceholder,
}: {
  products: Product[]
  priceKey: "price" | "cost"
  onSubmit: (payload: { party: string; lines: DocLine[] }) => void
  submitLabel: string
  nameLabel: string
  namePlaceholder: string
}) {
  const [party, setParty] = useState("")
  const [productId, setProductId] = useState(products[0]?.id ?? "")
  const [qty, setQty] = useState("1")
  const [lines, setLines] = useState<DocLine[]>([])
  const mx = (n: number) => formatMoney(n)
  const product = products.find((p) => p.id === productId)

  function addLine() {
    if (!product) return
    const q = Math.max(1, Number(qty) || 1)
    const capped =
      priceKey === "price" ? Math.min(q, Math.max(0, product.stock)) : q
    if (capped <= 0) return
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id)
      if (existing) {
        const nextQty =
          priceKey === "price"
            ? Math.min(existing.qty + capped, product.stock)
            : existing.qty + capped
        return prev.map((l) =>
          l.productId === product.id ? { ...l, qty: nextQty } : l,
        )
      }
      return [
        ...prev,
        { productId: product.id, qty: capped, unitPrice: product[priceKey] },
      ]
    })
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!party.trim() || lines.length === 0) return
    onSubmit({ party: party.trim(), lines })
    setParty("")
    setLines([])
    setQty("1")
  }

  const total = lines.reduce((n, l) => n + l.qty * l.unitPrice, 0)

  if (products.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Primero registra productos en Inventarios.
      </p>
    )
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="grid gap-1.5">
        <Label>{nameLabel}</Label>
        <Input
          required
          value={party}
          onChange={(e) => setParty(e.target.value)}
          placeholder={namePlaceholder}
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-[1fr_90px_auto]">
        <select
          className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} · stock {p.stock}
            </option>
          ))}
        </select>
        <Input
          inputMode="numeric"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
        <Button type="button" variant="outline" onClick={addLine}>
          Agregar
        </Button>
      </div>
      {lines.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin ítems todavía.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {lines.map((l) => {
            const p = products.find((x) => x.id === l.productId)
            return (
              <li key={l.productId} className="flex justify-between gap-3">
                <span>
                  {p?.name} × {l.qty}
                </span>
                <span className="tabular-nums">{mx(l.qty * l.unitPrice)}</span>
              </li>
            )
          })}
          <li className="flex justify-between border-t pt-1 font-medium">
            <span>Total</span>
            <span className="tabular-nums">{mx(total)}</span>
          </li>
        </ul>
      )}
      <Button type="submit" disabled={lines.length === 0}>
        {submitLabel}
      </Button>
    </form>
  )
}

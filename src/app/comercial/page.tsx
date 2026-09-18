"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { lineTotal, roleLabel, useErpStore } from "@/lib/erp-store"
import { formatMoney, todayISO } from "@/lib/money"

export default function ComercialHomePage() {
  const { state, ready, stats, reset, currentUser } = useErpStore()
  const mx = (n: number) => formatMoney(n)

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Levantando la red de 3 puestos…</p>
  }

  const low = state.products.filter((p) => p.stock <= p.minStock)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Nube + red local · 3 usuarios · {todayISO()}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Sistema Lalo listo para operar</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Sistema comercial instalado en la nube, operable en red local y remoto
            por navegador. Módulos integrados de Ventas, Compras e Inventarios.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={reset}>
            Restaurar datos
          </Button>
          <Button render={<Link href="/comercial/ventas" />}>Registrar venta</Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 text-sm">
        <p className="font-medium">Requisito vs. lo que hay ahora</p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          <li>✓ Instalable en la nube (app web, se publica en un hosting)</li>
          <li>✓ Red de mínimo 3 usuarios (admin, ventas, almacén)</li>
          <li>✓ Local y remoto por protocolo web (navegador en LAN o internet)</li>
          <li>✓ Módulos: ventas, compras e inventarios, enlazados al stock</li>
          <li className="text-muted-foreground">
            △ Puesta inmediata = demo hoy. Producción real (dominio, backups, 3
            cuentas) en 3–7 días si cierran.
          </li>
          <li className="text-muted-foreground">
            △ Facturación electrónica SUNAT / kardex contable no están en este
            paquete; van aparte.
          </li>
        </ul>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Ventas de hoy" value={mx(stats.sold)} hint={currentUser ? `Caja: ${currentUser.name}` : ""} />
        <Kpi label="Compras de hoy" value={mx(stats.bought)} hint="Ingresos a almacén" />
        <Kpi label="Valor de inventario" value={mx(stats.stockValue)} hint={`${stats.products} SKU`} />
        <Kpi label="Bajo mínimo" value={String(stats.low)} hint="Hay que reponer" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alertas de stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {low.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nada bajo el mínimo.</p>
            ) : (
              low.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-muted-foreground">
                      {p.sku} · mínimo {p.minStock}
                    </p>
                  </div>
                  <Badge variant="destructive">{p.stock} {p.unit}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Últimas ventas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.sales.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aún no hay ventas.</p>
            ) : (
              state.sales.slice(0, 5).map((s) => {
                const user = state.users.find((u) => u.id === s.userId)
                return (
                  <div key={s.id} className="flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium">{s.customer}</p>
                      <p className="text-muted-foreground">
                        {s.date} · {user ? roleLabel(user.role) : ""}
                      </p>
                    </div>
                    <p className="tabular-nums font-medium">{mx(lineTotal(s.lines))}</p>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Kpi({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <p className="text-xs text-muted-foreground">{label}</p>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardHeader>
    </Card>
  )
}

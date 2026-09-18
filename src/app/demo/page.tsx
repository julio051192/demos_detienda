"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  missedCount,
  paidToday,
  remainingOnLoan,
  useDemoStore,
} from "@/lib/demo-store"
import { formatMoney, todayISO } from "@/lib/money"

export default function DemoHomePage() {
  const { state, ready, stats, reset } = useDemoStore()
  const mx = (n: number) => formatMoney(n)

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando cartera de ejemplo…</p>
  }

  const active = state.loans.filter((l) => l.status === "active")
  const overdue = active.filter((l) => missedCount(state, l.id) > 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Cartera de ejemplo · {todayISO()}</p>
          <h1 className="text-2xl font-semibold tracking-tight">Corte de hoy</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Esto es lo que el prestamista abre cada mañana: cuánto debe entrar,
            qué falta por cobrar y quién anda atrasado.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={reset}>
            Restaurar datos
          </Button>
          <Button render={<Link href="/demo/cobros" />}>Ir a cobros</Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Por cobrar hoy" value={mx(stats.expectedToday)} hint={`${stats.pendingToday} visitas pendientes`} />
        <Kpi label="Ya cobrado hoy" value={mx(stats.collectedToday)} hint="Pagos registrados en el día" />
        <Kpi label="Saldo en calle" value={mx(stats.capital)} hint={`${stats.activeLoans} préstamos activos`} />
        <Kpi label="Con atraso" value={String(stats.overdue)} hint="Al menos un día sin pagar" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Morosos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdue.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nadie con días perdidos. Buen día.</p>
            ) : (
              overdue.map((loan) => {
                const client = state.clients.find((c) => c.id === loan.clientId)
                return (
                  <div key={loan.id} className="flex items-center justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium">{client?.name}</p>
                      <p className="text-muted-foreground">
                        {missedCount(state, loan.id)} días sin pagar · queda{" "}
                        {mx(remainingOnLoan(state, loan))}
                      </p>
                    </div>
                    <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                      Mora
                    </span>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Próximos en la ruta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {active.filter((l) => !paidToday(state, l.id)).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Ya se cobró toda la ruta de hoy.
              </p>
            ) : (
              active
                .filter((l) => !paidToday(state, l.id))
                .slice(0, 6)
                .map((loan) => {
                  const client = state.clients.find((c) => c.id === loan.clientId)
                  return (
                    <div
                      key={loan.id}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">{client?.name}</p>
                        <p className="text-muted-foreground">
                          {client?.neighborhood} · {client?.address}
                        </p>
                      </div>
                      <p className="tabular-nums font-medium">{mx(loan.dailyAmount)}</p>
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

"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  missedCount,
  paidToday,
  remainingOnLoan,
  useDemoStore,
} from "@/lib/demo-store"
import { formatMoney, todayISO } from "@/lib/money"

export default function CobrosPage() {
  const { state, ready, recordPayment, stats } = useDemoStore()
  const mx = (n: number) => formatMoney(n)

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando ruta…</p>
  }

  const items = state.loans
    .filter((l) => l.status === "active")
    .map((loan) => {
      const client = state.clients.find((c) => c.id === loan.clientId)
      return { loan, client, done: paidToday(state, loan.id) }
    })
    .sort((a, b) => Number(a.done) - Number(b.done))

  if (items.length === 0) {
    return (
      <Empty
        title="No hay préstamos activos"
        body="Da de alta un préstamo para armar la ruta de cobro del día."
      />
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-muted-foreground">Ruta del {todayISO()}</p>
        <h1 className="text-2xl font-semibold tracking-tight">Cobros de hoy</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Esperado {mx(stats.expectedToday)} · cobrado {mx(stats.collectedToday)}
        </p>
      </div>

      <div className="grid gap-3">
        {items.map(({ loan, client, done }) => {
          const missed = missedCount(state, loan.id)
          return (
            <Card key={loan.id}>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>{client?.name ?? "Cliente"}</CardTitle>
                  <CardDescription>
                    {client?.neighborhood} · {client?.address} · {client?.phone}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-1">
                  {done ? <Badge>Pagó hoy</Badge> : <Badge variant="outline">Pendiente</Badge>}
                  {missed > 0 ? (
                    <Badge variant="destructive">{missed} días de atraso</Badge>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm">
                  Cuota <span className="font-medium">{mx(loan.dailyAmount)}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    · saldo {mx(remainingOnLoan(state, loan))}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    disabled={done}
                    onClick={() => recordPayment(loan.id, loan.dailyAmount, "paid")}
                  >
                    Cobrar cuota
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      recordPayment(loan.id, Math.round(loan.dailyAmount / 2), "partial")
                    }
                  >
                    Abono a medias
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => recordPayment(loan.id, 0, "missed")}
                  >
                    No pagó
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-center">
      <h1 className="text-lg font-medium">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  )
}

"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Badge } from "@/components/ui/badge"
import {
  loanTotal,
  remainingOnLoan,
  useDemoStore,
} from "@/lib/demo-store"
import { formatMoney } from "@/lib/money"

export default function PrestamosPage() {
  const { state, ready, addLoan } = useDemoStore()
  const [open, setOpen] = useState(false)
  const [clientId, setClientId] = useState("")
  const [capital, setCapital] = useState("2000")
  const [interest, setInterest] = useState("20")
  const [days, setDays] = useState("20")
  const mx = (n: number) => formatMoney(n)

  const preview = useMemo(() => {
    const c = Number(capital) || 0
    const i = Number(interest) || 0
    const d = Number(days) || 1
    const total = Math.round(c * (1 + i / 100))
    return { total, daily: Math.ceil(total / d) }
  }, [capital, interest, days])

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Cargando préstamos…</p>
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientId) return
    addLoan({
      clientId,
      capital: Number(capital) || 0,
      interestPercent: Number(interest) || 0,
      days: Number(days) || 1,
    })
    setOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Préstamos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Capital + interés repartido en cuotas diarias. El total a recuperar
            es lo que ve el dueño, no solo el préstamo.
          </p>
        </div>
        <Button
          onClick={() => {
            setClientId(state.clients[0]?.id ?? "")
            setOpen(true)
          }}
          disabled={state.clients.length === 0}
        >
          Nuevo préstamo
        </Button>
      </div>

      {state.loans.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">Todavía no hay préstamos</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Primero registra un cliente y luego dispara el crédito.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Capital</TableHead>
                <TableHead>Cuota</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.loans.map((loan) => {
                const client = state.clients.find((c) => c.id === loan.clientId)
                return (
                  <TableRow key={loan.id}>
                    <TableCell>
                      <p className="font-medium">{client?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {loan.days} días · {loan.interestPercent}% · desde {loan.startDate}
                      </p>
                    </TableCell>
                    <TableCell>{mx(loan.capital)}</TableCell>
                    <TableCell>{mx(loan.dailyAmount)}</TableCell>
                    <TableCell>
                      {mx(remainingOnLoan(state, loan))}
                      <span className="block text-xs text-muted-foreground">
                        de {mx(loanTotal(loan))}
                      </span>
                    </TableCell>
                    <TableCell>
                      {loan.status === "paid" ? (
                        <Badge variant="secondary">Liquidado</Badge>
                      ) : (
                        <Badge>Activo</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={submit} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Nuevo préstamo</DialogTitle>
              <DialogDescription>
                La cuota diaria se calcula sola: capital más interés, entre los
                días del plazo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="client">Cliente</Label>
                <select
                  id="client"
                  required
                  className="h-9 rounded-lg border border-input bg-background px-2.5 text-sm"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                >
                  {state.clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="capital">Capital</Label>
                <Input
                  id="capital"
                  inputMode="numeric"
                  value={capital}
                  onChange={(e) => setCapital(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="interest">Interés %</Label>
                  <Input
                    id="interest"
                    inputMode="numeric"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="days">Días</Label>
                  <Input
                    id="days"
                    inputMode="numeric"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                  />
                </div>
              </div>
              <p className="rounded-lg bg-muted px-3 py-2 text-sm">
                Recuperas {mx(preview.total)} en cuotas de {mx(preview.daily)} al
                día.
              </p>
            </div>
            <DialogFooter>
              <Button type="submit">Crear préstamo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

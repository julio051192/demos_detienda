"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import type { Client, DemoState, Loan, Payment, PaymentStatus } from "@/lib/demo-types"
import { addDays, daysBetween, todayISO } from "@/lib/money"

const KEY = "callediario-demo-pe-v1"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function seed(): DemoState {
  const start = addDays(todayISO(), -8)
  const clients: Client[] = [
    {
      id: "c1",
      name: "María Elena Quispe",
      phone: "987 142 330",
      address: "Jr. Huancavelica 218",
      neighborhood: "Los Olivos",
    },
    {
      id: "c2",
      name: "José Luis Huamán",
      phone: "912 901 774",
      address: "Av. Túpac Amaru 1402",
      neighborhood: "Comas",
    },
    {
      id: "c3",
      name: "Ana Patricia Rojas",
      phone: "956 671 009",
      address: "Mz. C Lt. 12, AA.HH. El Ermitaño",
      neighborhood: "Independencia",
    },
    {
      id: "c4",
      name: "Roberto Sánchez Díaz",
      phone: "944 110 882",
      address: "Calle Las Flores 9",
      neighborhood: "San Juan de Lurigancho",
    },
    {
      id: "c5",
      name: "Leticia Ramírez Cueva",
      phone: "911 883 340",
      address: "Jr. Ayacucho 77",
      neighborhood: "Los Olivos",
    },
    {
      id: "c6",
      name: "Miguel Ángel Torres",
      phone: "990 331 208",
      address: "Av. Universitaria 1515",
      neighborhood: "Comas",
    },
  ]

  const loans: Loan[] = [
    loan("p1", "c1", 2500, 20, 20, start),
    loan("p2", "c2", 4000, 18, 25, addDays(start, -4)),
    loan("p3", "c3", 1500, 20, 15, addDays(start, -2)),
    loan("p4", "c4", 6000, 15, 30, addDays(start, -10)),
    loan("p5", "c5", 2000, 20, 20, addDays(start, 0)),
    loan("p6", "c6", 3500, 16, 22, addDays(start, -6)),
  ]

  const payments: Payment[] = []
  for (const l of loans) {
    const elapsed = Math.max(0, daysBetween(l.startDate, todayISO()))
    for (let i = 0; i < elapsed; i++) {
      const date = addDays(l.startDate, i)
      const miss = (l.id === "p2" && i === elapsed - 2) || (l.id === "p4" && i % 7 === 3)
      payments.push({
        id: uid("pay"),
        loanId: l.id,
        date,
        amount: miss ? 0 : l.dailyAmount,
        status: miss ? "missed" : "paid",
      })
    }
  }

  return { clients, loans, payments }
}

function loan(
  id: string,
  clientId: string,
  capital: number,
  interestPercent: number,
  days: number,
  startDate: string,
): Loan {
  const total = Math.round(capital * (1 + interestPercent / 100))
  const dailyAmount = Math.ceil(total / days)
  return {
    id,
    clientId,
    capital,
    interestPercent,
    days,
    startDate,
    dailyAmount,
    status: "active",
  }
}

const EMPTY: DemoState = { clients: [], loans: [], payments: [] }
let memory: DemoState | null = null
const listeners = new Set<() => void>()

function load(): DemoState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    return JSON.parse(raw) as DemoState
  } catch {
    return seed()
  }
}

function persist(state: DemoState) {
  memory = state
  localStorage.setItem(KEY, JSON.stringify(state))
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getClientSnapshot() {
  if (!memory) memory = load()
  return memory
}

function getServerSnapshot() {
  return EMPTY
}

export function loanTotal(loan: Loan) {
  return loan.dailyAmount * loan.days
}

export function paidOnLoan(state: DemoState, loanId: string) {
  return state.payments
    .filter((p) => p.loanId === loanId)
    .reduce((s, p) => s + p.amount, 0)
}

export function remainingOnLoan(state: DemoState, loan: Loan) {
  return Math.max(0, loanTotal(loan) - paidOnLoan(state, loan.id))
}

export function missedCount(state: DemoState, loanId: string) {
  return state.payments.filter((p) => p.loanId === loanId && p.status === "missed")
    .length
}

export function paidToday(state: DemoState, loanId: string) {
  const t = todayISO()
  return state.payments.some(
    (p) => p.loanId === loanId && p.date === t && p.status !== "missed" && p.amount > 0,
  )
}

export function useDemoStore() {
  const state = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  )
  const ready = state !== EMPTY

  const update = useCallback((fn: (prev: DemoState) => DemoState) => {
    persist(fn(getClientSnapshot()))
  }, [])

  const addClient = useCallback(
    (client: Omit<Client, "id">) => {
      update((s) => ({
        ...s,
        clients: [{ ...client, id: uid("c") }, ...s.clients],
      }))
    },
    [update],
  )

  const addLoan = useCallback(
    (input: {
      clientId: string
      capital: number
      interestPercent: number
      days: number
    }) => {
      update((s) => {
        const l = loan(
          uid("p"),
          input.clientId,
          input.capital,
          input.interestPercent,
          input.days,
          todayISO(),
        )
        return { ...s, loans: [l, ...s.loans] }
      })
    },
    [update],
  )

  const recordPayment = useCallback(
    (loanId: string, amount: number, status: PaymentStatus) => {
      const date = todayISO()
      update((s) => {
        const rest = s.payments.filter(
          (p) => !(p.loanId === loanId && p.date === date),
        )
        const payments = [
          ...rest,
          { id: uid("pay"), loanId, date, amount, status },
        ]
        const loan = s.loans.find((l) => l.id === loanId)
        let loans = s.loans
        if (loan) {
          const paid = payments
            .filter((p) => p.loanId === loanId)
            .reduce((n, p) => n + p.amount, 0)
          if (paid >= loanTotal(loan)) {
            loans = s.loans.map((l) =>
              l.id === loanId ? { ...l, status: "paid" as const } : l,
            )
          }
        }
        return { ...s, payments, loans }
      })
    },
    [update],
  )

  const reset = useCallback(() => {
    persist(seed())
  }, [])

  const stats = useMemo(() => {
    const t = todayISO()
    const active = state.loans.filter((l) => l.status === "active")
    const expectedToday = active.reduce((n, l) => n + l.dailyAmount, 0)
    const collectedToday = state.payments
      .filter((p) => p.date === t)
      .reduce((n, p) => n + p.amount, 0)
    const pendingToday = active.filter((l) => !paidToday(state, l.id)).length
    const capital = active.reduce((n, l) => n + remainingOnLoan(state, l), 0)
    const overdue = active.filter((l) => missedCount(state, l.id) > 0).length
    return {
      clients: state.clients.length,
      activeLoans: active.length,
      expectedToday,
      collectedToday,
      pendingToday,
      capital,
      overdue,
    }
  }, [state])

  return {
    state,
    ready,
    stats,
    addClient,
    addLoan,
    recordPayment,
    reset,
  }
}

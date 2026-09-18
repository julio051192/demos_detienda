"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { todayISO } from "@/lib/money"
import type {
  DocLine,
  ErpState,
  ErpUser,
  Product,
  Purchase,
  Sale,
} from "@/lib/erp-types"

const KEY = "tresnube-erp-pe-v1"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function seed(): ErpState {
  const users: ErpUser[] = [
    { id: "u1", name: "Julio Mendoza", role: "admin", seat: "Oficina / remoto" },
    { id: "u2", name: "Karina Paredes", role: "sales", seat: "Caja local" },
    { id: "u3", name: "Héctor Quispe", role: "warehouse", seat: "Almacén" },
  ]
  const products: Product[] = [
    {
      id: "pr1",
      sku: "ARZ-001",
      name: "Arroz extra 5 kg",
      unit: "bolsa",
      stock: 48,
      cost: 18.5,
      price: 24.9,
      minStock: 12,
    },
    {
      id: "pr2",
      sku: "ACE-002",
      name: "Aceite vegetal 1 L",
      unit: "botella",
      stock: 36,
      cost: 8.2,
      price: 11.5,
      minStock: 10,
    },
    {
      id: "pr3",
      sku: "AZU-003",
      name: "Azúcar rubia 1 kg",
      unit: "bolsa",
      stock: 8,
      cost: 3.4,
      price: 4.8,
      minStock: 15,
    },
    {
      id: "pr4",
      sku: "LEC-004",
      name: "Leche evaporada",
      unit: "lata",
      stock: 60,
      cost: 4.1,
      price: 5.9,
      minStock: 20,
    },
    {
      id: "pr5",
      sku: "FID-005",
      name: "Fideos spaghetti 500 g",
      unit: "paquete",
      stock: 22,
      cost: 2.3,
      price: 3.5,
      minStock: 16,
    },
  ]
  const sales: Sale[] = [
    {
      id: "s1",
      date: todayISO(),
      customer: "Bodega Doña Rosa",
      userId: "u2",
      lines: [
        { productId: "pr1", qty: 2, unitPrice: 24.9 },
        { productId: "pr2", qty: 4, unitPrice: 11.5 },
      ],
    },
  ]
  const purchases: Purchase[] = [
    {
      id: "b1",
      date: todayISO(),
      supplier: "Distribuidora Andina SAC",
      userId: "u3",
      lines: [{ productId: "pr4", qty: 24, unitPrice: 4.1 }],
    },
  ]
  return { users, currentUserId: "u1", products, sales, purchases }
}

const EMPTY: ErpState = {
  users: [],
  currentUserId: "",
  products: [],
  sales: [],
  purchases: [],
}

let memory: ErpState | null = null
const listeners = new Set<() => void>()

function load(): ErpState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    return JSON.parse(raw) as ErpState
  } catch {
    return seed()
  }
}

function persist(state: ErpState) {
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

export function lineTotal(lines: DocLine[]) {
  return lines.reduce((n, l) => n + l.qty * l.unitPrice, 0)
}

export function roleLabel(role: ErpUser["role"]) {
  if (role === "admin") return "Administrador"
  if (role === "sales") return "Ventas"
  return "Almacén"
}

export function useErpStore() {
  const state = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  )
  const ready = state !== EMPTY
  const currentUser =
    state.users.find((u) => u.id === state.currentUserId) ?? state.users[0]

  const update = useCallback((fn: (prev: ErpState) => ErpState) => {
    persist(fn(getClientSnapshot()))
  }, [])

  const setUser = useCallback(
    (id: string) => update((s) => ({ ...s, currentUserId: id })),
    [update],
  )

  const addProduct = useCallback(
    (input: Omit<Product, "id">) => {
      update((s) => ({
        ...s,
        products: [{ ...input, id: uid("pr") }, ...s.products],
      }))
    },
    [update],
  )

  const registerSale = useCallback(
    (input: { customer: string; lines: DocLine[] }) => {
      update((s) => {
        const products = s.products.map((p) => {
          const line = input.lines.find((l) => l.productId === p.id)
          if (!line) return p
          return { ...p, stock: p.stock - line.qty }
        })
        const sale: Sale = {
          id: uid("s"),
          date: todayISO(),
          customer: input.customer,
          userId: s.currentUserId,
          lines: input.lines,
        }
        return { ...s, products, sales: [sale, ...s.sales] }
      })
    },
    [update],
  )

  const registerPurchase = useCallback(
    (input: { supplier: string; lines: DocLine[] }) => {
      update((s) => {
        const products = s.products.map((p) => {
          const line = input.lines.find((l) => l.productId === p.id)
          if (!line) return p
          return { ...p, stock: p.stock + line.qty, cost: line.unitPrice }
        })
        const purchase: Purchase = {
          id: uid("b"),
          date: todayISO(),
          supplier: input.supplier,
          userId: s.currentUserId,
          lines: input.lines,
        }
        return { ...s, products, purchases: [purchase, ...s.purchases] }
      })
    },
    [update],
  )

  const reset = useCallback(() => persist(seed()), [])

  const stats = useMemo(() => {
    const salesToday = state.sales.filter((s) => s.date === todayISO())
    const sold = salesToday.reduce((n, s) => n + lineTotal(s.lines), 0)
    const bought = state.purchases
      .filter((p) => p.date === todayISO())
      .reduce((n, p) => n + lineTotal(p.lines), 0)
    const stockValue = state.products.reduce((n, p) => n + p.stock * p.cost, 0)
    const low = state.products.filter((p) => p.stock <= p.minStock).length
    return {
      sold,
      bought,
      stockValue,
      low,
      users: state.users.length,
      products: state.products.length,
    }
  }, [state])

  return {
    state,
    ready,
    currentUser,
    stats,
    setUser,
    addProduct,
    registerSale,
    registerPurchase,
    reset,
  }
}

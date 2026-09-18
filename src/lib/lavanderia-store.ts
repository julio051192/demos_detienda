"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { todayISO } from "@/lib/money"
import type {
  LaundryOrder,
  LaundryService,
  LaundrySupply,
  LavanderiaState,
  OrderStatus,
} from "@/lib/lavanderia-types"

const KEY = "lavanderia-demo-pe-v1"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function nextTicketCode(orders: LaundryOrder[]) {
  const num = orders.length + 1040
  return `#T-${num}`
}

function seed(): LavanderiaState {
  const services: LaundryService[] = [
    {
      id: "srv-kg",
      name: "Lavado y Secado por Kilo (Ropa de diario)",
      category: "lavado_kilo",
      unitType: "kg",
      price: 8.0,
      estimatedHours: 24,
    },
    {
      id: "srv-edr-2p",
      name: "Lavado de Edredón / Cubrecama (2 Plazas)",
      category: "prendas_pesadas",
      unitType: "unidad",
      price: 25.0,
      estimatedHours: 48,
    },
    {
      id: "srv-edr-k",
      name: "Lavado de Edredón de Plumas / King Size",
      category: "prendas_pesadas",
      unitType: "unidad",
      price: 35.0,
      estimatedHours: 48,
    },
    {
      id: "srv-terno",
      name: "Lavado al Seco - Terno Completo (2 piezas)",
      category: "tintoreria_seco",
      unitType: "juego",
      price: 28.0,
      estimatedHours: 48,
    },
    {
      id: "srv-camisa",
      name: "Lavado y Planchado de Camisa formal",
      category: "planchado",
      unitType: "unidad",
      price: 6.5,
      estimatedHours: 24,
    },
    {
      id: "srv-zap",
      name: "Lavado Profundo de Zapatillas / Calzado",
      category: "calzado",
      unitType: "par",
      price: 18.0,
      estimatedHours: 48,
    },
  ]

  const supplies: LaundrySupply[] = [
    {
      id: "sup-1",
      name: "Detergente Industrial Líquido Concentrado",
      unit: "bidón 20 L",
      stock: 4,
      minStock: 2,
      cost: 95.0,
    },
    {
      id: "sup-2",
      name: "Suavizante Textil Aroma Floral",
      unit: "bidón 20 L",
      stock: 3,
      minStock: 2,
      cost: 85.0,
    },
    {
      id: "sup-3",
      name: "Quitamanchas Enzimático Especial",
      unit: "frasco 1 L",
      stock: 6,
      minStock: 3,
      cost: 22.0,
    },
    {
      id: "sup-4",
      name: "Bolsas Plásticas Transparentes con Asa (Kilo)",
      unit: "paquete 100 u",
      stock: 12,
      minStock: 5,
      cost: 15.0,
    },
    {
      id: "sup-5",
      name: "Ganchos Metálicos para Ropa / Tintorería",
      unit: "caja 500 u",
      stock: 2,
      minStock: 1,
      cost: 45.0,
    },
  ]

  const today = todayISO()
  const orders: LaundryOrder[] = [
    {
      id: "ord-1",
      ticketCode: "#T-1037",
      customerName: "Carmen Morales",
      customerPhone: "987 654 321",
      date: today,
      deliveryDate: `${today} 18:00`,
      items: [
        {
          serviceId: "srv-kg",
          serviceName: "Lavado y Secado por Kilo",
          qty: 6.5,
          unitPrice: 8.0,
        },
      ],
      total: 52.0,
      advance: 30.0,
      balance: 22.0,
      status: "ready",
      notes: "Separar prendas blancas de color. Suavizante extra.",
    },
    {
      id: "ord-2",
      ticketCode: "#T-1038",
      customerName: "Jorge Luis Vargas",
      customerPhone: "945 112 890",
      date: today,
      deliveryDate: `${today} 19:30`,
      items: [
        {
          serviceId: "srv-edr-2p",
          serviceName: "Edredón 2 Plazas",
          qty: 1,
          unitPrice: 25.0,
        },
        {
          serviceId: "srv-zap",
          serviceName: "Zapatillas Blancas",
          qty: 1,
          unitPrice: 18.0,
        },
      ],
      total: 43.0,
      advance: 43.0,
      balance: 0.0,
      status: "washing",
      notes: "Zapatillas con manchas de barro en suela.",
    },
    {
      id: "ord-3",
      ticketCode: "#T-1039",
      customerName: "Andrea Salazar",
      customerPhone: "912 334 556",
      date: today,
      deliveryDate: `${today} 17:00`,
      items: [
        {
          serviceId: "srv-terno",
          serviceName: "Terno Completo",
          qty: 1,
          unitPrice: 28.0,
        },
        {
          serviceId: "srv-camisa",
          serviceName: "Camisa formal",
          qty: 2,
          unitPrice: 6.5,
        },
      ],
      total: 41.0,
      advance: 20.0,
      balance: 21.0,
      status: "received",
      notes: "Urgente para evento el fin de semana.",
    },
  ]

  return { orders, services, supplies }
}

const EMPTY: LavanderiaState = { orders: [], services: [], supplies: [] }
let memory: LavanderiaState | null = null
const listeners = new Set<() => void>()

function load(): LavanderiaState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    return JSON.parse(raw) as LavanderiaState
  } catch {
    return seed()
  }
}

function persist(state: LavanderiaState) {
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

export function statusLabel(status: OrderStatus) {
  switch (status) {
    case "received":
      return "📥 Recibido"
    case "washing":
      return "🧼 En Lavado / Proceso"
    case "ready":
      return "✅ Listo para Entrega"
    case "delivered":
      return "📦 Entregado"
    case "cancelled":
      return "❌ Anulado"
  }
}

export function statusBadgeColor(status: OrderStatus) {
  switch (status) {
    case "received":
      return "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300"
    case "washing":
      return "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-300"
    case "ready":
      return "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
    case "delivered":
      return "bg-muted text-muted-foreground border-border"
    case "cancelled":
      return "bg-red-100 text-red-900 border-red-300 dark:bg-red-950 dark:text-red-300"
  }
}

export function useLavanderiaStore() {
  const state = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  )
  const ready = state !== EMPTY

  const update = useCallback(
    (fn: (prev: LavanderiaState) => LavanderiaState) => {
      persist(fn(getClientSnapshot()))
    },
    [],
  )

  const createOrder = useCallback(
    (input: {
      customerName: string
      customerPhone: string
      deliveryDate: string
      items: { serviceId: string; serviceName: string; qty: number; unitPrice: number; notes?: string }[]
      advance: number
      notes?: string
    }) => {
      update((s) => {
        const total = input.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0)
        const advance = Math.min(total, Math.max(0, input.advance))
        const balance = Math.max(0, total - advance)
        const ticketCode = nextTicketCode(s.orders)

        const order: LaundryOrder = {
          id: uid("ord"),
          ticketCode,
          customerName: input.customerName.trim(),
          customerPhone: input.customerPhone.trim(),
          date: todayISO(),
          deliveryDate: input.deliveryDate,
          items: input.items,
          total,
          advance,
          balance,
          status: "received",
          notes: input.notes?.trim(),
        }

        return { ...s, orders: [order, ...s.orders] }
      })
    },
    [update],
  )

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      update((s) => ({
        ...s,
        orders: s.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status,
                deliveredAt: status === "delivered" ? todayISO() : o.deliveredAt,
                balance: status === "delivered" ? 0 : o.balance,
              }
            : o,
        ),
      }))
    },
    [update],
  )

  const deliverOrder = useCallback(
    (orderId: string) => {
      update((s) => ({
        ...s,
        orders: s.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "delivered",
                balance: 0,
                deliveredAt: todayISO(),
              }
            : o,
        ),
      }))
    },
    [update],
  )

  const addService = useCallback(
    (service: Omit<LaundryService, "id">) => {
      update((s) => ({
        ...s,
        services: [...s.services, { ...service, id: uid("srv") }],
      }))
    },
    [update],
  )

  const addSupply = useCallback(
    (supply: Omit<LaundrySupply, "id">) => {
      update((s) => ({
        ...s,
        supplies: [...s.supplies, { ...supply, id: uid("sup") }],
      }))
    },
    [update],
  )

  const updateSupplyStock = useCallback(
    (supplyId: string, delta: number) => {
      update((s) => ({
        ...s,
        supplies: s.supplies.map((sup) =>
          sup.id === supplyId
            ? { ...sup, stock: Math.max(0, sup.stock + delta) }
            : sup,
        ),
      }))
    },
    [update],
  )

  const reset = useCallback(() => persist(seed()), [])

  const stats = useMemo(() => {
    const today = todayISO()
    const ordersToday = state.orders.filter((o) => o.date === today)
    const advancesToday = ordersToday.reduce((sum, o) => sum + o.advance, 0)
    const balancesDeliveredToday = state.orders
      .filter((o) => o.deliveredAt === today && o.total > o.advance)
      .reduce((sum, o) => sum + (o.total - o.advance), 0)

    const revenueToday = advancesToday + balancesDeliveredToday

    const kgToday = ordersToday.reduce((sum, o) => {
      const kgItems = o.items.filter((i) => i.serviceId === "srv-kg")
      return sum + kgItems.reduce((k, item) => k + item.qty, 0)
    }, 0)

    const pendingReady = state.orders.filter((o) => o.status === "ready").length
    const inProcess = state.orders.filter((o) => o.status === "washing" || o.status === "received").length
    const pendingBalancesTotal = state.orders
      .filter((o) => o.status !== "delivered" && o.status !== "cancelled")
      .reduce((sum, o) => sum + o.balance, 0)

    return {
      revenueToday,
      kgToday,
      pendingReady,
      inProcess,
      pendingBalancesTotal,
      totalOrders: state.orders.length,
    }
  }, [state])

  return {
    state,
    ready,
    stats,
    createOrder,
    updateOrderStatus,
    deliverOrder,
    addService,
    addSupply,
    updateSupplyStock,
    reset,
  }
}

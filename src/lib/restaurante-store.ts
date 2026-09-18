"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { todayISO } from "@/lib/money"
import type {
  DishCategory,
  DishItem,
  OrderDishLine,
  RestaurantOrder,
  RestaurantTable,
  RestauranteState,
  TableStatus,
  TableZone,
} from "@/lib/restaurante-types"

const KEY = "restaurante-demo-pe-v1"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function nextTicket(orders: RestaurantOrder[]) {
  return `#RES-${3000 + orders.length + 1}`
}

function seed(): RestauranteState {
  const today = todayISO()

  const dishes: DishItem[] = [
    // Entradas
    {
      id: "dish-1",
      name: "Causa Rellena de Pollo",
      category: "entradas",
      description: "Papa amarilla prensada con ají amarillo, rellena de pechuga deshilachada y palta fuerte.",
      price: 18.0,
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      prepTimeMinutes: 10,
    },
    {
      id: "dish-2",
      name: "Papa a la Huancaína",
      category: "entradas",
      description: "Rodajas de papa sancochada bañadas en crema suave de ají amarillo, queso fresco y aceituna.",
      price: 16.0,
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80",
      available: true,
      prepTimeMinutes: 8,
    },

    // Ceviches
    {
      id: "dish-3",
      name: "Ceviche Mixto Tradicional",
      category: "ceviches",
      description: "Pesca del día, calamar, pulpo y langostinos marinados en limón de Chulucanas con camote y choclo.",
      price: 38.0,
      imageUrl: "https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      isSpicy: true,
      available: true,
      prepTimeMinutes: 12,
    },
    {
      id: "dish-4",
      name: "Chicharrón de Calamar",
      category: "ceviches",
      description: "Aros de calamar crujientes acompañados de yuca frita, salsa criolla y tártara casera.",
      price: 32.0,
      imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=80",
      available: true,
      prepTimeMinutes: 15,
    },

    // Pollo a la Brasa
    {
      id: "dish-5",
      name: "1/4 Pollo a la Brasa + Papas",
      category: "pollos",
      description: "Cuarto de pollo marinado con especias norteñas, papas nativas crujientes y ensalada fresca.",
      price: 24.0,
      imageUrl: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      prepTimeMinutes: 10,
    },
    {
      id: "dish-6",
      name: "1/2 Pollo a la Brasa Familiar",
      category: "pollos",
      description: "Medio pollo a la leña con porción grande de papas amarillas fritas y cremas de la casa.",
      price: 44.0,
      imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      prepTimeMinutes: 12,
    },

    // Platos Criollos
    {
      id: "dish-7",
      name: "Lomo Saltado Jugoso",
      category: "criollos",
      description: "Trozos de lomo fino salteados al wok con cebolla morada, tomate, ají amarillo y arroz blanco.",
      price: 42.0,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      prepTimeMinutes: 15,
    },
    {
      id: "dish-8",
      name: "Arroz con Mariscos",
      category: "criollos",
      description: "Arroz graneado en guiso de ají panca y vino blanco con mixtura de mariscos y sarza criolla.",
      price: 36.0,
      imageUrl: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=500&q=80",
      available: true,
      prepTimeMinutes: 18,
    },

    // Bebidas
    {
      id: "dish-9",
      name: "Jarra Chicha Morada 1L",
      category: "bebidas",
      description: "Elaborada con maíz morado hervido con piña, membrillo, clavo y canela.",
      price: 15.0,
      imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      prepTimeMinutes: 3,
    },
    {
      id: "dish-10",
      name: "Inca Kola Personal 500ml",
      category: "bebidas",
      description: "Gaseosa helada en botella de vidrio o plástica.",
      price: 6.0,
      imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80",
      available: true,
      prepTimeMinutes: 1,
    },

    // Cocteles
    {
      id: "dish-11",
      name: "Pisco Sour Catedral",
      category: "licoreria",
      description: "Pisco Quebranta premium con jugo de limón fresco, jarabe de goma y clara de huevo.",
      price: 25.0,
      imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      prepTimeMinutes: 5,
    },

    // Postres
    {
      id: "dish-12",
      name: "Suspiro a la Limeña",
      category: "postres",
      description: "Manjar blanco suave de yemas aromatizado con oporto y merengue a la canela.",
      price: 16.0,
      imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80",
      available: true,
      prepTimeMinutes: 5,
    },
  ]

  const tables: RestaurantTable[] = [
    { id: "tbl-101", code: "Mesa 01", zone: "salon_principal", capacity: 4, status: "ocupada", currentOrderId: "ord-r1", waiterName: "Carlos Mozo" },
    { id: "tbl-102", code: "Mesa 02", zone: "salon_principal", capacity: 2, status: "libre" },
    { id: "tbl-103", code: "Mesa 03", zone: "salon_principal", capacity: 6, status: "precuenta", currentOrderId: "ord-r2", waiterName: "Ana Silva" },
    { id: "tbl-104", code: "Mesa 04", zone: "salon_principal", capacity: 4, status: "libre" },
    { id: "tbl-201", code: "Terraza T1", zone: "terraza", capacity: 4, status: "ocupada", currentOrderId: "ord-r3", waiterName: "Carlos Mozo" },
    { id: "tbl-202", code: "Terraza T2", zone: "terraza", capacity: 2, status: "limpieza" },
    { id: "tbl-301", code: "Barra 01", zone: "barra", capacity: 1, status: "libre" },
  ]

  const orders: RestaurantOrder[] = [
    {
      id: "ord-r1",
      ticketCode: "#RES-3001",
      tableId: "tbl-101",
      tableName: "Mesa 01",
      zone: "salon_principal",
      waiterName: "Carlos Mozo",
      type: "mesa",
      lines: [
        { dishId: "dish-3", name: "Ceviche Mixto Tradicional", unitPrice: 38.0, qty: 1, subtotal: 38.0, notes: "Picante medio, con bastante cancha", status: "en_preparacion" },
        { dishId: "dish-9", name: "Jarra Chicha Morada 1L", unitPrice: 15.0, qty: 1, subtotal: 15.0, notes: "Bien helada", status: "listo" },
      ],
      subtotal: 53.0,
      total: 53.0,
      advance: 0.0,
      balance: 53.0,
      status: "en_cocina",
      createdAt: `${today} 13:10`,
      kitchenTimeMinutes: 14,
    },
    {
      id: "ord-r2",
      ticketCode: "#RES-3002",
      tableId: "tbl-103",
      tableName: "Mesa 03",
      zone: "salon_principal",
      waiterName: "Ana Silva",
      type: "mesa",
      lines: [
        { dishId: "dish-5", name: "1/4 Pollo a la Brasa + Papas", unitPrice: 24.0, qty: 2, subtotal: 48.0, notes: "Papas bien crocantes", status: "servido" },
        { dishId: "dish-7", name: "Lomo Saltado Jugoso", unitPrice: 42.0, qty: 1, subtotal: 42.0, notes: "Término medio", status: "servido" },
        { dishId: "dish-10", name: "Inca Kola Personal 500ml", unitPrice: 6.0, qty: 3, subtotal: 18.0, status: "servido" },
      ],
      subtotal: 108.0,
      total: 108.0,
      advance: 0.0,
      balance: 108.0,
      status: "precuenta",
      createdAt: `${today} 12:40`,
      kitchenTimeMinutes: 25,
    },
    {
      id: "ord-r3",
      ticketCode: "#RES-3003",
      tableId: "tbl-201",
      tableName: "Terraza T1",
      zone: "terraza",
      waiterName: "Carlos Mozo",
      type: "mesa",
      lines: [
        { dishId: "dish-11", name: "Pisco Sour Catedral", unitPrice: 25.0, qty: 2, subtotal: 50.0, notes: "Doble gota de amargo de angostura", status: "en_preparacion" },
        { dishId: "dish-1", name: "Causa Rellena de Pollo", unitPrice: 18.0, qty: 1, subtotal: 18.0, status: "listo" },
      ],
      subtotal: 68.0,
      total: 68.0,
      advance: 0.0,
      balance: 68.0,
      status: "en_cocina",
      createdAt: `${today} 13:20`,
      kitchenTimeMinutes: 8,
    },
  ]

  return { dishes, tables, orders }
}

const EMPTY: RestauranteState = { dishes: [], tables: [], orders: [] }
let memory: RestauranteState | null = null
const listeners = new Set<() => void>()

function load(): RestauranteState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    return JSON.parse(raw) as RestauranteState
  } catch {
    return seed()
  }
}

function persist(state: RestauranteState) {
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

export function categoryLabel(cat: DishCategory) {
  const map: Record<DishCategory, string> = {
    entradas: "🥗 Entradas",
    ceviches: "🐟 Ceviches & Mariscos",
    pollos: "🍗 Pollo a la Brasa",
    criollos: "🥘 Platos Criollos",
    bebidas: "🥤 Bebidas & Jarras",
    licoreria: "🍸 Cocteles & Licores",
    postres: "🍰 Postres Tradicionales",
  }
  return map[cat] || "🍽️ Plato"
}

export function tableStatusBadge(status: TableStatus) {
  switch (status) {
    case "libre":
      return "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
    case "ocupada":
      return "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-300"
    case "precuenta":
      return "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300"
    case "limpieza":
      return "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-300"
  }
}

export function tableStatusLabel(status: TableStatus) {
  switch (status) {
    case "libre":
      return "🟢 Libre"
    case "ocupada":
      return "🔴 Ocupada"
    case "precuenta":
      return "🟡 Pre-Cuenta"
    case "limpieza":
      return "🧹 En Limpieza"
  }
}

export function useRestauranteStore() {
  const state = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  const ready = state !== EMPTY

  const update = useCallback((fn: (prev: RestauranteState) => RestauranteState) => {
    persist(fn(getClientSnapshot()))
  }, [])

  const createOrderForTable = useCallback(
    (input: {
      tableId: string
      waiterName: string
      lines: OrderDishLine[]
    }) => {
      update((s) => {
        const table = s.tables.find((t) => t.id === input.tableId)
        if (!table) return s

        const subtotal = input.lines.reduce((sum, l) => sum + l.subtotal, 0)
        const orderId = uid("ord")
        const ticketCode = nextTicket(s.orders)
        const now = `${todayISO()} ${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}`

        const newOrder: RestaurantOrder = {
          id: orderId,
          ticketCode,
          tableId: input.tableId,
          tableName: table.code,
          zone: table.zone,
          waiterName: input.waiterName,
          type: "mesa",
          lines: input.lines,
          subtotal,
          total: subtotal,
          advance: 0,
          balance: subtotal,
          status: "en_cocina",
          createdAt: now,
          kitchenTimeMinutes: 2,
        }

        const updatedTables = s.tables.map((t) =>
          t.id === input.tableId
            ? { ...t, status: "ocupada" as const, currentOrderId: orderId, waiterName: input.waiterName }
            : t,
        )

        return {
          ...s,
          orders: [newOrder, ...s.orders],
          tables: updatedTables,
        }
      })
    },
    [update],
  )

  const updateLineStatus = useCallback(
    (orderId: string, dishId: string, newStatus: OrderDishLine["status"]) => {
      update((s) => ({
        ...s,
        orders: s.orders.map((o) => {
          if (o.id !== orderId) return o
          const updatedLines = o.lines.map((l) => (l.dishId === dishId ? { ...l, status: newStatus } : l))
          return { ...o, lines: updatedLines }
        }),
      }))
    },
    [update],
  )

  const requestPreCuenta = useCallback(
    (tableId: string) => {
      update((s) => ({
        ...s,
        tables: s.tables.map((t) => (t.id === tableId ? { ...t, status: "precuenta" as const } : t)),
        orders: s.orders.map((o) => (o.tableId === tableId && o.status !== "pagada" ? { ...o, status: "precuenta" as const } : o)),
      }))
    },
    [update],
  )

  const payAndReleaseTable = useCallback(
    (orderId: string) => {
      update((s) => {
        const order = s.orders.find((o) => o.id === orderId)
        if (!order) return s

        const updatedTables = s.tables.map((t) =>
          t.id === order.tableId
            ? { ...t, status: "limpieza" as const, currentOrderId: undefined, waiterName: undefined }
            : t,
        )

        const updatedOrders = s.orders.map((o) =>
          o.id === orderId ? { ...o, status: "pagada" as const, balance: 0 } : o,
        )

        return {
          ...s,
          tables: updatedTables,
          orders: updatedOrders,
        }
      })
    },
    [update],
  )

  const reset = useCallback(() => persist(seed()), [])

  const stats = useMemo(() => {
    const occupiedTablesCount = state.tables.filter((t) => t.status === "ocupada" || t.status === "precuenta").length
    const freeTablesCount = state.tables.filter((t) => t.status === "libre").length
    const activeOrders = state.orders.filter((o) => o.status !== "pagada")
    const totalSalesToday = state.orders
      .filter((o) => o.status === "pagada")
      .reduce((sum, o) => sum + o.total, 0)

    const pendingKitchenLinesCount = activeOrders
      .flatMap((o) => o.lines)
      .filter((l) => l.status === "en_preparacion" || l.status === "pendiente").length

    return {
      occupiedTablesCount,
      freeTablesCount,
      totalTablesCount: state.tables.length,
      totalSalesToday,
      activeOrdersCount: activeOrders.length,
      pendingKitchenLinesCount,
    }
  }, [state])

  return {
    state,
    ready,
    stats,
    createOrderForTable,
    updateLineStatus,
    requestPreCuenta,
    payAndReleaseTable,
    reset,
  }
}

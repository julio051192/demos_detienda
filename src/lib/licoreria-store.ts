"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { todayISO } from "@/lib/money"
import type {
  LicoreriaState,
  LiquorCategory,
  LiquorProduct,
  Sale,
  SaleItem,
} from "@/lib/licoreria-types"

const KEY = "licoreria-demo-pe-v1"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function nextTicket(sales: Sale[]) {
  return `#LC-${1000 + sales.length + 1}`
}

function seed(): LicoreriaState {
  const products: LiquorProduct[] = [
    // Cervezas
    {
      id: "p-001",
      barcode: "7751144000011",
      name: "Cristal Botella",
      brand: "Backus",
      category: "cerveza",
      presentation: "Botella 620ml",
      purchasePrice: 5.5,
      salePrice: 8.0,
      stock: 120,
      minStock: 24,
      alcoholPercent: 5.0,
    },
    {
      id: "p-002",
      barcode: "7751144000028",
      name: "Pilsen Callao",
      brand: "Backus",
      category: "cerveza",
      presentation: "Botella 620ml",
      purchasePrice: 5.5,
      salePrice: 8.0,
      stock: 96,
      minStock: 24,
      alcoholPercent: 5.0,
    },
    {
      id: "p-003",
      barcode: "7751144000035",
      name: "Cusqueña Trigo",
      brand: "Backus",
      category: "cerveza",
      presentation: "Botella 620ml",
      purchasePrice: 7.0,
      salePrice: 10.0,
      stock: 72,
      minStock: 12,
      alcoholPercent: 4.8,
    },
    {
      id: "p-004",
      barcode: "7751144000042",
      name: "Cristal Six Pack",
      brand: "Backus",
      category: "cerveza",
      presentation: "Six Pack 355ml",
      purchasePrice: 22.0,
      salePrice: 30.0,
      stock: 36,
      minStock: 6,
      alcoholPercent: 5.0,
    },
    {
      id: "p-005",
      barcode: "7751144000059",
      name: "Heineken Lata",
      brand: "Heineken",
      category: "cerveza",
      presentation: "Lata 355ml",
      purchasePrice: 7.5,
      salePrice: 11.0,
      stock: 48,
      minStock: 12,
      alcoholPercent: 5.0,
    },
    // Piscos
    {
      id: "p-006",
      barcode: "7751000100016",
      name: "Tabernero Puro Quebranta",
      brand: "Tabernero",
      category: "pisco",
      presentation: "Botella 700ml",
      purchasePrice: 38.0,
      salePrice: 55.0,
      stock: 18,
      minStock: 3,
      alcoholPercent: 42.0,
    },
    {
      id: "p-007",
      barcode: "7751000100023",
      name: "Santiago Queirolo Italia",
      brand: "Santiago Queirolo",
      category: "pisco",
      presentation: "Botella 750ml",
      purchasePrice: 45.0,
      salePrice: 65.0,
      stock: 12,
      minStock: 3,
      alcoholPercent: 40.0,
    },
    // Vinos
    {
      id: "p-008",
      barcode: "7751000200014",
      name: "Tacama Gran Tinto",
      brand: "Tacama",
      category: "vino",
      presentation: "Botella 750ml",
      purchasePrice: 42.0,
      salePrice: 60.0,
      stock: 24,
      minStock: 6,
      alcoholPercent: 13.5,
    },
    {
      id: "p-009",
      barcode: "7751000200021",
      name: "Casillero del Diablo Cabernet",
      brand: "Concha y Toro",
      category: "vino",
      presentation: "Botella 750ml",
      purchasePrice: 48.0,
      salePrice: 70.0,
      stock: 18,
      minStock: 3,
      alcoholPercent: 14.0,
    },
    // Whisky
    {
      id: "p-010",
      barcode: "5000267023656",
      name: "Johnnie Walker Red Label",
      brand: "Johnnie Walker",
      category: "whisky",
      presentation: "Botella 750ml",
      purchasePrice: 95.0,
      salePrice: 135.0,
      stock: 12,
      minStock: 2,
      alcoholPercent: 40.0,
    },
    {
      id: "p-011",
      barcode: "5000267023663",
      name: "Johnnie Walker Black Label",
      brand: "Johnnie Walker",
      category: "whisky",
      presentation: "Botella 750ml",
      purchasePrice: 160.0,
      salePrice: 220.0,
      stock: 6,
      minStock: 2,
      alcoholPercent: 40.0,
    },
    // Ron
    {
      id: "p-012",
      barcode: "8000070020047",
      name: "Cartavio Ron Superior",
      brand: "Cartavio",
      category: "ron",
      presentation: "Botella 750ml",
      purchasePrice: 28.0,
      salePrice: 42.0,
      stock: 20,
      minStock: 4,
      alcoholPercent: 40.0,
    },
    // Gaseosas y mezcla
    {
      id: "p-013",
      barcode: "7751533000013",
      name: "Coca Cola 1.5L",
      brand: "Coca Cola",
      category: "gaseosa",
      presentation: "Botella 1.5L",
      purchasePrice: 5.0,
      salePrice: 7.0,
      stock: 60,
      minStock: 12,
    },
    {
      id: "p-014",
      barcode: "7751533000020",
      name: "Sprite 1.5L",
      brand: "Coca Cola",
      category: "gaseosa",
      presentation: "Botella 1.5L",
      purchasePrice: 4.5,
      salePrice: 6.5,
      stock: 48,
      minStock: 12,
    },
    {
      id: "p-015",
      barcode: "7751533000037",
      name: "Agua Mineral San Luis 2.5L",
      brand: "San Luis",
      category: "otros",
      presentation: "Botella 2.5L",
      purchasePrice: 3.5,
      salePrice: 5.0,
      stock: 48,
      minStock: 12,
    },
  ]

  const today = todayISO()
  const sales: Sale[] = [
    {
      id: "s-001",
      ticketCode: "#LC-1001",
      date: today,
      time: "19:35",
      items: [
        {
          productId: "p-001",
          barcode: "7751144000011",
          name: "Cristal Botella 620ml",
          presentation: "Botella 620ml",
          qty: 6,
          unitPrice: 8.0,
          subtotal: 48.0,
        },
        {
          productId: "p-013",
          barcode: "7751533000013",
          name: "Coca Cola 1.5L",
          presentation: "Botella 1.5L",
          qty: 2,
          unitPrice: 7.0,
          subtotal: 14.0,
        },
      ],
      subtotal: 62.0,
      total: 62.0,
      amountPaid: 100.0,
      change: 38.0,
      paymentMethod: "efectivo",
      cashierName: "María García",
    },
    {
      id: "s-002",
      ticketCode: "#LC-1002",
      date: today,
      time: "20:10",
      items: [
        {
          productId: "p-010",
          barcode: "5000267023656",
          name: "Johnnie Walker Red Label",
          presentation: "Botella 750ml",
          qty: 1,
          unitPrice: 135.0,
          subtotal: 135.0,
        },
      ],
      subtotal: 135.0,
      total: 135.0,
      amountPaid: 135.0,
      change: 0.0,
      paymentMethod: "yape_plin",
      cashierName: "María García",
    },
  ]

  return { products, sales, cashierName: "María García" }
}

const EMPTY: LicoreriaState = { products: [], sales: [], cashierName: "" }
let memory: LicoreriaState | null = null
const listeners = new Set<() => void>()

function load(): LicoreriaState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    return JSON.parse(raw) as LicoreriaState
  } catch {
    return seed()
  }
}

function persist(state: LicoreriaState) {
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

export function categoryLabel(cat: LiquorCategory) {
  const map: Record<LiquorCategory, string> = {
    cerveza: "🍺 Cerveza",
    vino: "🍷 Vino",
    pisco: "🥃 Pisco",
    whisky: "🥃 Whisky",
    ron: "🍾 Ron",
    vodka: "🍸 Vodka",
    cocteles: "🍹 Cocteles",
    gaseosa: "🥤 Gaseosa / Agua",
    otros: "📦 Otros",
  }
  return map[cat]
}

export function useLicoreriaStore() {
  const state = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  const ready = state !== EMPTY

  const update = useCallback((fn: (prev: LicoreriaState) => LicoreriaState) => {
    persist(fn(getClientSnapshot()))
  }, [])

  const findByBarcode = useCallback(
    (barcode: string): LiquorProduct | undefined => {
      return getClientSnapshot().products.find((p) => p.barcode === barcode)
    },
    [],
  )

  const registerSale = useCallback(
    (input: {
      items: SaleItem[]
      amountPaid: number
      paymentMethod: Sale["paymentMethod"]
    }) => {
      update((s) => {
        const total = input.items.reduce((sum, i) => sum + i.subtotal, 0)
        const change = Math.max(0, input.amountPaid - total)
        const now = new Date()

        const newSale: Sale = {
          id: uid("sale"),
          ticketCode: nextTicket(s.sales),
          date: todayISO(),
          time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
          items: input.items,
          subtotal: total,
          total,
          amountPaid: input.amountPaid,
          change,
          paymentMethod: input.paymentMethod,
          cashierName: s.cashierName,
        }

        // Descontar stock
        const updatedProducts = s.products.map((p) => {
          const sold = input.items.find((i) => i.productId === p.id)
          if (!sold) return p
          return { ...p, stock: Math.max(0, p.stock - sold.qty) }
        })

        return {
          ...s,
          products: updatedProducts,
          sales: [newSale, ...s.sales],
        }
      })
    },
    [update],
  )

  const addProduct = useCallback(
    (prod: Omit<LiquorProduct, "id">) => {
      update((s) => ({
        ...s,
        products: [...s.products, { ...prod, id: uid("p") }],
      }))
    },
    [update],
  )

  const updateStock = useCallback(
    (productId: string, delta: number) => {
      update((s) => ({
        ...s,
        products: s.products.map((p) =>
          p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p,
        ),
      }))
    },
    [update],
  )

  const reset = useCallback(() => persist(seed()), [])

  const stats = useMemo(() => {
    const today = todayISO()
    const todaySales = state.sales.filter((s) => s.date === today)
    const totalToday = todaySales.reduce((sum, s) => sum + s.total, 0)
    const efectivo = todaySales
      .filter((s) => s.paymentMethod === "efectivo")
      .reduce((sum, s) => sum + s.total, 0)
    const digital = todaySales
      .filter((s) => s.paymentMethod !== "efectivo")
      .reduce((sum, s) => sum + s.total, 0)
    const lowStock = state.products.filter((p) => p.stock <= p.minStock)
    const totalProducts = state.products.length
    const totalTransactions = todaySales.length

    return {
      totalToday,
      efectivo,
      digital,
      lowStock,
      totalProducts,
      totalTransactions,
    }
  }, [state])

  return {
    state,
    ready,
    stats,
    findByBarcode,
    registerSale,
    addProduct,
    updateStock,
    reset,
  }
}

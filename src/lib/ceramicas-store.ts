"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { todayISO } from "@/lib/money"

export type CeramicProduct = {
  id: string
  sku: string
  name: string
  category: string
  unit: "caja" | "saco" | "unidad"
  coverage: number
  stock: number
  minStock: number
  price: number
}

export type CeramicQuote = {
  id: string
  number: string
  date: string
  customer: string
  project: string
  area: number
  waste: number
  total: number
  lines: { productId: string; quantity: number; unitPrice: number }[]
}

type CeramicasState = { products: CeramicProduct[]; quotes: CeramicQuote[] }

const KEY = "tresnube-ceramicas-v1"
const EMPTY: CeramicasState = { products: [], quotes: [] }
let memory: CeramicasState | null = null
const listeners = new Set<() => void>()

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function seed(): CeramicasState {
  return {
    products: [
      { id: "c1", sku: "POR-6060-GR", name: "Porcelanato Gris Cemento 60x60", category: "Porcelanato", unit: "caja", coverage: 1.44, stock: 35, minStock: 10, price: 89.9 },
      { id: "c2", sku: "CER-4545-MAR", name: "Cerámica Mármol Blanco 45x45", category: "Cerámica", unit: "caja", coverage: 2.02, stock: 52, minStock: 12, price: 54.9 },
      { id: "c3", sku: "PEG-25-GRI", name: "Pegamento flexible gris 25 kg", category: "Complementos", unit: "saco", coverage: 5, stock: 18, minStock: 8, price: 32.5 },
      { id: "c4", sku: "FRG-2-BLA", name: "Fragua blanca 2 kg", category: "Complementos", unit: "unidad", coverage: 8, stock: 7, minStock: 10, price: 18.9 },
      { id: "c5", sku: "SAN-ONE-BLA", name: "Sanitario One Piece Blanco", category: "Sanitarios", unit: "unidad", coverage: 1, stock: 9, minStock: 3, price: 649.9 },
    ],
    quotes: [
      { id: "q1", number: "COT-0001", date: todayISO(), customer: "María Torres", project: "Baño principal", area: 18, waste: 10, total: 789.2, lines: [{ productId: "c1", quantity: 14, unitPrice: 89.9 }] },
    ],
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as CeramicasState) : seed()
  } catch {
    return seed()
  }
}

function getSnapshot() {
  if (!memory) memory = load()
  return memory
}

function persist(state: CeramicasState) {
  memory = state
  localStorage.setItem(KEY, JSON.stringify(state))
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useCeramicasStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)
  const update = useCallback((fn: (current: CeramicasState) => CeramicasState) => persist(fn(getSnapshot())), [])
  const reset = useCallback(() => persist(seed()), [])
  const updateProduct = useCallback((id: string, changes: Partial<Omit<CeramicProduct, "id">>) => {
    update((current) => ({
      ...current,
      products: current.products.map((product) => product.id === id ? { ...product, ...changes } : product),
    }))
  }, [update])
  const deleteProduct = useCallback((id: string) => {
    update((current) => ({
      ...current,
      products: current.products.filter((product) => product.id !== id),
    }))
  }, [update])
  const deleteQuote = useCallback((id: string) => {
    update((current) => ({
      ...current,
      quotes: current.quotes.filter((quote) => quote.id !== id),
    }))
  }, [update])
  const addQuote = useCallback((quote: Omit<CeramicQuote, "id" | "number" | "date">) => {
    update((current) => ({
      ...current,
      quotes: [{ ...quote, id: uid("q"), number: `COT-${String(current.quotes.length + 1).padStart(4, "0")}`, date: todayISO() }, ...current.quotes],
    }))
  }, [update])
  const stats = useMemo(() => ({
    products: state.products.length,
    lowStock: state.products.filter((product) => product.stock <= product.minStock).length,
    inventoryValue: state.products.reduce((sum, product) => sum + product.stock * product.price, 0),
    quotes: state.quotes.length,
  }), [state])
  return { state, ready: state !== EMPTY, stats, reset, addQuote, updateProduct, deleteProduct, deleteQuote }
}
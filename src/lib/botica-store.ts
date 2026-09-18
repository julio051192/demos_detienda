"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { todayISO } from "@/lib/money"
import type { BoticaProduct, BoticaSale, BoticaSaleItem, BoticaState } from "@/lib/botica-types"

const KEY = "botica-demo-pe-v1"
const EMPTY: BoticaState = { products: [], sales: [], cashierName: "" }
let memory: BoticaState | null = null
const listeners = new Set<() => void>()

function uid(prefix: string) { return `${prefix}_${Math.random().toString(36).slice(2, 9)}` }
function nextTicket(sales: BoticaSale[]) { return `#BT-${1000 + sales.length + 1}` }

function seed(): BoticaState {
  const products: BoticaProduct[] = [
    { id: "med-001", barcode: "7751234560012", name: "Panadol 500 mg", activeIngredient: "Paracetamol", laboratory: "Johnson & Johnson", category: "analgesico", presentation: "Caja x 20 tabletas", concentration: "500 mg", purchasePrice: 4.2, salePrice: 7.5, stock: 84, minStock: 20, lot: "PANA-2604", expiresAt: "2027-04-30", requiresPrescription: false },
    { id: "med-002", barcode: "7751234560029", name: "Amoxicilina", activeIngredient: "Amoxicilina", laboratory: "Genfar", category: "antibiotico", presentation: "Caja x 20 cápsulas", concentration: "500 mg", purchasePrice: 8.5, salePrice: 14.9, stock: 32, minStock: 12, lot: "AMOX-2511", expiresAt: "2026-11-30", requiresPrescription: true },
    { id: "med-003", barcode: "7751234560036", name: "Doloflam Extra Forte", activeIngredient: "Ibuprofeno + Paracetamol", laboratory: "Portugal", category: "analgesico", presentation: "Caja x 10 tabletas", concentration: "400/325 mg", purchasePrice: 5.8, salePrice: 10.5, stock: 15, minStock: 18, lot: "DOLF-2601", expiresAt: "2027-01-31", requiresPrescription: false },
    { id: "med-004", barcode: "7751234560043", name: "Panadol Antigripal", activeIngredient: "Paracetamol + Clorfenamina", laboratory: "Hersil", category: "antigripal", presentation: "Caja x 12 tabletas", concentration: "500/2 mg", purchasePrice: 6.2, salePrice: 11.9, stock: 42, minStock: 12, lot: "PANT-2602", expiresAt: "2027-02-28", requiresPrescription: false },
    { id: "med-005", barcode: "7751234560050", name: "Multivitamínico Adulto", activeIngredient: "Vitaminas A, C, D y Zinc", laboratory: "Simi", category: "vitamina", presentation: "Frasco x 60 cápsulas", concentration: "Complejo vitamínico", purchasePrice: 15, salePrice: 24.9, stock: 21, minStock: 8, lot: "VITA-2510", expiresAt: "2026-10-31", requiresPrescription: false },
    { id: "med-006", barcode: "7751234560067", name: "Pañales Bebé Talla M", activeIngredient: "N/A", laboratory: "Huggies", category: "bebes", presentation: "Paquete x 36 unidades", concentration: "Talla M", purchasePrice: 32, salePrice: 45.9, stock: 18, minStock: 5, lot: "HUG-2603", expiresAt: "2029-12-31", requiresPrescription: false },
    { id: "med-007", barcode: "7751234560074", name: "Alcohol medicinal 96°", activeIngredient: "Etanol", laboratory: "Medifarma", category: "higiene", presentation: "Frasco 500 ml", concentration: "96°", purchasePrice: 4.5, salePrice: 8.5, stock: 27, minStock: 8, lot: "ALC-2605", expiresAt: "2028-05-31", requiresPrescription: false },
  ]
  return { products, sales: [], cashierName: "María García" }
}

function load() { try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) as BoticaState : seed() } catch { return seed() } }
function persist(state: BoticaState) { memory = state; localStorage.setItem(KEY, JSON.stringify(state)); listeners.forEach((listener) => listener()) }
function subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener) }
function getSnapshot() { if (!memory) memory = load(); return memory }

export function categoryLabel(category: BoticaProduct["category"]) {
  return { analgesico: "Analgésicos", antibiotico: "Antibióticos", antigripal: "Antigripales", vitamina: "Vitaminas", higiene: "Higiene", bebes: "Bebés", otros: "Otros" }[category]
}

export function useBoticaStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)
  const ready = state !== EMPTY
  const update = useCallback((fn: (current: BoticaState) => BoticaState) => persist(fn(getSnapshot())), [])
  const findByBarcode = useCallback((barcode: string) => getSnapshot().products.find((product) => product.barcode === barcode), [])
  const registerSale = useCallback((input: { items: BoticaSaleItem[]; amountPaid: number; paymentMethod: BoticaSale["paymentMethod"]; gateway?: string }) => {
    update((current) => {
      const total = input.items.reduce((sum, item) => sum + item.subtotal, 0)
      const now = new Date()
      const sale: BoticaSale = { id: uid("sale"), ticketCode: nextTicket(current.sales), date: todayISO(), time: now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }), items: input.items, total, amountPaid: input.amountPaid, change: Math.max(0, input.amountPaid - total), paymentMethod: input.paymentMethod, gateway: input.gateway, cashierName: current.cashierName }
      return { ...current, products: current.products.map((product) => { const item = input.items.find((line) => line.productId === product.id); return item ? { ...product, stock: Math.max(0, product.stock - item.qty) } : product }), sales: [sale, ...current.sales] }
    })
  }, [update])
  const reset = useCallback(() => persist(seed()), [])
  const stats = useMemo(() => {
    const salesToday = state.sales.filter((sale) => sale.date === todayISO())
    return { totalToday: salesToday.reduce((sum, sale) => sum + sale.total, 0), transactions: salesToday.length, lowStock: state.products.filter((product) => product.stock <= product.minStock), expiring: state.products.filter((product) => product.expiresAt <= "2026-12-31"), digital: salesToday.filter((sale) => sale.paymentMethod !== "efectivo").reduce((sum, sale) => sum + sale.total, 0) }
  }, [state])
  return { state, ready, stats, findByBarcode, registerSale, reset }
}

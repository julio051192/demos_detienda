"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { todayISO } from "@/lib/money"
import type {
  CafeteriaState,
  CoffeeCategory,
  CoffeeOrder,
  CoffeeOrderLine,
  CoffeeProduct,
  CoffeeSupply,
  LoyaltyCard,
} from "@/lib/cafeteria-types"

const KEY = "cafeteria-demo-pe-v1"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function nextTicketCode(count: number) {
  const num = 100 + count + 1
  return `#CAF-${num}`
}

function seed(): CafeteriaState {
  const today = todayISO()

  const products: CoffeeProduct[] = [
    // Cafés Calientes
    {
      id: "prod-1",
      name: "Cappuccino con Arte Latte",
      category: "calientes",
      description: "Espresso doble de Villa Rica con leche texturizada sedosa y diseño de barismo.",
      basePrice: 12.0,
      imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      allowsMilkCustomization: true,
      allowsSizeCustomization: true,
      prepTimeMinutes: 3,
    },
    {
      id: "prod-2",
      name: "Espresso Doble Especial",
      category: "calientes",
      description: "Extracción pura de granos 100% arábica de origen Chanchamayo (86 pts SCAA).",
      basePrice: 8.0,
      imageUrl: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=500&q=80",
      available: true,
      allowsSizeCustomization: false,
      prepTimeMinutes: 2,
    },
    {
      id: "prod-3",
      name: "Latte Vainilla & Canela",
      category: "calientes",
      description: "Espresso suave con abundante leche vaporizada y toque de jarabe de vainilla francesa.",
      basePrice: 14.0,
      imageUrl: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      allowsMilkCustomization: true,
      allowsSizeCustomization: true,
      prepTimeMinutes: 3,
    },
    {
      id: "prod-4",
      name: "Americano Clásico",
      category: "calientes",
      description: "Shot doble de espresso rebajado con agua a temperatura controlada (92°C).",
      basePrice: 9.0,
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=500&q=80",
      available: true,
      allowsSizeCustomization: true,
      prepTimeMinutes: 2,
    },
    {
      id: "prod-5",
      name: "Moka con Chocolate Cusco",
      category: "calientes",
      description: "Espresso combinado con auténtico cacao cusqueño al 70% y leche texturizada.",
      basePrice: 15.0,
      imageUrl: "https://images.unsplash.com/photo-1607681034540-2c46cc71896d?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      allowsMilkCustomization: true,
      allowsSizeCustomization: true,
      prepTimeMinutes: 4,
    },

    // Bebidas Frías
    {
      id: "prod-6",
      name: "Caramel Frappé con Chantilly",
      category: "frios",
      description: "Bebida helada cremosa a base de café espresso, jarabe de caramelo y crema batida.",
      basePrice: 16.5,
      imageUrl: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      allowsMilkCustomization: true,
      allowsSizeCustomization: true,
      prepTimeMinutes: 4,
    },
    {
      id: "prod-7",
      name: "Cold Brew Macerado 18h",
      category: "frios",
      description: "Café extraído lentamente en frío durante 18 horas. Notas a chocolate y frutos secos.",
      basePrice: 13.0,
      imageUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=500&q=80",
      available: true,
      allowsSizeCustomization: true,
      prepTimeMinutes: 1,
    },
    {
      id: "prod-8",
      name: "Iced Latte Almendras",
      category: "frios",
      description: "Espresso doble servido sobre hielo con leche de almendras y esencia natural.",
      basePrice: 14.5,
      imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=500&q=80",
      available: true,
      allowsMilkCustomization: true,
      allowsSizeCustomization: true,
      prepTimeMinutes: 3,
    },

    // Pastelería & Repostería
    {
      id: "prod-9",
      name: "Croissant Artesanal de Mantequilla",
      category: "pasteleria",
      description: "Masa hojaldrada francesa con 100% mantequilla pura, dorada y crocante.",
      basePrice: 8.5,
      imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      prepTimeMinutes: 2,
    },
    {
      id: "prod-10",
      name: "Torta Húmeda de Chocolate al 70%",
      category: "pasteleria",
      description: "Bizcochuelo súper chocolatoso relleno de fudge artesanal y ganache suave.",
      basePrice: 14.0,
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      prepTimeMinutes: 1,
    },
    {
      id: "prod-11",
      name: "Carrot Cake con Frosting",
      category: "pasteleria",
      description: "Torta de zanahoria con nueces tostadas, canela y cubierta de queso crema suave.",
      basePrice: 13.5,
      imageUrl: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=500&q=80",
      available: true,
      prepTimeMinutes: 1,
    },

    // Sandwiches Calientes
    {
      id: "prod-12",
      name: "Croissant Mixto Gratinado",
      category: "sandwiches",
      description: "Relleno de jamón inglés artesanal y queso Edam fundido con toque de orégano.",
      basePrice: 15.0,
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      prepTimeMinutes: 4,
    },
    {
      id: "prod-13",
      name: "Pan con Chicharrón Criollo",
      category: "sandwiches",
      description: "Chicharrón de cerdo tierno con camote frito crocante y zarza criolla con hierbabuena.",
      basePrice: 18.0,
      imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      prepTimeMinutes: 5,
    },

    // Combos Especiales
    {
      id: "prod-14",
      name: "Combo Desayuno: Cappuccino + Croissant",
      category: "combos",
      description: "1 Cappuccino de 12oz + 1 Croissant mixto recién horneado.",
      basePrice: 22.0,
      imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=500&q=80",
      isPopular: true,
      available: true,
      prepTimeMinutes: 4,
    },
  ]

  const orders: CoffeeOrder[] = [
    {
      id: "ord-c1",
      ticketCode: "#CAF-101",
      customerName: "Mariana Rivera",
      customerPhone: "987 112 233",
      orderType: "para_mesa",
      tableNumber: "Mesa 04",
      lines: [
        {
          id: "line-1",
          productId: "prod-1",
          name: "Cappuccino con Arte Latte",
          unitPrice: 12.0,
          qty: 1,
          subtotal: 12.0,
          customization: { size: "12oz", milk: "entera", sugarLevel: "Sin azúcar" },
        },
        {
          id: "line-2",
          productId: "prod-10",
          name: "Torta Húmeda de Chocolate",
          unitPrice: 14.0,
          qty: 1,
          subtotal: 14.0,
        },
      ],
      total: 26.0,
      status: "preparando",
      paymentMethod: "yape_plin",
      isPaid: true,
      createdAt: `${today} 15:10`,
      preparationMinutes: 3,
    },
    {
      id: "ord-c2",
      ticketCode: "#CAF-102",
      customerName: "Renzo Castillo",
      customerPhone: "991 445 566",
      orderType: "para_llevar",
      lines: [
        {
          id: "line-3",
          productId: "prod-6",
          name: "Caramel Frappé con Chantilly",
          unitPrice: 19.5, // + 3 soles leche almendras
          qty: 1,
          subtotal: 19.5,
          customization: { size: "16oz", milk: "almendras", syrup: "Caramelo" },
          notes: "Extra salsa de caramelo en las paredes del vaso",
        },
      ],
      total: 19.5,
      status: "en_cola",
      paymentMethod: "tarjeta",
      isPaid: true,
      createdAt: `${today} 15:18`,
      preparationMinutes: 1,
    },
    {
      id: "ord-c3",
      ticketCode: "#CAF-103",
      customerName: "Andrea Morales",
      orderType: "para_mesa",
      tableNumber: "Mesa 02",
      lines: [
        {
          id: "line-4",
          productId: "prod-4",
          name: "Americano Clásico",
          unitPrice: 9.0,
          qty: 2,
          subtotal: 18.0,
          customization: { size: "12oz" },
        },
        {
          id: "line-5",
          productId: "prod-12",
          name: "Croissant Mixto Gratinado",
          unitPrice: 15.0,
          qty: 1,
          subtotal: 15.0,
        },
      ],
      total: 33.0,
      status: "listo",
      paymentMethod: "efectivo",
      isPaid: true,
      createdAt: `${today} 14:55`,
      preparationMinutes: 5,
    },
  ]

  const supplies: CoffeeSupply[] = [
    {
      id: "sup-1",
      name: "Café de Especialidad Villa Rica (Tostado Medio)",
      category: "grano_cafe",
      origin: "Oxapampa / Pasco (1,600 msnm)",
      currentStock: 18.5,
      minStock: 5.0,
      unit: "kg",
    },
    {
      id: "sup-2",
      name: "Café Espresso Blend Chanchamayo",
      category: "grano_cafe",
      origin: "Junín (1,450 msnm)",
      currentStock: 12.0,
      minStock: 4.0,
      unit: "kg",
    },
    {
      id: "sup-3",
      name: "Leche Entera Barista (Texturizable)",
      category: "leches",
      currentStock: 34,
      minStock: 10,
      unit: "litros",
    },
    {
      id: "sup-4",
      name: "Bebida Vegetal de Almendras",
      category: "leches",
      currentStock: 8,
      minStock: 6,
      unit: "litros",
    },
    {
      id: "sup-5",
      name: "Bebida Vegetal de Avena Barista",
      category: "leches",
      currentStock: 4,
      minStock: 5,
      unit: "litros",
    },
    {
      id: "sup-6",
      name: "Vasos Biodegradables 12oz",
      category: "descartables",
      currentStock: 240,
      minStock: 100,
      unit: "unidades",
    },
    {
      id: "sup-7",
      name: "Vasos Biodegradables 16oz (Frappés)",
      category: "descartables",
      currentStock: 85,
      minStock: 100,
      unit: "unidades",
    },
    {
      id: "sup-8",
      name: "Jarabe Monin Caramelo Salado",
      category: "jarabes",
      currentStock: 3,
      minStock: 1,
      unit: "botellas (750ml)",
    },
  ]

  const loyaltyCards: LoyaltyCard[] = [
    {
      id: "loy-1",
      customerName: "Mariana Rivera",
      phone: "987 112 233",
      stampsCount: 5, // ¡Le falta 1 para el café gratis!
      freeCoffeesRedeemed: 2,
      lastVisit: `${today} 15:10`,
    },
    {
      id: "loy-2",
      customerName: "Renzo Castillo",
      phone: "991 445 566",
      stampsCount: 3,
      freeCoffeesRedeemed: 1,
      lastVisit: `${today} 15:18`,
    },
    {
      id: "loy-3",
      customerName: "Gonzalo Valdivia",
      phone: "945 889 001",
      stampsCount: 6, // ¡YA PUEDE CANJEAR!
      freeCoffeesRedeemed: 3,
      lastVisit: `${today} 11:20`,
    },
  ]

  return { products, orders, supplies, loyaltyCards }
}

const EMPTY: CafeteriaState = { products: [], orders: [], supplies: [], loyaltyCards: [] }
let memory: CafeteriaState | null = null
const listeners = new Set<() => void>()

function load(): CafeteriaState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    return JSON.parse(raw) as CafeteriaState
  } catch {
    return seed()
  }
}

function persist(state: CafeteriaState) {
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

export function categoryLabel(cat: CoffeeCategory) {
  const map: Record<CoffeeCategory, string> = {
    calientes: "☕ Cafés Calientes",
    frios: "🧊 Frappés & Cold Brew",
    pasteleria: "🥐 Pastelería & Tortas",
    sandwiches: "🥪 Sandwiches Tostados",
    combos: "⭐ Combos & Desayunos",
  }
  return map[cat] || "☕ Cafetería"
}

export function useCafeteriaStore() {
  const state = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  const ready = state !== EMPTY

  const update = useCallback((fn: (prev: CafeteriaState) => CafeteriaState) => {
    persist(fn(getClientSnapshot()))
  }, [])

  const createOrder = useCallback(
    (input: {
      customerName: string
      customerPhone?: string
      orderType: "para_mesa" | "para_llevar"
      tableNumber?: string
      lines: CoffeeOrderLine[]
      paymentMethod: "efectivo" | "yape_plin" | "tarjeta"
    }) => {
      update((s) => {
        const total = input.lines.reduce((sum, l) => sum + l.subtotal, 0)
        const timeNow = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
        const ticketCode = nextTicketCode(s.orders.length)

        const newOrder: CoffeeOrder = {
          id: uid("ord"),
          ticketCode,
          customerName: input.customerName.trim() || "Cliente",
          customerPhone: input.customerPhone?.trim() || undefined,
          orderType: input.orderType,
          tableNumber: input.tableNumber?.trim() || undefined,
          lines: input.lines,
          total,
          status: "en_cola",
          paymentMethod: input.paymentMethod,
          isPaid: true,
          createdAt: `${todayISO()} ${timeNow}`,
          preparationMinutes: 1,
        }

        // Si dio su teléfono, actualizamos o creamos tarjeta de fidelización sumando 1 sello
        let updatedLoyalty = s.loyaltyCards
        if (input.customerPhone && input.customerPhone.length >= 7) {
          const cleanPhone = input.customerPhone.trim()
          const existing = s.loyaltyCards.find((c) => c.phone === cleanPhone)
          if (existing) {
            updatedLoyalty = s.loyaltyCards.map((c) =>
              c.phone === cleanPhone
                ? {
                    ...c,
                    stampsCount: Math.min(6, c.stampsCount + 1),
                    lastVisit: `${todayISO()} ${timeNow}`,
                  }
                : c,
            )
          } else {
            updatedLoyalty = [
              {
                id: uid("loy"),
                customerName: input.customerName.trim() || "Cliente Frecuente",
                phone: cleanPhone,
                stampsCount: 1,
                freeCoffeesRedeemed: 0,
                lastVisit: `${todayISO()} ${timeNow}`,
              },
              ...s.loyaltyCards,
            ]
          }
        }

        return {
          ...s,
          orders: [newOrder, ...s.orders],
          loyaltyCards: updatedLoyalty,
        }
      })
    },
    [update],
  )

  const updateOrderStatus = useCallback(
    (orderId: string, status: CoffeeOrder["status"]) => {
      update((s) => ({
        ...s,
        orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
      }))
    },
    [update],
  )

  const addLoyaltyStamp = useCallback(
    (phone: string, customerName: string) => {
      update((s) => {
        const timeNow = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
        const existing = s.loyaltyCards.find((c) => c.phone === phone)
        if (existing) {
          return {
            ...s,
            loyaltyCards: s.loyaltyCards.map((c) =>
              c.phone === phone
                ? {
                    ...c,
                    stampsCount: Math.min(6, c.stampsCount + 1),
                    lastVisit: `${todayISO()} ${timeNow}`,
                  }
                : c,
            ),
          }
        }
        const newCard: LoyaltyCard = {
          id: uid("loy"),
          customerName: customerName.trim() || "Cliente",
          phone,
          stampsCount: 1,
          freeCoffeesRedeemed: 0,
          lastVisit: `${todayISO()} ${timeNow}`,
        }
        return {
          ...s,
          loyaltyCards: [newCard, ...s.loyaltyCards],
        }
      })
    },
    [update],
  )

  const redeemFreeCoffee = useCallback(
    (cardId: string) => {
      update((s) => ({
        ...s,
        loyaltyCards: s.loyaltyCards.map((c) =>
          c.id === cardId
            ? {
                ...c,
                stampsCount: 0,
                freeCoffeesRedeemed: c.freeCoffeesRedeemed + 1,
              }
            : c,
        ),
      }))
    },
    [update],
  )

  const adjustSupplyStock = useCallback(
    (supplyId: string, delta: number) => {
      update((s) => ({
        ...s,
        supplies: s.supplies.map((sup) =>
          sup.id === supplyId
            ? { ...sup, currentStock: Math.max(0, sup.currentStock + delta) }
            : sup,
        ),
      }))
    },
    [update],
  )

  const reset = useCallback(() => persist(seed()), [])

  const stats = useMemo(() => {
    const totalSalesToday = state.orders.reduce((sum, o) => sum + o.total, 0)
    const activeOrdersCount = state.orders.filter((o) => o.status !== "entregado").length
    const preparingCount = state.orders.filter((o) => o.status === "preparando").length
    const readyCount = state.orders.filter((o) => o.status === "listo").length
    const lowStockSuppliesCount = state.supplies.filter((s) => s.currentStock <= s.minStock).length
    const totalLoyaltyMembers = state.loyaltyCards.length

    return {
      totalSalesToday,
      activeOrdersCount,
      preparingCount,
      readyCount,
      lowStockSuppliesCount,
      totalLoyaltyMembers,
    }
  }, [state])

  return {
    state,
    ready,
    stats,
    createOrder,
    updateOrderStatus,
    addLoyaltyStamp,
    redeemFreeCoffee,
    adjustSupplyStock,
    reset,
  }
}

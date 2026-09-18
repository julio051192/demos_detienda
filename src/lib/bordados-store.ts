"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { todayISO, addDays } from "@/lib/money"
import type {
  BordadosState,
  BordadosUser,
  CashMovement,
  EmbroideryLocation,
  EmbroideryMachine,
  EmbroideryOrder,
  EmbroiderySupply,
  GarmentType,
  OperatorPayroll,
  OrderStage,
  PaymentGatewayTransaction,
  PaymentMethod,
  UserRole,
} from "@/lib/bordados-types"

const KEY = "bordados-demo-pe-v1"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function nextTicket(orders: EmbroideryOrder[]) {
  return `#BD-${2000 + orders.length + 1}`
}

function seed(): BordadosState {
  const today = todayISO()
  const tomorrow = addDays(today, 1)
  const nextWeek = addDays(today, 3)

  const users: BordadosUser[] = [
    { id: "usr-admin", name: "Julio Administrador (Dueño)", role: "admin", seatName: "Oficina General & Finanzas" },
    { id: "usr-cajero", name: "María Torres (Caja & Recepción)", role: "cajero", seatName: "Mostrador Principal & POS" },
    { id: "usr-operario", name: "Carlos Ramos (Operario de Máquinas)", role: "operario", seatName: "Pista de Bordadoras & Taller" },
  ]

  const machines: EmbroideryMachine[] = [
    { id: "m-1", name: "Bordadora M-01", brand: "Tajima Industrial", heads: 6, status: "active", currentOrderId: "ord-1" },
    { id: "m-2", name: "Bordadora M-02", brand: "Barudan Heavy Duty", heads: 4, status: "active", currentOrderId: "ord-2" },
    { id: "m-3", name: "Bordadora M-03 (Muestras)", brand: "Brother VR", heads: 1, status: "idle" },
    { id: "m-4", name: "Bordadora M-04", brand: "Feiya High-Speed", heads: 12, status: "maintenance" },
  ]

  const supplies: EmbroiderySupply[] = [
    { id: "sup-1", name: "Cono Hilo Poliéster 5000m", type: "hilo", color: "Blanco Optico", stock: 18, unit: "conos", minStock: 5, estimatedMetersPerThousandStitches: 5.2 },
    { id: "sup-2", name: "Cono Hilo Poliéster 5000m", type: "hilo", color: "Negro Azabache", stock: 14, unit: "conos", minStock: 5, estimatedMetersPerThousandStitches: 5.2 },
    { id: "sup-3", name: "Cono Hilo Poliéster 5000m", type: "hilo", color: "Azul Marino", stock: 8, unit: "conos", minStock: 3, estimatedMetersPerThousandStitches: 5.2 },
    { id: "sup-4", name: "Cono Hilo Metalizado", type: "hilo", color: "Dorado Real", stock: 4, unit: "conos", minStock: 2, estimatedMetersPerThousandStitches: 6.0 },
    { id: "sup-5", name: "Pelón Arrancable 80g (Rollo 100m)", type: "pelon", stock: 3, unit: "rollos", minStock: 1 },
    { id: "sup-6", name: "Pelón Recortable 60g (Rollo 100m)", type: "pelon", stock: 2, unit: "rollos", minStock: 1 },
    { id: "sup-7", name: "Agujas Groz-Beckert DBxK5 #75/11", type: "aguja", stock: 120, unit: "unidades", minStock: 30 },
    { id: "sup-8", name: "Spray Adhesivo Temporal 500ml", type: "adhesivo", stock: 6, unit: "frascos", minStock: 2 },
  ]

  const orders: EmbroideryOrder[] = [
    {
      id: "ord-1",
      ticketCode: "#BD-2001",
      clientName: "Colegio San Agustín",
      clientPhone: "987 654 321",
      clientDoc: "RUC: 20123456789",
      garmentType: "polo_pique",
      garmentColor: "Blanco / Cuello Azul",
      location: "pecho_izquierdo",
      widthCm: 8.5,
      heightCm: 6.0,
      stitchCount: 9200,
      needsNewMatrix: false,
      matrixCost: 0,
      pricePerThousandStitches: 0.9,
      unitPrice: 8.28,
      qty: 60,
      total: 496.8,
      advance: 250.0,
      balance: 246.8,
      stage: "en_maquina",
      assignedMachineId: "m-1",
      assignedOperatorId: "usr-operario",
      threadColors: ["Azul Marino", "Dorado Real", "Blanco Optico"],
      createdAt: `${today} 09:15`,
      promisedDate: tomorrow,
      invoiceType: "factura",
      invoiceNumber: "F001-000452",
      paymentGatewayRef: "NIU-9841029",
      notes: "Bordar insignia institucional con acabado nítido en letras pequeñas.",
    },
    {
      id: "ord-2",
      ticketCode: "#BD-2002",
      clientName: "Transportes Chinchaysuyo S.A.C.",
      clientPhone: "912 345 678",
      clientDoc: "RUC: 20554433221",
      garmentType: "casaca",
      garmentColor: "Negro",
      location: "espalda_grande",
      widthCm: 26.0,
      heightCm: 14.0,
      stitchCount: 28500,
      needsNewMatrix: true,
      matrixCost: 35.0,
      pricePerThousandStitches: 0.85,
      unitPrice: 24.23,
      qty: 25,
      total: 640.75,
      advance: 300.0,
      balance: 340.75,
      stage: "muestra",
      assignedMachineId: "m-2",
      assignedOperatorId: "usr-operario",
      threadColors: ["Amarillo Neón", "Blanco Optico", "Rojo Intenso"],
      createdAt: `${today} 10:30`,
      promisedDate: nextWeek,
      invoiceType: "boleta",
      invoiceNumber: "B001-001290",
      notes: "Espalda grande con texto reflectivo. Muestra aprobada en pedazo de casaca.",
    },
    {
      id: "ord-3",
      ticketCode: "#BD-2003",
      clientName: "Restaurante El Mochica",
      clientPhone: "944 112 233",
      garmentType: "mandil",
      garmentColor: "Rojo Vinoso",
      location: "pecho_derecho",
      widthCm: 10.0,
      heightCm: 8.0,
      stitchCount: 11000,
      needsNewMatrix: true,
      matrixCost: 25.0,
      pricePerThousandStitches: 0.9,
      unitPrice: 9.9,
      qty: 15,
      total: 173.5,
      advance: 100.0,
      balance: 73.5,
      stage: "matrizado",
      threadColors: ["Blanco Optico", "Verde Esmeralda"],
      createdAt: `${today} 11:45`,
      promisedDate: tomorrow,
      notes: "El cliente envió el logo en JPG. Pendiente ponchado en Wilcom.",
    },
  ]

  const cashMovements: CashMovement[] = [
    {
      id: "cash-1",
      date: today,
      time: "09:15",
      type: "ingreso",
      category: "adelanto_orden",
      description: "Adelanto Orden #BD-2001 (Colegio San Agustín)",
      amount: 250.0,
      paymentMethod: "niubiz",
      orderId: "ord-1",
      registeredBy: "María Torres",
    },
    {
      id: "cash-2",
      date: today,
      time: "10:30",
      type: "ingreso",
      category: "adelanto_orden",
      description: "Adelanto Orden #BD-2002 (Transportes Chinchaysuyo)",
      amount: 300.0,
      paymentMethod: "mercadopago",
      orderId: "ord-2",
      registeredBy: "María Torres",
    },
    {
      id: "cash-3",
      date: today,
      time: "11:00",
      type: "egreso",
      category: "compra_insumos",
      description: "Compra urgente 2 Conos Hilo Dorado + Spray Adhesivo",
      amount: 65.0,
      paymentMethod: "efectivo",
      registeredBy: "María Torres",
    },
    {
      id: "cash-4",
      date: today,
      time: "11:45",
      type: "ingreso",
      category: "adelanto_orden",
      description: "Adelanto Orden #BD-2003 (Restaurante El Mochica)",
      amount: 100.0,
      paymentMethod: "yape_plin",
      orderId: "ord-3",
      registeredBy: "María Torres",
    },
  ]

  const gatewayTransactions: PaymentGatewayTransaction[] = [
    {
      id: "gw-1",
      orderId: "ord-1",
      gateway: "niubiz",
      amount: 250.0,
      currency: "PEN",
      status: "approved",
      transactionRef: "NIU-9841029",
      cardBrand: "VISA ****4242",
      createdAt: `${today} 09:15`,
    },
    {
      id: "gw-2",
      orderId: "ord-2",
      gateway: "mercadopago",
      amount: 300.0,
      currency: "PEN",
      status: "approved",
      transactionRef: "MP-7781920",
      cardBrand: "YAPE QR",
      createdAt: `${today} 10:30`,
    },
  ]

  const payroll: OperatorPayroll[] = [
    {
      id: "pay-1",
      operatorName: "Carlos Ramos",
      role: "operario_bordador",
      payRatePerThousand: 0.15,
      payRatePerGarment: 0.4,
      totalStitchesWorked: 552000, // 552k puntadas bordadas esta semana
      totalGarmentsFinished: 85,
      grossEarned: 116.8, // (552 × 0.15) + (85 × 0.40)
      advancesPaid: 50.0,
      netPayable: 66.8,
      status: "pending",
    },
    {
      id: "pay-2",
      operatorName: "Jorge Diseños (Ponchador)",
      role: "diseñador_matrizador",
      payRatePerThousand: 0.05,
      payRatePerGarment: 0.0,
      totalStitchesWorked: 285000,
      totalGarmentsFinished: 0,
      grossEarned: 120.0, // Tarifa plana por matriz ponchada
      advancesPaid: 0.0,
      netPayable: 120.0,
      status: "pending",
    },
  ]

  return {
    orders,
    machines,
    supplies,
    cashMovements,
    gatewayTransactions,
    payroll,
    users,
    currentUserRoleId: "usr-admin",
  }
}

const EMPTY: BordadosState = {
  orders: [],
  machines: [],
  supplies: [],
  cashMovements: [],
  gatewayTransactions: [],
  payroll: [],
  users: [],
  currentUserRoleId: "usr-admin",
}

let memory: BordadosState | null = null
const listeners = new Set<() => void>()

function load(): BordadosState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    return JSON.parse(raw) as BordadosState
  } catch {
    return seed()
  }
}

function persist(state: BordadosState) {
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

export function garmentLabel(type: GarmentType) {
  const map: Record<GarmentType, string> = {
    polo_pique: "👕 Polo Piqué",
    polo_cotton: "👕 Polo Algodón",
    gorra: "🧢 Gorra",
    casaca: "🧥 Casaca / Polerón",
    mandil: "🦺 Mandil / Delantal",
    pechear: "🦺 Pechera / Chaleco",
    parche: "🏷️ Parche Termoadhesivo",
    otros: "📦 Prenda Varia",
  }
  return map[type] || "👕 Prenda"
}

export function locationLabel(loc: EmbroideryLocation) {
  const map: Record<EmbroideryLocation, string> = {
    pecho_izquierdo: "Pecho Izquierdo",
    pecho_derecho: "Pecho Derecho",
    espalda_grande: "Espalda Grande",
    manga_derecha: "Manga Derecha",
    manga_izquierda: "Manga Izquierda",
    frente_gorra: "Frente de Gorra",
    costado_gorra: "Costado de Gorra",
    otro: "Ubicación Personalizada",
  }
  return map[loc] || loc
}

export function stageLabel(stage: OrderStage) {
  const map: Record<OrderStage, string> = {
    matrizado: "🟡 Diseño / Matriz",
    muestra: "🔵 Muestra de Prueba",
    en_maquina: "🟠 En Máquina",
    limpieza: "✂️ Limpieza & Control",
    listo: "✨ Listo para Entrega",
    entregado: "✅ Entregado",
  }
  return map[stage] || stage
}

export function stageBadge(stage: OrderStage) {
  switch (stage) {
    case "matrizado":
      return "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300"
    case "muestra":
      return "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-300"
    case "en_maquina":
      return "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950 dark:text-orange-300"
    case "limpieza":
      return "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-300"
    case "listo":
      return "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
    case "entregado":
      return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-900 dark:text-slate-400"
  }
}

export function roleLabel(role: UserRole) {
  switch (role) {
    case "admin":
      return "🔑 Administrador / Dueño"
    case "cajero":
      return "💼 Secretario / Cajero"
    case "operario":
      return "⚙️ Operario / Bordador"
  }
}

export function useBordadosStore() {
  const state = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  const ready = state !== EMPTY

  const update = useCallback((fn: (prev: BordadosState) => BordadosState) => {
    persist(fn(getClientSnapshot()))
  }, [])

  const currentUser = useMemo(() => {
    return state.users.find((u) => u.id === state.currentUserRoleId) ?? state.users[0]
  }, [state])

  const setCurrentUserRole = useCallback(
    (userId: string) => {
      update((s) => ({ ...s, currentUserRoleId: userId }))
    },
    [update],
  )

  const addOrder = useCallback(
    (input: Omit<EmbroideryOrder, "id" | "ticketCode" | "total" | "balance" | "stage" | "createdAt">) => {
      update((s) => {
        const totalStitchCost = (input.stitchCount / 1000) * input.pricePerThousandStitches * input.qty
        const total = totalStitchCost + (input.needsNewMatrix ? input.matrixCost : 0)
        const advance = Math.min(total, Math.max(0, input.advance))
        const balance = Math.max(0, total - advance)
        const orderId = uid("ord")
        const ticketCode = nextTicket(s.orders)
        const now = `${todayISO()} ${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}`

        const newOrder: EmbroideryOrder = {
          ...input,
          id: orderId,
          ticketCode,
          total: Math.round(total * 100) / 100,
          advance,
          balance: Math.round(balance * 100) / 100,
          stage: "matrizado",
          createdAt: now,
          invoiceType: "ticket",
          invoiceNumber: `T001-${Math.floor(1000 + Math.random() * 9000)}`,
        }

        // Movimiento de caja por adelanto
        const newCashMov: CashMovement = {
          id: uid("cash"),
          date: todayISO(),
          time: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
          type: "ingreso",
          category: "adelanto_orden",
          description: `Adelanto Orden ${ticketCode} (${input.clientName})`,
          amount: advance,
          paymentMethod: "efectivo",
          orderId,
          registeredBy: s.users.find((u) => u.id === s.currentUserRoleId)?.name || "Cajero",
        }

        return {
          ...s,
          orders: [newOrder, ...s.orders],
          cashMovements: [newCashMov, ...s.cashMovements],
        }
      })
    },
    [update],
  )

  const advanceStage = useCallback(
    (orderId: string, nextStage?: OrderStage) => {
      update((s) => {
        const order = s.orders.find((o) => o.id === orderId)
        if (!order) return s

        const flow: OrderStage[] = ["matrizado", "muestra", "en_maquina", "limpieza", "listo", "entregado"]
        const currentIndex = flow.indexOf(order.stage)
        const targetStage = nextStage ?? (currentIndex < flow.length - 1 ? flow[currentIndex + 1] : order.stage)

        return {
          ...s,
          orders: s.orders.map((o) => (o.id === orderId ? { ...o, stage: targetStage } : o)),
        }
      })
    },
    [update],
  )

  const addCashMovement = useCallback(
    (input: Omit<CashMovement, "id" | "date" | "time" | "registeredBy">) => {
      update((s) => {
        const now = new Date()
        const user = s.users.find((u) => u.id === s.currentUserRoleId)

        const newMov: CashMovement = {
          ...input,
          id: uid("cash"),
          date: todayISO(),
          time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
          registeredBy: user?.name || "Administrador",
        }

        return {
          ...s,
          cashMovements: [newMov, ...s.cashMovements],
        }
      })
    },
    [update],
  )

  const processGatewayPayment = useCallback(
    (input: {
      orderId: string
      gateway: PaymentGatewayTransaction["gateway"]
      amount: number
      cardBrand?: string
    }) => {
      update((s) => {
        const order = s.orders.find((o) => o.id === input.orderId)
        if (!order) return s

        const txRef = `${input.gateway.substring(0, 3).toUpperCase()}-${Math.floor(1000000 + Math.random() * 9000000)}`
        const now = `${todayISO()} ${new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}`

        const newTx: PaymentGatewayTransaction = {
          id: uid("gw"),
          orderId: input.orderId,
          gateway: input.gateway,
          amount: input.amount,
          currency: "PEN",
          status: "approved",
          transactionRef: txRef,
          cardBrand: input.cardBrand || "Visa / Mastercard",
          createdAt: now,
        }

        const newAdvance = order.advance + input.amount
        const newBalance = Math.max(0, order.total - newAdvance)

        const updatedOrders = s.orders.map((o) =>
          o.id === input.orderId
            ? { ...o, advance: newAdvance, balance: newBalance, paymentGatewayRef: txRef }
            : o,
        )

        const newCashMov: CashMovement = {
          id: uid("cash"),
          date: todayISO(),
          time: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
          type: "ingreso",
          category: newBalance === 0 ? "saldo_orden" : "adelanto_orden",
          description: `Pago Pasarela ${input.gateway.toUpperCase()} (${txRef}) — Orden ${order.ticketCode}`,
          amount: input.amount,
          paymentMethod: input.gateway as PaymentMethod,
          orderId: input.orderId,
          registeredBy: "Pasarela API",
        }

        return {
          ...s,
          orders: updatedOrders,
          gatewayTransactions: [newTx, ...s.gatewayTransactions],
          cashMovements: [newCashMov, ...s.cashMovements],
        }
      })
    },
    [update],
  )

  const issueInvoice = useCallback(
    (orderId: string, invoiceType: "boleta" | "factura") => {
      update((s) => ({
        ...s,
        orders: s.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                invoiceType,
                invoiceNumber: `${invoiceType === "boleta" ? "B001" : "F001"}-${Math.floor(100000 + Math.random() * 900000)}`,
              }
            : o,
        ),
      }))
    },
    [update],
  )

  const updateSupplyStock = useCallback(
    (supplyId: string, delta: number) => {
      update((s) => ({
        ...s,
        supplies: s.supplies.map((sup) => (sup.id === supplyId ? { ...sup, stock: Math.max(0, sup.stock + delta) } : sup)),
      }))
    },
    [update],
  )

  const reset = useCallback(() => persist(seed()), [])

  const stats = useMemo(() => {
    const today = todayISO()
    const activeOrders = state.orders.filter((o) => o.stage !== "entregado")
    const totalGarmentsPending = activeOrders.reduce((sum, o) => sum + o.qty, 0)
    const totalStitchesPending = activeOrders.reduce((sum, o) => sum + o.stitchCount * o.qty, 0)

    // Caja chica
    const todayMovs = state.cashMovements.filter((m) => m.date === today)
    const totalIngresosToday = todayMovs.filter((m) => m.type === "ingreso").reduce((sum, m) => sum + m.amount, 0)
    const totalEgresosToday = todayMovs.filter((m) => m.type === "egreso").reduce((sum, m) => sum + m.amount, 0)
    const totalAdvancesToday = todayMovs
      .filter((m) => m.type === "ingreso" && (m.category === "adelanto_orden" || m.category === "saldo_orden"))
      .reduce((sum, m) => sum + m.amount, 0)
    const cashNetBalance = totalIngresosToday - totalEgresosToday

    const pendingBalancesTotal = activeOrders.reduce((sum, o) => sum + o.balance, 0)
    const activeMachinesCount = state.machines.filter((m) => m.status === "active").length

    const totalPayrollPending = state.payroll.reduce((sum, p) => sum + p.netPayable, 0)

    return {
      activeOrdersCount: activeOrders.length,
      totalGarmentsPending,
      totalStitchesPending,
      totalIngresosToday,
      totalEgresosToday,
      totalAdvancesToday,
      cashNetBalance,
      pendingBalancesTotal,
      activeMachinesCount,
      totalMachinesCount: state.machines.length,
      totalPayrollPending,
    }
  }, [state])

  return {
    state,
    ready,
    stats,
    currentUser,
    setCurrentUserRole,
    addOrder,
    advanceStage,
    addCashMovement,
    processGatewayPayment,
    issueInvoice,
    updateSupplyStock,
    reset,
  }
}

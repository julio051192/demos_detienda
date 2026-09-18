"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { todayISO } from "@/lib/money"
import type {
  CarWashService,
  CarWashState,
  CarWashStatus,
  CarWashSupply,
  PaymentMethod,
  VehicleTicket,
  VehicleType,
  WasherStaff,
} from "@/lib/carwash-types"

const KEY = "carwash-demo-pe-v1"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function nextTicketCode(tickets: VehicleTicket[]) {
  const num = tickets.length + 201
  return `#CW-${num}`
}

function seed(): CarWashState {
  const washers: WasherStaff[] = [
    { id: "w-1", name: "Bryan Huamán", phone: "981 223 441", active: true },
    { id: "w-2", name: "Kevin Ramos", phone: "974 551 209", active: true },
    { id: "w-3", name: "Jhonathan Silva", phone: "912 884 330", active: true },
    { id: "w-4", name: "Carlos Quispe", phone: "956 771 004", active: true },
  ]

  const services: CarWashService[] = [
    // Auto / Sedán
    {
      id: "srv-auto-exp",
      name: "Lavado Express / Carrocería",
      vehicleType: "auto",
      price: 15.0,
      estimatedMinutes: 20,
      commission: 5.0,
    },
    {
      id: "srv-auto-comp",
      name: "Lavado Completo (Salón + Aspirado + Silicona)",
      vehicleType: "auto",
      price: 25.0,
      estimatedMinutes: 35,
      commission: 8.0,
    },
    {
      id: "srv-auto-mot",
      name: "Lavado Completo + Motor & Chasis",
      vehicleType: "auto",
      price: 45.0,
      estimatedMinutes: 50,
      commission: 15.0,
    },
    {
      id: "srv-auto-tap",
      name: "Lavado de Salón Profundo (Tapicería y Techo)",
      vehicleType: "auto",
      price: 120.0,
      estimatedMinutes: 120,
      commission: 40.0,
    },

    // SUV / Camioneta
    {
      id: "srv-suv-exp",
      name: "Lavado Express / Carrocería SUV",
      vehicleType: "suv",
      price: 22.0,
      estimatedMinutes: 25,
      commission: 7.0,
    },
    {
      id: "srv-suv-comp",
      name: "Lavado Completo SUV (Salón + Aspirado + Cera)",
      vehicleType: "suv",
      price: 35.0,
      estimatedMinutes: 40,
      commission: 12.0,
    },
    {
      id: "srv-suv-mot",
      name: "Lavado Completo SUV + Motor & Pulverizado",
      vehicleType: "suv",
      price: 60.0,
      estimatedMinutes: 60,
      commission: 20.0,
    },

    // Moto / Trimoto
    {
      id: "srv-moto-bas",
      name: "Lavado Básico de Moto",
      vehicleType: "moto",
      price: 12.0,
      estimatedMinutes: 15,
      commission: 4.0,
    },
    {
      id: "srv-moto-det",
      name: "Lavado Detallado Moto + Desengrase de Cadena",
      vehicleType: "moto",
      price: 20.0,
      estimatedMinutes: 25,
      commission: 7.0,
    },

    // Minivan / Combi
    {
      id: "srv-mini-comp",
      name: "Lavado Completo Minivan / Combi (11-15 asientos)",
      vehicleType: "minivan",
      price: 45.0,
      estimatedMinutes: 50,
      commission: 15.0,
    },
  ]

  const supplies: CarWashSupply[] = [
    {
      id: "sup-cw-1",
      name: "Shampoo con Cera / Espuma Activa Snow Foam",
      unit: "bidón 20 L",
      stock: 5,
      minStock: 2,
      cost: 110.0,
    },
    {
      id: "sup-cw-2",
      name: "Renovador de Llantas & Silicona de Tablero",
      unit: "bidón 20 L",
      stock: 3,
      minStock: 2,
      cost: 95.0,
    },
    {
      id: "sup-cw-3",
      name: "Desengrasante Industrial para Motores y Chasis",
      unit: "galón 4 L",
      stock: 4,
      minStock: 2,
      cost: 38.0,
    },
    {
      id: "sup-cw-4",
      name: "Aromatizante Concentrado para Interiores (Spray)",
      unit: "frasco 1 L",
      stock: 8,
      minStock: 3,
      cost: 18.0,
    },
    {
      id: "sup-cw-5",
      name: "Paños de Microfibra de Alto Gramaje (40x40 cm)",
      unit: "pack 12 u",
      stock: 6,
      minStock: 2,
      cost: 32.0,
    },
  ]

  const tickets: VehicleTicket[] = [
    {
      id: "t-1",
      ticketCode: "#CW-201",
      plate: "B8M-492",
      vehicleType: "auto",
      brandModel: "Toyota Yaris (Negro)",
      customerName: "Raúl Castañeda",
      customerPhone: "987 120 445",
      bay: "Bahía 1",
      washerId: "w-1",
      washerName: "Bryan Huamán",
      serviceId: "srv-auto-comp",
      serviceName: "Lavado Completo (Salón + Aspirado)",
      price: 25.0,
      paymentMethod: "yape_plin",
      isPaid: true,
      status: "washing",
      entryTime: "14:15",
      notes: "Cuidado con alerón posterior.",
    },
    {
      id: "t-2",
      ticketCode: "#CW-202",
      plate: "CFW-310",
      vehicleType: "suv",
      brandModel: "Hyundai Tucson (Blanco)",
      customerName: "Mariana Delgado",
      customerPhone: "944 332 118",
      bay: "Zona Secado",
      washerId: "w-2",
      washerName: "Kevin Ramos",
      serviceId: "srv-suv-comp",
      serviceName: "Lavado Completo SUV",
      price: 35.0,
      paymentMethod: "efectivo",
      isPaid: true,
      status: "drying",
      entryTime: "13:50",
      notes: "Silicona mate en tablero.",
    },
    {
      id: "t-3",
      ticketCode: "#CW-203",
      plate: "4512-4C",
      vehicleType: "moto",
      brandModel: "Honda CB190R (Rojo)",
      customerName: "Christian Paucar",
      customerPhone: "911 002 993",
      bay: "En Espera",
      washerId: "w-3",
      washerName: "Jhonathan Silva",
      serviceId: "srv-moto-det",
      serviceName: "Lavado Detallado Moto",
      price: 20.0,
      paymentMethod: "yape_plin",
      isPaid: false,
      status: "waiting",
      entryTime: "14:30",
    },
    {
      id: "t-4",
      ticketCode: "#CW-200",
      plate: "AYZ-889",
      vehicleType: "auto",
      brandModel: "Kia Cerato (Gris)",
      customerName: "Víctor Huamán",
      bay: "Salida",
      washerId: "w-1",
      washerName: "Bryan Huamán",
      serviceId: "srv-auto-comp",
      serviceName: "Lavado Completo",
      price: 25.0,
      paymentMethod: "efectivo",
      isPaid: true,
      status: "delivered",
      entryTime: "13:00",
      exitTime: "13:45",
    },
  ]

  return { tickets, services, washers, supplies }
}

const EMPTY: CarWashState = {
  tickets: [],
  services: [],
  washers: [],
  supplies: [],
}

let memory: CarWashState | null = null
const listeners = new Set<() => void>()

function load(): CarWashState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    return JSON.parse(raw) as CarWashState
  } catch {
    return seed()
  }
}

function persist(state: CarWashState) {
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

export function vehicleTypeLabel(type: VehicleType) {
  switch (type) {
    case "auto":
      return "🚗 Auto / Sedán"
    case "suv":
      return "🚙 SUV / Camioneta"
    case "moto":
      return "🏍️ Moto / Lineal"
    case "minivan":
      return "🚐 Minivan / Combi"
    case "camion":
      return "🚚 Camión / Furgón"
  }
}

export function carWashStatusLabel(status: CarWashStatus) {
  switch (status) {
    case "waiting":
      return "⏳ En Espera"
    case "washing":
      return "💦 En Lavado"
    case "drying":
      return "🧽 Secado & Aspirado"
    case "ready":
      return "✨ Listo para Salir"
    case "delivered":
      return "✅ Entregado"
  }
}

export function carWashStatusBadge(status: CarWashStatus) {
  switch (status) {
    case "waiting":
      return "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-900 dark:text-slate-200"
    case "washing":
      return "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200"
    case "drying":
      return "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200"
    case "ready":
      return "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200"
    case "delivered":
      return "bg-muted text-muted-foreground border-border"
  }
}

export function useCarWashStore() {
  const state = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  )
  const ready = state !== EMPTY

  const update = useCallback(
    (fn: (prev: CarWashState) => CarWashState) => {
      persist(fn(getClientSnapshot()))
    },
    [],
  )

  const createTicket = useCallback(
    (input: {
      plate: string
      vehicleType: VehicleType
      brandModel: string
      customerName?: string
      customerPhone?: string
      bay: string
      washerId: string
      serviceId: string
      paymentMethod: PaymentMethod
      isPaid: boolean
      notes?: string
    }) => {
      update((s) => {
        const service = s.services.find((srv) => srv.id === input.serviceId)
        const washer = s.washers.find((w) => w.id === input.washerId)
        const ticketCode = nextTicketCode(s.tickets)

        const now = new Date()
        const entryTime = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`

        const newTicket: VehicleTicket = {
          id: uid("cw_t"),
          ticketCode,
          plate: input.plate.trim().toUpperCase(),
          vehicleType: input.vehicleType,
          brandModel: input.brandModel.trim(),
          customerName: input.customerName?.trim() || "Cliente Mostrador",
          customerPhone: input.customerPhone?.trim(),
          bay: input.bay || "Bahía 1",
          washerId: input.washerId,
          washerName: washer?.name || "Sin asignar",
          serviceId: input.serviceId,
          serviceName: service?.name || "Lavado General",
          price: service?.price || 20.0,
          paymentMethod: input.paymentMethod,
          isPaid: input.isPaid,
          status: "washing",
          entryTime,
          notes: input.notes?.trim(),
        }

        return { ...s, tickets: [newTicket, ...s.tickets] }
      })
    },
    [update],
  )

  const updateTicketStatus = useCallback(
    (ticketId: string, status: CarWashStatus) => {
      update((s) => {
        const now = new Date()
        const exitTime = `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`

        return {
          ...s,
          tickets: s.tickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  status,
                  exitTime: status === "delivered" ? exitTime : t.exitTime,
                  isPaid: status === "delivered" ? true : t.isPaid,
                }
              : t,
          ),
        }
      })
    },
    [update],
  )

  const markTicketPaid = useCallback(
    (ticketId: string, paymentMethod: PaymentMethod) => {
      update((s) => ({
        ...s,
        tickets: s.tickets.map((t) =>
          t.id === ticketId ? { ...t, isPaid: true, paymentMethod } : t,
        ),
      }))
    },
    [update],
  )

  const addWasher = useCallback(
    (washer: Omit<WasherStaff, "id">) => {
      update((s) => ({
        ...s,
        washers: [...s.washers, { ...washer, id: uid("w") }],
      }))
    },
    [update],
  )

  const addService = useCallback(
    (service: Omit<CarWashService, "id">) => {
      update((s) => ({
        ...s,
        services: [...s.services, { ...service, id: uid("srv_cw") }],
      }))
    },
    [update],
  )

  const addSupply = useCallback(
    (supply: Omit<CarWashSupply, "id">) => {
      update((s) => ({
        ...s,
        supplies: [...s.supplies, { ...supply, id: uid("sup_cw") }],
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
    const paidTickets = state.tickets.filter((t) => t.isPaid)
    const revenueToday = paidTickets.reduce((sum, t) => sum + t.price, 0)
    const efectivoToday = paidTickets
      .filter((t) => t.paymentMethod === "efectivo")
      .reduce((sum, t) => sum + t.price, 0)
    const yapeToday = paidTickets
      .filter((t) => t.paymentMethod === "yape_plin")
      .reduce((sum, t) => sum + t.price, 0)

    const activeTickets = state.tickets.filter((t) => t.status !== "delivered")
    const waitingCount = activeTickets.filter((t) => t.status === "waiting").length
    const washingCount = activeTickets.filter((t) => t.status === "washing").length
    const dryingCount = activeTickets.filter((t) => t.status === "drying").length
    const readyCount = activeTickets.filter((t) => t.status === "ready").length

    const washerCommissions = state.washers.map((w) => {
      const washerTickets = state.tickets.filter(
        (t) => t.washerId === w.id && t.status === "delivered",
      )
      const count = washerTickets.length
      const totalCommission = washerTickets.reduce((sum, t) => {
        const srv = state.services.find((s) => s.id === t.serviceId)
        return sum + (srv?.commission || 5.0)
      }, 0)
      return {
        washerId: w.id,
        name: w.name,
        count,
        totalCommission,
      }
    })

    const totalCommissionsToday = washerCommissions.reduce(
      (sum, w) => sum + w.totalCommission,
      0,
    )

    return {
      revenueToday,
      efectivoToday,
      yapeToday,
      vehiclesToday: state.tickets.length,
      activeVehicles: activeTickets.length,
      waitingCount,
      washingCount,
      dryingCount,
      readyCount,
      washerCommissions,
      totalCommissionsToday,
    }
  }, [state])

  return {
    state,
    ready,
    stats,
    createTicket,
    updateTicketStatus,
    markTicketPaid,
    addWasher,
    addService,
    addSupply,
    updateSupplyStock,
    reset,
  }
}

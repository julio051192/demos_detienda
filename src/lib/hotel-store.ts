"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { todayISO, addDays } from "@/lib/money"
import type {
  FrigobarProduct,
  GuestStay,
  HotelRoom,
  HotelState,
  PaymentMethod,
  RoomCharge,
  RoomStatus,
  RoomType,
  StayMode,
} from "@/lib/hotel-types"

const KEY = "hotel-demo-pe-v1"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function nextTicketCode(stays: GuestStay[]) {
  const num = stays.length + 301
  return `#HT-${num}`
}

function seed(): HotelState {
  const rooms: HotelRoom[] = [
    // Piso 1
    {
      id: "rm-101",
      number: "101",
      floor: 1,
      type: "matrimonial",
      priceNight: 70.0,
      priceHour: 30.0,
      status: "occupied",
      currentStayId: "stay-1",
    },
    {
      id: "rm-102",
      number: "102",
      floor: 1,
      type: "simple",
      priceNight: 50.0,
      priceHour: 25.0,
      status: "available",
    },
    {
      id: "rm-103",
      number: "103",
      floor: 1,
      type: "doble",
      priceNight: 90.0,
      priceHour: 35.0,
      status: "cleaning",
    },

    // Piso 2
    {
      id: "rm-201",
      number: "201",
      floor: 2,
      type: "matrimonial",
      priceNight: 80.0,
      priceHour: 30.0,
      status: "occupied",
      currentStayId: "stay-2",
    },
    {
      id: "rm-202",
      number: "202",
      floor: 2,
      type: "matrimonial",
      priceNight: 80.0,
      priceHour: 30.0,
      status: "available",
    },
    {
      id: "rm-203",
      number: "203",
      floor: 2,
      type: "doble",
      priceNight: 95.0,
      priceHour: 40.0,
      status: "available",
    },

    // Piso 3
    {
      id: "rm-301",
      number: "301",
      floor: 3,
      type: "suite",
      priceNight: 130.0,
      priceHour: 50.0,
      status: "available",
    },
    {
      id: "rm-302",
      number: "302",
      floor: 3,
      type: "jacuzzi",
      priceNight: 160.0,
      priceHour: 65.0,
      status: "occupied",
      currentStayId: "stay-3",
    },
  ]

  const frigobar: FrigobarProduct[] = [
    { id: "fg-1", name: "Agua Mineral San Mateo 600ml", category: "bebida", price: 3.5, stock: 24 },
    { id: "fg-2", name: "Gaseosa Inka Kola / Coca Cola 500ml", category: "bebida", price: 5.0, stock: 20 },
    { id: "fg-3", name: "Cerveza Cusqueña Trigo / Dorada 330ml", category: "bebida", price: 8.0, stock: 18 },
    { id: "fg-4", name: "Papas Lays Clásicas / Pringles", category: "snack", price: 6.0, stock: 15 },
    { id: "fg-5", name: "Chocolates Sublime / Triángulo", category: "snack", price: 3.5, stock: 30 },
    { id: "fg-6", name: "Kit de Aseo & Dientes Personal", category: "amenity", price: 4.0, stock: 25 },
  ]

  const today = todayISO()
  const tomorrow = addDays(today, 1)

  const stays: GuestStay[] = [
    {
      id: "stay-1",
      ticketCode: "#HT-301",
      roomId: "rm-101",
      roomNumber: "101",
      guestName: "Carlos Benites Mendoza",
      docType: "DNI",
      docNumber: "45892147",
      phone: "987 441 220",
      originCity: "Arequipa",
      checkIn: `${today} 14:00`,
      checkOutExpected: `${tomorrow} 12:00`,
      mode: "night",
      duration: 1,
      rate: 70.0,
      charges: [
        { id: "ch-1", description: "Agua Mineral San Mateo 600ml", qty: 2, unitPrice: 3.5, date: today },
      ],
      totalRoom: 70.0,
      totalCharges: 7.0,
      total: 77.0,
      advance: 50.0,
      balance: 27.0,
      paymentMethod: "efectivo",
      status: "active",
      notes: "Solicitó toalla extra y no molestar por la mañana.",
    },
    {
      id: "stay-2",
      ticketCode: "#HT-302",
      roomId: "rm-201",
      roomNumber: "201",
      guestName: "Rosa Palacios Gómez",
      docType: "DNI",
      docNumber: "72109844",
      phone: "945 110 982",
      originCity: "Trujillo",
      checkIn: `${today} 15:30`,
      checkOutExpected: `${tomorrow} 12:00`,
      mode: "night",
      duration: 1,
      rate: 80.0,
      charges: [
        { id: "ch-2", description: "Gaseosa Inka Kola 500ml", qty: 1, unitPrice: 5.0, date: today },
        { id: "ch-3", description: "Papas Lays Clásicas", qty: 1, unitPrice: 6.0, date: today },
      ],
      totalRoom: 80.0,
      totalCharges: 11.0,
      total: 91.0,
      advance: 91.0,
      balance: 0.0,
      paymentMethod: "yape_plin",
      status: "active",
      notes: "Pagó 100% por Yape al ingresar.",
    },
    {
      id: "stay-3",
      ticketCode: "#HT-303",
      roomId: "rm-302",
      roomNumber: "302",
      guestName: "Jorge & Andrea Linares",
      docType: "DNI",
      docNumber: "40192837",
      phone: "912 883 441",
      originCity: "Lima",
      checkIn: `${today} 13:00`,
      checkOutExpected: `${today} 19:00`,
      mode: "hours",
      duration: 6,
      rate: 65.0, // Tarifa plana por horas
      charges: [
        { id: "ch-4", description: "Cerveza Cusqueña 330ml", qty: 2, unitPrice: 8.0, date: today },
      ],
      totalRoom: 65.0,
      totalCharges: 16.0,
      total: 81.0,
      advance: 65.0,
      balance: 16.0,
      paymentMethod: "tarjeta",
      status: "active",
      notes: "Suite Jacuzzi - 6 horas de uso.",
    },
  ]

  return { rooms, stays, frigobar }
}

const EMPTY: HotelState = { rooms: [], stays: [], frigobar: [] }
let memory: HotelState | null = null
const listeners = new Set<() => void>()

function load(): HotelState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    return JSON.parse(raw) as HotelState
  } catch {
    return seed()
  }
}

function persist(state: HotelState) {
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

export function roomTypeLabel(type: RoomType) {
  switch (type) {
    case "simple":
      return "🛏️ Simple (1 Plaza)"
    case "matrimonial":
      return "🛏️ Matrimonial (2 Plazas)"
    case "doble":
      return "🛏️ Doble Twin (2 Camas)"
    case "suite":
      return "👑 Suite Ejecutiva"
    case "jacuzzi":
      return "🛁 Suite con Jacuzzi"
  }
}

export function roomStatusLabel(status: RoomStatus) {
  switch (status) {
    case "available":
      return "🟢 Disponible"
    case "occupied":
      return "🔴 Ocupada"
    case "cleaning":
      return "🧹 En Limpieza"
    case "maintenance":
      return "🛠️ Mantenimiento"
  }
}

export function roomStatusBadge(status: RoomStatus) {
  switch (status) {
    case "available":
      return "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300"
    case "occupied":
      return "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-300"
    case "cleaning":
      return "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300"
    case "maintenance":
      return "bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-900 dark:text-slate-300"
  }
}

export function useHotelStore() {
  const state = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  )
  const ready = state !== EMPTY

  const update = useCallback(
    (fn: (prev: HotelState) => HotelState) => {
      persist(fn(getClientSnapshot()))
    },
    [],
  )

  const checkInGuest = useCallback(
    (input: {
      roomId: string
      guestName: string
      docType: "DNI" | "Pasaporte" | "CE"
      docNumber: string
      phone?: string
      originCity?: string
      checkOutExpected: string
      mode: StayMode
      duration: number
      rate: number
      advance: number
      paymentMethod: PaymentMethod
      notes?: string
    }) => {
      update((s) => {
        const room = s.rooms.find((r) => r.id === input.roomId)
        if (!room) return s

        const stayId = uid("stay")
        const ticketCode = nextTicketCode(s.stays)
        const now = new Date()
        const checkIn = `${now.toISOString().slice(0, 10)} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

        const totalRoom = input.rate * input.duration
        const total = totalRoom
        const advance = Math.min(total, Math.max(0, input.advance))
        const balance = Math.max(0, total - advance)

        const newStay: GuestStay = {
          id: stayId,
          ticketCode,
          roomId: room.id,
          roomNumber: room.number,
          guestName: input.guestName.trim(),
          docType: input.docType,
          docNumber: input.docNumber.trim(),
          phone: input.phone?.trim(),
          originCity: input.originCity?.trim(),
          checkIn,
          checkOutExpected: input.checkOutExpected,
          mode: input.mode,
          duration: input.duration,
          rate: input.rate,
          charges: [],
          totalRoom,
          totalCharges: 0,
          total,
          advance,
          balance,
          paymentMethod: input.paymentMethod,
          status: "active",
          notes: input.notes?.trim(),
        }

        const updatedRooms = s.rooms.map((r) =>
          r.id === room.id
            ? { ...r, status: "occupied" as const, currentStayId: stayId }
            : r,
        )

        return {
          ...s,
          rooms: updatedRooms,
          stays: [newStay, ...s.stays],
        }
      })
    },
    [update],
  )

  const addChargeToStay = useCallback(
    (stayId: string, item: { description: string; qty: number; unitPrice: number }) => {
      update((s) => {
        const stay = s.stays.find((st) => st.id === stayId)
        if (!stay) return s

        const newCharge: RoomCharge = {
          id: uid("ch"),
          description: item.description,
          qty: item.qty,
          unitPrice: item.unitPrice,
          date: todayISO(),
        }

        const updatedCharges = [...stay.charges, newCharge]
        const totalCharges = updatedCharges.reduce((sum, ch) => sum + ch.qty * ch.unitPrice, 0)
        const total = stay.totalRoom + totalCharges
        const balance = Math.max(0, total - stay.advance)

        const updatedStays = s.stays.map((st) =>
          st.id === stayId
            ? {
                ...st,
                charges: updatedCharges,
                totalCharges,
                total,
                balance,
              }
            : st,
        )

        return { ...s, stays: updatedStays }
      })
    },
    [update],
  )

  const checkOutGuest = useCallback(
    (stayId: string) => {
      update((s) => {
        const stay = s.stays.find((st) => st.id === stayId)
        if (!stay) return s

        const now = new Date()
        const checkedOutAt = `${now.toISOString().slice(0, 10)} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

        const updatedStays = s.stays.map((st) =>
          st.id === stayId
            ? {
                ...st,
                status: "checked_out" as const,
                balance: 0,
                checkedOutAt,
              }
            : st,
        )

        const updatedRooms = s.rooms.map((r) =>
          r.id === stay.roomId
            ? { ...r, status: "cleaning" as const, currentStayId: undefined }
            : r,
        )

        return {
          ...s,
          rooms: updatedRooms,
          stays: updatedStays,
        }
      })
    },
    [update],
  )

  const setRoomStatus = useCallback(
    (roomId: string, status: RoomStatus) => {
      update((s) => ({
        ...s,
        rooms: s.rooms.map((r) =>
          r.id === roomId
            ? {
                ...r,
                status,
                currentStayId: status === "available" || status === "cleaning" ? undefined : r.currentStayId,
              }
            : r,
        ),
      }))
    },
    [update],
  )

  const addRoom = useCallback(
    (room: Omit<HotelRoom, "id" | "status" | "currentStayId">) => {
      update((s) => ({
        ...s,
        rooms: [
          ...s.rooms,
          {
            ...room,
            id: uid("rm"),
            status: "available",
          },
        ],
      }))
    },
    [update],
  )

  const addFrigobarProduct = useCallback(
    (prod: Omit<FrigobarProduct, "id">) => {
      update((s) => ({
        ...s,
        frigobar: [...s.frigobar, { ...prod, id: uid("fg") }],
      }))
    },
    [update],
  )

  const reset = useCallback(() => persist(seed()), [])

  const stats = useMemo(() => {
    const totalRooms = state.rooms.length
    const occupiedCount = state.rooms.filter((r) => r.status === "occupied").length
    const availableCount = state.rooms.filter((r) => r.status === "available").length
    const cleaningCount = state.rooms.filter((r) => r.status === "cleaning").length

    const occupancyPercent = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0

    const today = todayISO()
    const activeStays = state.stays.filter((st) => st.status === "active")

    const advancesCollectedToday = state.stays
      .filter((st) => st.checkIn.startsWith(today))
      .reduce((sum, st) => sum + st.advance, 0)

    const checkoutsSettledToday = state.stays
      .filter((st) => st.checkedOutAt?.startsWith(today) && st.total > st.advance)
      .reduce((sum, st) => sum + (st.total - st.advance), 0)

    const revenueToday = advancesCollectedToday + checkoutsSettledToday

    const pendingBalancesTotal = activeStays.reduce((sum, st) => sum + st.balance, 0)

    return {
      totalRooms,
      occupiedCount,
      availableCount,
      cleaningCount,
      occupancyPercent,
      revenueToday,
      activeGuestsCount: activeStays.length,
      pendingBalancesTotal,
    }
  }, [state])

  return {
    state,
    ready,
    stats,
    checkInGuest,
    addChargeToStay,
    checkOutGuest,
    setRoomStatus,
    addRoom,
    addFrigobarProduct,
    reset,
  }
}

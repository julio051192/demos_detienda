"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { addDays, todayISO } from "@/lib/money"
import type {
  ClinicalConsultation,
  GroomingService,
  PetPatient,
  PetShopProduct,
  VaccineRecord,
  VeterinariaSale,
  VeterinariaState,
} from "@/lib/veterinaria-types"

const KEY = "veterinaria-demo-pe-v1"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function nextTicketCode(count: number, prefix = "VET") {
  return `#${prefix}-${1000 + count + 1}`
}

function seed(): VeterinariaState {
  const today = todayISO()
  const tomorrow = addDays(today, 1)
  const inAWeek = addDays(today, 7)

  const patients: PetPatient[] = [
    {
      id: "pet-1",
      code: "HC-4010",
      name: "Toby",
      species: "perro",
      breed: "Golden Retriever",
      gender: "macho",
      ageYears: 3,
      weightKg: 28.5,
      imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=80",
      ownerName: "Patricia Alarcón",
      ownerDni: "45892134",
      ownerPhone: "987 112 233",
      allergies: "Alérgico al pollo crudo",
      lastVisit: `${today} 10:15`,
    },
    {
      id: "pet-2",
      code: "HC-4011",
      name: "Luna",
      species: "gato",
      breed: "Siamés Tradicional",
      gender: "hembra",
      ageYears: 2,
      weightKg: 3.8,
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80",
      ownerName: "Diego Barrenechea",
      ownerDni: "70891245",
      ownerPhone: "991 334 455",
      lastVisit: `${today} 11:30`,
    },
    {
      id: "pet-3",
      code: "HC-4012",
      name: "Max",
      species: "perro",
      breed: "Bulldog Francés",
      gender: "macho",
      ageYears: 1,
      weightKg: 11.2,
      imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=500&q=80",
      ownerName: "Camila Vega",
      ownerDni: "48231902",
      ownerPhone: "978 556 677",
      allergies: "Piel atópica / Dermatitis",
      lastVisit: `${today} 12:00`,
    },
    {
      id: "pet-4",
      code: "HC-4013",
      name: "Rocky",
      species: "perro",
      breed: "Schnauzer Miniatura",
      gender: "macho",
      ageYears: 4,
      weightKg: 7.5,
      imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80",
      ownerName: "Rodrigo Salazar",
      ownerDni: "43128901",
      ownerPhone: "945 889 001",
      lastVisit: `${today} 09:00`,
    },
  ]

  const consultations: ClinicalConsultation[] = [
    {
      id: "cons-1",
      patientId: "pet-1",
      petName: "Toby (Golden)",
      species: "perro",
      ownerName: "Patricia Alarcón",
      ownerPhone: "987 112 233",
      date: today,
      time: "10:15",
      temperatureC: 38.6,
      heartRateBpm: 92,
      weightKg: 28.5,
      reason: "Revisión general y cojera leve en pata trasera derecha tras juego en parque.",
      diagnosis: "Distensión muscular leve en articulación coxofemoral. Sin fractura.",
      treatmentPrescription: "Meloxicam 2mg c/24h por 4 días. Reposo absoluto y compresas tibias.",
      vetDoctorName: "Dra. Sofía Morales (CMVP 8940)",
      cost: 50.0,
      isPaid: true,
    },
    {
      id: "cons-2",
      patientId: "pet-3",
      petName: "Max (Bulldog)",
      species: "perro",
      ownerName: "Camila Vega",
      ownerPhone: "978 556 677",
      date: today,
      time: "12:00",
      temperatureC: 39.1,
      heartRateBpm: 110,
      weightKg: 11.2,
      reason: "Prurito intenso en pliegues faciales y enrojecimiento en patitas.",
      diagnosis: "Dermatitis por malassezia en pliegues cutáneos.",
      treatmentPrescription: "Champú con clorhexidina al 3% 2 veces por semana + Apoquel 5.4mg.",
      vetDoctorName: "Dr. Carlos Reátegui (CMVP 7612)",
      cost: 65.0,
      isPaid: true,
    },
  ]

  const vaccines: VaccineRecord[] = [
    {
      id: "vac-1",
      patientId: "pet-1",
      petName: "Toby",
      ownerPhone: "987 112 233",
      vaccineName: "Vacuna Séxtuple Canina (DHPPI-L)",
      applicationDate: `${todayISO().slice(0, 4)}-08-15`,
      nextBoosterDate: tomorrow, // ¡Vence mañana! Alerta activa
      isBoosterDue: true,
      batchNumber: "ZOETIS-98214",
      vetDoctorName: "Dra. Sofía Morales",
    },
    {
      id: "vac-2",
      patientId: "pet-2",
      petName: "Luna",
      ownerPhone: "991 334 455",
      vaccineName: "Triple Felina (Rinotraqueítis/Calici/Panleucopenia)",
      applicationDate: `${todayISO().slice(0, 4)}-06-10`,
      nextBoosterDate: inAWeek,
      isBoosterDue: false,
      batchNumber: "BOEHRINGER-5510",
      vetDoctorName: "Dr. Carlos Reátegui",
    },
    {
      id: "vac-3",
      patientId: "pet-3",
      petName: "Max",
      ownerPhone: "978 556 677",
      vaccineName: "Antirrábica Canina Anual",
      applicationDate: `${todayISO().slice(0, 4)}-07-20`,
      nextBoosterDate: addDays(today, 15),
      isBoosterDue: false,
      batchNumber: "DEFENSOR-3390",
      vetDoctorName: "Dra. Sofía Morales",
    },
  ]

  const groomingQueue: GroomingService[] = [
    {
      id: "gro-1",
      ticketCode: "SPA-301",
      patientId: "pet-4",
      petName: "Rocky (Schnauzer)",
      breed: "Schnauzer Miniatura",
      ownerName: "Rodrigo Salazar",
      ownerPhone: "945 889 001",
      serviceType: "corte_raza",
      status: "en_corte",
      price: 55.0,
      groomerName: "Ana Peluquera",
      notes: "Corte estándar de Schnauzer (falda y cejas clásicas).",
      createdAt: `${today} 09:15`,
    },
    {
      id: "gro-2",
      ticketCode: "SPA-302",
      patientId: "pet-1",
      petName: "Toby (Golden)",
      breed: "Golden Retriever",
      ownerName: "Patricia Alarcón",
      ownerPhone: "987 112 233",
      serviceType: "baño_medicado",
      status: "en_baño",
      price: 60.0,
      groomerName: "Marcos Groomer",
      notes: "Champú hidratante y deslanado profundo.",
      createdAt: `${today} 10:30`,
    },
    {
      id: "gro-3",
      ticketCode: "SPA-303",
      patientId: "pet-3",
      petName: "Max (Bulldog)",
      breed: "Bulldog Francés",
      ownerName: "Camila Vega",
      ownerPhone: "978 556 677",
      serviceType: "baño_medicado",
      status: "en_espera",
      price: 45.0,
      groomerName: "Ana Peluquera",
      notes: "Champú con clorhexidina en pliegues.",
      createdAt: `${today} 11:45`,
    },
  ]

  const products: PetShopProduct[] = [
    {
      id: "prod-v1",
      name: "Bravecto Antipulgas y Garrapatas (20 - 40 kg)",
      category: "antipulgas",
      brand: "MSD Animal Health",
      price: 135.0,
      currentStock: 14,
      minStock: 5,
      unit: "cajas",
      imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "prod-v2",
      name: "Simparica Trio 10-20 kg (Pulgas, Garrapatas y Parásitos)",
      category: "antipulgas",
      brand: "Zoetis",
      price: 68.0,
      currentStock: 22,
      minStock: 6,
      unit: "tabletas",
      imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "prod-v3",
      name: "Alimento Pro Plan Adulto Raza Grande 15kg",
      category: "alimentos",
      brand: "Purina Pro Plan",
      price: 245.0,
      currentStock: 8,
      minStock: 3,
      unit: "sacos",
      imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "prod-v4",
      name: "Royal Canin Mini Adulto 7.5kg",
      category: "alimentos",
      brand: "Royal Canin",
      price: 165.0,
      currentStock: 6,
      minStock: 4,
      unit: "sacos",
      imageUrl: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "prod-v5",
      name: "Champú Medicado Clorhexidina al 3% (250ml)",
      category: "higiene_accesorios",
      brand: "Dermovet",
      price: 42.0,
      currentStock: 11,
      minStock: 4,
      unit: "frascos",
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "prod-v6",
      name: "Meloxicam Gotas 10ml (Antiinflamatorio)",
      category: "farmacia",
      brand: "Pet Care Labs",
      price: 28.0,
      currentStock: 18,
      minStock: 5,
      unit: "frascos",
      imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=500&q=80",
    },
  ]

  const sales: VeterinariaSale[] = [
    {
      id: "sale-1",
      ticketCode: "TKT-5001",
      clientName: "Patricia Alarcón",
      petName: "Toby",
      type: "mixto",
      itemsSummary: "Consulta Médica + Bravecto 20-40kg + Meloxicam Gotas",
      total: 213.0,
      paymentMethod: "tarjeta",
      createdAt: `${today} 10:45`,
    },
    {
      id: "sale-2",
      ticketCode: "TKT-5002",
      clientName: "Rodrigo Salazar",
      petName: "Rocky",
      type: "grooming",
      itemsSummary: "Corte de Raza Schnauzer + Limpieza Dental",
      total: 55.0,
      paymentMethod: "yape_plin",
      createdAt: `${today} 11:10`,
    },
    {
      id: "sale-3",
      ticketCode: "TKT-5003",
      clientName: "Diego Barrenechea",
      petName: "Luna",
      type: "petshop",
      itemsSummary: "Alimento Royal Canin Gato 3kg + Desparasitante",
      total: 115.0,
      paymentMethod: "efectivo",
      createdAt: `${today} 12:20`,
    },
  ]

  return { patients, consultations, vaccines, groomingQueue, products, sales }
}

const EMPTY: VeterinariaState = {
  patients: [],
  consultations: [],
  vaccines: [],
  groomingQueue: [],
  products: [],
  sales: [],
}

let memory: VeterinariaState | null = null
const listeners = new Set<() => void>()

function load(): VeterinariaState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    return JSON.parse(raw) as VeterinariaState
  } catch {
    return seed()
  }
}

function persist(state: VeterinariaState) {
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

export function useVeterinariaStore() {
  const state = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  const ready = state !== EMPTY

  const update = useCallback((fn: (prev: VeterinariaState) => VeterinariaState) => {
    persist(fn(getClientSnapshot()))
  }, [])

  const addPatient = useCallback(
    (patient: Omit<PetPatient, "id" | "code" | "lastVisit">) => {
      update((s) => {
        const id = uid("pet")
        const code = `HC-${4010 + s.patients.length + 1}`
        const timeNow = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
        const newPatient: PetPatient = {
          ...patient,
          id,
          code,
          lastVisit: `${todayISO()} ${timeNow}`,
        }
        return {
          ...s,
          patients: [newPatient, ...s.patients],
        }
      })
    },
    [update],
  )

  const addConsultation = useCallback(
    (consultation: Omit<ClinicalConsultation, "id" | "date" | "time">) => {
      update((s) => {
        const timeNow = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
        const newCons: ClinicalConsultation = {
          ...consultation,
          id: uid("cons"),
          date: todayISO(),
          time: timeNow,
        }
        return {
          ...s,
          consultations: [newCons, ...s.consultations],
        }
      })
    },
    [update],
  )

  const addVaccineRecord = useCallback(
    (record: Omit<VaccineRecord, "id">) => {
      update((s) => ({
        ...s,
        vaccines: [{ ...record, id: uid("vac") }, ...s.vaccines],
      }))
    },
    [update],
  )

  const updateGroomingStatus = useCallback(
    (id: string, status: GroomingService["status"]) => {
      update((s) => ({
        ...s,
        groomingQueue: s.groomingQueue.map((g) => (g.id === id ? { ...g, status } : g)),
      }))
    },
    [update],
  )

  const addGroomingService = useCallback(
    (service: Omit<GroomingService, "id" | "ticketCode" | "createdAt">) => {
      update((s) => {
        const ticketCode = `SPA-${301 + s.groomingQueue.length + 1}`
        const timeNow = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
        const newGroom: GroomingService = {
          ...service,
          id: uid("gro"),
          ticketCode,
          createdAt: `${todayISO()} ${timeNow}`,
        }
        return {
          ...s,
          groomingQueue: [newGroom, ...s.groomingQueue],
        }
      })
    },
    [update],
  )

  const adjustProductStock = useCallback(
    (productId: string, delta: number) => {
      update((s) => ({
        ...s,
        products: s.products.map((p) =>
          p.id === productId ? { ...p, currentStock: Math.max(0, p.currentStock + delta) } : p,
        ),
      }))
    },
    [update],
  )

  const registerSale = useCallback(
    (sale: Omit<VeterinariaSale, "id" | "ticketCode" | "createdAt">) => {
      update((s) => {
        const ticketCode = `TKT-${5001 + s.sales.length + 1}`
        const timeNow = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
        const newSale: VeterinariaSale = {
          ...sale,
          id: uid("sale"),
          ticketCode,
          createdAt: `${todayISO()} ${timeNow}`,
        }
        return {
          ...s,
          sales: [newSale, ...s.sales],
        }
      })
    },
    [update],
  )

  const reset = useCallback(() => persist(seed()), [])

  const stats = useMemo(() => {
    const totalPatients = state.patients.length
    const consultationsToday = state.consultations.filter((c) => c.date === todayISO()).length
    const activeGrooming = state.groomingQueue.filter((g) => g.status !== "entregado").length
    const dueVaccinesCount = state.vaccines.filter((v) => v.isBoosterDue).length
    const totalSalesToday = state.sales.reduce((sum, s) => sum + s.total, 0)
    const lowStockProductsCount = state.products.filter((p) => p.currentStock <= p.minStock).length

    return {
      totalPatients,
      consultationsToday,
      activeGrooming,
      dueVaccinesCount,
      totalSalesToday,
      lowStockProductsCount,
    }
  }, [state])

  return {
    state,
    ready,
    stats,
    addPatient,
    addConsultation,
    addVaccineRecord,
    updateGroomingStatus,
    addGroomingService,
    adjustProductStock,
    registerSale,
    reset,
  }
}

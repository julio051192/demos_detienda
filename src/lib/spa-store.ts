"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { todayISO } from "@/lib/money"
import type { SpaAppointment, SpaAppointmentStatus, SpaClient, SpaPayment, SpaService, SpaState } from "@/lib/spa-types"

const KEY = "clinica-spa-demo-pe-v1"
const EMPTY: SpaState = { clients: [], services: [], appointments: [], payments: [] }
let memory: SpaState | null = null
const listeners = new Set<() => void>()
function uid(prefix: string) { return `${prefix}_${Math.random().toString(36).slice(2, 9)}` }
function subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener) }
function persist(state: SpaState) { memory = state; localStorage.setItem(KEY, JSON.stringify(state)); listeners.forEach((listener) => listener()) }
function getSnapshot() { if (!memory) memory = load(); return memory }
function load(): SpaState { try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) as SpaState : seed() } catch { return seed() } }

function seed(): SpaState {
  const clients: SpaClient[] = [
    { id: "cl-001", name: "Valeria Mendoza", phone: "987 456 120", email: "valeria@email.com", allergies: "Ninguna conocida", notes: "Prefiere horarios de tarde." },
    { id: "cl-002", name: "Carolina Rojas", phone: "945 221 870", email: "carolina@email.com", allergies: "Aspirina", notes: "Cliente frecuente, paquete facial." },
    { id: "cl-003", name: "María Fernanda Soto", phone: "999 780 334", email: "maria.soto@email.com", allergies: "Piel sensible", notes: "Solicita productos hipoalergénicos." },
    { id: "cl-004", name: "Andrea Salazar", phone: "976 112 540", email: "andrea@email.com", allergies: "Ninguna conocida", notes: "Primera visita." },
  ]
  const services: SpaService[] = [
    { id: "srv-001", name: "Limpieza facial profunda", category: "facial", durationMinutes: 75, price: 120, room: "Cabina 1", professional: "Dra. Lucía Pérez" },
    { id: "srv-002", name: "Masaje relajante", category: "masaje", durationMinutes: 60, price: 100, room: "Cabina 2", professional: "Ana Torres" },
    { id: "srv-003", name: "Drenaje linfático", category: "corporal", durationMinutes: 60, price: 130, room: "Cabina 3", professional: "Carla Ruiz" },
    { id: "srv-004", name: "Radiofrecuencia facial", category: "medicina_estetica", durationMinutes: 45, price: 160, room: "Cabina 1", professional: "Dra. Lucía Pérez" },
    { id: "srv-005", name: "Ritual de relajación", category: "relajacion", durationMinutes: 90, price: 180, room: "Suite Spa", professional: "Ana Torres" },
  ]
  const appointments: SpaAppointment[] = [
    { id: "apt-001", clientId: "cl-001", serviceId: "srv-001", date: todayISO(), time: "09:00", status: "confirmada", professional: "Dra. Lucía Pérez", room: "Cabina 1", amountPaid: 60, notes: "Confirmada por WhatsApp." },
    { id: "apt-002", clientId: "cl-002", serviceId: "srv-002", date: todayISO(), time: "10:30", status: "en_atencion", professional: "Ana Torres", room: "Cabina 2", amountPaid: 0, notes: "Solicitó presión media." },
    { id: "apt-003", clientId: "cl-003", serviceId: "srv-003", date: todayISO(), time: "12:00", status: "reservada", professional: "Carla Ruiz", room: "Cabina 3", amountPaid: 130, notes: "Pago completo adelantado." },
    { id: "apt-004", clientId: "cl-004", serviceId: "srv-004", date: todayISO(), time: "15:30", status: "reservada", professional: "Dra. Lucía Pérez", room: "Cabina 1", amountPaid: 0, notes: "Primera evaluación." },
  ]
  return { clients, services, appointments, payments: [{ id: "pay-001", appointmentId: "apt-001", amount: 60, method: "yape_plin", createdAt: `${todayISO()} 08:30` }, { id: "pay-002", appointmentId: "apt-003", amount: 130, method: "tarjeta", createdAt: `${todayISO()} 08:45` }] }
}

export function useSpaStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)
  const ready = state !== EMPTY
  const update = useCallback((fn: (current: SpaState) => SpaState) => persist(fn(getSnapshot())), [])
  const updateAppointment = useCallback((id: string, changes: Partial<SpaAppointment>) => update((current) => ({ ...current, appointments: current.appointments.map((item) => item.id === id ? { ...item, ...changes } : item) })), [update])
  const registerPayment = useCallback((input: { appointmentId: string; amount: number; method: SpaPayment["method"] }) => update((current) => ({ ...current, payments: [{ id: uid("pay"), appointmentId: input.appointmentId, amount: input.amount, method: input.method, createdAt: `${todayISO()} ${new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}` }, ...current.payments], appointments: current.appointments.map((item) => item.id === input.appointmentId ? { ...item, amountPaid: item.amountPaid + input.amount } : item) })), [update])
  const addClient = useCallback((client: Omit<SpaClient, "id">) => update((current) => ({ ...current, clients: [...current.clients, { ...client, id: uid("client") }] })), [update])
  const reset = useCallback(() => persist(seed()), [])
  const stats = useMemo(() => { const today = state.appointments.filter((item) => item.date === todayISO()); const revenue = state.payments.filter((item) => item.createdAt.startsWith(todayISO())).reduce((sum, item) => sum + item.amount, 0); return { todayCount: today.length, confirmed: today.filter((item) => item.status === "confirmada").length, inProgress: today.filter((item) => item.status === "en_atencion").length, revenue, pending: today.reduce((sum, appointment) => { const service = state.services.find((item) => item.id === appointment.serviceId); return sum + Math.max(0, (service?.price ?? 0) - appointment.amountPaid) }, 0) } }, [state])
  return { state, ready, stats, updateAppointment, registerPayment, addClient, reset }
}

export function appointmentStatusLabel(status: SpaAppointmentStatus) { return { reservada: "Reservada", confirmada: "Confirmada", en_atencion: "En atención", lista_para_cobro: "Lista para cobro", atendida: "Atendida", cancelada: "Cancelada", no_asistio: "No asistió" }[status] }
export function serviceCategoryLabel(category: SpaService["category"]) { return { facial: "Facial", corporal: "Corporal", masaje: "Masajes", relajacion: "Relajación", medicina_estetica: "Medicina estética" }[category] }

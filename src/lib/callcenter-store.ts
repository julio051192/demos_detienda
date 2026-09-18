"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { todayISO } from "@/lib/money"
import type { CallCenterState, CallCase, CallClient, CallInteraction, CallStatus } from "@/lib/callcenter-types"

const KEY = "callcenter-demo-pe-v1"
const EMPTY: CallCenterState = { clients: [], cases: [], interactions: [], agents: [] }
let memory: CallCenterState | null = null
const listeners = new Set<() => void>()

function uid(prefix: string) { return `${prefix}_${Math.random().toString(36).slice(2, 9)}` }
function persist(state: CallCenterState) { memory = state; localStorage.setItem(KEY, JSON.stringify(state)); listeners.forEach((listener) => listener()) }
function subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener) }
function getSnapshot() { if (!memory) memory = load(); return memory }
function load(): CallCenterState { try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) as CallCenterState : seed() } catch { return seed() } }

function seed(): CallCenterState {
  const clients: CallClient[] = [
    { id: "cc-001", name: "Claudia Ramos", phone: "987 456 210", email: "claudia.ramos@email.com", segment: "Cliente preferente", lastContact: "2026-09-07", notes: "Solicitó información sobre renovación." },
    { id: "cc-002", name: "Jorge Salazar", phone: "945 221 870", email: "jorge.salazar@email.com", segment: "Cliente nuevo", lastContact: "2026-09-06", notes: "Prefiere contacto por WhatsApp." },
    { id: "cc-003", name: "Mónica Torres", phone: "999 780 334", email: "monica.torres@email.com", segment: "Cliente activo", lastContact: "2026-09-08", notes: "Reportó demora en su pedido." },
    { id: "cc-004", name: "Luis Mendoza", phone: "976 112 540", email: "luis.mendoza@email.com", segment: "Cliente activo", lastContact: "2026-09-05", notes: "Interesado en ampliar su servicio." },
  ]
  const cases: CallCase[] = [
    { id: "case-001", clientId: "cc-001", subject: "Renovación de servicio", channel: "saliente", priority: "alta", status: "pendiente", assignedTo: "Ana Torres", createdAt: "2026-09-08", nextFollowUp: "2026-09-08", notes: "Confirmar condiciones y enviar propuesta." },
    { id: "case-002", clientId: "cc-002", subject: "Consulta de producto", channel: "entrante", priority: "media", status: "seguimiento", assignedTo: "Carlos Ruiz", createdAt: "2026-09-07", nextFollowUp: "2026-09-09", notes: "Esperando confirmación del cliente." },
    { id: "case-003", clientId: "cc-003", subject: "Reclamo por demora", channel: "entrante", priority: "alta", status: "pendiente", assignedTo: "Ana Torres", createdAt: "2026-09-08", nextFollowUp: "2026-09-08", notes: "Escalar a operaciones." },
    { id: "case-004", clientId: "cc-004", subject: "Ampliación de servicio", channel: "saliente", priority: "baja", status: "contactado", assignedTo: "Carlos Ruiz", createdAt: "2026-09-06", nextFollowUp: "2026-09-10", notes: "Enviar cotización." },
  ]
  return { clients, cases, interactions: [{ id: "int-001", caseId: "case-004", clientId: "cc-004", agent: "Carlos Ruiz", result: "Contactado", notes: "Cliente pidió cotización por correo.", createdAt: "2026-09-08 09:20", nextFollowUp: "2026-09-10" }], agents: ["Ana Torres", "Carlos Ruiz", "Lucía Pérez"] }
}

export function useCallCenterStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)
  const ready = state !== EMPTY
  const update = useCallback((fn: (current: CallCenterState) => CallCenterState) => persist(fn(getSnapshot())), [])
  const updateCase = useCallback((caseId: string, changes: Partial<CallCase>) => update((current) => ({ ...current, cases: current.cases.map((item) => item.id === caseId ? { ...item, ...changes } : item) })), [update])
  const registerInteraction = useCallback((input: { caseId: string; result: string; notes: string; nextFollowUp: string }) => update((current) => {
    const currentCase = current.cases.find((item) => item.id === input.caseId)
    if (!currentCase) return current
    const now = new Date()
    const interaction: CallInteraction = { id: uid("int"), caseId: input.caseId, clientId: currentCase.clientId, agent: currentCase.assignedTo, result: input.result, notes: input.notes, createdAt: `${todayISO()} ${now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}`, nextFollowUp: input.nextFollowUp }
    const nextStatus: CallStatus = input.result === "Resuelto" ? "resuelto" : input.result === "No contesta" ? "no_contesta" : input.nextFollowUp ? "seguimiento" : "contactado"
    return { ...current, cases: current.cases.map((item) => item.id === input.caseId ? { ...item, status: nextStatus, nextFollowUp: input.nextFollowUp, notes: input.notes } : item), interactions: [interaction, ...current.interactions] }
  }), [update])
  const reset = useCallback(() => persist(seed()), [])
  const stats = useMemo(() => ({ pending: state.cases.filter((item) => ["pendiente", "seguimiento", "no_contesta"].includes(item.status)).length, highPriority: state.cases.filter((item) => item.priority === "alta" && item.status !== "resuelto").length, contactedToday: state.interactions.filter((item) => item.createdAt.startsWith(todayISO())).length, resolved: state.cases.filter((item) => item.status === "resuelto").length }), [state])
  return { state, ready, stats, updateCase, registerInteraction, reset }
}

export function statusLabel(status: CallStatus) { return { pendiente: "Pendiente", en_llamada: "En llamada", contactado: "Contactado", no_contesta: "No contesta", seguimiento: "Seguimiento", resuelto: "Resuelto" }[status] }

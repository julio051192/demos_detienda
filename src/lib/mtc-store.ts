"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import { addDays, todayISO } from "@/lib/money"
import type {
  AppointmentStatus,
  LicenseCategory,
  MtcAppointment,
  MtcSede,
  MtcState,
  ProcedureType,
  ScraperLogEntry,
} from "@/lib/mtc-types"

const KEY = "mtc-demo-pe-v1"

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

function nextTicketCode(count: number) {
  const num = 1000 + count + 1
  return `MTC-PE-${num}`
}

function seed(): MtcState {
  const today = todayISO()
  const tomorrow = addDays(today, 1)
  const inTwoDays = addDays(today, 2)

  const sedes: MtcSede[] = [
    {
      id: "sede-1",
      name: "Sede Antenor Orrego (Lima Centro)",
      department: "Lima",
      address: "Jr. Antenor Orrego 1923, Chacra Ríos Sur, Cercado de Lima",
      hasAvailableSlots: true,
      availableSlotsCount: 14,
      nextAvailableDate: tomorrow,
      lastChecked: "Hace 4 minutos",
    },
    {
      id: "sede-2",
      name: "Sede Lince (César Vallejo)",
      department: "Lima",
      address: "Av. César Vallejo 603, Lince",
      hasAvailableSlots: true,
      availableSlotsCount: 6,
      nextAvailableDate: inTwoDays,
      lastChecked: "Hace 12 minutos",
    },
    {
      id: "sede-3",
      name: "Sede Conchán (Exámenes & Emisión)",
      department: "Lima Sur",
      address: "Km. 21.5 Panamericana Sur, Lurín",
      hasAvailableSlots: false,
      availableSlotsCount: 0,
      lastChecked: "Hace 8 minutos",
    },
    {
      id: "sede-4",
      name: "Sede MAC Plaza Norte (Independencia)",
      department: "Lima Norte",
      address: "Centro Comercial Plaza Norte, 2do Nivel",
      hasAvailableSlots: true,
      availableSlotsCount: 9,
      nextAvailableDate: addDays(today, 3),
      lastChecked: "Hace 2 minutos",
    },
    {
      id: "sede-5",
      name: "Sede Regional Arequipa",
      department: "Arequipa",
      address: "Calle Los Pinos 102, Paucarpata",
      hasAvailableSlots: false,
      availableSlotsCount: 0,
      lastChecked: "Hace 18 minutos",
    },
  ]

  const appointments: MtcAppointment[] = [
    {
      id: "app-1",
      ticketCode: "MTC-PE-1042",
      clientDni: "74589123",
      clientName: "Carlos Mendoza Ramos",
      clientPhone: "987 654 321",
      licenseCategory: "A-I (Particular)",
      procedure: "Revalidación",
      sedeName: "Sede Antenor Orrego (Lima Centro)",
      appointmentDate: today,
      appointmentTime: "16:30",
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MTC-PE-1042-DNI-74589123",
      status: "alerta_critica_2h_enviada",
      createdAt: `${today} 08:30`,
      whatsappHistory: [
        {
          type: "confirmacion",
          sentAt: `${today} 08:31`,
          status: "leido",
          preview: "✅ ¡Cita Reservada con éxito! Tu código es MTC-PE-1042 para Revalidación A-I en Sede Antenor Orrego a las 16:30 hrs.",
        },
        {
          type: "recordatorio_24h",
          sentAt: `${today} 09:00`,
          status: "leido",
          preview: "📋 RECORDATORIO 24H: Llevar DNI vigente en físico, examen médico aprobado en RENIEC y voucher de pago de S/ 14.80 al BN.",
        },
        {
          type: "alerta_critica_2h",
          sentAt: `${today} 14:30`,
          status: "leido",
          preview: "🚨 ALERTA CRÍTICA (Faltan 2 horas): Tu cita es a las 16:30 hrs. Margen de tolerancia: 10 min. Muestra este QR al ingresar.",
        },
      ],
      notes: "Examen médico registrado y validado en sistema SNC.",
    },
    {
      id: "app-2",
      ticketCode: "MTC-PE-1043",
      clientDni: "48123901",
      clientName: "María Elena Farfán Quispe",
      clientPhone: "991 234 567",
      licenseCategory: "A-IIa (Taxi / Colectivo)",
      procedure: "Recategorización",
      sedeName: "Sede Lince (César Vallejo)",
      appointmentDate: tomorrow,
      appointmentTime: "10:15",
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MTC-PE-1043-DNI-48123901",
      status: "recordatorio_24h_enviado",
      createdAt: `${today} 11:20`,
      whatsappHistory: [
        {
          type: "confirmacion",
          sentAt: `${today} 11:21`,
          status: "leido",
          preview: "✅ ¡Cita Confirmada! Código MTC-PE-1043 en Sede Lince para mañana a las 10:15 hrs.",
        },
        {
          type: "recordatorio_24h",
          sentAt: `${today} 11:25`,
          status: "entregado",
          preview: "📋 RECORDATORIO PREVENTIVO: Mañana es tu cita. Revisa que tu certificado de profesionalización esté subido al MTC.",
        },
      ],
      notes: "Requiere certificado de escuela de conductores autorizada.",
    },
    {
      id: "app-3",
      ticketCode: "MTC-PE-1044",
      clientDni: "60234589",
      clientName: "Jorge Luis Benavides Paz",
      clientPhone: "978 456 123",
      licenseCategory: "A-IIIc (Máxima Categoría)",
      procedure: "Revalidación",
      sedeName: "Sede MAC Plaza Norte (Independencia)",
      appointmentDate: inTwoDays,
      appointmentTime: "11:45",
      qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MTC-PE-1044-DNI-60234589",
      status: "confirmada",
      createdAt: `${today} 15:40`,
      whatsappHistory: [
        {
          type: "confirmacion",
          sentAt: `${today} 15:41`,
          status: "leido",
          preview: "✅ Confirmación de Cita MTC-PE-1044 en MAC Plaza Norte. Ver ticket digital con QR adjunto.",
        },
      ],
      notes: "Cupo capturado automáticamente por el Bot Scraper.",
    },
  ]

  const scraperLogs: ScraperLogEntry[] = [
    {
      id: "log-1",
      timestamp: `${today} 16:55:12`,
      sedeName: "Sede Antenor Orrego",
      status: "slots_found",
      message: "14 cupos libres detectados para mañana. Alerta enviada a n8n webhook.",
      ipProxy: "190.237.45.18 (Residencial PE)",
      responseTimeMs: 820,
    },
    {
      id: "log-2",
      timestamp: `${today} 16:52:05`,
      sedeName: "Sede Lince",
      status: "captcha_bypassed",
      message: "reCAPTCHA v2 Enterprise resuelto en 1.8s. Sesión autenticada sin bloqueo.",
      ipProxy: "200.121.90.11 (Lima Datacenter)",
      responseTimeMs: 1840,
    },
    {
      id: "log-3",
      timestamp: `${today} 16:48:30`,
      sedeName: "Sede Conchán",
      status: "no_slots",
      message: "Sin cupos disponibles. Próximo chequeo programado en 15 min.",
      ipProxy: "181.176.88.42 (Residencial PE)",
      responseTimeMs: 640,
    },
    {
      id: "log-4",
      timestamp: `${today} 16:45:10`,
      sedeName: "Sede MAC Plaza Norte",
      status: "slots_found",
      message: "9 cupos liberados. Notificación instantánea despachada a operadores.",
      ipProxy: "190.236.12.98 (Residencial PE)",
      responseTimeMs: 760,
    },
    {
      id: "log-5",
      timestamp: `${today} 16:30:00`,
      sedeName: "Portal General MTC",
      status: "success",
      message: "Rastreador en Railway operando 24/7 sin bloqueos WAF (Cloudflare/MTC OK).",
      ipProxy: "Pool Rotativo (16 IPs)",
      responseTimeMs: 510,
    },
  ]

  return {
    isScraperActive: true,
    scanIntervalMinutes: 15,
    lastScrapeTime: "Hace 2 minutos",
    sedes,
    appointments,
    scraperLogs,
  }
}

const EMPTY: MtcState = {
  isScraperActive: true,
  scanIntervalMinutes: 15,
  lastScrapeTime: "Iniciando...",
  sedes: [],
  appointments: [],
  scraperLogs: [],
}

let memory: MtcState | null = null
const listeners = new Set<() => void>()

function load(): MtcState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return seed()
    return JSON.parse(raw) as MtcState
  } catch {
    return seed()
  }
}

function persist(state: MtcState) {
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

export function useMtcStore() {
  const state = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  const ready = state !== EMPTY

  const update = useCallback((fn: (prev: MtcState) => MtcState) => {
    persist(fn(getClientSnapshot()))
  }, [])

  // Disparar escaneo manual
  const triggerManualScrape = useCallback(() => {
    update((s) => {
      const timeStr = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      const randomSlots = Math.floor(Math.random() * 8) + 3
      const targetSede = s.sedes[Math.floor(Math.random() * s.sedes.length)]

      const newLog: ScraperLogEntry = {
        id: uid("log"),
        timestamp: `${todayISO()} ${timeStr}`,
        sedeName: targetSede.name,
        status: "slots_found",
        message: `Bypass CAPTCHA exitoso. Se detectaron ${randomSlots} cupos nuevos liberados para ${targetSede.name}. Webhook n8n disparado.`,
        ipProxy: `190.237.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)} (Residencial PE)`,
        responseTimeMs: Math.floor(Math.random() * 600) + 600,
      }

      const updatedSedes = s.sedes.map((sede) =>
        sede.id === targetSede.id
          ? {
              ...sede,
              hasAvailableSlots: true,
              availableSlotsCount: sede.availableSlotsCount + randomSlots,
              nextAvailableDate: addDays(todayISO(), 1),
              lastChecked: "Recién verificado",
            }
          : sede,
      )

      return {
        ...s,
        lastScrapeTime: "Hace unos segundos",
        sedes: updatedSedes,
        scraperLogs: [newLog, ...s.scraperLogs.slice(0, 20)],
      }
    })
  }, [update])

  // Registrar nueva cita
  const registerAppointment = useCallback(
    (input: {
      clientDni: string
      clientName: string
      clientPhone: string
      licenseCategory: LicenseCategory
      procedure: ProcedureType
      sedeName: string
      appointmentDate: string
      appointmentTime: string
      notes?: string
    }) => {
      update((s) => {
        const ticketCode = nextTicketCode(s.appointments.length)
        const timeNow = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
          `${ticketCode}|DNI:${input.clientDni}|${input.clientName}|${input.procedure}|${input.sedeName}|${input.appointmentDate}_${input.appointmentTime}`,
        )}`

        const newApp: MtcAppointment = {
          id: uid("app"),
          ticketCode,
          clientDni: input.clientDni.trim(),
          clientName: input.clientName.trim(),
          clientPhone: input.clientPhone.trim(),
          licenseCategory: input.licenseCategory,
          procedure: input.procedure,
          sedeName: input.sedeName,
          appointmentDate: input.appointmentDate,
          appointmentTime: input.appointmentTime,
          qrCodeUrl,
          status: "confirmada",
          createdAt: `${todayISO()} ${timeNow}`,
          notes: input.notes?.trim() || undefined,
          whatsappHistory: [
            {
              type: "confirmacion",
              sentAt: `${todayISO()} ${timeNow}`,
              status: "entregado",
              preview: `✅ Confirmación: Cita ${ticketCode} reservada para ${input.clientName} en ${input.sedeName} el ${input.appointmentDate} a las ${input.appointmentTime} hrs.`,
            },
          ],
        }

        return {
          ...s,
          appointments: [newApp, ...s.appointments],
        }
      })
    },
    [update],
  )

  // Enviar / simular notificación WhatsApp
  const sendWhatsAppNotification = useCallback(
    (appointmentId: string, type: "confirmacion" | "recordatorio_24h" | "alerta_critica_2h") => {
      update((s) => {
        const timeNow = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
        const updatedAppointments = s.appointments.map((app) => {
          if (app.id !== appointmentId) return app

          let newStatus: AppointmentStatus = app.status
          let text = ""

          if (type === "confirmacion") {
            newStatus = "confirmada"
            text = `✅ ¡CITA MTC CONFIRMADA!\nTicket: ${app.ticketCode}\nCliente: ${app.clientName} (DNI: ${app.clientDni})\nTrámite: ${app.procedure} ${app.licenseCategory}\nSede: ${app.sedeName}\nFecha: ${app.appointmentDate} a las ${app.appointmentTime} hrs.\n🎫 Muestra tu ticket con QR al llegar.`
          } else if (type === "recordatorio_24h") {
            newStatus = "recordatorio_24h_enviado"
            text = `📋 RECORDATORIO PREVENTIVO (24 Horas Antes):\nHola ${app.clientName}, tu cita en MTC ${app.sedeName} es MAÑANA a las ${app.appointmentTime} hrs.\nDocumentos obligatorios:\n1. DNI físico vigente.\n2. Examen médico aprobado en SNC.\n3. Voucher de pago del Banco de la Nación.\n4. Ticket QR digital en tu celular.`
          } else if (type === "alerta_critica_2h") {
            newStatus = "alerta_critica_2h_enviada"
            text = `🚨 ALERTA CRÍTICA DE ASISTENCIA (FALTAN 2 HORAS):\nEstimado(a) ${app.clientName}, tu cita para ${app.procedure} en ${app.sedeName} inicia en 120 minutos (${app.appointmentTime} hrs).\n⚠️ Recuerda: Tolerancia máxima de 10 minutos. Ten a la mano tu DNI y tu QR.`
          }

          return {
            ...app,
            status: newStatus,
            whatsappHistory: [
              {
                type,
                sentAt: `${todayISO()} ${timeNow}`,
                status: "leido" as const,
                preview: text,
              },
              ...app.whatsappHistory,
            ],
          }
        })

        return {
          ...s,
          appointments: updatedAppointments,
        }
      })
    },
    [update],
  )

  const reset = useCallback(() => persist(seed()), [])

  const stats = useMemo(() => {
    const totalAppointments = state.appointments.length
    const totalSlotsAvailable = state.sedes.reduce((sum, s) => sum + s.availableSlotsCount, 0)
    const activeAlertsSent = state.appointments.reduce(
      (sum, a) => sum + a.whatsappHistory.length,
      0,
    )
    const criticalAlertsSent = state.appointments.filter(
      (a) => a.status === "alerta_critica_2h_enviada",
    ).length

    return {
      totalAppointments,
      totalSlotsAvailable,
      activeAlertsSent,
      criticalAlertsSent,
      sedesMonitored: state.sedes.length,
      attendanceRateEstimated: "98.7%",
    }
  }, [state])

  return {
    state,
    ready,
    stats,
    triggerManualScrape,
    registerAppointment,
    sendWhatsAppNotification,
    reset,
  }
}

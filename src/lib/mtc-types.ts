export type LicenseCategory =
  | "A-I (Particular)"
  | "A-IIa (Taxi / Colectivo)"
  | "A-IIb (Cúster / Camión Pequeño)"
  | "A-IIIa (Ómnibus Interprovincial)"
  | "A-IIIb (Tráiler / Remolque)"
  | "A-IIIc (Máxima Categoría)"
  | "B-IIb (Moto Lineal / Torito)"

export type ProcedureType =
  | "Nueva Licencia"
  | "Revalidación"
  | "Recategorización"
  | "Duplicado"
  | "Canje Extranjero"

export type MtcSede = {
  id: string
  name: string
  department: string
  address: string
  hasAvailableSlots: boolean
  availableSlotsCount: number
  nextAvailableDate?: string
  lastChecked: string
}

export type AppointmentStatus =
  | "confirmada"
  | "recordatorio_24h_enviado"
  | "alerta_critica_2h_enviada"
  | "atendida"
  | "cancelada"

export type MtcAppointment = {
  id: string
  ticketCode: string
  clientDni: string
  clientName: string
  clientPhone: string
  licenseCategory: LicenseCategory
  procedure: ProcedureType
  sedeName: string
  appointmentDate: string
  appointmentTime: string
  qrCodeUrl: string
  status: AppointmentStatus
  whatsappHistory: {
    type: "confirmacion" | "recordatorio_24h" | "alerta_critica_2h"
    sentAt: string
    status: "enviado" | "entregado" | "leido"
    preview: string
  }[]
  createdAt: string
  notes?: string
}

export type ScraperLogEntry = {
  id: string
  timestamp: string
  sedeName: string
  status: "success" | "captcha_bypassed" | "slots_found" | "no_slots"
  message: string
  ipProxy: string
  responseTimeMs: number
}

export type MtcState = {
  isScraperActive: boolean
  scanIntervalMinutes: number
  lastScrapeTime: string
  sedes: MtcSede[]
  appointments: MtcAppointment[]
  scraperLogs: ScraperLogEntry[]
}

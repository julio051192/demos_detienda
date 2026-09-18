export type SpaAppointmentStatus = "reservada" | "confirmada" | "en_atencion" | "lista_para_cobro" | "atendida" | "cancelada" | "no_asistio"

export type SpaClient = {
  id: string
  name: string
  phone: string
  email: string
  allergies: string
  notes: string
}

export type SpaService = {
  id: string
  name: string
  category: "facial" | "corporal" | "masaje" | "relajacion" | "medicina_estetica"
  durationMinutes: number
  price: number
  room: string
  professional: string
}

export type SpaAppointment = {
  id: string
  clientId: string
  serviceId: string
  date: string
  time: string
  status: SpaAppointmentStatus
  professional: string
  room: string
  amountPaid: number
  notes: string
}

export type SpaPayment = {
  id: string
  appointmentId: string
  amount: number
  method: "efectivo" | "tarjeta" | "yape_plin"
  createdAt: string
}

export type SpaState = {
  clients: SpaClient[]
  services: SpaService[]
  appointments: SpaAppointment[]
  payments: SpaPayment[]
}

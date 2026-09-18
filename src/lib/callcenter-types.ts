export type CallStatus = "pendiente" | "en_llamada" | "contactado" | "no_contesta" | "seguimiento" | "resuelto"
export type CallPriority = "alta" | "media" | "baja"

export type CallClient = {
  id: string
  name: string
  phone: string
  email: string
  segment: string
  lastContact: string
  notes: string
}

export type CallCase = {
  id: string
  clientId: string
  subject: string
  channel: "entrante" | "saliente"
  priority: CallPriority
  status: CallStatus
  assignedTo: string
  createdAt: string
  nextFollowUp: string
  notes: string
}

export type CallInteraction = {
  id: string
  caseId: string
  clientId: string
  agent: string
  result: string
  notes: string
  createdAt: string
  nextFollowUp: string
}

export type CallCenterState = {
  clients: CallClient[]
  cases: CallCase[]
  interactions: CallInteraction[]
  agents: string[]
}

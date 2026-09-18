export type VehicleType = "auto" | "suv" | "moto" | "minivan" | "camion"

export type CarWashStatus = "waiting" | "washing" | "drying" | "ready" | "delivered"

export type PaymentMethod = "efectivo" | "yape_plin" | "tarjeta"

export type CarWashService = {
  id: string
  name: string
  vehicleType: VehicleType
  price: number
  estimatedMinutes: number
  commission: number // Comisión en Soles para el lavador
}

export type WasherStaff = {
  id: string
  name: string
  phone: string
  active: boolean
  commissionPercent?: number
}

export type VehicleTicket = {
  id: string
  ticketCode: string
  plate: string
  vehicleType: VehicleType
  brandModel: string
  customerName?: string
  customerPhone?: string
  bay: string // "Bahía 1", "Bahía 2", etc.
  washerId: string
  washerName: string
  serviceId: string
  serviceName: string
  price: number
  paymentMethod: PaymentMethod
  isPaid: boolean
  status: CarWashStatus
  entryTime: string
  exitTime?: string
  notes?: string
}

export type CarWashSupply = {
  id: string
  name: string
  unit: string
  stock: number
  minStock: number
  cost: number
}

export type CarWashState = {
  tickets: VehicleTicket[]
  services: CarWashService[]
  washers: WasherStaff[]
  supplies: CarWashSupply[]
}

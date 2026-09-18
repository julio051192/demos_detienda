export type OrderStatus = "received" | "washing" | "ready" | "delivered" | "cancelled"

export type UnitType = "kg" | "unidad" | "par" | "juego"

export type ServiceCategory = "lavado_kilo" | "prendas_pesadas" | "tintoreria_seco" | "calzado" | "planchado"

export type LaundryService = {
  id: string
  name: string
  category: ServiceCategory
  unitType: UnitType
  price: number
  estimatedHours: number
}

export type OrderItem = {
  serviceId: string
  serviceName: string
  qty: number
  unitPrice: number
  notes?: string
}

export type LaundryOrder = {
  id: string
  ticketCode: string
  customerName: string
  customerPhone: string
  date: string
  deliveryDate: string
  items: OrderItem[]
  total: number
  advance: number
  balance: number
  status: OrderStatus
  notes?: string
  deliveredAt?: string
}

export type LaundrySupply = {
  id: string
  name: string
  unit: string
  stock: number
  minStock: number
  cost: number
}

export type LavanderiaState = {
  orders: LaundryOrder[]
  services: LaundryService[]
  supplies: LaundrySupply[]
}

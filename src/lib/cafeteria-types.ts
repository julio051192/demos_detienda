export type CoffeeCategory =
  | "calientes"
  | "frios"
  | "pasteleria"
  | "sandwiches"
  | "combos"

export type MilkOption = "entera" | "descremada" | "almendras" | "avena" | "sin_leche"
export type CupSize = "8oz" | "12oz" | "16oz"

export type CoffeeProduct = {
  id: string
  name: string
  category: CoffeeCategory
  description: string
  basePrice: number
  imageUrl: string
  isPopular?: boolean
  available: boolean
  allowsMilkCustomization?: boolean
  allowsSizeCustomization?: boolean
  prepTimeMinutes: number
}

export type OrderLineCustomization = {
  size?: CupSize
  milk?: MilkOption
  syrup?: string // ej. Vainilla, Caramelo, Avellana
  sugarLevel?: string // ej. Sin azúcar, Stevia, Normal
  extraShotEspresso?: boolean
}

export type CoffeeOrderLine = {
  id: string
  productId: string
  name: string
  unitPrice: number
  qty: number
  subtotal: number
  customization?: OrderLineCustomization
  notes?: string
}

export type CoffeeOrder = {
  id: string
  ticketCode: string
  customerName: string
  customerPhone?: string
  orderType: "para_mesa" | "para_llevar"
  tableNumber?: string
  lines: CoffeeOrderLine[]
  total: number
  status: "en_cola" | "preparando" | "listo" | "entregado"
  paymentMethod: "efectivo" | "yape_plin" | "tarjeta"
  isPaid: boolean
  createdAt: string
  preparationMinutes?: number
}

export type CoffeeSupply = {
  id: string
  name: string
  category: "grano_cafe" | "leches" | "descartables" | "jarabes"
  origin?: string // ej. Villa Rica, Chanchamayo, Quillabamba
  currentStock: number
  minStock: number
  unit: string
}

export type LoyaltyCard = {
  id: string
  customerName: string
  phone: string
  stampsCount: number // 1 al 6 (el 6to es gratis)
  freeCoffeesRedeemed: number
  lastVisit: string
}

export type CafeteriaState = {
  products: CoffeeProduct[]
  orders: CoffeeOrder[]
  supplies: CoffeeSupply[]
  loyaltyCards: LoyaltyCard[]
}

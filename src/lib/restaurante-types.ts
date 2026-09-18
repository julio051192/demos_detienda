export type DishCategory =
  | "entradas"
  | "ceviches"
  | "pollos"
  | "criollos"
  | "bebidas"
  | "licoreria"
  | "postres"

export type DishItem = {
  id: string
  name: string
  category: DishCategory
  description: string
  price: number
  imageUrl: string
  isPopular?: boolean
  isSpicy?: boolean
  available: boolean
  prepTimeMinutes: number
}

export type TableZone = "salon_principal" | "terraza" | "barra" | "delivery"

export type TableStatus = "libre" | "ocupada" | "precuenta" | "limpieza"

export type RestaurantTable = {
  id: string
  code: string // ej. "Mesa 01"
  zone: TableZone
  capacity: number
  status: TableStatus
  currentOrderId?: string
  waiterName?: string
}

export type OrderDishLine = {
  dishId: string
  name: string
  unitPrice: number
  qty: number
  subtotal: number
  notes?: string // ej. "Sin cebolla, picante medio"
  status: "pendiente" | "en_preparacion" | "listo" | "servido"
}

export type RestaurantOrder = {
  id: string
  ticketCode: string
  tableId: string
  tableName: string
  zone: TableZone
  waiterName: string
  clientName?: string
  clientPhone?: string
  type: "mesa" | "para_llevar" | "delivery"
  lines: OrderDishLine[]
  subtotal: number
  total: number
  advance: number
  balance: number
  status: "abierta" | "en_cocina" | "servida" | "precuenta" | "pagada"
  createdAt: string
  kitchenTimeMinutes?: number
}

export type RestauranteState = {
  dishes: DishItem[]
  tables: RestaurantTable[]
  orders: RestaurantOrder[]
}

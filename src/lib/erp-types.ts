export type Role = "admin" | "sales" | "warehouse"

export type ErpUser = {
  id: string
  name: string
  role: Role
  seat: string
}

export type Product = {
  id: string
  sku: string
  name: string
  unit: string
  stock: number
  cost: number
  price: number
  minStock: number
}

export type DocLine = {
  productId: string
  qty: number
  unitPrice: number
}

export type Sale = {
  id: string
  date: string
  customer: string
  userId: string
  lines: DocLine[]
}

export type Purchase = {
  id: string
  date: string
  supplier: string
  userId: string
  lines: DocLine[]
}

export type ErpState = {
  users: ErpUser[]
  currentUserId: string
  products: Product[]
  sales: Sale[]
  purchases: Purchase[]
}

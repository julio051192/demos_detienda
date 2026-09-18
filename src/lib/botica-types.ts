export type BoticaCategory = "analgesico" | "antibiotico" | "antigripal" | "vitamina" | "higiene" | "bebes" | "otros"

export type BoticaProduct = {
  id: string
  barcode: string
  name: string
  activeIngredient: string
  laboratory: string
  category: BoticaCategory
  presentation: string
  concentration: string
  purchasePrice: number
  salePrice: number
  stock: number
  minStock: number
  lot: string
  expiresAt: string
  requiresPrescription: boolean
}

export type BoticaSaleItem = {
  productId: string
  barcode: string
  name: string
  presentation: string
  qty: number
  unitPrice: number
  subtotal: number
}

export type BoticaPaymentMethod = "efectivo" | "yape_plin" | "tarjeta" | "niubiz" | "mercadopago" | "culqi" | "stripe"

export type BoticaSale = {
  id: string
  ticketCode: string
  date: string
  time: string
  items: BoticaSaleItem[]
  total: number
  amountPaid: number
  change: number
  paymentMethod: BoticaPaymentMethod
  gateway?: string
  cashierName: string
}

export type BoticaState = {
  products: BoticaProduct[]
  sales: BoticaSale[]
  cashierName: string
}

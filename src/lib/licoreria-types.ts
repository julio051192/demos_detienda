export type LiquorCategory =
  | "cerveza"
  | "vino"
  | "pisco"
  | "whisky"
  | "ron"
  | "vodka"
  | "cocteles"
  | "gaseosa"
  | "otros"

export type LiquorProduct = {
  id: string
  barcode: string
  name: string
  brand: string
  category: LiquorCategory
  presentation: string // "Botella 750ml", "Six Pack", "Lata 355ml"
  purchasePrice: number
  salePrice: number
  stock: number
  minStock: number
  alcoholPercent?: number
}

export type SaleItem = {
  productId: string
  barcode: string
  name: string
  presentation: string
  qty: number
  unitPrice: number
  subtotal: number
}

export type Sale = {
  id: string
  ticketCode: string
  date: string
  time: string
  items: SaleItem[]
  subtotal: number
  total: number
  amountPaid: number
  change: number
  paymentMethod: "efectivo" | "yape_plin" | "tarjeta"
  cashierName: string
}

export type LicoreriaState = {
  products: LiquorProduct[]
  sales: Sale[]
  cashierName: string
}

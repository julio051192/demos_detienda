export type GarmentType =
  | "polo_pique"
  | "polo_cotton"
  | "gorra"
  | "casaca"
  | "mandil"
  | "pechear"
  | "parche"
  | "otros"

export type EmbroideryLocation =
  | "pecho_izquierdo"
  | "pecho_derecho"
  | "espalda_grande"
  | "manga_derecha"
  | "manga_izquierda"
  | "frente_gorra"
  | "costado_gorra"
  | "otro"

export type OrderStage =
  | "matrizado" // Creando ponchado .DST
  | "muestra" // Bordando prueba en retazo
  | "en_maquina" // Producción en bordadora
  | "limpieza" // Despeluzado y retoque
  | "listo" // Terminado para entrega
  | "entregado"

export type PaymentMethod = "efectivo" | "yape_plin" | "niubiz" | "culqi" | "mercadopago" | "stripe"

export type EmbroideryOrder = {
  id: string
  ticketCode: string
  clientName: string
  clientPhone: string
  clientDoc?: string
  garmentType: GarmentType
  garmentColor: string
  location: EmbroideryLocation
  widthCm: number
  heightCm: number
  stitchCount: number // Cantidad de puntadas ej. 8500
  needsNewMatrix: boolean // Requiere ponchado/matrizado nuevo
  matrixCost: number // Costo del ponchado ej. S/ 30
  pricePerThousandStitches: number // Tarifa ej. S/ 0.90 por cada 1,000 puntadas
  unitPrice: number
  qty: number
  total: number
  advance: number
  balance: number
  stage: OrderStage
  assignedMachineId?: string
  assignedOperatorId?: string // Operario responsable del destajo
  threadColors: string[] // Lista de colores de hilo
  createdAt: string
  promisedDate: string
  invoiceType?: "ticket" | "boleta" | "factura"
  invoiceNumber?: string
  paymentGatewayRef?: string
  notes?: string
}

export type EmbroideryMachine = {
  id: string
  name: string
  brand: string // Tajima, Barudan, Feiya, Brother
  heads: number // Número de cabezales (1, 4, 6, 12)
  status: "active" | "maintenance" | "idle"
  currentOrderId?: string
}

export type EmbroiderySupply = {
  id: string
  name: string
  type: "hilo" | "pelon" | "aguja" | "bobina" | "adhesivo"
  color?: string
  stock: number
  unit: string
  minStock: number
  estimatedMetersPerThousandStitches?: number // Consumo estimado de hilo por 1,000 puntadas
}

export type CashMovement = {
  id: string
  date: string
  time: string
  type: "ingreso" | "egreso"
  category: "adelanto_orden" | "saldo_orden" | "compra_insumos" | "pago_destajo" | "servicios_taller" | "varios"
  description: string
  amount: number
  paymentMethod: PaymentMethod
  orderId?: string
  registeredBy: string
}

export type PaymentGatewayTransaction = {
  id: string
  orderId: string
  gateway: "niubiz" | "culqi" | "mercadopago" | "stripe"
  amount: number
  currency: "PEN" | "USD"
  status: "approved" | "pending" | "declined"
  transactionRef: string
  cardBrand?: string
  createdAt: string
}

export type OperatorPayroll = {
  id: string
  operatorName: string
  role: "operario_bordador" | "diseñador_matrizador" | "cajero_secretario"
  payRatePerThousand: number // Tarifa destajo por 1,000 puntadas ej. S/ 0.15
  payRatePerGarment?: number // Tarifa destajo por prenda acabada ej. S/ 0.50
  totalStitchesWorked: number
  totalGarmentsFinished: number
  grossEarned: number
  advancesPaid: number
  netPayable: number
  status: "pending" | "paid"
}

export type UserRole = "admin" | "cajero" | "operario"

export type BordadosUser = {
  id: string
  name: string
  role: UserRole
  seatName: string
}

export type BordadosState = {
  orders: EmbroideryOrder[]
  machines: EmbroideryMachine[]
  supplies: EmbroiderySupply[]
  cashMovements: CashMovement[]
  gatewayTransactions: PaymentGatewayTransaction[]
  payroll: OperatorPayroll[]
  users: BordadosUser[]
  currentUserRoleId: string
}

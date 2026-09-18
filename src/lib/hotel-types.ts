export type RoomType = "simple" | "matrimonial" | "doble" | "suite" | "jacuzzi"

export type RoomStatus = "available" | "occupied" | "cleaning" | "maintenance"

export type StayMode = "night" | "hours"

export type PaymentMethod = "efectivo" | "yape_plin" | "tarjeta"

export type RoomCharge = {
  id: string
  description: string
  qty: number
  unitPrice: number
  date: string
}

export type GuestStay = {
  id: string
  ticketCode: string
  roomId: string
  roomNumber: string
  guestName: string
  docType: "DNI" | "Pasaporte" | "CE"
  docNumber: string
  phone?: string
  originCity?: string
  checkIn: string
  checkOutExpected: string
  mode: StayMode
  duration: number // número de noches u horas
  rate: number // tarifa por noche o por hora
  charges: RoomCharge[]
  totalRoom: number
  totalCharges: number
  total: number
  advance: number
  balance: number
  paymentMethod: PaymentMethod
  status: "active" | "checked_out" | "cancelled"
  checkedOutAt?: string
  notes?: string
}

export type HotelRoom = {
  id: string
  number: string
  floor: number
  type: RoomType
  priceNight: number
  priceHour: number
  status: RoomStatus
  currentStayId?: string
}

export type FrigobarProduct = {
  id: string
  name: string
  category: "bebida" | "snack" | "amenity"
  price: number
  stock: number
}

export type HotelState = {
  rooms: HotelRoom[]
  stays: GuestStay[]
  frigobar: FrigobarProduct[]
}

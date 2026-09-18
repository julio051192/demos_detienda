export type PetSpecies = "perro" | "gato" | "conejo" | "ave" | "otro"

export type PetPatient = {
  id: string
  code: string // ej. HC-4010
  name: string
  species: PetSpecies
  breed: string // ej. Golden Retriever, Mestizo, Bulldog Francés, Siamés
  gender: "macho" | "hembra"
  ageYears: number
  weightKg: number
  imageUrl: string
  ownerName: string
  ownerDni: string
  ownerPhone: string
  allergies?: string
  lastVisit: string
}

export type ClinicalConsultation = {
  id: string
  patientId: string
  petName: string
  species: PetSpecies
  ownerName: string
  ownerPhone: string
  date: string
  time: string
  temperatureC: number
  heartRateBpm: number
  weightKg: number
  reason: string
  diagnosis: string
  treatmentPrescription: string
  vetDoctorName: string
  cost: number
  isPaid: boolean
}

export type VaccineRecord = {
  id: string
  patientId: string
  petName: string
  ownerPhone: string
  vaccineName: string // ej. Séxtuple Canina, Antirrábica, Triple Felina, Desparasitación Interna
  applicationDate: string
  nextBoosterDate: string
  isBoosterDue: boolean
  batchNumber: string
  vetDoctorName: string
}

export type GroomingService = {
  id: string
  ticketCode: string
  patientId: string
  petName: string
  breed: string
  ownerName: string
  ownerPhone: string
  serviceType: "baño_simple" | "baño_medicado" | "corte_raza" | "spa_completo"
  status: "en_espera" | "en_baño" | "en_corte" | "listo_entrega" | "entregado"
  price: number
  groomerName: string
  notes?: string
  createdAt: string
}

export type PetShopProduct = {
  id: string
  name: string
  category: "alimentos" | "farmacia" | "antipulgas" | "higiene_accesorios"
  brand: string // ej. Royal Canin, Pro Plan, Bravecto, Nexgard
  price: number
  currentStock: number
  minStock: number
  unit: string
  imageUrl: string
}

export type VeterinariaSale = {
  id: string
  ticketCode: string
  clientName: string
  petName: string
  type: "consulta" | "grooming" | "petshop" | "mixto"
  itemsSummary: string
  total: number
  paymentMethod: "efectivo" | "yape_plin" | "tarjeta"
  createdAt: string
}

export type VeterinariaState = {
  patients: PetPatient[]
  consultations: ClinicalConsultation[]
  vaccines: VaccineRecord[]
  groomingQueue: GroomingService[]
  products: PetShopProduct[]
  sales: VeterinariaSale[]
}

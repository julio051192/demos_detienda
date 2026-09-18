export type Client = {
  id: string
  name: string
  phone: string
  address: string
  neighborhood: string
}

export type LoanStatus = "active" | "paid"

export type Loan = {
  id: string
  clientId: string
  capital: number
  interestPercent: number
  days: number
  startDate: string
  dailyAmount: number
  status: LoanStatus
}

export type PaymentStatus = "paid" | "partial" | "missed"

export type Payment = {
  id: string
  loanId: string
  date: string
  amount: number
  status: PaymentStatus
}

export type DemoState = {
  clients: Client[]
  loans: Loan[]
  payments: Payment[]
}

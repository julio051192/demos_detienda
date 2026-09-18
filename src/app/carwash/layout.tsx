import type { ReactNode } from "react"
import { CarWashNav } from "@/components/carwash-nav"

export const metadata = {
  title: "Sistema Car Wash / Autolavado — Control de Bahías y Caja",
  description: "Recepción por placa, tipos de vehículos, bahías de lavado en vivo, comisiones de lavadores y caja diaria.",
}

export default function CarWashLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <CarWashNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div>
    </div>
  )
}

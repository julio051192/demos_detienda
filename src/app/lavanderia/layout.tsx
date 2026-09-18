import type { ReactNode } from "react"
import { LavanderiaNav } from "@/components/lavanderia-nav"

export const metadata = {
  title: "Sistema Lavandería & Tintorería — Control de Prendas y Caja",
  description: "Recepción de ropa por kilo y unidad, tickets, estados de lavado, entregas y caja diaria.",
}

export default function LavanderiaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <LavanderiaNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div>
    </div>
  )
}

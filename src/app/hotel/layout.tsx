import type { ReactNode } from "react"
import { HotelNav } from "@/components/hotel-nav"

export const metadata = {
  title: "Sistema Hotel & Hospedaje — Rack de Habitaciones y Caja",
  description: "Control de habitaciones en tiempo real, Check-in, consumos de frigobar, Check-out y caja diaria.",
}

export default function HotelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <HotelNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div>
    </div>
  )
}

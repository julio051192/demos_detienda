import type { ReactNode } from "react"
import { BarberiaNav } from "@/components/barberia-nav"

export const metadata = {
  title: "Corte & Sello — Fidelización para barberías",
  description: "Demo de tarjeta digital, sellos y retención de clientes para barbería.",
}

export default function BarberiaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-stone-100">
      <BarberiaNav />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</div>
    </div>
  )
}

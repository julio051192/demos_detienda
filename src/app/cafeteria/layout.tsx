import type { ReactNode } from "react"
import { CafeteriaNav } from "@/components/cafeteria-nav"

export const metadata = {
  title: "Sistema Cafetería & Coffee Shop — POS, Barista y Fidelización",
  description: "POS táctil para barra de cafetería, personalización de cafés, pantalla de barista, club de sellos e inventario de granos de especialidad.",
}

export default function CafeteriaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <CafeteriaNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div>
    </div>
  )
}

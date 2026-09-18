import type { ReactNode } from "react"
import { TransporteNav } from "@/components/transporte-nav"

export const metadata = {
  title: "Sistema Transporte / Logística — Costos, rutas y flota",
  description: "Demo de gestión de transporte con flota, rutas, costos operativos y reportes de logística.",
}

export default function TransporteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <TransporteNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div>
    </div>
  )
}

import type { ReactNode } from "react"
import { BordadosNav } from "@/components/bordados-nav"

export const metadata = {
  title: "Sistema Taller de Bordados Computarizados — Puntadas y Producción",
  description: "Control de órdenes por puntadas, ponchado/matrizado, tablero Kanban de taller y cotizador.",
}

export default function BordadosLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <BordadosNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div>
    </div>
  )
}

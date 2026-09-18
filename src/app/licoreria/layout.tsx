import type { ReactNode } from "react"
import { LicoreriaNav } from "@/components/licoreria-nav"

export const metadata = {
  title: "Sistema Licorería — POS con Código de Barras",
  description: "Caja rápida con escáner de código de barras, control de stock y ventas del día.",
}

export default function LicoreriaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <LicoreriaNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div>
    </div>
  )
}

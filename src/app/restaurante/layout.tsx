import type { ReactNode } from "react"
import { RestauranteNav } from "@/components/restaurante-nav"

export const metadata = {
  title: "Sistema Restaurante, Pollería & Cevichería — Menú Visual y Mesas",
  description: "Mapa interactivo de mesas por zonas, catálogo visual de platos con fotos, comandería y KDS de cocina.",
}

export default function RestauranteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <RestauranteNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div>
    </div>
  )
}

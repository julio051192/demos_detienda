import type { ReactNode } from "react"
import { VeterinariaNav } from "@/components/veterinaria-nav"

export const metadata = {
  title: "Sistema Clínica Veterinaria, Grooming & Pet Shop — Historias Clínicas y Vacunas",
  description: "Fichas clínicas de pacientes peludos, carnet digital de vacunas, control de peluquería canina y punto de venta pet shop.",
}

export default function VeterinariaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <VeterinariaNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div>
    </div>
  )
}

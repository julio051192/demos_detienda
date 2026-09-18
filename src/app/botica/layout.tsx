import type { ReactNode } from "react"
import { BoticaNav } from "@/components/botica-nav"

export const metadata = { title: "Sistema Botica — POS, Stock y Vencimientos", description: "Punto de venta para boticas con medicamentos, lotes, vencimientos y pasarelas de pago." }

export default function BoticaLayout({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col bg-background"><BoticaNav /><div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div></div>
}

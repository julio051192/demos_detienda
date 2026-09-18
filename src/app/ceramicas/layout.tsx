import type { ReactNode } from "react"
import { CeramicasNav } from "@/components/ceramicas-nav"

export const metadata = {
  title: "Sistema de Cerámicas y Acabados",
  description: "Cotizaciones, inventario y comprobantes internos para materiales de acabados.",
}

export default function CeramicasLayout({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col bg-background"><CeramicasNav /><div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div></div>
}
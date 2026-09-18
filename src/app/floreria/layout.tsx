import type { ReactNode } from "react"
import { FloreriaNav } from "@/components/floreria-nav"

export const metadata = {
  title: "Sistema Florería & Eventos",
  description: "Pedidos, catálogo, agenda, delivery y caja para florerías.",
}

export default function FloreriaLayout({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col bg-background"><FloreriaNav /><div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div></div>
}

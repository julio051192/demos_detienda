import type { ReactNode } from "react"
import { TextilNav } from "@/components/textil-nav"

export const metadata = {
  title: "Sistema Textil & Confecciones",
  description: "Producción, telas, cotizador, catálogo y despacho textil.",
}

export default function TextilLayout({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col bg-background"><TextilNav /><div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div></div>
}

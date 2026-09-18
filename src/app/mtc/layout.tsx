import type { ReactNode } from "react"
import { MtcNav } from "@/components/mtc-nav"

export const metadata = {
  title: "Sistema de Monitoreo Inteligente de Citas MTC & WhatsApp Automation",
  description: "Rastreador automático (Scraper con bypass de CAPTCHA), gestión de citas con Ticket QR y recordatorios automáticos por WhatsApp.",
}

export default function MtcLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <MtcNav />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div>
    </div>
  )
}

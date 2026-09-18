import type { ReactNode } from "react"
import { CallCenterNav } from "@/components/callcenter-nav"

export const metadata = { title: "Sistema Call Center — Clientes y Seguimientos", description: "Bandeja de llamadas, clientes, agentes y seguimiento de casos." }

export default function CallCenterLayout({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col bg-background"><CallCenterNav /><div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div></div>
}

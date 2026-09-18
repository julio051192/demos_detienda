import type { ReactNode } from "react"
import { SpaNav } from "@/components/spa-nav"

export const metadata = { title: "Clínica Spa — Agenda, Tratamientos y Caja", description: "Sistema de gestión para clínica spa con agenda, clientes, tratamientos y pagos." }

export default function SpaLayout({ children }: { children: ReactNode }) { return <div className="flex flex-1 flex-col bg-background"><SpaNav /><div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</div></div> }

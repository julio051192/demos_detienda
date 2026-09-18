"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Flower2, LayoutGrid, Truck, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/floreria", label: "Resumen", icon: LayoutGrid },
  { href: "/floreria/pedidos", label: "Pedidos & Taller", icon: Flower2 },
  { href: "/floreria/catalogo", label: "Catálogo Visual", icon: Flower2 },
  { href: "/floreria/eventos", label: "Agenda de Eventos", icon: CalendarDays },
  { href: "/floreria/delivery", label: "Delivery", icon: Truck },
  { href: "/floreria/caja", label: "Caja & Ventas", icon: Wallet },
]

export function FloreriaNav() {
  const pathname = usePathname()
  return <div className="border-b bg-card"><div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">{items.map((item) => { const Icon = item.icon; const active = item.href === "/floreria" ? pathname === "/floreria" : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} className={cn("flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium sm:text-sm", active ? "bg-rose-600 text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><Icon className="size-4" />{item.label}</Link> })}</div></div>
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calculator, Factory, LayoutGrid, Package, Shirt, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/textil", label: "Resumen", icon: LayoutGrid },
  { href: "/textil/produccion", label: "Producción & Pedidos", icon: Factory },
  { href: "/textil/catalogo", label: "Catálogo Visual", icon: Shirt },
  { href: "/textil/cotizador", label: "Cotizador por Metros", icon: Calculator },
  { href: "/textil/inventario", label: "Inventario de Telas", icon: Package },
  { href: "/textil/caja", label: "Caja & Despacho", icon: Wallet },
]

export function TextilNav() {
  const pathname = usePathname()
  return <div className="border-b bg-card"><div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">{items.map((item) => { const Icon = item.icon; const active = item.href === "/textil" ? pathname === "/textil" : pathname.startsWith(item.href); return <Link key={item.href} href={item.href} className={cn("flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium sm:text-sm", active ? "bg-sky-600 text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><Icon className="size-4" />{item.label}</Link> })}</div></div>
}

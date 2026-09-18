"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calculator, ClipboardList, LayoutGrid, Package, Printer } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/ceramicas", label: "Resumen", icon: LayoutGrid },
  { href: "/ceramicas#cotizador", label: "Cotizador", icon: Calculator },
  { href: "/ceramicas#inventario", label: "Inventario", icon: Package },
  { href: "/ceramicas#cotizaciones", label: "Cotizaciones", icon: ClipboardList },
]

export function CeramicasNav() {
  const pathname = usePathname()
  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2">
        {items.map((item) => {
          const Icon = item.icon
          const active = item.href === "/ceramicas" ? pathname === "/ceramicas" : false
          return <Link key={item.href} href={item.href} className={cn("flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm", active ? "bg-amber-600 text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><Icon className="size-4" />{item.label}</Link>
        })}
        <span className="ml-auto hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex"><Printer className="size-3.5" /> PDF desde Imprimir</span>
      </div>
    </div>
  )
}
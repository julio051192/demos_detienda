"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Scan, CreditCard, PackageSearch, History } from "lucide-react"

const items = [
  { href: "/botica", label: "Caja POS", icon: Scan },
  { href: "/botica/inventario", label: "Inventario y Vencimientos", icon: PackageSearch },
  { href: "/botica/ventas", label: "Ventas del Día", icon: History },
  { href: "/botica/pagos", label: "Pasarelas de Pago", icon: CreditCard },
]

export function BoticaNav() {
  const pathname = usePathname()
  return <div className="border-b bg-card"><div className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-4 py-2">{items.map(({ href, label, icon: Icon }) => { const active = href === "/botica" ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} className={cn("flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium sm:text-sm", active ? "bg-emerald-600 text-white shadow-xs" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><Icon className="size-4" />{label}</Link> })}</div></div>
}

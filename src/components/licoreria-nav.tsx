"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Scan, Package, History, BarChart3, PackageSearch } from "lucide-react"

const navItems = [
  { href: "/licoreria", label: "Caja & Escáner POS", icon: Scan },
  { href: "/licoreria/productos", label: "Productos & Códigos", icon: Package },
  { href: "/licoreria/inventario", label: "Inventario & Stock", icon: PackageSearch },
  { href: "/licoreria/ventas", label: "Ventas del Día", icon: History },
]

export function LicoreriaNav() {
  const pathname = usePathname()

  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active =
            item.href === "/licoreria"
              ? pathname === "/licoreria"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm whitespace-nowrap",
                active
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutGrid, UtensilsCrossed, ChefHat, Receipt, Bike } from "lucide-react"

const navItems = [
  { href: "/restaurante", label: "Mapa de Mesas & Salón", icon: LayoutGrid },
  { href: "/restaurante/comanda", label: "Menú Visual & Comandero", icon: UtensilsCrossed },
  { href: "/restaurante/cocina", label: "Pantalla KDS Cocina", icon: ChefHat },
  { href: "/restaurante/caja", label: "Pre-Cuenta & Caja", icon: Receipt },
  { href: "/restaurante/delivery", label: "Delivery & Motorizados", icon: Bike },
]

export function RestauranteNav() {
  const pathname = usePathname()

  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active =
            item.href === "/restaurante"
              ? pathname === "/restaurante"
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

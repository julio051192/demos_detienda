"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Coffee,
  ChefHat,
  Award,
  Package,
  Receipt,
  Sparkles,
} from "lucide-react"

const navItems = [
  { href: "/cafeteria", label: "POS Táctil & Pedidos", icon: Coffee },
  { href: "/cafeteria/barista", label: "Pantalla de Barista", icon: ChefHat },
  { href: "/cafeteria/fidelizacion", label: "Club de Sellos (Fidelización)", icon: Award },
  { href: "/cafeteria/insumos", label: "Granos & Insumos", icon: Package },
  { href: "/cafeteria/caja", label: "Caja & Comprobantes", icon: Receipt },
]

export function CafeteriaNav() {
  const pathname = usePathname()

  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active =
            item.href === "/cafeteria"
              ? pathname === "/cafeteria"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm whitespace-nowrap",
                active
                  ? "bg-amber-700 text-white font-semibold shadow-xs"
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

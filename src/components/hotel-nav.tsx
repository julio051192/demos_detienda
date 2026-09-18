"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutGrid, LogIn, ShoppingBag, LogOut, BedDouble } from "lucide-react"

const navItems = [
  { href: "/hotel", label: "Rack de Habitaciones (Mapa)", icon: LayoutGrid },
  { href: "/hotel/checkin", label: "Check-in (Entradas)", icon: LogIn },
  { href: "/hotel/consumos", label: "Consumos & Frigobar", icon: ShoppingBag },
  { href: "/hotel/checkout", label: "Check-out (Salidas)", icon: LogOut },
  { href: "/hotel/habitaciones", label: "Tarifario & Cuartos", icon: BedDouble },
]

export function HotelNav() {
  const pathname = usePathname()

  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon
            const active =
              item.href === "/hotel"
                ? pathname === "/hotel"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
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
    </div>
  )
}

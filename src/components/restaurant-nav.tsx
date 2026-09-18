"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChefHat, LayoutGrid, ShoppingBag, CreditCard, Bike } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/restaurante", label: "Mesas", icon: LayoutGrid },
  { href: "/restaurante/comanda", label: "Comandero", icon: ShoppingBag },
  { href: "/restaurante/cocina", label: "Cocina & Bar", icon: ChefHat },
  { href: "/restaurante/caja", label: "Caja", icon: CreditCard },
  { href: "/restaurante/delivery", label: "Delivery", icon: Bike },
]

export function RestaurantNav() {
  const pathname = usePathname()
  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2">
        <div className="mr-2 flex shrink-0 items-center gap-2 border-r pr-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-orange-600 text-white"><ChefHat className="size-4" /></span>
          <div className="hidden sm:block"><p className="text-sm font-bold leading-none">La Brasa</p><p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Restaurante</p></div>
        </div>
        <nav className="flex min-w-max gap-1">
          {items.map((item) => {
            const Icon = item.icon
            const active = item.href === "/restaurante" ? pathname === item.href : pathname.startsWith(item.href)
            return <Link key={item.href} href={item.href} className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "bg-orange-600 text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><Icon className="size-4" />{item.label}</Link>
          })}
        </nav>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Car, PlusCircle, Users, Tag, Droplets } from "lucide-react"

const navItems = [
  { href: "/carwash", label: "Pista & Bahías en Vivo", icon: Car },
  { href: "/carwash/recepcion", label: "Recepción (Por Placa)", icon: PlusCircle },
  { href: "/carwash/lavadores", label: "Lavadores & Comisiones", icon: Users },
  { href: "/carwash/servicios", label: "Tarifario de Lavado", icon: Tag },
  { href: "/carwash/insumos", label: "Insumos & Shampoos", icon: Droplets },
]

export function CarWashNav() {
  const pathname = usePathname()

  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon
            const active =
              item.href === "/carwash"
                ? pathname === "/carwash"
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

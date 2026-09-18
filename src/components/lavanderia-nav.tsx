"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sparkles, PlusCircle, CheckCircle2, Tag, Layers } from "lucide-react"

const navItems = [
  { href: "/lavanderia", label: "Tablero & Resumen", icon: Sparkles },
  { href: "/lavanderia/ordenes", label: "Recepción / Tickets", icon: PlusCircle },
  { href: "/lavanderia/entregas", label: "Entregas & Cobros", icon: CheckCircle2 },
  { href: "/lavanderia/servicios", label: "Tarifario / Precios", icon: Tag },
  { href: "/lavanderia/insumos", label: "Insumos & Stock", icon: Layers },
]

export function LavanderiaNav() {
  const pathname = usePathname()

  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon
            const active =
              item.href === "/lavanderia"
                ? pathname === "/lavanderia"
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

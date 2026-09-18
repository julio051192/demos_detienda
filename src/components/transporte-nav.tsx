"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const items = [
  { href: "/transporte", label: "Resumen" },
  { href: "/transporte/flota", label: "Flota" },
  { href: "/transporte/rutas", label: "Rutas" },
  { href: "/transporte/costos", label: "Costos" },
  { href: "/transporte/reportes", label: "Reportes" },
]

export function TransporteNav() {
  const pathname = usePathname()

  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
        {items.map((item) => {
          const active =
            item.href === "/transporte"
              ? pathname === "/transporte"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-3 py-1 text-sm whitespace-nowrap",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

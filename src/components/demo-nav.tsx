"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const items = [
  { href: "/demo", label: "Hoy" },
  { href: "/demo/cobros", label: "Cobros" },
  { href: "/demo/prestamos", label: "Préstamos" },
  { href: "/demo/clientes", label: "Clientes" },
]

export function DemoNav() {
  const pathname = usePathname()
  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
        {items.map((item) => {
          const active =
            item.href === "/demo"
              ? pathname === "/demo"
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

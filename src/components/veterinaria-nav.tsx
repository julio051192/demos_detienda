"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Stethoscope,
  Syringe,
  Scissors,
  ShoppingBag,
  Receipt,
  Dog,
} from "lucide-react"

const navItems = [
  { href: "/veterinaria", label: "Consultas & Historias Clínicas", icon: Stethoscope },
  { href: "/veterinaria/vacunas", label: "Carnet de Vacunación", icon: Syringe },
  { href: "/veterinaria/grooming", label: "Grooming, Baños & Spa", icon: Scissors },
  { href: "/veterinaria/petshop", label: "Pet Shop & Farmacia", icon: ShoppingBag },
  { href: "/veterinaria/caja", label: "Caja & Facturación", icon: Receipt },
]

export function VeterinariaNav() {
  const pathname = usePathname()

  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active =
            item.href === "/veterinaria"
              ? pathname === "/veterinaria"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm whitespace-nowrap",
                active
                  ? "bg-teal-700 text-white font-semibold shadow-xs"
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

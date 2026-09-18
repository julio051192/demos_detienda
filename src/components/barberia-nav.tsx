"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { BarChart3, CreditCard, Gift, Scissors, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/barberia", label: "Vista general", icon: BarChart3 },
  { href: "/barberia/clientes", label: "Clientes", icon: Users },
  { href: "/barberia/tarjeta", label: "Tarjeta digital", icon: CreditCard },
  { href: "/barberia/premios", label: "Premios", icon: Gift },
]

export function BarberiaNav() {
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    navRef.current?.scrollTo({ left: 0 })
  }, [pathname])

  return (
    <div className="border-b border-stone-800 bg-stone-950 text-stone-300">
      <div ref={navRef} className="mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-4 py-2">
        <Link href="/barberia" className="mr-3 flex shrink-0 items-center gap-2 border-r border-stone-800 pr-4 text-sm font-semibold text-amber-400">
          <Scissors className="size-4" /> Corte & Sello
        </Link>
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/barberia" ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href} className={cn("flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm", active ? "bg-amber-400 text-stone-950" : "hover:bg-stone-800 hover:text-white")}>
              <Icon className="size-4" /> {label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Headphones, Users, ListTodo, History } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/callcenter", label: "Panel multiservicios", icon: Headphones },
  { href: "/callcenter/cola", label: "Cola de atención", icon: ListTodo },
  { href: "/callcenter/clientes", label: "Clientes", icon: Users },
  { href: "/callcenter/historial", label: "Historial", icon: History },
]

export function CallCenterNav() {
  const pathname = usePathname()
  return <div className="border-b bg-card"><div className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-4 py-2">{items.map(({ href, label, icon: Icon }) => { const active = href === "/callcenter" ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} className={cn("flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium sm:text-sm", active ? "bg-cyan-700 text-white shadow-xs" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><Icon className="size-4" />{label}</Link> })}</div></div>
}

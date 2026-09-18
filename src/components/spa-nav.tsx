"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, CircleDollarSign, HeartPulse, Users, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [{ href: "/spa", label: "Panel del día", icon: HeartPulse }, { href: "/spa/agenda", label: "Agenda", icon: CalendarDays }, { href: "/spa/clientes", label: "Clientes", icon: Users }, { href: "/spa/servicios", label: "Tratamientos", icon: Sparkles }, { href: "/spa/caja", label: "Caja", icon: CircleDollarSign }]

export function SpaNav() { const pathname = usePathname(); return <div className="border-b bg-card"><div className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-4 py-2">{items.map(({ href, label, icon: Icon }) => { const active = href === "/spa" ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} className={cn("flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium sm:text-sm", active ? "bg-rose-600 text-white shadow-xs" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><Icon className="size-4" />{label}</Link> })}</div></div> }

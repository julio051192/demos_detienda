"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Bot,
  CalendarCheck,
  MessageSquareCode,
  Server,
  Sparkles,
} from "lucide-react"

const navItems = [
  { href: "/mtc", label: "Bot Scraper & Cupos MTC", icon: Bot },
  { href: "/mtc/citas", label: "Gestión de Citas & Ticket QR", icon: CalendarCheck },
  { href: "/mtc/whatsapp", label: "Automatización WhatsApp", icon: MessageSquareCode },
  { href: "/mtc/infraestructura", label: "Infraestructura n8n / Cloud", icon: Server },
]

export function MtcNav() {
  const pathname = usePathname()

  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active =
            item.href === "/mtc"
              ? pathname === "/mtc"
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm whitespace-nowrap",
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
  )
}

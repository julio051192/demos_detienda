"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { roleLabel, useErpStore } from "@/lib/erp-store"

const items = [
  { href: "/comercial", label: "Hoy" },
  { href: "/comercial/ventas", label: "Ventas" },
  { href: "/comercial/compras", label: "Compras" },
  { href: "/comercial/inventarios", label: "Inventarios" },
  { href: "/comercial/usuarios", label: "3 usuarios" },
]

export function ErpNav() {
  const pathname = usePathname()
  const { state, ready, currentUser, setUser } = useErpStore()

  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {items.map((item) => {
            const active =
              item.href === "/comercial"
                ? pathname === "/comercial"
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
        {ready && currentUser ? (
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden text-muted-foreground sm:inline">Operando como</span>
            <select
              className="h-8 rounded-lg border border-input bg-background px-2 text-sm"
              value={currentUser.id}
              onChange={(e) => setUser(e.target.value)}
            >
              {state.users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} · {roleLabel(u.role)}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
    </div>
  )
}

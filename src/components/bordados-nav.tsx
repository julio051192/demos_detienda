"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { roleLabel, useBordadosStore } from "@/lib/bordados-store"
import {
  LayoutGrid,
  PlusCircle,
  Calculator,
  Wallet,
  CreditCard,
  Scissors,
  Users,
  ShieldCheck,
} from "lucide-react"

const navItems = [
  { href: "/bordados", label: "Taller en Vivo (Kanban)", icon: LayoutGrid },
  { href: "/bordados/ordenes", label: "Órdenes & Ficha", icon: PlusCircle },
  { href: "/bordados/cotizador", label: "Cotizador por Puntadas", icon: Calculator },
  { href: "/bordados/caja", label: "Caja Chica & Comprobantes", icon: Wallet },
  { href: "/bordados/pagos", label: "Pasarela API (Niubiz/Culqi)", icon: CreditCard },
  { href: "/bordados/insumos", label: "Insumos & Trazabilidad", icon: Scissors },
  { href: "/bordados/personal", label: "Planillas & Destajo", icon: Users },
  { href: "/bordados/usuarios", label: "Roles & Permisos", icon: ShieldCheck },
]

export function BordadosNav() {
  const pathname = usePathname()
  const { state, ready, currentUser, setCurrentUserRole } = useBordadosStore()

  return (
    <div className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon
            const active =
              item.href === "/bordados"
                ? pathname === "/bordados"
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

        {/* Puesto / Rol Activo Dropdown */}
        {ready && currentUser && (
          <div className="hidden items-center gap-2 rounded-lg border bg-background px-2.5 py-1 text-xs sm:flex whitespace-nowrap">
            <span className="text-muted-foreground">Rol Activo:</span>
            <select
              className="bg-transparent font-semibold text-foreground outline-none cursor-pointer"
              value={currentUser.id}
              onChange={(e) => setCurrentUserRole(e.target.value)}
            >
              {state.users.map((u) => (
                <option key={u.id} value={u.id} className="bg-background text-foreground">
                  {u.name} ({roleLabel(u.role)})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

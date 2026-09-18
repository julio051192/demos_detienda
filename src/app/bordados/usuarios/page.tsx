"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { roleLabel, useBordadosStore } from "@/lib/bordados-store"
import { ShieldCheck, UserCheck, Check, X, Key, Scissors, Wallet } from "lucide-react"

const permissionsList = [
  { module: "Tablero Kanban de Taller", admin: true, cajero: true, operario: true },
  { module: "Recepción de Órdenes & Cotización", admin: true, cajero: true, operario: false },
  { module: "Cobros con Pasarela API (Niubiz/Culqi)", admin: true, cajero: true, operario: false },
  { module: "Arqueo de Caja Chica & Movimientos", admin: true, cajero: true, operario: false },
  { module: "Ficha Técnica para Operario", admin: true, cajero: true, operario: true },
  { module: "Control de Insumos & Alertas", admin: true, cajero: true, operario: true },
  { module: "Planilla & Pagos por Destajo", admin: true, cajero: false, operario: false },
  { module: "Configuración de Tarifas de Puntadas", admin: true, cajero: false, operario: false },
]

export default function UsuariosBordadosPage() {
  const { state, ready, currentUser, setCurrentUserRole } = useBordadosStore()

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando usuarios…</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios & Matriz de Roles</h1>
          <p className="text-sm text-muted-foreground">
            Perfiles con permisos diferenciados para Administrador, Secretario/Cajero y Operario/Bordador.
          </p>
        </div>
      </div>

      {/* Selector Activo de Puesto */}
      <div className="rounded-xl border bg-card p-5 space-y-4 shadow-xs">
        <h2 className="text-base font-bold flex items-center gap-2">
          <UserCheck className="size-5 text-violet-600" />
          Probar Perfil de Usuario Activo en Pantalla
        </h2>
        <p className="text-xs text-muted-foreground">
          Selecciona un puesto para simular la experiencia que tendrá cada trabajador en el taller:
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {state.users.map((user) => {
            const isSelected = user.id === currentUser?.id
            return (
              <button
                key={user.id}
                onClick={() => setCurrentUserRole(user.id)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-violet-500 bg-violet-50/40 dark:bg-violet-950/20 ring-2 ring-violet-500/20"
                    : "bg-background hover:bg-muted/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{user.name}</span>
                  {isSelected && (
                    <Badge className="bg-violet-600 text-white text-[10px]">Activo</Badge>
                  )}
                </div>
                <p className="text-xs text-violet-700 dark:text-violet-300 font-semibold mt-1">
                  {roleLabel(user.role)}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{user.seatName}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Matriz de Permisos por Rol */}
      <div className="space-y-3">
        <h2 className="text-base font-bold flex items-center gap-2">
          <ShieldCheck className="size-4 text-violet-600" />
          Matriz de Accesos y Permisos por Perfil
        </h2>

        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Módulo / Función del Sistema</TableHead>
                <TableHead className="text-center">🔑 Administrador / Dueño</TableHead>
                <TableHead className="text-center">💼 Secretario / Cajero</TableHead>
                <TableHead className="text-center">⚙️ Operario / Bordador</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissionsList.map((perm, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-semibold text-xs text-foreground">
                    {perm.module}
                  </TableCell>
                  <TableCell className="text-center">
                    {perm.admin ? (
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                        <Check className="size-4" />
                      </span>
                    ) : (
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground mx-auto">
                        <X className="size-4" />
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {perm.cajero ? (
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                        <Check className="size-4" />
                      </span>
                    ) : (
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground mx-auto">
                        <X className="size-4" />
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {perm.operario ? (
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                        <Check className="size-4" />
                      </span>
                    ) : (
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground mx-auto">
                        <X className="size-4" />
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

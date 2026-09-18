"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { lineTotal, roleLabel, useErpStore } from "@/lib/erp-store"
import { formatMoney, todayISO } from "@/lib/money"
import { ShoppingCart, ShoppingBag, Package, Users, PlusCircle, Wine, Building2, Car, Sparkles, HandCoins, ArrowRight, Scissors, Bot, Coffee, Stethoscope } from "lucide-react"

export default function HomePage() {
  const { state, ready, stats, reset, currentUser } = useErpStore()
  const mx = (n: number) => formatMoney(n)

  if (!ready) {
    return (
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-muted-foreground">Iniciando Sistema Lalo…</p>
      </main>
    )
  }

  const low = state.products.filter((p) => p.stock <= p.minStock)

  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Banner Superior */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Nube & Red Local · 3 Usuarios</Badge>
            <span className="text-xs text-muted-foreground">{todayISO()}</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Sistema Lalo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Control integral de Ventas, Compras e Inventarios para operar en red local y remoto por navegador.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={reset}>
            Restaurar datos
          </Button>
          <Button render={<Link href="/comercial/ventas" />}>
            <PlusCircle className="mr-1.5 size-4" />
            Nueva Venta
          </Button>
          <Button variant="secondary" render={<Link href="/comercial/compras" />}>
            <ShoppingBag className="mr-1.5 size-4" />
            Nueva Compra
          </Button>
        </div>
      </div>

      {/* Resumen de Requerimientos y Estado de Red */}
      <div className="rounded-xl border bg-card p-4 text-sm shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3 mb-3">
          <p className="font-semibold text-foreground">Estado de la Red de Operación:</p>
          <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-medium">
            ✓ 3 Puestos activos en simultáneo
          </span>
        </div>
        <ul className="grid gap-2 sm:grid-cols-3 text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <span className="text-primary font-bold">1.</span>
            <span><strong>Ventas:</strong> Descuenta stock al instante</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="text-primary font-bold">2.</span>
            <span><strong>Compras:</strong> Ingreso directo a almacén</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="text-primary font-bold">3.</span>
            <span><strong>Inventarios:</strong> Existencias y costos en tiempo real</span>
          </li>
        </ul>
      </div>

      {/* Tarjetas de Métricas (KPIs) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Ventas de hoy</p>
              <ShoppingCart className="size-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl tabular-nums font-bold text-emerald-600 dark:text-emerald-400">
              {mx(stats.sold)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {currentUser ? `Puesto actual: ${currentUser.name}` : "Caja activa"}
            </p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Compras de hoy</p>
              <ShoppingBag className="size-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl tabular-nums font-bold">
              {mx(stats.bought)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Ingresos de mercadería</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Valor de inventario</p>
              <Package className="size-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl tabular-nums font-bold">
              {mx(stats.stockValue)}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{stats.products} productos en almacén</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">Alertas de Stock</p>
              <Users className="size-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl tabular-nums font-bold text-destructive">
              {stats.low} por reponer
            </CardTitle>
            <p className="text-xs text-muted-foreground">Productos bajo el mínimo</p>
          </CardHeader>
        </Card>
      </div>

      {/* Selector Visual de Demos Multi-Negocio */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight">Demos Especializadas Disponibles</h2>
            <p className="text-xs text-muted-foreground">
              Haz clic en cualquier industria para ver su flujo operativo en tiempo real:
            </p>
          </div>
          <Badge variant="outline" className="text-xs">6 Demos Listas</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/mtc"
            className="group rounded-xl border-2 border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20 p-4 transition-all hover:border-emerald-500 hover:shadow-md"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
              <Bot className="size-5" />
            </div>
            <h3 className="mt-3 font-semibold text-sm text-foreground group-hover:text-emerald-600 transition-colors">
              Citas MTC & Bot
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Scraper 24/7 de cupos MTC, bypass CAPTCHA, ticket QR y WhatsApp.
            </p>
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <span>Abrir Monitor MTC</span>
              <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/cafeteria"
            className="group rounded-xl border-2 border-amber-600/60 bg-amber-50/20 dark:bg-amber-950/20 p-4 transition-all hover:border-amber-700 hover:shadow-md"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100">
              <Coffee className="size-5" />
            </div>
            <h3 className="mt-3 font-semibold text-sm text-foreground group-hover:text-amber-800 transition-colors">
              Cafetería & Barismo
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              POS táctil, leches vegetales, pantalla de barista y club de sellos.
            </p>
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-amber-800 dark:text-amber-400">
              <span>Abrir Cafetería</span>
              <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/veterinaria"
            className="group rounded-xl border-2 border-teal-600/60 bg-teal-50/20 dark:bg-teal-950/20 p-4 transition-all hover:border-teal-700 hover:shadow-md"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100">
              <Stethoscope className="size-5" />
            </div>
            <h3 className="mt-3 font-semibold text-sm text-foreground group-hover:text-teal-700 transition-colors">
              Clínica Veterinaria
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Historias clínicas, carnet de vacunas, grooming y pet shop.
            </p>
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-teal-700 dark:text-teal-300">
              <span>Abrir Veterinaria</span>
              <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/barberia"
            className="group rounded-xl border bg-card p-4 transition-all hover:border-amber-400 hover:shadow-md dark:hover:border-amber-700"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Scissors className="size-5" />
            </div>
            <h3 className="mt-3 font-semibold text-sm text-foreground group-hover:text-amber-600 transition-colors">
              Barbería & Fidelización
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Tarjeta Platinum/Diamond, escáner de sellos y campañas de WhatsApp.
            </p>
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-amber-600">
              <span>Abrir Demo</span>
              <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/bordados"
            className="group rounded-xl border bg-card p-4 transition-all hover:border-violet-400 hover:shadow-md dark:hover:border-violet-700"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              <Scissors className="size-5" />
            </div>
            <h3 className="mt-3 font-semibold text-sm text-foreground group-hover:text-violet-600 transition-colors">
              Bordados Computarizados
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Conteo de puntadas, ponchado/matriz, Kanban de taller y cotizador.
            </p>
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-violet-600">
              <span>Abrir Taller</span>
              <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/licoreria"
            className="group rounded-xl border bg-card p-4 transition-all hover:border-rose-400 hover:shadow-md dark:hover:border-rose-700"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              <Wine className="size-5" />
            </div>
            <h3 className="mt-3 font-semibold text-sm text-foreground group-hover:text-rose-600 transition-colors">
              Licorería & POS
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Lector de código de barras (EAN/UPC), caja rápida, vuelto y tickets.
            </p>
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-rose-600">
              <span>Abrir POS</span>
              <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/hotel"
            className="group rounded-xl border bg-card p-4 transition-all hover:border-amber-400 hover:shadow-md dark:hover:border-amber-700"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <Building2 className="size-5" />
            </div>
            <h3 className="mt-3 font-semibold text-sm text-foreground group-hover:text-amber-600 transition-colors">
              Hotel & Hospedaje
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Rack interactivo por colores, Check-in con DNI, frigobar y Check-out.
            </p>
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-amber-600">
              <span>Abrir Rack</span>
              <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/carwash"
            className="group rounded-xl border bg-card p-4 transition-all hover:border-cyan-400 hover:shadow-md dark:hover:border-cyan-700"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
              <Car className="size-5" />
            </div>
            <h3 className="mt-3 font-semibold text-sm text-foreground group-hover:text-cyan-600 transition-colors">
              Car Wash
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Pista en vivo por bahías, recepción por placa y comisiones de lavadores.
            </p>
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-cyan-600">
              <span>Abrir Pista</span>
              <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/lavanderia"
            className="group rounded-xl border bg-card p-4 transition-all hover:border-blue-400 hover:shadow-md dark:hover:border-blue-700"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Sparkles className="size-5" />
            </div>
            <h3 className="mt-3 font-semibold text-sm text-foreground group-hover:text-blue-600 transition-colors">
              Lavandería
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Recepción por kilos y prendas, tickets térmicos y cobranza en entrega.
            </p>
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-blue-600">
              <span>Abrir Lavandería</span>
              <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/demo"
            className="group rounded-xl border bg-card p-4 transition-all hover:border-emerald-400 hover:shadow-md dark:hover:border-emerald-700"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <HandCoins className="size-5" />
            </div>
            <h3 className="mt-3 font-semibold text-sm text-foreground group-hover:text-emerald-600 transition-colors">
              Préstamos & Créditos
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Cartera de clientes, cronograma de cuotas y registro diario de cobranzas.
            </p>
            <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-emerald-600">
              <span>Abrir Préstamos</span>
              <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Tablas de Alertas y Ventas Recientes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Alertas de Inventario (Bajo Mínimo)</CardTitle>
              <Button variant="ghost" size="xs" render={<Link href="/comercial/inventarios" />}>
                Ver catálogo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {low.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                ✓ Todo el inventario se encuentra en niveles óptimos.
              </p>
            ) : (
              low.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 text-sm border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.sku} · Stock mínimo requerido: {p.minStock} {p.unit}
                    </p>
                  </div>
                  <Badge variant="destructive">Quedan {p.stock} {p.unit}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Últimas Ventas Registradas</CardTitle>
              <Button variant="ghost" size="xs" render={<Link href="/comercial/ventas" />}>
                Ver todas
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.sales.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Aún no hay ventas registradas hoy.
              </p>
            ) : (
              state.sales.slice(0, 5).map((s) => {
                const user = state.users.find((u) => u.id === s.userId)
                return (
                  <div key={s.id} className="flex items-center justify-between gap-3 text-sm border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-foreground">{s.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.date} · Registrado por: {user ? `${user.name} (${roleLabel(user.role)})` : "Caja"}
                      </p>
                    </div>
                    <p className="tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                      {mx(lineTotal(s.lines))}
                    </p>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Accesos directos a los 3 puestos de red */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="text-base font-semibold">Puestos de Trabajo en Red (3 Usuarios)</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Cada puesto opera de forma simultánea desde cualquier computadora o dispositivo:
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {state.users.map((u) => (
            <div key={u.id} className="rounded-lg border p-3 bg-muted/20">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{u.name}</span>
                <Badge variant="secondary">{roleLabel(u.role)}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{u.seat}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

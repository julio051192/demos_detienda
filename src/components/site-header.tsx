"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Boxes, Sparkles, Car, Building2, Wine, HandCoins, Scissors, UtensilsCrossed, Package, Flower2, Pill, Headphones, HeartPulse, Bot, Coffee, Stethoscope, Truck } from "lucide-react"
import { cn } from "@/lib/utils"
import { roleLabel, useErpStore } from "@/lib/erp-store"

const laloLinks = [
  { href: "/", label: "Inicio / Resumen" },
  { href: "/comercial/ventas", label: "Ventas" },
  { href: "/comercial/compras", label: "Compras" },
  { href: "/comercial/inventarios", label: "Inventarios" },
  { href: "/comercial/usuarios", label: "3 Usuarios" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const isVeterinaria = pathname.startsWith("/veterinaria")
  const isCafeteria = pathname.startsWith("/cafeteria")
  const isMtc = pathname.startsWith("/mtc")
  const isLavanderia = pathname.startsWith("/lavanderia")
  const isCarWash = pathname.startsWith("/carwash")
  const isHotel = pathname.startsWith("/hotel")
  const isLicoreria = pathname.startsWith("/licoreria")
  const isBordados = pathname.startsWith("/bordados")
  const isDemo = pathname.startsWith("/demo")
  const isTransporte = pathname.startsWith("/transporte")
  const isRestaurante = pathname.startsWith("/restaurante")
  const isCeramicas = pathname.startsWith("/ceramicas")
  const isFloreria = pathname.startsWith("/floreria")
  const isTextil = pathname.startsWith("/textil")
  const isBotica = pathname.startsWith("/botica")
  const isCallCenter = pathname.startsWith("/callcenter")
  const isSpa = pathname.startsWith("/spa")
  const isBarberia = pathname.startsWith("/barberia")
  const { state, ready, currentUser, setUser } = useErpStore()

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link
          href={isVeterinaria ? "/veterinaria" : isCafeteria ? "/cafeteria" : isMtc ? "/mtc" : isBarberia ? "/barberia" : isSpa ? "/spa" : isCallCenter ? "/callcenter" : isBotica ? "/botica" : isFloreria ? "/floreria" : isTextil ? "/textil" : isRestaurante ? "/restaurante" : isCeramicas ? "/ceramicas" : isBordados ? "/bordados" : isHotel ? "/hotel" : isCarWash ? "/carwash" : isLavanderia ? "/lavanderia" : isLicoreria ? "/licoreria" : isDemo ? "/demo" : isTransporte ? "/transporte" : "/"}
          className="flex min-w-0 items-center gap-2 font-semibold tracking-tight"
        >
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-lg text-primary-foreground",
              isVeterinaria
                ? "bg-teal-700 shadow-md shadow-teal-600/20"
                : isCafeteria
                ? "bg-amber-800 shadow-md shadow-amber-900/20"
                : isMtc
                ? "bg-emerald-600 shadow-md shadow-emerald-500/20"
                : isRestaurante
                ? "bg-orange-600"
                : isBarberia
                ? "bg-stone-900"
                : isSpa
                ? "bg-rose-600"
                : isCallCenter
                ? "bg-cyan-700"
                : isBotica
                ? "bg-emerald-600"
                : isFloreria
                ? "bg-rose-600"
                : isTextil
                ? "bg-sky-600"
                : isCeramicas
                ? "bg-amber-600"
                : isBordados
                ? "bg-violet-600"
                : isHotel
                  ? "bg-amber-600"
                  : isCarWash
                    ? "bg-cyan-600"
                    : isLavanderia
                      ? "bg-blue-600"
                      : isLicoreria
                        ? "bg-rose-600"
                        : isDemo
                          ? "bg-emerald-600"
                          : isTransporte
                            ? "bg-cyan-700 shadow-md shadow-cyan-600/20"
                            : "bg-primary",
            )}
          >
            {isVeterinaria ? (
              <Stethoscope className="size-5" />
            ) : isCafeteria ? (
              <Coffee className="size-5" />
            ) : isMtc ? (
              <Bot className="size-5" />
            ) : isBarberia ? (
              <Scissors className="size-5" />
            ) : isRestaurante ? (
              <UtensilsCrossed className="size-5" />
            ) : isSpa ? (
              <HeartPulse className="size-5" />
            ) : isCallCenter ? (
              <Headphones className="size-5" />
            ) : isBotica ? (
              <Pill className="size-5" />
            ) : isFloreria ? (
              <Flower2 className="size-5" />
            ) : isTextil ? (
              <Scissors className="size-5" />
            ) : isCeramicas ? (
              <Package className="size-5" />
            ) : isBordados ? (
              <Scissors className="size-5" />
            ) : isHotel ? (
              <Building2 className="size-5" />
            ) : isCarWash ? (
              <Car className="size-5" />
            ) : isLavanderia ? (
              <Sparkles className="size-5" />
            ) : isLicoreria ? (
              <Wine className="size-5" />
            ) : isDemo ? (
              <HandCoins className="size-5" />
            ) : isTransporte ? (
              <Truck className="size-5" />
            ) : (
              <Boxes className="size-5" />
            )}
          </span>
          <span className="truncate">
            <span className="text-base font-bold">
                {isVeterinaria
                  ? "Clínica Veterinaria"
                  : isCafeteria
                  ? "Sistema Cafetería"
                  : isMtc
                  ? "Citas MTC & WhatsApp"
                  : isBarberia
                  ? "Corte & Sello"
                  : isRestaurante
                  ? "Sistema Restaurante"
                  : isSpa
                  ? "Clínica Spa"
                  : isCallCenter
                  ? "Sistema Multiservicios"
                  : isBotica
                  ? "Sistema Botica"
                  : isFloreria
                  ? "Sistema Florería"
                  : isTextil
                  ? "Sistema Textil"
                  : isCeramicas
                  ? "Sistema Cerámicas"
                  : isBordados
                ? "Sistema Bordados"
                : isHotel
                  ? "Sistema Hotel"
                  : isCarWash
                    ? "Sistema Car Wash"
                    : isLavanderia
                      ? "Sistema Lavandería"
                      : isLicoreria
                        ? "Sistema Licorería"
                        : isDemo
                          ? "Sistema Préstamos"
                          : isTransporte
                            ? "Sistema Transporte"
                            : "Sistema Lalo"}
            </span>
            <span className="ml-2 hidden text-xs font-normal text-muted-foreground sm:inline">
                {isVeterinaria
                  ? "Historias Clínicas · Vacunas · Grooming · Pet Shop"
                  : isCafeteria
                  ? "Barista · POS · Sellos Club · Especialidad"
                  : isMtc
                  ? "Scraper · Cupos 24/7 · Ticket QR · n8n"
                  : isBarberia
                  ? "Clientes · Sellos · Premios · WhatsApp"
                  : isRestaurante
                  ? "Mesas · Comandas · Cocina · Caja · Delivery"
                  : isSpa
                  ? "Agenda · Tratamientos · Clientes · Caja"
                  : isCallCenter
                  ? "Clientes · Atención · Seguimientos · Agentes"
                  : isBotica
                  ? "POS · Medicamentos · Vencimientos · Pagos"
                  : isFloreria
                  ? "Pedidos · Catálogo · Eventos · Delivery"
                  : isTextil
                  ? "Producción · Telas · Cotizador · Despacho"
                  : isCeramicas
                  ? "Cotizador · m² · Inventario · PDF"
                  : isBordados
                ? "Taller · Puntadas · Matrizado · Cotizador"
                : isHotel
                  ? "Rack · Check-in · Frigobar · Caja"
                  : isCarWash
                    ? "Pista · Bahías · Placas · Comisiones"
                    : isLavanderia
                      ? "Recepción · Kilos · Prendas · Caja"
                      : isLicoreria
                        ? "POS · Código de Barras · Stock · Ventas"
                        : isDemo
                          ? "Clientes · Préstamos · Cobros"
                          : isTransporte
                            ? "Flota · Rutas · Costos · Reportes"
                            : "Ventas · Compras · Inventarios"}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {!isLavanderia && !isCarWash && !isHotel && !isLicoreria && !isBordados && !isDemo && !isRestaurante && !isCeramicas && !isFloreria && !isTextil && !isBotica && !isCallCenter && !isSpa && !isBarberia ? (
            <nav className="flex items-center gap-1 overflow-x-auto">
              {laloLinks.map((l) => {
                const active =
                  l.href === "/"
                    ? pathname === "/" || pathname === "/comercial"
                    : pathname === l.href
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "rounded-lg px-2.5 py-1.5 text-sm whitespace-nowrap transition-colors sm:px-3",
                      active
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {l.label}
                  </Link>
                )
              })}
            </nav>
          ) : null}

          {/* Selector de Demos */}
          <div className="flex items-center gap-1.5 border-l pl-2">
            <Link
              href="/"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                !isMtc && !isLavanderia && !isCarWash && !isHotel && !isLicoreria && !isBordados && !isDemo && !isRestaurante && !isBarberia
                  ? "bg-primary/10 text-primary border-primary/30 font-semibold"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground",
              )}
            >
              <Boxes className="size-3.5" />
              <span className="hidden md:inline">Comercial Lalo</span>
            </Link>

            <Link
              href="/mtc"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isMtc
                  ? "bg-emerald-100 text-emerald-900 border-emerald-400 font-bold dark:bg-emerald-950 dark:text-emerald-200"
                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300",
              )}
            >
              <Bot className="size-3.5 text-emerald-600" />
              <span className="hidden md:inline font-semibold">Citas MTC & Bot</span>
            </Link>

            <Link
              href="/veterinaria"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isVeterinaria
                  ? "bg-teal-100 text-teal-900 border-teal-400 font-bold dark:bg-teal-950 dark:text-teal-200"
                  : "bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/40 dark:text-teal-300",
              )}
            >
              <Stethoscope className="size-3.5 text-teal-700 dark:text-teal-400" />
              <span className="hidden md:inline font-semibold">Veterinaria</span>
            </Link>

            <Link
              href="/cafeteria"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isCafeteria
                  ? "bg-amber-100 text-amber-900 border-amber-400 font-bold dark:bg-amber-950 dark:text-amber-200"
                  : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300",
              )}
            >
              <Coffee className="size-3.5 text-amber-800 dark:text-amber-400" />
              <span className="hidden md:inline font-semibold">Cafetería</span>
            </Link>

            <Link
              href="/restaurante"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isRestaurante
                  ? "bg-orange-100 text-orange-900 border-orange-400 font-semibold dark:bg-orange-950 dark:text-orange-200"
                  : "bg-orange-50 hover:bg-orange-100 text-orange-800 border-orange-200",
              )}
            >
              <UtensilsCrossed className="size-3.5 text-orange-600" />
              <span className="hidden md:inline">Restaurante</span>
            </Link>

            <Link
              href="/ceramicas"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isCeramicas
                  ? "bg-amber-100 text-amber-900 border-amber-400 font-semibold dark:bg-amber-950 dark:text-amber-200"
                  : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200",
              )}
            >
              <Package className="size-3.5 text-amber-600" />
              <span className="hidden md:inline">Cerámicas</span>
            </Link>

            <Link
              href="/floreria"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isFloreria
                  ? "bg-rose-100 text-rose-900 border-rose-400 font-semibold dark:bg-rose-950 dark:text-rose-200"
                  : "bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200",
              )}
            >
              <Flower2 className="size-3.5 text-rose-600" />
              <span className="hidden md:inline">Florería</span>
            </Link>

            <Link
              href="/textil"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isTextil
                  ? "bg-sky-100 text-sky-900 border-sky-400 font-semibold dark:bg-sky-950 dark:text-sky-200"
                  : "bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200",
              )}
            >
              <Scissors className="size-3.5 text-sky-600" />
              <span className="hidden md:inline">Textil</span>
            </Link>

            <Link
              href="/bordados"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isBordados
                  ? "bg-violet-100 text-violet-900 border-violet-400 font-semibold dark:bg-violet-950 dark:text-violet-200"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground",
              )}
            >
              <Scissors className="size-3.5 text-violet-600" />
              <span className="hidden md:inline">Bordados</span>
            </Link>

            <Link
              href="/licoreria"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isLicoreria
                  ? "bg-rose-100 text-rose-900 border-rose-400 font-semibold dark:bg-rose-950 dark:text-rose-200"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground",
              )}
            >
              <Wine className="size-3.5 text-rose-600" />
              <span className="hidden md:inline">Licorería</span>
            </Link>

            <Link
              href="/botica"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isBotica
                  ? "bg-emerald-100 text-emerald-900 border-emerald-400 font-semibold dark:bg-emerald-950 dark:text-emerald-200"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground",
              )}
            >
              <Pill className="size-3.5 text-emerald-600" />
              <span className="hidden md:inline">Botica</span>
            </Link>

            <Link
              href="/callcenter"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isCallCenter
                  ? "bg-cyan-100 text-cyan-900 border-cyan-400 font-semibold dark:bg-cyan-950 dark:text-cyan-200"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground",
              )}
            >
              <Headphones className="size-3.5 text-cyan-700" />
              <span className="hidden md:inline">Multiservicios</span>
            </Link>

            <Link
              href="/spa"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isSpa
                  ? "bg-rose-100 text-rose-900 border-rose-400 font-semibold dark:bg-rose-950 dark:text-rose-200"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground",
              )}
            >
              <HeartPulse className="size-3.5 text-rose-600" />
              <span className="hidden md:inline">Clínica Spa</span>
            </Link>

            <Link
              href="/barberia"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isBarberia
                  ? "bg-stone-900 text-amber-300 border-stone-700 font-semibold"
                  : "bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300",
              )}
            >
              <Scissors className="size-3.5 text-amber-600" />
              <span className="hidden md:inline">Barbería</span>
            </Link>

            <Link
              href="/hotel"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isHotel
                  ? "bg-amber-100 text-amber-900 border-amber-400 font-semibold dark:bg-amber-950 dark:text-amber-200"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground",
              )}
            >
              <Building2 className="size-3.5 text-amber-600" />
              <span className="hidden md:inline">Hotel</span>
            </Link>

            <Link
              href="/carwash"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isCarWash
                  ? "bg-cyan-100 text-cyan-900 border-cyan-400 font-semibold dark:bg-cyan-950 dark:text-cyan-200"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground",
              )}
            >
              <Car className="size-3.5 text-cyan-600" />
              <span className="hidden md:inline">Car Wash</span>
            </Link>

            <Link
              href="/lavanderia"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isLavanderia
                  ? "bg-blue-100 text-blue-900 border-blue-400 font-semibold dark:bg-blue-950 dark:text-blue-200"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground",
              )}
            >
              <Sparkles className="size-3.5 text-blue-600" />
              <span className="hidden md:inline">Lavandería</span>
            </Link>

            <Link
              href="/demo"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isDemo
                  ? "bg-emerald-100 text-emerald-900 border-emerald-400 font-semibold dark:bg-emerald-950 dark:text-emerald-200"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground",
              )}
            >
              <HandCoins className="size-3.5 text-emerald-600" />
              <span className="hidden md:inline">Préstamos</span>
            </Link>

            <Link
              href="/transporte"
              className={cn(
                "flex shrink-0 items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors",
                isTransporte
                  ? "bg-cyan-100 text-cyan-900 border-cyan-400 font-semibold dark:bg-cyan-950 dark:text-cyan-200"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground",
              )}
            >
              <Truck className="size-3.5 text-cyan-600" />
              <span className="hidden md:inline">Transporte</span>
            </Link>

          </div>

          {!isLavanderia && !isCarWash && !isHotel && !isLicoreria && !isBordados && !isDemo && !isRestaurante && !isCeramicas && !isFloreria && !isTextil && !isBotica && !isCallCenter && !isSpa && ready && currentUser && (
            <div className="hidden items-center gap-2 rounded-lg border bg-card px-2.5 py-1 text-xs lg:flex">
              <span className="text-muted-foreground">Puesto:</span>
              <select
                className="bg-transparent font-medium text-foreground outline-none cursor-pointer"
                value={currentUser.id}
                onChange={(e) => setUser(e.target.value)}
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
    </header>
  )
}


"use client"

import Link from "next/link"
import { ArrowUpRight, BatteryCharging, CircleDollarSign, Fuel, MapPinned, Route, Truck, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const kpis = [
  { label: "Costo operativo total", value: "S/. 18,420", note: "Mes actual", icon: CircleDollarSign, tone: "amber" },
  { label: "Flota activa", value: "12", note: "6 de carga + 6 servicios", icon: Truck, tone: "blue" },
  { label: "Rutas programadas", value: "46", note: "+8 vs. semana pasada", icon: Route, tone: "green" },
  { label: "Combustible", value: "S/. 5,230", note: "Promedio 22.4 gal/día", icon: Fuel, tone: "orange" },
]

const rutas = [
  { nombre: "Lima - Arequipa", distancia: "1,200 km", estado: "En ruta" },
  { nombre: "Lima - Trujillo", distancia: "560 km", estado: "Programada" },
  { nombre: "Callao - Chimbote", distancia: "420 km", estado: "En tránsito" },
  { nombre: "Cusco - Juliaca", distancia: "760 km", estado: "A tiempo" },
]

const vehiculos = [
  { modelo: "Camión Hino P.B. 17T", costo: "S/. 12,300", tarifa: "S/. 1.90/km", estado: "Operativo" },
  { modelo: "Cisterna x 15 m3", costo: "S/. 9,400", tarifa: "S/. 1.70/km", estado: "Servicio" },
  { modelo: "Pickup 4x4", costo: "S/. 6,800", tarifa: "S/. 1.10/km", estado: "Activo" },
]

export default function TransportePage() {
  return (
    <main className="space-y-6">
      <section className="flex flex-col justify-between gap-4 border-b border-border pb-5 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            <Truck className="size-4" /> Transporte & logística
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Sistema demo de transporte</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Control de flota, rutas, costos operativos, combustible, personal y reportes de productividad.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-emerald-500" /> Operación activa · Hoy 15 sep 2026
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon
          const toneClasses = {
            amber: "bg-amber-100 text-amber-700",
            blue: "bg-blue-100 text-blue-700",
            green: "bg-emerald-100 text-emerald-700",
            orange: "bg-orange-100 text-orange-700",
          }

          return (
            <Card key={item.label} className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                  <span className={`grid size-8 place-items-center rounded-md ${toneClasses[item.tone as keyof typeof toneClasses]}`}>
                    <Icon className="size-4" />
                  </span>
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight">{item.value}</CardTitle>
                <p className="text-xs text-muted-foreground">{item.note}</p>
              </CardHeader>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Rutas del día</CardTitle>
              <p className="text-sm text-muted-foreground">Programación activa por vehículo y destino.</p>
            </div>
            <Button variant="outline" size="sm" render={<Link href="/transporte/rutas" />}>
              Ver más
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {rutas.map((ruta) => (
              <div key={ruta.nombre} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-md bg-blue-100 text-blue-700">
                    <MapPinned className="size-4" />
                  </span>
                  <div>
                    <p className="font-medium">{ruta.nombre}</p>
                    <p className="text-xs text-muted-foreground">Distancia: {ruta.distancia}</p>
                  </div>
                </div>
                <Badge variant={ruta.estado === "En ruta" ? "default" : "secondary"}>{ruta.estado}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Flota principal</CardTitle>
            <p className="text-sm text-muted-foreground">Vehículos con mayor participación operativa.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {vehiculos.map((vehiculo) => (
              <div key={vehiculo.modelo} className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-md bg-amber-100 text-amber-700">
                      <Truck className="size-4" />
                    </span>
                    <p className="font-medium">{vehiculo.modelo}</p>
                  </div>
                  <Badge variant="outline">{vehiculo.estado}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <span>Valor:</span>
                  <span className="text-right font-medium text-foreground">{vehiculo.costo}</span>
                  <span>Tarifa:</span>
                  <span className="text-right font-medium text-foreground">{vehiculo.tarifa}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Resumen de costos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-md bg-muted/40 p-3">
              <span className="text-sm text-muted-foreground">Combustible</span>
              <span className="font-semibold text-foreground">S/. 5,230</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/40 p-3">
              <span className="text-sm text-muted-foreground">Personal</span>
              <span className="font-semibold text-foreground">S/. 7,420</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/40 p-3">
              <span className="text-sm text-muted-foreground">Mantenimiento</span>
              <span className="font-semibold text-foreground">S/. 2,660</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-emerald-500/10 p-3 text-emerald-700">
              <span className="font-medium">Total operativo</span>
              <span className="font-bold">S/. 18,420</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Gestión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium"><Users className="size-4 text-sky-700" /> Personal</span>
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">12 conductores, 4 auxiliares y 2 supervisores activos esta semana.</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium"><BatteryCharging className="size-4 text-emerald-700" /> Mantenimiento</span>
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">3 vehículos programados para revisión técnica y 2 con mantenimiento preventivo.</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

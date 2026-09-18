"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Server,
  Cloud,
  Workflow,
  CheckCircle2,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  Globe,
  Radio,
} from "lucide-react"

export default function InfraestructuraMtcPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Infraestructura en la Nube & Automatización n8n</h1>
          <p className="text-sm text-muted-foreground">
            Arquitectura 24/7 en Railway conectada con n8n workflows para scraping continuo, base de datos y mensajería.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-600 text-white font-mono text-xs flex items-center gap-1">
            <Radio className="size-3 animate-pulse" />
            Servidores 24/7 Online
          </Badge>
        </div>
      </div>

      {/* Tarjetas de Salud de Infraestructura */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Cloud className="size-3.5 text-primary" />
              Hosting en Railway
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600">
              99.98%
            </CardTitle>
            <p className="text-xs text-muted-foreground">Uptime garantizado 24/7</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Workflow className="size-3.5 text-amber-600" />
              Workflows n8n Activos
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums text-amber-600">
              4 Flujos
            </CardTitle>
            <p className="text-xs text-muted-foreground">Scraper, BD, Alertas, WhatsApp</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Zap className="size-3.5 text-blue-600" />
              Latencia Promedio
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums text-blue-600">
              640 ms
            </CardTitle>
            <p className="text-xs text-muted-foreground">Tiempo de respuesta a cupos</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              Bypass Anti-Bot WAF
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600">
              Activo
            </CardTitle>
            <p className="text-xs text-muted-foreground">Rotación de proxies residenciales</p>
          </CardHeader>
        </Card>
      </div>

      {/* Diagrama Visual de Arquitectura de Flujos */}
      <Card className="shadow-xs border-primary/30">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Workflow className="size-5 text-primary" />
            Diagrama de Funcionamiento Automatizado (Cero Intervención Manual)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            {/* Paso 1 */}
            <div className="rounded-xl border p-4 bg-muted/20 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="size-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <Badge variant="outline" className="text-[10px]">Cada 15 min</Badge>
              </div>
              <h3 className="font-bold text-sm text-foreground">Scraper MTC</h3>
              <p className="text-xs text-muted-foreground">
                Bot headless programado en Railway que ingresa al portal del MTC, resuelve CAPTCHAs y busca cupos en todas las sedes.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="rounded-xl border p-4 bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="size-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <Badge variant="outline" className="text-[10px]">Webhook n8n</Badge>
              </div>
              <h3 className="font-bold text-sm text-foreground">Detección de Cupo</h3>
              <p className="text-xs text-muted-foreground">
                Si se libera un cupo, n8n recibe la señal inmediata, valida la sede y comprueba la cola de clientes en espera.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="rounded-xl border p-4 bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="size-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <Badge variant="outline" className="text-[10px]">PostgreSQL</Badge>
              </div>
              <h3 className="font-bold text-sm text-foreground">Reserva & Ticket QR</h3>
              <p className="text-xs text-muted-foreground">
                Se registra la cita, se genera el identificador único y se emite el comprobante digital con código QR de validación.
              </p>
            </div>

            {/* Paso 4 */}
            <div className="rounded-xl border p-4 bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="size-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <Badge variant="outline" className="text-[10px]">API WhatsApp</Badge>
              </div>
              <h3 className="font-bold text-sm text-foreground">Mensajería Inteligente</h3>
              <p className="text-xs text-muted-foreground">
                Despacho automático de Confirmación, Recordatorio preventivo de 24h y Alerta crítica de 2h para asistencia 100%.
              </p>
            </div>
          </div>

          {/* Especificaciones de los 4 Flujos n8n */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-foreground">
              Workflows Activos en el Servidor n8n:
            </h3>

            <div className="divide-y rounded-xl border bg-card text-xs">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <p className="font-bold text-foreground">Workflow 1: MTC-Scraper-Cron-Trigger</p>
                    <p className="text-muted-foreground text-[11px]">
                      Ejecución cíclica con evasión de bloqueos IP y resolución automática de reCAPTCHA.
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                  Activo (Cron 15m)
                </Badge>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <p className="font-bold text-foreground">Workflow 2: Auto-Appointment-Generator-QR</p>
                    <p className="text-muted-foreground text-[11px]">
                      Generación del código ticket y renderizado del comprobante oficial con código QR en nube.
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                  Activo (Webhook)
                </Badge>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <p className="font-bold text-foreground">Workflow 3: WhatsApp-Broadcast-Queue (Meta / Cloud API)</p>
                    <p className="text-muted-foreground text-[11px]">
                      Cola de envíos de confirmación y recordatorios con control de tasa para evitar bloqueos de WhatsApp.
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                  Activo (Queue)
                </Badge>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <p className="font-bold text-foreground">Workflow 4: Attendance-Zero-NoShow-Monitor</p>
                    <p className="text-muted-foreground text-[11px]">
                      Verificador de citas próximas a las 24 horas y alerta de máxima urgencia a las 2 horas previas.
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px]">
                  Activo (Scheduled)
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

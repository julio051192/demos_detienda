"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMtcStore } from "@/lib/mtc-store"
import { formatNumber } from "@/lib/money"
import {
  Bot,
  RefreshCw,
  ShieldCheck,
  Zap,
  MapPin,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Activity,
  Flame,
  Clock,
  ArrowRight,
} from "lucide-react"

export default function MtcDashboardPage() {
  const { state, ready, stats, triggerManualScrape, reset } = useMtcStore()
  const [isScanning, setIsScanning] = useState(false)

  if (!ready) return <p className="text-sm text-muted-foreground">Iniciando sistema MTC…</p>

  function handleManualScrape() {
    setIsScanning(true)
    setTimeout(() => {
      triggerManualScrape()
      setIsScanning(false)
    }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200">
              <Bot className="size-3.5 text-emerald-600" />
              Bot Scraper MTC · Monitoreo Inteligente 24/7
            </Badge>
            <span className="text-xs text-muted-foreground">
              Intervalo: cada {state.scanIntervalMinutes} min
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl">
            Rastreador Automático de Cupos MTC
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitoreo continuo de portales del MTC sin bloqueos, bypass de CAPTCHAs y alertas instantáneas al detectar cupos liberados.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Restaurar demo
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            disabled={isScanning}
            onClick={handleManualScrape}
          >
            <RefreshCw className={`size-4 mr-2 ${isScanning ? "animate-spin" : ""}`} />
            {isScanning ? "Bypasseando CAPTCHA..." : "Escanear MTC Ahora"}
          </Button>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm" className="border-emerald-200 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/10">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Flame className="size-3.5 text-emerald-600" />
              Cupos Detectados Hoy
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600">
              {formatNumber(stats.totalSlotsAvailable)} vacantes
            </CardTitle>
            <p className="text-xs text-muted-foreground">Disponibles para reserva inmediata</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5 text-primary" />
              Sedes MTC Monitoreadas
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {stats.sedesMonitored} centros
            </CardTitle>
            <p className="text-xs text-muted-foreground">Lima Centro, Lince, Conchán, MAC</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Zap className="size-3.5 text-amber-600" />
              Alertas WhatsApp Enviadas
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums text-amber-600">
              {formatNumber(stats.activeAlertsSent)} avisos
            </CardTitle>
            <p className="text-xs text-muted-foreground">Confirmaciones y recordatorios</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-blue-600" />
              Asistencia Lograda
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums text-blue-600">
              {stats.attendanceRateEstimated}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Ausentismo reducido a casi cero</p>
          </CardHeader>
        </Card>
      </div>

      {/* Estado de las Sedes Monitoreadas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Activity className="size-4 text-emerald-600" />
            Estado de Disponibilidad en Sedes MTC
          </h2>
          <span className="text-xs text-muted-foreground">
            Último rastreo: <strong className="text-foreground">{state.lastScrapeTime}</strong>
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {state.sedes.map((sede) => (
            <Card
              key={sede.id}
              className={`border-2 transition-all ${
                sede.hasAvailableSlots
                  ? "border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-sm"
                  : "border-border bg-card"
              }`}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">{sede.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="size-3 shrink-0" />
                      {sede.address}
                    </p>
                  </div>
                  {sede.hasAvailableSlots ? (
                    <Badge className="bg-emerald-600 text-white font-bold text-xs shrink-0">
                      🟢 {sede.availableSlotsCount} Cupos
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground text-xs shrink-0">
                      🔴 Agotado
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t text-muted-foreground">
                  <span>
                    {sede.nextAvailableDate ? (
                      <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                        Próxima fecha: {sede.nextAvailableDate}
                      </span>
                    ) : (
                      "Monitoreando liberación..."
                    )}
                  </span>
                  <span className="text-[11px] font-mono">{sede.lastChecked}</span>
                </div>

                {sede.hasAvailableSlots && (
                  <div className="pt-1">
                    <Button
                      size="sm"
                      className="w-full text-xs font-semibold bg-primary hover:bg-primary/90"
                      render={<Link href={`/mtc/citas?sede=${encodeURIComponent(sede.name)}`} />}
                    >
                      Reservar Cita en esta Sede
                      <ArrowRight className="size-3.5 ml-1.5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Terminal de Logs del Scraper (n8n / Railway) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Terminal className="size-4 text-emerald-600" />
            Consola del Rastreador en Vivo (n8n Worker & Proxies)
          </h2>
          <Badge variant="outline" className="font-mono text-[10px] bg-muted">
            Anti-WAF: Cloudflare Bypass OK
          </Badge>
        </div>

        <div className="rounded-xl border bg-slate-950 p-4 font-mono text-xs text-slate-200 shadow-inner space-y-2 max-h-64 overflow-y-auto">
          {state.scraperLogs.map((log) => (
            <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-1.5 last:border-0 last:pb-0">
              <div className="flex items-start sm:items-center gap-2">
                <span className="text-slate-500 text-[11px] shrink-0">[{log.timestamp}]</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                    log.status === "slots_found"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : log.status === "captcha_bypassed"
                        ? "bg-amber-950 text-amber-400 border border-amber-800"
                        : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {log.status === "slots_found" ? "CUPOS LIBRES" : log.status === "captcha_bypassed" ? "CAPTCHA SOLVED" : "SCAN OK"}
                </span>
                <span className="text-slate-200 text-xs">{log.message}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
                <span>{log.ipProxy}</span>
                <span className="text-emerald-400">{log.responseTimeMs}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

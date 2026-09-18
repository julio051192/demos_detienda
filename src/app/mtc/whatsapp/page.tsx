"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMtcStore } from "@/lib/mtc-store"
import {
  MessageSquareCode,
  Send,
  CheckCheck,
  Clock,
  AlertTriangle,
  FileCheck2,
  Phone,
  Smartphone,
  Sparkles,
  ShieldAlert,
} from "lucide-react"

export default function WhatsAppAutomationPage() {
  const { state, ready, sendWhatsAppNotification } = useMtcStore()

  const [selectedAppId, setSelectedAppId] = useState(state.appointments[0]?.id || "")
  const [activeTabType, setActiveTabType] = useState<"confirmacion" | "recordatorio_24h" | "alerta_critica_2h">("confirmacion")
  const [justSent, setJustSent] = useState(false)

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando automatización WhatsApp…</p>

  const currentApp = state.appointments.find((a) => a.id === selectedAppId) || state.appointments[0]

  function handleTriggerSend(type: "confirmacion" | "recordatorio_24h" | "alerta_critica_2h") {
    if (!currentApp) return
    sendWhatsAppNotification(currentApp.id, type)
    setJustSent(true)
    setTimeout(() => setJustSent(false), 2500)
  }

  // Plantillas de WhatsApp generadas en tiempo real para el cliente seleccionado
  function getMessagePreview(type: "confirmacion" | "recordatorio_24h" | "alerta_critica_2h") {
    if (!currentApp) return ""
    if (type === "confirmacion") {
      return `*SISTEMA DE CITAS MTC - PERÚ* 🇵🇪
━━━━━━━━━━━━━━━━━━━━
✅ *¡CITA RESERVADA CON ÉXITO!*

Estimado(a) *${currentApp.clientName}*, su turno para trámite de brevete ha sido confirmado:

🎫 *Código Ticket:* ${currentApp.ticketCode}
🆔 *DNI:* ${currentApp.clientDni}
🚗 *Trámite:* ${currentApp.procedure} - ${currentApp.licenseCategory}
📍 *Sede:* ${currentApp.sedeName}
📅 *Fecha:* ${currentApp.appointmentDate}
⏰ *Hora Exacta:* ${currentApp.appointmentTime} hrs.

📲 *Su Comprobante Digital con Código QR:*
👉 https://citas.mtc.gob.pe/ticket/${currentApp.ticketCode}

_Guarde este mensaje y muestre el QR al ingresar al local._`
    }

    if (type === "recordatorio_24h") {
      return `*SISTEMA DE CITAS MTC - PERÚ* 🇵🇪
━━━━━━━━━━━━━━━━━━━━
📋 *RECORDATORIO PREVENTIVO (24 HORAS ANTES)*

Hola *${currentApp.clientName}*, le recordamos que su cita en el MTC es *MAÑANA*:

📍 *Sede:* ${currentApp.sedeName}
⏰ *Hora:* ${currentApp.appointmentTime} hrs.

⚠️ *DOCUMENTOS OBLIGATORIOS PARA INGRESAR:*
1. DNI físico original y vigente.
2. Examen Médico Psicosomático APROBADO (verificado en SNC).
3. Voucher de pago del Banco de la Nación / Págalo.pe (Tasa S/ 14.80).
4. Ticket QR en su celular.

_Le recomendamos salir con 30 minutos de anticipación._`
    }

    return `*ALERTA CRÍTICA DE ASISTENCIA (FALTAN 2 HORAS)* 🚨
━━━━━━━━━━━━━━━━━━━━
Estimado(a) *${currentApp.clientName}*, su cita programada en *${currentApp.sedeName}* inicia en exactamente *120 minutos* (${currentApp.appointmentTime} hrs).

⏱️ *Tolerancia máxima:* 10 minutos por protocolo MTC.
📍 *Ubicación GPS de la Sede:*
👉 https://maps.google.com/?q=${encodeURIComponent(currentApp.sedeName)}

Por favor confirme que se encuentra en camino respondiendo:
1️⃣ *EN CAMINO*
2️⃣ *LLEGUÉ A LA SEDE*

_Evite la pérdida de su cita y el bloqueo de 30 días en el sistema MTC._`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Automatización de Notificaciones por WhatsApp</h1>
          <p className="text-sm text-muted-foreground">
            Flujos automáticos conectados con n8n: Confirmación inmediata, Recordatorio 24h preventivo y Alerta crítica 2h antes para ausentismo cero.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Panel Izquierdo: Selección de Cliente y Configuración de Alertas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Selector de Postulante */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Phone className="size-4 text-emerald-600" />
                Seleccionar Postulante para Simular Disparo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                className="w-full h-9 rounded-lg border border-input bg-background px-3 text-xs font-semibold"
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
              >
                {state.appointments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.ticketCode} — {a.clientName} (DNI: {a.clientDni} · Tel: {a.clientPhone})
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Las 3 Etapas de Notificación Automatizada */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-foreground">
              Las 3 Etapas de Notificación Automática (Flujo n8n):
            </h2>

            {/* Etapa 1: Confirmación Inmediata */}
            <Card
              className={`cursor-pointer transition-all border-2 ${
                activeTabType === "confirmacion"
                  ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs"
                  : "hover:border-primary/40"
              }`}
              onClick={() => setActiveTabType("confirmacion")}
            >
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-600 text-white font-bold text-[10px]">
                      1. Confirmación Inmediata
                    </Badge>
                    <span className="text-xs text-muted-foreground">Al momento de la reserva</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground">
                    Envío automático del comprobante y resumen de cita
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Despacha el ticket con link directo al código QR para validación en sede.
                  </p>
                </div>
                <Button
                  size="xs"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTriggerSend("confirmacion")
                  }}
                >
                  <Send className="size-3 mr-1" />
                  Disparar
                </Button>
              </CardContent>
            </Card>

            {/* Etapa 2: Recordatorio Preventivo 24h */}
            <Card
              className={`cursor-pointer transition-all border-2 ${
                activeTabType === "recordatorio_24h"
                  ? "border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 shadow-xs"
                  : "hover:border-primary/40"
              }`}
              onClick={() => setActiveTabType("recordatorio_24h")}
            >
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-600 text-white font-bold text-[10px]">
                      2. Recordatorio Preventivo
                    </Badge>
                    <span className="text-xs text-muted-foreground">24 horas antes del turno</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground">
                    Checklist de documentos obligatorios
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Indica DNI original, examen médico en SNC y voucher de tasa Banco de la Nación.
                  </p>
                </div>
                <Button
                  size="xs"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTriggerSend("recordatorio_24h")
                  }}
                >
                  <Send className="size-3 mr-1" />
                  Disparar
                </Button>
              </CardContent>
            </Card>

            {/* Etapa 3: Alerta Crítica 2h */}
            <Card
              className={`cursor-pointer transition-all border-2 ${
                activeTabType === "alerta_critica_2h"
                  ? "border-rose-500 bg-rose-50/20 dark:bg-rose-950/20 shadow-xs"
                  : "hover:border-primary/40"
              }`}
              onClick={() => setActiveTabType("alerta_critica_2h")}
            >
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-rose-600 text-white font-bold text-[10px]">
                      3. Alerta Crítica de Alta Prioridad
                    </Badge>
                    <span className="text-xs text-muted-foreground">2 horas antes del turno</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground">
                    Margen de llegada para ausentismo CERO
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Envía hora exacta, tolerancia de 10 min y link de Google Maps de la sede.
                  </p>
                </div>
                <Button
                  size="xs"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold shrink-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTriggerSend("alerta_critica_2h")
                  }}
                >
                  <Send className="size-3 mr-1" />
                  Disparar
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Historial de Mensajes de este Postulante */}
          {currentApp && currentApp.whatsappHistory.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase">
                Historial de Envíos Registrados para {currentApp.clientName}:
              </h3>
              <div className="rounded-xl border bg-card divide-y text-xs">
                {currentApp.whatsappHistory.map((h, i) => (
                  <div key={i} className="p-3 flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold capitalize text-primary text-[11px]">
                          {h.type.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-muted-foreground">({h.sentAt})</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                        {h.preview}
                      </p>
                    </div>
                    <span className="flex items-center text-blue-500 text-[10px] font-bold shrink-0">
                      <CheckCheck className="size-3.5 mr-0.5" />
                      {h.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Panel Derecho: Simulador de Teléfono Celular WhatsApp Web (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm rounded-[36px] border-4 border-slate-800 bg-slate-900 p-3 shadow-2xl">
            {/* Notch / Barra Superior */}
            <div className="flex justify-between items-center px-4 py-1 text-[11px] text-slate-400 font-mono">
              <span>16:42</span>
              <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto" />
              <span>5G · 98%</span>
            </div>

            {/* Header de WhatsApp */}
            <div className="flex items-center gap-2.5 bg-emerald-800 text-white p-3 rounded-t-2xl mt-1">
              <div className="size-8 rounded-full bg-white text-emerald-900 flex items-center justify-center font-black text-xs">
                MTC
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs truncate">Citas MTC Oficial</p>
                <p className="text-[10px] text-emerald-200">En línea (Bot Automatizado)</p>
              </div>
            </div>

            {/* Pantalla del Chat */}
            <div className="bg-[#0b141a] p-3 min-h-[380px] max-h-[420px] overflow-y-auto space-y-3 text-xs">
              {/* Fecha central */}
              <div className="text-center">
                <span className="bg-[#182229] text-slate-400 text-[10px] px-2.5 py-1 rounded-md">
                  HOY
                </span>
              </div>

              {/* Burbuja de Mensaje del Bot */}
              <div className="bg-[#005c4b] text-white p-3 rounded-2xl rounded-tl-xs max-w-[92%] shadow space-y-1.5 leading-relaxed font-sans">
                <pre className="whitespace-pre-wrap font-sans text-xs text-slate-100">
                  {getMessagePreview(activeTabType)}
                </pre>
                <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200 pt-1 border-t border-emerald-700/50">
                  <span>16:42</span>
                  <CheckCheck className="size-3 text-cyan-400" />
                </div>
              </div>

              {justSent && (
                <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 p-2 rounded-lg text-center text-[11px] animate-pulse">
                  ⚡ Notificación despachada con éxito vía API WhatsApp
                </div>
              )}
            </div>

            {/* Input Bar de Celular */}
            <div className="bg-[#202c33] p-2 rounded-b-2xl flex items-center gap-2 text-slate-400 text-xs">
              <span className="text-sm">😊</span>
              <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-[11px] text-slate-400">
                Mensaje...
              </div>
              <span className="text-sm text-emerald-500 font-bold">🎙️</span>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 text-center">
            Simulación en vivo de lo que recibe el postulante en su celular
          </p>
        </div>
      </div>
    </div>
  )
}

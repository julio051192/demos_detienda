"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useMtcStore } from "@/lib/mtc-store"
import { addDays, todayISO } from "@/lib/money"
import type { LicenseCategory, MtcAppointment, ProcedureType } from "@/lib/mtc-types"
import {
  CalendarCheck,
  PlusCircle,
  QrCode,
  Search,
  Printer,
  MessageSquareCode,
  ShieldCheck,
  CheckCircle2,
  FileText,
  User,
  Clock,
  MapPin,
} from "lucide-react"

export default function CitasMtcPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando citas MTC…</p>}>
      <CitasMtcContent />
    </Suspense>
  )
}

function CitasMtcContent() {
  const { state, ready, registerAppointment, sendWhatsAppNotification } = useMtcStore()
  const searchParams = useSearchParams()
  const defaultSede = searchParams.get("sede") || state.sedes[0]?.name || "Sede Antenor Orrego (Lima Centro)"

  const [openNewModal, setOpenNewModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<MtcAppointment | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Campos formulario
  const [clientDni, setClientDni] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("9")
  const [licenseCategory, setLicenseCategory] = useState<LicenseCategory>("A-I (Particular)")
  const [procedure, setProcedure] = useState<ProcedureType>("Revalidación")
  const [sedeName, setSedeName] = useState(defaultSede)
  const [appointmentDate, setAppointmentDate] = useState(addDays(todayISO(), 1))
  const [appointmentTime, setAppointmentTime] = useState("10:30")
  const [notes, setNotes] = useState("")

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando citas MTC…</p>

  const filteredAppointments = state.appointments.filter(
    (a) =>
      a.clientDni.includes(searchTerm) ||
      a.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.ticketCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.sedeName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  function handleCreateAppointment(e: React.FormEvent) {
    e.preventDefault()
    if (!clientDni.trim() || !clientName.trim()) return

    registerAppointment({
      clientDni: clientDni.trim(),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      licenseCategory,
      procedure,
      sedeName,
      appointmentDate,
      appointmentTime,
      notes,
    })

    setClientDni("")
    setClientName("")
    setClientPhone("9")
    setNotes("")
    setOpenNewModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Citas & Comprobantes con QR</h1>
          <p className="text-sm text-muted-foreground">
            Registro centralizado de postulantes, asignación de turnos MTC y emisión de tickets digitales con código QR único.
          </p>
        </div>
        <Button
          onClick={() => setOpenNewModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
        >
          <PlusCircle className="mr-1.5 size-4" />
          Registrar Nueva Cita
        </Button>
      </div>

      {/* Buscador y Filtro */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por DNI, nombre, ticket o sede..."
            className="pl-8 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          Mostrando {filteredAppointments.length} de {state.appointments.length} citas registradas
        </span>
      </div>

      {/* Tabla de Citas */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Postulante / DNI</TableHead>
              <TableHead>Trámite / Licencia</TableHead>
              <TableHead>Sede MTC</TableHead>
              <TableHead>Fecha & Turno</TableHead>
              <TableHead>WhatsApp Status</TableHead>
              <TableHead className="text-right">Ticket Digital</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">
                  No se encontraron citas con ese criterio de búsqueda.
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-mono font-bold text-xs text-primary">
                    {app.ticketCode}
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-xs text-foreground">{app.clientName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      DNI: {app.clientDni} · Tel: {app.clientPhone}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[11px] font-semibold">
                      {app.procedure}
                    </Badge>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{app.licenseCategory}</p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">
                    {app.sedeName}
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-xs">{app.appointmentDate}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{app.appointmentTime} hrs</p>
                  </TableCell>
                  <TableCell>
                    {app.status === "alerta_critica_2h_enviada" ? (
                      <Badge className="bg-rose-100 text-rose-800 border-rose-300 text-[10px] font-bold">
                        🚨 Alerta 2h Notificada
                      </Badge>
                    ) : app.status === "recordatorio_24h_enviado" ? (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] font-bold">
                        📋 Recordatorio 24h OK
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-[10px] font-bold">
                        ✅ Confirmada
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="xs"
                      variant="outline"
                      className="border-primary/40 hover:bg-primary/10 text-primary font-bold"
                      onClick={() => setSelectedTicket(app)}
                    >
                      <QrCode className="size-3.5 mr-1" />
                      Ver Ticket QR
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal: Registrar Cita */}
      <Dialog open={openNewModal} onOpenChange={setOpenNewModal}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreateAppointment} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarCheck className="size-5 text-emerald-600" />
                Registrar Cita de Brevete MTC
              </DialogTitle>
              <DialogDescription>
                Ingresa los datos del solicitante. El sistema generará el ticket con código QR único y disparará la confirmación por WhatsApp.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="dni">DNI del Postulante *</Label>
                  <Input
                    id="dni"
                    required
                    maxLength={8}
                    placeholder="Ej. 74589123"
                    value={clientDni}
                    onChange={(e) => setClientDni(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="phone">WhatsApp Celular *</Label>
                  <Input
                    id="phone"
                    required
                    placeholder="Ej. 987 654 321"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="name">Nombres y Apellidos Completos *</Label>
                <Input
                  id="name"
                  required
                  placeholder="Ej. Carlos Mendoza Ramos"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="proc">Tipo de Trámite</Label>
                  <select
                    id="proc"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={procedure}
                    onChange={(e) => setProcedure(e.target.value as any)}
                  >
                    <option value="Nueva Licencia">Nueva Licencia</option>
                    <option value="Revalidación">Revalidación</option>
                    <option value="Recategorización">Recategorización</option>
                    <option value="Duplicado">Duplicado</option>
                    <option value="Canje Extranjero">Canje Extranjero</option>
                  </select>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="cat">Categoría Brevete</Label>
                  <select
                    id="cat"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={licenseCategory}
                    onChange={(e) => setLicenseCategory(e.target.value as any)}
                  >
                    <option value="A-I (Particular)">A-I (Particular)</option>
                    <option value="A-IIa (Taxi / Colectivo)">A-IIa (Taxi / Colectivo)</option>
                    <option value="A-IIb (Cúster / Camión Pequeño)">A-IIb (Cúster)</option>
                    <option value="A-IIIa (Ómnibus Interprovincial)">A-IIIa (Ómnibus)</option>
                    <option value="A-IIIc (Máxima Categoría)">A-IIIc (Máxima)</option>
                    <option value="B-IIb (Moto Lineal / Torito)">B-IIb (Moto)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="sede">Sede MTC Asignada</Label>
                <select
                  id="sede"
                  className="h-8 rounded-lg border border-input bg-background px-2 text-xs font-semibold"
                  value={sedeName}
                  onChange={(e) => setSedeName(e.target.value)}
                >
                  {state.sedes.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.availableSlotsCount > 0 ? `${s.availableSlotsCount} cupos` : "Cupo reservado"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="date">Fecha de Cita</Label>
                  <Input
                    id="date"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="time">Hora del Turno</Label>
                  <Input
                    id="time"
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenNewModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                Generar Cita & Ticket QR
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Ver Ticket Digital con QR */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-md">
            <div className="border-2 border-dashed border-emerald-500 rounded-xl p-5 bg-card space-y-4 text-center">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  SISTEMA OFICIAL DE CITAS MTC
                </span>
                <Badge className="bg-emerald-600 text-white font-mono text-[10px]">
                  {selectedTicket.ticketCode}
                </Badge>
              </div>

              {/* Imagen del Código QR */}
              <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border max-w-[200px] mx-auto shadow-xs">
                <img
                  src={selectedTicket.qrCodeUrl}
                  alt={`QR ${selectedTicket.ticketCode}`}
                  className="size-40 object-contain"
                />
                <span className="text-[9px] font-mono text-slate-700 mt-1">
                  VALIDACIÓN OFICIAL EN SEDE
                </span>
              </div>

              <div className="text-left space-y-1.5 text-xs bg-muted/40 p-3 rounded-lg border font-mono">
                <p>
                  <strong>Postulante:</strong> {selectedTicket.clientName}
                </p>
                <p>
                  <strong>DNI:</strong> {selectedTicket.clientDni}
                </p>
                <p>
                  <strong>Trámite:</strong> {selectedTicket.procedure} ({selectedTicket.licenseCategory})
                </p>
                <p>
                  <strong>Sede:</strong> {selectedTicket.sedeName}
                </p>
                <p className="text-emerald-700 dark:text-emerald-300 font-bold">
                  <strong>Fecha & Hora:</strong> {selectedTicket.appointmentDate} a las {selectedTicket.appointmentTime} hrs.
                </p>
              </div>

              <p className="text-[11px] text-muted-foreground italic">
                Presentar este comprobante digital en el punto de control de acceso de la sede MTC con DNI físico en mano.
              </p>

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  onClick={() => {
                    sendWhatsAppNotification(selectedTicket.id, "confirmacion")
                    alert("Ticket enviado con éxito al WhatsApp del cliente.")
                  }}
                >
                  <MessageSquareCode className="size-3.5 mr-1.5" />
                  Enviar por WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={() => window.print()}
                >
                  <Printer className="size-3.5 mr-1.5" />
                  Imprimir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

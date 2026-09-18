"use client"

import { useState } from "react"
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
import { useVeterinariaStore } from "@/lib/veterinaria-store"
import { addDays, todayISO } from "@/lib/money"
import type { VaccineRecord } from "@/lib/veterinaria-types"
import {
  Syringe,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Phone,
  MessageSquareCode,
  ShieldCheck,
  Calendar,
} from "lucide-react"

export default function VacunasVeterinariaPage() {
  const { state, ready, stats, addVaccineRecord } = useVeterinariaStore()

  const [openModal, setOpenModal] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState(state.patients[0]?.id || "")
  const [vaccineName, setVaccineName] = useState("Vacuna Séxtuple Canina (DHPPI-L)")
  const [batchNumber, setBatchNumber] = useState("ZOETIS-1094")
  const [nextBoosterDate, setNextBoosterDate] = useState(addDays(todayISO(), 365))
  const [whatsappSent, setWhatsappSent] = useState<string | null>(null)

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando carnet de vacunas…</p>

  const selectedPatient = state.patients.find((p) => p.id === selectedPetId) || state.patients[0]

  function handleAddVaccine(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedPatient) return

    addVaccineRecord({
      patientId: selectedPatient.id,
      petName: selectedPatient.name,
      ownerPhone: selectedPatient.ownerPhone,
      vaccineName,
      applicationDate: todayISO(),
      nextBoosterDate,
      isBoosterDue: false,
      batchNumber: batchNumber.trim() || "LOTE-PE-2026",
      vetDoctorName: "Dra. Sofía Morales (CMVP 8940)",
    })

    setOpenModal(false)
  }

  function handleSendWhatsAppReminder(vac: VaccineRecord) {
    setWhatsappSent(
      `📲 Recordatorio enviado al WhatsApp ${vac.ownerPhone}: "Estimado(a) tutor de ${vac.petName}, le recordamos que su refuerzo de ${vac.vaccineName} vence el ${vac.nextBoosterDate}. Agende su cita con anticipación."`,
    )
    setTimeout(() => setWhatsappSent(null), 4000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-teal-700 text-teal-100 border-teal-600">
              <Syringe className="size-3.5 mr-1" />
              Inmunizaciones & Control Preventivo
            </Badge>
            <span className="text-xs text-muted-foreground">Calendario Anual y Refuerzos</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight">Carnet Digital de Vacunación & Desparasitación</h1>
          <p className="text-sm text-muted-foreground">
            Control de vacunas aplicadas, lotes de laboratorio, fechas de refuerzo y alertas automáticas por WhatsApp para tutores.
          </p>
        </div>

        <Button
          className="bg-teal-700 hover:bg-teal-800 text-white font-bold"
          onClick={() => setOpenModal(true)}
        >
          <PlusCircle className="mr-1.5 size-4" />
          Registrar Vacuna / Refuerzo
        </Button>
      </div>

      {whatsappSent && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-100/90 dark:bg-emerald-950 p-3.5 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{whatsappSent}</span>
        </div>
      )}

      {/* Tarjetas de Resumen de Vacunas */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Vacunas en Historial</p>
            <CardTitle className="text-2xl font-bold tabular-nums">
              {state.vaccines.length} dosis registradas
            </CardTitle>
            <p className="text-xs text-muted-foreground">En toda la clínica</p>
          </CardHeader>
        </Card>

        <Card size="sm" className="border-rose-300 dark:border-rose-900 bg-rose-50/20 dark:bg-rose-950/10">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1 text-rose-600">
              <AlertTriangle className="size-3.5" />
              Refuerzos Pendientes / Vencidos
            </p>
            <CardTitle className="text-2xl font-bold tabular-nums text-rose-600">
              {stats.dueVaccinesCount} mascotas
            </CardTitle>
            <p className="text-xs text-muted-foreground">Requieren recordatorio urgente</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Cobertura Inmunológica</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-teal-700 dark:text-teal-300">
              94.2%
            </CardTitle>
            <p className="text-xs text-muted-foreground">Pacientes con carnet al día</p>
          </CardHeader>
        </Card>
      </div>

      {/* Tabla de Carnets de Vacunación */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mascota</TableHead>
              <TableHead>Vacuna / Biológico</TableHead>
              <TableHead>Fecha de Aplicación</TableHead>
              <TableHead>Próximo Refuerzo</TableHead>
              <TableHead>Lote de Laboratorio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Recordatorio WhatsApp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.vaccines.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-bold text-xs text-foreground">
                  {v.petName}
                </TableCell>
                <TableCell className="font-medium text-xs">
                  {v.vaccineName}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">
                  {v.applicationDate}
                </TableCell>
                <TableCell className="font-bold text-xs font-mono">
                  {v.nextBoosterDate}
                </TableCell>
                <TableCell className="text-[11px] font-mono text-muted-foreground">
                  {v.batchNumber}
                </TableCell>
                <TableCell>
                  {v.isBoosterDue ? (
                    <Badge variant="destructive" className="text-[10px] font-bold animate-pulse">
                      🚨 Refuerzo Vencido / Hoy
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-[10px]">
                      ✓ Al día
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="xs"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    onClick={() => handleSendWhatsAppReminder(v)}
                  >
                    <MessageSquareCode className="size-3.5 mr-1" />
                    Enviar WhatsApp
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal: Registrar Vacuna */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAddVaccine} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Syringe className="size-5 text-teal-700" />
                Registrar Vacunación en Carnet
              </DialogTitle>
              <DialogDescription>
                Anota la vacuna colocada y programa la fecha del próximo refuerzo para enviar avisos al dueño.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 text-xs">
              <div className="grid gap-1">
                <Label htmlFor="vpet">Mascota Paciente *</Label>
                <select
                  id="vpet"
                  className="h-8 rounded-lg border border-input bg-background px-2 text-xs font-bold"
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                >
                  {state.patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.breed}) — Tutor: {p.ownerName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="vname">Nombre de la Vacuna / Biológico *</Label>
                <select
                  id="vname"
                  className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                >
                  <option value="Vacuna Séxtuple Canina (DHPPI-L)">Vacuna Séxtuple Canina (DHPPI-L)</option>
                  <option value="Vacuna Antirrábica Canina Anual">Vacuna Antirrábica Canina Anual</option>
                  <option value="Triple Felina (Rinotraqueítis/Calici/Panleucopenia)">Triple Felina</option>
                  <option value="Vacuna contra Giardia">Vacuna contra Giardia</option>
                  <option value="Tos de las Perreras (KC Bronchicine)">Tos de las Perreras (KC)</option>
                  <option value="Desparasitación Interna Total">Desparasitación Interna Total</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="vlote">N° de Lote de Vacuna</Label>
                  <Input
                    id="vlote"
                    placeholder="Ej. ZOETIS-8891"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="vnext">Fecha Próximo Refuerzo</Label>
                  <Input
                    id="vnext"
                    type="date"
                    value={nextBoosterDate}
                    onChange={(e) => setNextBoosterDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white font-bold">
                Guardar en Carnet
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

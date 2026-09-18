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
import { formatMoney } from "@/lib/money"
import type { ClinicalConsultation, PetPatient } from "@/lib/veterinaria-types"
import {
  Stethoscope,
  PlusCircle,
  Search,
  FileText,
  Activity,
  Heart,
  Thermometer,
  Weight,
  User,
  Phone,
  CheckCircle2,
  Printer,
  Dog,
} from "lucide-react"

export default function VeterinariaConsultasPage() {
  const { state, ready, stats, addConsultation, reset } = useVeterinariaStore()
  const mx = (n: number) => formatMoney(n)

  const [searchTerm, setSearchTerm] = useState("")
  const [openNewConsultModal, setOpenNewConsultModal] = useState(false)
  const [selectedConsult, setSelectedConsult] = useState<ClinicalConsultation | null>(null)

  // Formulario consulta
  const [selectedPetId, setSelectedPetId] = useState(state.patients[0]?.id || "")
  const [tempC, setTempC] = useState("38.5")
  const [heartRate, setHeartRate] = useState("95")
  const [weight, setWeight] = useState("25.0")
  const [reason, setReason] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [prescription, setPrescription] = useState("")
  const [cost, setCost] = useState("50")

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando veterinaria…</p>

  const filteredPatients = state.patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.breed.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const selectedPatientObj = state.patients.find((p) => p.id === selectedPetId) || state.patients[0]

  function handleCreateConsultation(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedPatientObj || !reason.trim() || !diagnosis.trim()) return

    addConsultation({
      patientId: selectedPatientObj.id,
      petName: `${selectedPatientObj.name} (${selectedPatientObj.breed})`,
      species: selectedPatientObj.species,
      ownerName: selectedPatientObj.ownerName,
      ownerPhone: selectedPatientObj.ownerPhone,
      temperatureC: Number(tempC) || 38.5,
      heartRateBpm: Number(heartRate) || 90,
      weightKg: Number(weight) || selectedPatientObj.weightKg,
      reason: reason.trim(),
      diagnosis: diagnosis.trim(),
      treatmentPrescription: prescription.trim() || "Reposo e hidratación.",
      vetDoctorName: "Dra. Sofía Morales (CMVP 8940)",
      cost: Number(cost) || 50,
      isPaid: true,
    })

    setReason("")
    setDiagnosis("")
    setPrescription("")
    setOpenNewConsultModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-teal-700 text-teal-100 border-teal-600">
              <Stethoscope className="size-3.5 mr-1" />
              Clínica Veterinaria & Atención Médica
            </Badge>
            <span className="text-xs text-muted-foreground">Historias Clínicas Digitales</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight">Consultas & Triaje Veterinario</h1>
          <p className="text-sm text-muted-foreground">
            Control de constantes vitales (°C, FC, peso), diagnóstico clínico, recetas médicas y seguimiento de pacientes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Restaurar demo
          </Button>
          <Button
            className="bg-teal-700 hover:bg-teal-800 text-white font-bold"
            onClick={() => setOpenNewConsultModal(true)}
          >
            <PlusCircle className="mr-1.5 size-4" />
            Nueva Consulta Médica
          </Button>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card size="sm" className="border-teal-200 dark:border-teal-900 bg-teal-50/20 dark:bg-teal-950/10">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Pacientes Registrados</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-teal-800 dark:text-teal-300">
              {stats.totalPatients} mascotas
            </CardTitle>
            <p className="text-xs text-muted-foreground">Historias clínicas activas</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Consultas Hoy</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-foreground">
              {stats.consultationsToday} atenciones
            </CardTitle>
            <p className="text-xs text-muted-foreground">En consultorio médico</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">En Spa / Grooming</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-amber-600">
              {stats.activeGrooming} mascotas
            </CardTitle>
            <p className="text-xs text-muted-foreground">En baño y corte de raza</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Vacunas por Vencer</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-rose-600">
              {stats.dueVaccinesCount} refuerzos
            </CardTitle>
            <p className="text-xs text-muted-foreground">Alerta enviada a tutores</p>
          </CardHeader>
        </Card>
      </div>

      {/* Grid: Pacientes Activos con Fotos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Dog className="size-4 text-teal-700" />
            Pacientes Peludos Registrados ({filteredPatients.length})
          </h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por mascota, raza o dueño..."
              className="pl-8 text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filteredPatients.map((pet) => (
            <Card key={pet.id} className="overflow-hidden border hover:border-teal-600 transition-all hover:shadow-md">
              <div className="relative h-32 w-full overflow-hidden bg-muted">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="h-full w-full object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-teal-800 text-white font-mono text-[10px]">
                  {pet.code}
                </Badge>
                <div className="absolute bottom-2 right-2 rounded-lg bg-background/90 backdrop-blur-md px-2 py-0.5 font-bold text-[11px] shadow">
                  {pet.weightKg} kg · {pet.ageYears} años
                </div>
              </div>

              <CardContent className="p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-foreground">{pet.name}</h3>
                  <Badge variant="outline" className="capitalize text-[10px]">
                    {pet.species} ({pet.gender})
                  </Badge>
                </div>

                <p className="text-[11px] text-muted-foreground font-medium">{pet.breed}</p>

                <div className="pt-1 border-t text-[11px] space-y-0.5 text-muted-foreground">
                  <p><strong>Dueño:</strong> {pet.ownerName}</p>
                  <p><strong>WhatsApp:</strong> {pet.ownerPhone}</p>
                  {pet.allergies && (
                    <p className="text-rose-600 font-semibold truncate">⚠️ {pet.allergies}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Historial de Consultas Médicas */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Activity className="size-4 text-teal-700" />
          Historial de Consultas Clínicas Recientes ({state.consultations.length})
        </h2>

        <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha / Hora</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Tutor / Teléfono</TableHead>
                <TableHead>Constantes (Triaje)</TableHead>
                <TableHead>Diagnóstico Clínico</TableHead>
                <TableHead>Médico Veterinario</TableHead>
                <TableHead className="text-right">Receta Médica</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.consultations.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {c.date} · {c.time}
                  </TableCell>
                  <TableCell className="font-bold text-xs text-foreground">
                    {c.petName}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-xs">{c.ownerName}</p>
                    <p className="text-[11px] text-muted-foreground">{c.ownerPhone}</p>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <span className="text-amber-700 font-semibold">{c.temperatureC}°C</span> ·{" "}
                    <span>{c.heartRateBpm} lpm</span> ·{" "}
                    <span>{c.weightKg} kg</span>
                  </TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate text-foreground font-medium">
                    {c.diagnosis}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.vetDoctorName}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="xs"
                      variant="outline"
                      className="border-teal-600/40 text-teal-800 dark:text-teal-300 font-bold text-xs"
                      onClick={() => setSelectedConsult(c)}
                    >
                      <FileText className="size-3.5 mr-1" />
                      Ver Receta
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal: Nueva Consulta Médica */}
      <Dialog open={openNewConsultModal} onOpenChange={setOpenNewConsultModal}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreateConsultation} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Stethoscope className="size-5 text-teal-700" />
                Nueva Consulta Veterinaria
              </DialogTitle>
              <DialogDescription>
                Ingresa los datos del triaje, diagnóstico y tratamiento para la historia clínica.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 text-xs">
              <div className="grid gap-1">
                <Label htmlFor="pet-sel">Seleccionar Paciente *</Label>
                <select
                  id="pet-sel"
                  className="h-8 rounded-lg border border-input bg-background px-2 text-xs font-bold"
                  value={selectedPetId}
                  onChange={(e) => {
                    setSelectedPetId(e.target.value)
                    const p = state.patients.find((pet) => pet.id === e.target.value)
                    if (p) setWeight(p.weightKg.toString())
                  }}
                >
                  {state.patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.breed}) — Tutor: {p.ownerName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Triaje */}
              <div className="grid grid-cols-3 gap-2 bg-muted/40 p-2.5 rounded-lg border">
                <div className="grid gap-1">
                  <Label htmlFor="temp" className="text-[10px]">Temp. (°C)</Label>
                  <Input
                    id="temp"
                    type="number"
                    step="0.1"
                    className="h-7 text-xs font-mono font-bold"
                    value={tempC}
                    onChange={(e) => setTempC(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="fc" className="text-[10px]">FC (lpm)</Label>
                  <Input
                    id="fc"
                    type="number"
                    className="h-7 text-xs font-mono font-bold"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="peso" className="text-[10px]">Peso (kg)</Label>
                  <Input
                    id="peso"
                    type="number"
                    step="0.1"
                    className="h-7 text-xs font-mono font-bold"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="reas">Motivo de Consulta *</Label>
                <Input
                  id="reas"
                  required
                  placeholder="Ej. Vómitos recurrentes y decaimiento..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="diag">Diagnóstico Presuntivo / Definitivo *</Label>
                <Input
                  id="diag"
                  required
                  placeholder="Ej. Gastroenteritis aguda..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="rec">Tratamiento & Receta Farmacológica</Label>
                <textarea
                  id="rec"
                  rows={2}
                  className="rounded-lg border border-input bg-background p-2 text-xs"
                  placeholder="Dosis, frecuencia y recomendaciones..."
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="cost">Costo de Consulta (S/)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="h-8 font-bold"
                  />
                </div>
                <div className="grid gap-1">
                  <Label className="text-muted-foreground">Médico Responsable</Label>
                  <p className="text-xs font-bold pt-1.5 text-teal-800 dark:text-teal-300">
                    Dra. Sofía Morales (CMVP 8940)
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenNewConsultModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white font-bold">
                Guardar Consulta & Receta
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Ver Receta Médica */}
      {selectedConsult && (
        <Dialog open={!!selectedConsult} onOpenChange={() => setSelectedConsult(null)}>
          <DialogContent className="sm:max-w-md font-mono text-xs">
            <div className="border-2 border-dashed border-teal-600 rounded-xl p-5 bg-card space-y-4">
              <div className="text-center border-b pb-2">
                <Stethoscope className="size-6 mx-auto text-teal-700 mb-1" />
                <h3 className="font-black text-sm tracking-wider">CLÍNICA VETERINARIA SAN MARTÍN</h3>
                <p className="text-[10px] text-muted-foreground">RECETA MÉDICA VETERINARIA OFICIAL</p>
                <p className="text-[11px] font-bold text-teal-800 dark:text-teal-300 mt-0.5">
                  {selectedConsult.vetDoctorName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-muted/30 p-2.5 rounded border">
                <p><strong>Paciente:</strong> {selectedConsult.petName}</p>
                <p><strong>Tutor:</strong> {selectedConsult.ownerName}</p>
                <p><strong>Fecha:</strong> {selectedConsult.date} ({selectedConsult.time})</p>
                <p><strong>Peso:</strong> {selectedConsult.weightKg} kg · <strong>Temp:</strong> {selectedConsult.temperatureC}°C</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-xs text-foreground">DIAGNÓSTICO:</p>
                <p className="text-[11px] text-muted-foreground">{selectedConsult.diagnosis}</p>
              </div>

              <div className="space-y-1 bg-teal-50/50 dark:bg-teal-950/30 p-3 rounded-lg border border-teal-200 dark:border-teal-800">
                <p className="font-bold text-xs text-teal-900 dark:text-teal-200">INDICACIONES / RP:</p>
                <p className="text-[11px] text-foreground leading-relaxed whitespace-pre-line font-sans">
                  {selectedConsult.treatmentPrescription}
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t">
                <span>Firma & Sello Médico Digital</span>
                <span>Costo: {mx(selectedConsult.cost)}</span>
              </div>

              <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold" onClick={() => window.print()}>
                <Printer className="size-4 mr-2" />
                Imprimir Receta Médica
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

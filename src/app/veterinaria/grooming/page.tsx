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
import { useVeterinariaStore } from "@/lib/veterinaria-store"
import { formatMoney } from "@/lib/money"
import type { GroomingService } from "@/lib/veterinaria-types"
import {
  Scissors,
  PlusCircle,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquareCode,
  Dog,
  Sparkles,
  ArrowRight,
} from "lucide-react"

export default function GroomingVeterinariaPage() {
  const { state, ready, stats, updateGroomingStatus, addGroomingService } = useVeterinariaStore()
  const mx = (n: number) => formatMoney(n)

  const [openNewModal, setOpenNewModal] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState(state.patients[0]?.id || "")
  const [serviceType, setServiceType] = useState<GroomingService["serviceType"]>("baño_medicado")
  const [price, setPrice] = useState("55")
  const [groomerName, setGroomerName] = useState("Ana Peluquera")
  const [notes, setNotes] = useState("")
  const [whatsappSent, setWhatsappSent] = useState<string | null>(null)

  if (!ready) return <p className="text-sm text-muted-foreground">Cargando grooming…</p>

  const selectedPatient = state.patients.find((p) => p.id === selectedPetId) || state.patients[0]

  function handleCreateGrooming(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedPatient) return

    addGroomingService({
      patientId: selectedPatient.id,
      petName: `${selectedPatient.name} (${selectedPatient.breed})`,
      breed: selectedPatient.breed,
      ownerName: selectedPatient.ownerName,
      ownerPhone: selectedPatient.ownerPhone,
      serviceType,
      status: "en_espera",
      price: Number(price) || 50,
      groomerName,
      notes: notes.trim() || undefined,
    })

    setNotes("")
    setOpenNewModal(false)
  }

  function handleSendReadyWhatsApp(g: GroomingService) {
    setWhatsappSent(
      `📲 WhatsApp enviado a ${g.ownerName} (${g.ownerPhone}): "¡Hola! Te avisamos que ${g.petName} ya terminó su baño/corte de spa y quedó súper limpio y oliendo delicioso. Ya puedes pasar a recogerlo."`,
    )
    setTimeout(() => setWhatsappSent(null), 4000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-teal-700 text-teal-100 border-teal-600">
              <Scissors className="size-3.5 mr-1" />
              Peluquería Canina & Spa
            </Badge>
            <span className="text-xs text-muted-foreground">Baños Medicados y Cortes de Raza</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight">Grooming & Estética de Mascotas</h1>
          <p className="text-sm text-muted-foreground">
            Monitoreo en tiempo real del estado de baños, cortes de pelo y aviso automático por WhatsApp cuando la mascota está lista para ser recogida.
          </p>
        </div>

        <Button
          className="bg-teal-700 hover:bg-teal-800 text-white font-bold"
          onClick={() => setOpenNewModal(true)}
        >
          <PlusCircle className="mr-1.5 size-4" />
          Ingresar Mascota a Spa
        </Button>
      </div>

      {whatsappSent && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-100/90 dark:bg-emerald-950 p-3.5 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{whatsappSent}</span>
        </div>
      )}

      {/* Tarjetas KPI */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Mascotas en Spa Ahora</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-amber-600">
              {stats.activeGrooming} en proceso
            </CardTitle>
            <p className="text-xs text-muted-foreground">En espera, baño o corte</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Listos para Entrega</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-emerald-600">
              {state.groomingQueue.filter((g) => g.status === "listo_entrega").length} esperando a su dueño
            </CardTitle>
            <p className="text-xs text-muted-foreground">Con aviso WhatsApp enviado</p>
          </CardHeader>
        </Card>

        <Card size="sm">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">Servicios Completados Hoy</p>
            <CardTitle className="text-2xl font-bold tabular-nums text-foreground">
              {state.groomingQueue.filter((g) => g.status === "entregado").length} atendidos
            </CardTitle>
            <p className="text-xs text-muted-foreground">Baños y cortes entregados</p>
          </CardHeader>
        </Card>
      </div>

      {/* Grid de Mascotas en Grooming */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.groomingQueue.map((g) => {
          const isReady = g.status === "listo_entrega"
          const isBath = g.status === "en_baño"
          const isCut = g.status === "en_corte"
          const isDone = g.status === "entregado"

          return (
            <Card
              key={g.id}
              className={`border-2 shadow-xs transition-all ${
                isReady
                  ? "border-emerald-400 bg-emerald-50/20 dark:bg-emerald-950/20"
                  : isCut
                    ? "border-amber-400 bg-amber-50/20 dark:bg-amber-950/20"
                    : isBath
                      ? "border-cyan-400 bg-cyan-50/20 dark:bg-cyan-950/20"
                      : "border-border bg-card"
              }`}
            >
              <CardHeader className="p-3.5 pb-2 border-b">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-teal-800 dark:text-teal-300">
                    {g.ticketCode}
                  </span>
                  <Badge
                    className={`text-[10px] font-bold ${
                      isReady
                        ? "bg-emerald-600 text-white animate-pulse"
                        : isCut
                          ? "bg-amber-600 text-white"
                          : isBath
                            ? "bg-cyan-600 text-white"
                            : isDone
                              ? "bg-muted text-muted-foreground"
                              : "bg-stone-200 text-stone-800"
                    }`}
                  >
                    {isReady
                      ? "✨ ¡LISTO PARA ENTREGA!"
                      : isCut
                        ? "✂️ En Mesa de Corte"
                        : isBath
                          ? "🛁 En Tina / Baño"
                          : isDone
                            ? "✓ Entregado"
                            : "⏳ En Espera"}
                  </Badge>
                </div>
                <h3 className="font-bold text-sm text-foreground mt-1">{g.petName}</h3>
                <p className="text-xs text-muted-foreground">
                  Tutor: <strong>{g.ownerName}</strong> ({g.ownerPhone})
                </p>
              </CardHeader>

              <CardContent className="p-3.5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-[11px] bg-muted/40 p-2 rounded">
                  <span>Servicio: <strong className="capitalize">{g.serviceType.replace("_", " ")}</strong></span>
                  <span className="font-bold text-teal-800 dark:text-teal-300">{mx(g.price)}</span>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  <strong>Peluquero(a):</strong> {g.groomerName} · {g.createdAt}
                </p>

                {g.notes && (
                  <p className="text-[11px] text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded border border-amber-200">
                    Obs: {g.notes}
                  </p>
                )}

                {/* Acciones de Flujo de Grooming */}
                <div className="pt-2 border-t flex flex-col gap-1.5">
                  {g.status === "en_espera" && (
                    <Button
                      size="sm"
                      className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs"
                      onClick={() => updateGroomingStatus(g.id, "en_baño")}
                    >
                      🛁 Ingresar a Tina de Baño
                    </Button>
                  )}

                  {g.status === "en_baño" && (
                    <Button
                      size="sm"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                      onClick={() => updateGroomingStatus(g.id, "en_corte")}
                    >
                      ✂️ Pasar a Mesa de Corte
                    </Button>
                  )}

                  {g.status === "en_corte" && (
                    <Button
                      size="sm"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      onClick={() => {
                        updateGroomingStatus(g.id, "listo_entrega")
                        handleSendReadyWhatsApp(g)
                      }}
                    >
                      <CheckCircle2 className="size-3.5 mr-1" />
                      Marcar Listo & Avisar por WhatsApp
                    </Button>
                  )}

                  {g.status === "listo_entrega" && (
                    <div className="flex gap-1.5">
                      <Button
                        size="xs"
                        variant="outline"
                        className="flex-1 text-emerald-700 border-emerald-400 font-bold"
                        onClick={() => handleSendReadyWhatsApp(g)}
                      >
                        <MessageSquareCode className="size-3 mr-1" />
                        Reenviar WhatsApp
                      </Button>
                      <Button
                        size="xs"
                        className="flex-1 bg-stone-800 hover:bg-stone-900 text-white font-bold"
                        onClick={() => updateGroomingStatus(g.id, "entregado")}
                      >
                        ✓ Entregar a Tutor
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Modal: Ingresar a Spa */}
      <Dialog open={openNewModal} onOpenChange={setOpenNewModal}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreateGrooming} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Scissors className="size-5 text-teal-700" />
                Ingreso a Peluquería & Grooming
              </DialogTitle>
              <DialogDescription>
                Registra la mascota para baño simple, medicado o corte de raza.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 text-xs">
              <div className="grid gap-1">
                <Label htmlFor="gpet">Seleccionar Mascota *</Label>
                <select
                  id="gpet"
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

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1">
                  <Label htmlFor="gserv">Tipo de Servicio</Label>
                  <select
                    id="gserv"
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as any)}
                  >
                    <option value="baño_simple">Baño Simple + Secado</option>
                    <option value="baño_medicado">Baño Medicado (Antipulgas/Alergia)</option>
                    <option value="corte_raza">Corte de Raza Estándar</option>
                    <option value="spa_completo">Spa Completo (Corte + Baño + Uñas)</option>
                  </select>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="gprice">Precio Servicio (S/)</Label>
                  <Input
                    id="gprice"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="h-8 font-bold"
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="gnotes">Indicaciones Especiales (Corte, pulgas, etc.)</Label>
                <Input
                  id="gnotes"
                  placeholder="Ej. Cuidado con herida en oreja izquierda, corte bajo en patitas..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenNewModal(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white font-bold">
                Iniciar en Espera
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

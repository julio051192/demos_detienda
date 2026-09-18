"use client"

import { useState } from "react"
import { BellRing, Check, Clock3, Gift, MessageCircle, QrCode, Scissors, ShieldCheck, Sparkles, Users, WalletCards } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const visits = [
  { name: "Luis Mendoza", initials: "LM", service: "Corte + barba", barber: "Álex", time: "Hace 12 min", stamps: 4, level: "Platinum" },
  { name: "Marco Salazar", initials: "MS", service: "Corte clásico", barber: "Diego", time: "Hace 28 min", stamps: 10, level: "Diamond" },
  { name: "Renzo Paredes", initials: "RP", service: "Fade premium", barber: "Álex", time: "Hace 46 min", stamps: 2, level: "Platinum" },
]

export default function BarberiaPage() {
  const [scanned, setScanned] = useState(false)
  const [stampCount, setStampCount] = useState(4)
  const [messageSent, setMessageSent] = useState(false)
  const isReward = stampCount >= 5

  function addStamp() {
    setStampCount((current) => Math.min(current + 1, 5))
    setScanned(true)
  }

  return (
    <main className="space-y-6">
      <section className="flex flex-col justify-between gap-4 border-b border-stone-300 pb-5 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700"><Scissors className="size-4" /> Corte & Sello</div>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-stone-900">Fideliza cada visita.</h1>
          <p className="mt-1 max-w-2xl text-sm text-stone-600">La tarjeta digital que convierte un buen corte en el próximo regreso.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-500"><span className="size-2 rounded-full bg-emerald-500" /> Sistema en línea · Hoy, 10 de septiembre</div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={Users} label="Clientes activos" value="248" detail="+18 este mes" tone="amber" />
        <Metric icon={Scissors} label="Visitas de hoy" value="34" detail="6 por confirmar" tone="blue" />
        <Metric icon={Gift} label="Premios liberados" value="12" detail="3 pendientes de canje" tone="emerald" />
        <Metric icon={MessageCircle} label="Retención 30 días" value="78%" detail="+11% vs. mes anterior" tone="violet" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-stone-800 bg-stone-950 text-stone-100 shadow-xl">
          <CardHeader className="border-b border-stone-800 pb-4">
            <div className="flex items-center justify-between"><div><Badge className="bg-amber-400 text-stone-950 hover:bg-amber-400">Módulo del barbero</Badge><CardTitle className="mt-3 text-xl">Registrar visita</CardTitle></div><QrCode className="size-7 text-amber-400" /></div>
            <p className="text-sm text-stone-400">Escanea el código QR del cliente para asignar su sello en segundos.</p>
          </CardHeader>
          <CardContent className="grid gap-5 p-5 md:grid-cols-[1fr_0.85fr]">
            <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-stone-700 bg-stone-900 p-5 text-center">
              <div className="relative mb-4 grid size-32 place-items-center border-8 border-white bg-white text-stone-950">
                <QrCode className="size-24" strokeWidth={1.5} />
                <span className="absolute bg-white px-1 text-[9px] font-bold">SCAN</span>
              </div>
              <p className="text-sm font-medium">Cámara lista para escanear</p><p className="mt-1 text-xs text-stone-500">Cliente de ejemplo: Luis Mendoza</p>
            </div>
            <div className="flex flex-col justify-between">
              <div className="rounded-lg bg-stone-900 p-4"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full bg-amber-400 font-bold text-stone-950">LM</div><div><p className="font-semibold">Luis Mendoza</p><p className="text-xs text-stone-400">Platinum · 4 de 5 sellos</p></div></div><div className="mt-4 flex gap-1.5">{Array.from({ length: 5 }, (_, index) => <span key={index} className={`grid size-8 place-items-center rounded-full border text-xs ${index < stampCount ? "border-amber-400 bg-amber-400 text-stone-950" : "border-stone-600 text-stone-500"}`}>{index < stampCount ? <Check className="size-4" /> : index + 1}</span>)}</div></div>
              {isReward ? <div className="mt-3 rounded-lg border border-emerald-700 bg-emerald-950/60 p-3 text-emerald-300"><div className="flex items-center gap-2 font-semibold"><Gift className="size-4" /> Premio liberado</div><p className="mt-1 text-xs text-emerald-400">Corte gratis o producto de peinado de regalo.</p></div> : <Button className="mt-3 bg-amber-400 text-stone-950 hover:bg-amber-300" onClick={addStamp}><Check className="mr-2 size-4" />Asignar sello</Button>}
              {scanned && <button className="mt-3 text-xs text-stone-500 underline underline-offset-4" onClick={() => { setScanned(false); setStampCount(4) }}>Restablecer demo</button>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-stone-200 bg-white shadow-sm">
          <CardHeader><div className="flex items-center justify-between"><div><Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700">Vista del cliente</Badge><CardTitle className="mt-3 text-xl text-stone-900">Tarjeta digital</CardTitle></div><WalletCards className="size-6 text-violet-600" /></div><p className="text-sm text-stone-500">Así la ve el cliente al abrir su enlace QR.</p></CardHeader>
          <CardContent><div className="rounded-xl bg-gradient-to-br from-violet-950 via-violet-900 to-stone-900 p-5 text-white shadow-lg"><div className="flex items-start justify-between"><div><p className="text-[10px] uppercase tracking-[0.22em] text-violet-300">Corte & Sello</p><p className="mt-3 font-serif text-xl">Marco Salazar</p><p className="text-xs text-violet-200">Nivel Diamond · 10 sellos</p></div><ShieldCheck className="size-7 text-amber-300" /></div><div className="mt-6 grid grid-cols-5 gap-2">{Array.from({ length: 10 }, (_, index) => <span key={index} className="grid aspect-square place-items-center rounded-full border border-amber-300/70 bg-amber-300 text-xs font-bold text-violet-950">{index + 1}</span>)}</div><div className="mt-5 flex items-center justify-between border-t border-white/15 pt-3 text-xs"><span className="text-violet-200">Próximo beneficio</span><strong className="text-amber-300">Servicio premium gratis</strong></div></div><div className="mt-4 flex items-center gap-2 rounded-md bg-stone-100 p-3 text-xs text-stone-600"><Sparkles className="size-4 text-amber-600" /> Bebida de cortesía + 20% en productos</div></CardContent>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="border-stone-200 bg-white"><CardHeader><div className="flex items-center justify-between"><div><CardTitle className="text-lg text-stone-900">Actividad reciente</CardTitle><p className="text-sm text-stone-500">Últimos clientes registrados por el equipo.</p></div><Button variant="outline" size="sm">Ver clientes</Button></div></CardHeader><CardContent className="space-y-1">{visits.map((visit) => <div key={visit.name} className="flex flex-wrap items-center gap-3 rounded-md p-3 hover:bg-stone-50"><div className="grid size-9 place-items-center rounded-full bg-stone-200 text-xs font-semibold text-stone-700">{visit.initials}</div><div className="min-w-36 flex-1"><p className="text-sm font-semibold text-stone-800">{visit.name}</p><p className="text-xs text-stone-500">{visit.service} · {visit.barber}</p></div><Badge variant="outline" className={visit.level === "Diamond" ? "border-violet-200 text-violet-700" : "border-amber-200 text-amber-700"}>{visit.level} · {visit.stamps}/10</Badge><span className="flex items-center gap-1 text-xs text-stone-400"><Clock3 className="size-3" /> {visit.time}</span></div>)}</CardContent></Card>
        <Card className="border-stone-200 bg-white"><CardHeader><CardTitle className="text-lg text-stone-900">Automatizaciones</CardTitle><p className="text-sm text-stone-500">Marketing que trabaja después del corte.</p></CardHeader><CardContent className="space-y-3"><Automation icon={MessageCircle} title="Sello obtenido" detail="WhatsApp inmediato" status="Activo" /><Automation icon={Clock3} title="Recordatorio 21 días" detail="Invitación a agendar" status="Activo" /><Automation icon={BellRing} title="Reactivación 45 días" detail="Recuperar sellos" status="Activo" /><Button className="mt-2 w-full bg-stone-900 text-white hover:bg-stone-800" onClick={() => setMessageSent(true)}>{messageSent ? <><Check className="mr-2 size-4" />Mensaje de prueba enviado</> : <><MessageCircle className="mr-2 size-4" />Probar WhatsApp</>}</Button></CardContent></Card>
      </section>
    </main>
  )
}

function Metric({ icon: Icon, label, value, detail, tone }: { icon: typeof Users; label: string; value: string; detail: string; tone: "amber" | "blue" | "emerald" | "violet" }) {
  const colors = { amber: "bg-amber-100 text-amber-700", blue: "bg-blue-100 text-blue-700", emerald: "bg-emerald-100 text-emerald-700", violet: "bg-violet-100 text-violet-700" }
  return <Card className="border-stone-200 bg-white shadow-sm"><CardHeader><div className="flex items-center justify-between"><p className="text-xs font-medium text-stone-500">{label}</p><span className={`grid size-8 place-items-center rounded-md ${colors[tone]}`}><Icon className="size-4" /></span></div><CardTitle className="text-3xl text-stone-900">{value}</CardTitle><p className="text-xs text-stone-500">{detail}</p></CardHeader></Card>
}

function Automation({ icon: Icon, title, detail, status }: { icon: typeof MessageCircle; title: string; detail: string; status: string }) {
  return <div className="flex items-center gap-3 rounded-md border border-stone-200 p-3"><span className="grid size-8 place-items-center rounded-md bg-emerald-50 text-emerald-600"><Icon className="size-4" /></span><div className="flex-1"><p className="text-sm font-medium text-stone-800">{title}</p><p className="text-xs text-stone-500">{detail}</p></div><span className="text-[10px] font-semibold uppercase text-emerald-600">{status}</span></div>
}

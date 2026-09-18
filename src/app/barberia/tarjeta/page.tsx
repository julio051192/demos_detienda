import Link from "next/link"
import { ArrowLeft, Check, Gift, QrCode, ShieldCheck, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BarberiaTarjetaPage() {
  return (
    <main className="space-y-6">
      <Heading title="Tarjeta digital" description="Vista previa de la tarjeta que el cliente abre desde su código QR." />
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-stone-800 bg-stone-950 text-white"><CardHeader><Badge className="w-fit bg-amber-400 text-stone-950 hover:bg-amber-400">Cliente de ejemplo</Badge><CardTitle className="text-xl">Marco Salazar · Diamond</CardTitle></CardHeader><CardContent><div className="rounded-xl bg-gradient-to-br from-violet-950 to-stone-900 p-5"><div className="flex justify-between"><div><p className="text-[10px] uppercase tracking-[0.2em] text-violet-300">Corte & Sello</p><p className="mt-3 font-serif text-xl">10 sellos acumulados</p></div><ShieldCheck className="size-7 text-amber-300" /></div><div className="mt-6 grid grid-cols-5 gap-2">{Array.from({ length: 10 }, (_, index) => <span key={index} className="grid aspect-square place-items-center rounded-full bg-amber-300 text-xs font-bold text-violet-950"><Check className="size-4" /></span>)}</div></div><div className="mt-4 flex items-center gap-2 rounded-md bg-stone-900 p-3 text-xs text-stone-300"><Sparkles className="size-4 text-amber-300" /> Servicio premium completo gratis en el sello 10</div></CardContent></Card>
        <Card className="border-stone-200 bg-white"><CardHeader><CardTitle className="text-lg text-stone-900">Código QR único</CardTitle><p className="text-sm text-stone-500">El cliente lo presenta en cada visita para registrar su sello.</p></CardHeader><CardContent className="flex flex-col items-center justify-center gap-4"><div className="grid size-52 place-items-center border-8 border-stone-900 bg-white text-stone-900"><QrCode className="size-40" strokeWidth={1.5} /></div><p className="text-center text-xs text-stone-500">corte-sello.pe/c/ML-2048</p><div className="flex items-center gap-2 text-sm font-medium text-emerald-700"><Gift className="size-4" /> Beneficios Diamond activos</div></CardContent></Card>
      </div>
    </main>
  )
}

function Heading({ title, description }: { title: string; description: string }) {
  return <div className="border-b border-stone-300 pb-5"><Link href="/barberia" className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-amber-700"><ArrowLeft className="size-3" /> Volver al panel</Link><h1 className="font-serif text-3xl font-bold text-stone-900">{title}</h1><p className="mt-1 text-sm text-stone-600">{description}</p></div>
}

import Link from "next/link"
import { ArrowLeft, Check, Gift, Percent, Scissors } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const rewards = [
  { title: "Corte gratis", detail: "Disponible al completar 5 sellos Platinum", icon: Scissors, count: "8 listos" },
  { title: "Producto de peinado", detail: "Alternativa al corte en el sello 5", icon: Gift, count: "4 listos" },
  { title: "Servicio premium completo", detail: "Premio mayor al completar 10 sellos Diamond", icon: Gift, count: "3 listos" },
  { title: "20% en productos", detail: "Beneficio activo para clientes Diamond", icon: Percent, count: "42 clientes" },
]

export default function BarberiaPremiosPage() {
  return (
    <main className="space-y-6">
      <div className="border-b border-stone-300 pb-5"><Link href="/barberia" className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-amber-700"><ArrowLeft className="size-3" /> Volver al panel</Link><h1 className="font-serif text-3xl font-bold text-stone-900">Premios</h1><p className="mt-1 text-sm text-stone-600">Beneficios que mantienen al cliente conectado con tu barbería.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">{rewards.map(({ title, detail, icon: Icon, count }) => <Card key={title} className="border-stone-200 bg-white"><CardHeader><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-md bg-amber-100 text-amber-700"><Icon className="size-5" /></span><Badge variant="outline" className="border-emerald-200 text-emerald-700"><Check className="mr-1 size-3" /> {count}</Badge></div><CardTitle className="pt-2 text-lg text-stone-900">{title}</CardTitle></CardHeader><CardContent><p className="text-sm text-stone-500">{detail}</p></CardContent></Card>)}</div>
    </main>
  )
}
